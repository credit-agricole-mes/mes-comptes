import React, { useState } from 'react';
import { Lock, Users, User, UserPlus, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const BeneficiariesPage = () => {
  const { user, updateUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    iban: '',
    bank: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // ✅ Vérifier si le compte est vraiment bloqué
  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;
  
  // ✅ Récupérer les bénéficiaires de l'utilisateur (vide pour nouveaux comptes)
  const beneficiaries = user?.beneficiaires || [];
  
  const hasNoBeneficiaries = beneficiaries.length === 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateIBAN = (iban) => {
    // Validation simple de l'IBAN (au moins 15 caractères)
    const ibanClean = iban.replace(/\s/g, '');
    return ibanClean.length >= 15;
  };

  const handleAddBeneficiary = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Le nom du bénéficiaire est obligatoire');
      return;
    }

    if (!formData.iban.trim()) {
      setError('L\'IBAN est obligatoire');
      return;
    }

    if (!validateIBAN(formData.iban)) {
      setError('L\'IBAN doit contenir au moins 15 caractères');
      return;
    }

    if (!formData.bank.trim()) {
      setError('Le nom de la banque est obligatoire');
      return;
    }

    try {
      // Créer le nouveau bénéficiaire
      const newBeneficiary = {
        id: Date.now(), // ID unique basé sur le timestamp
        name: formData.name.trim(),
        iban: formData.iban.trim().toUpperCase(),
        bank: formData.bank.trim()
      };

      // Ajouter aux bénéficiaires existants
      const updatedBeneficiaries = [...beneficiaries, newBeneficiary];

      // Mettre à jour l'utilisateur
      const updatedUser = {
        ...user,
        beneficiaires: updatedBeneficiaries
      };

      // Sauvegarder dans UserService
      await UserService.updateUser(user.code, updatedUser);

      // Mettre à jour le contexte
      updateUser(updatedUser);

      // Afficher le succès
      setSuccess('✅ Bénéficiaire ajouté avec succès !');
      
      // Réinitialiser le formulaire
      setFormData({ name: '', iban: '', bank: '' });
      
      // Fermer le formulaire après 2 secondes
      setTimeout(() => {
        setShowAddForm(false);
        setSuccess('');
      }, 2000);

    } catch (error) {
      setError('Une erreur s\'est produite lors de l\'ajout du bénéficiaire');
      console.error('Erreur ajout bénéficiaire:', error);
    }
  };

  const handleDeleteBeneficiary = async (beneficiaryId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?')) {
      return;
    }

    try {
      // Filtrer pour supprimer le bénéficiaire
      const updatedBeneficiaries = beneficiaries.filter(b => b.id !== beneficiaryId);

      // Mettre à jour l'utilisateur
      const updatedUser = {
        ...user,
        beneficiaires: updatedBeneficiaries
      };

      // Sauvegarder dans UserService
      await UserService.updateUser(user.code, updatedUser);

      // Mettre à jour le contexte
      updateUser(updatedUser);

      setSuccess('✅ Bénéficiaire supprimé avec succès !');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      setError('Une erreur s\'est produite lors de la suppression');
      console.error('Erreur suppression bénéficiaire:', error);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <Users className="text-blue-600" size={24} />
          Gestion des bénéficiaires
        </h2>
        
        {/* ✅ MESSAGES DE SUCCÈS/ERREUR */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-4 rounded">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 rounded">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {/* ✅ AFFICHER L'ALERTE UNIQUEMENT SI LE COMPTE EST BLOQUÉ */}
        {isCompteBloque && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
            <p className="text-red-800 font-semibold text-base sm:text-lg">
              🔒 Mode lecture seule activé
            </p>
            <p className="text-red-700 text-xs sm:text-sm mt-2">
              Vous pouvez consulter vos bénéficiaires mais pas les ajouter, modifier ou supprimer tant que votre compte est bloqué.
            </p>
          </div>
        )}
        
        {/* ✅ MESSAGE POUR NOUVEAUX COMPTES SANS BÉNÉFICIAIRES */}
        {!isCompteBloque && hasNoBeneficiaries && !showAddForm && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
            <p className="text-blue-800 font-semibold text-base sm:text-lg">
              📝 Aucun bénéficiaire enregistré
            </p>
            <p className="text-blue-700 text-xs sm:text-sm mt-2">
              Vous pouvez ajouter des bénéficiaires pour faciliter vos virements futurs.
            </p>
          </div>
        )}
        
        {/* ✅ FORMULAIRE D'AJOUT */}
        {showAddForm && !isCompteBloque && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Ajouter un bénéficiaire</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', iban: '', bank: '' });
                  setError('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Nom du bénéficiaire <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Jean Dupont"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  IBAN <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="iban"
                  value={formData.iban}
                  onChange={handleInputChange}
                  placeholder="Ex: FR76 1234 5678 9012 3456"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Banque <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                  placeholder="Ex: BNP Paribas"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddBeneficiary}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  ✅ Ajouter
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ name: '', iban: '', bank: '' });
                    setError('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* ✅ LISTE DES BÉNÉFICIAIRES */}
        {beneficiaries.length > 0 && (
          <>
            <h3 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-base sm:text-lg">
              📋 Mes bénéficiaires ({beneficiaries.length})
            </h3>
            
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="border-2 border-gray-300 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4 hover:bg-gray-50 transition">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex items-start gap-3 sm:gap-4 w-full sm:flex-1">
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                      <User size={20} className="text-blue-600 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{beneficiary.name}</h3>
                      <p className="text-gray-600 mt-1 text-xs sm:text-sm break-all">{beneficiary.iban}</p>
                      <p className="text-gray-500 text-xs mt-1">🏦 {beneficiary.bank}</p>
                    </div>
                  </div>
                  
                  {/* Bouton supprimer */}
                  {!isCompteBloque && (
                    <button
                      onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
        
        {/* ✅ VIDE SI AUCUN BÉNÉFICIAIRE */}
        {hasNoBeneficiaries && !showAddForm && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-base sm:text-lg font-medium mb-2">
              Aucun bénéficiaire pour le moment
            </p>
            <p className="text-gray-400 text-sm">
              Commencez par ajouter votre premier bénéficiaire
            </p>
          </div>
        )}
        
        {/* ✅ BOUTON AJOUTER */}
        {!showAddForm && (
          <div className="mt-4 sm:mt-6">
            <button 
              disabled={isCompteBloque}
              onClick={() => !isCompteBloque && setShowAddForm(true)}
              className={`w-full py-3 sm:py-4 rounded-lg flex items-center justify-center font-semibold text-sm sm:text-base transition ${
                isCompteBloque 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              }`}
            >
              {isCompteBloque ? (
                <>
                  <Lock size={16} className="mr-2 sm:w-5 sm:h-5" />
                  Ajouter (compte bloqué)
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-2 sm:w-5 sm:h-5" />
                  Ajouter un bénéficiaire
                </>
              )}
            </button>
          </div>
        )}

        {/* ✅ MESSAGE INFORMATIF ADAPTÉ */}
        {isCompteBloque && (
          <div className="mt-4 sm:mt-6 bg-orange-50 border border-orange-300 rounded-lg p-3 sm:p-4">
            <p className="text-orange-800 text-xs sm:text-sm">
              <strong>⚠️ Compte bloqué :</strong> Vous pouvez consulter vos bénéficiaires mais pas effectuer de modifications. Les fonctionnalités seront à nouveau disponibles après le déblocage de votre compte.
            </p>
          </div>
        )}
        
        {!isCompteBloque && (
          <div className="mt-4 sm:mt-6 bg-green-50 border border-green-300 rounded-lg p-3 sm:p-4">
            <p className="text-green-800 text-xs sm:text-sm">
              <strong>✅ Compte actif :</strong> Vous pouvez gérer librement vos bénéficiaires. Ajoutez ou supprimez des bénéficiaires selon vos besoins pour faciliter vos virements futurs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeneficiariesPage;