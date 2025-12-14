import React, { useState } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDateShort } from '../utils/dateFormatter';
import { useAuth } from '../context/AuthContext';
import { Inbox, X, Send } from 'lucide-react';
import UserService from '../services/UserService';

const Virements = () => {
  const { user, updateUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('historique');
  const [formData, setFormData] = useState({
    beneficiaire: '',
    iban: '',
    montant: '',
    motif: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // ✅ Vérifier si le compte est vraiment bloqué
  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;
  
  // ✅ Récupérer les virements de l'utilisateur connecté
  const virements = user?.virements || [];
  const beneficiaires = user?.beneficiaires || [];
  const devise = user?.devise || "EUR";
  const symbole = user?.symboleDevise || "€";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBeneficiaireSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    const beneficiaire = beneficiaires.find(b => b.id === selectedId);
    
    if (beneficiaire) {
      setFormData(prev => ({
        ...prev,
        beneficiaire: beneficiaire.name,
        iban: beneficiaire.iban
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        beneficiaire: '',
        iban: ''
      }));
    }
  };

  const validateIBAN = (iban) => {
    const ibanClean = iban.replace(/\s/g, '');
    return ibanClean.length >= 15;
  };

  const handleSubmitVirement = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.beneficiaire.trim()) {
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

    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    const montant = parseFloat(formData.montant);

    // Vérifier le solde
    if (montant > user.solde) {
      setError(`Solde insuffisant. Votre solde actuel est de ${formatCurrency(user.solde, devise, symbole)}`);
      return;
    }

    try {
      const today = new Date();
      const dateFormatted = today.toLocaleDateString('fr-FR');

      // Créer le nouveau virement
      const newVirement = {
        date: dateFormatted,
        beneficiaire: formData.beneficiaire.trim(),
        iban: formData.iban.trim().toUpperCase(),
        montant: -montant, // Négatif car c'est une sortie
        motif: formData.motif.trim() || 'Virement',
        statut: 'Effectué'
      };

      // Créer la transaction correspondante
      const newTransaction = {
        date: dateFormatted,
        description: `Virement vers ${formData.beneficiaire.trim()}`,
        montant: -montant,
        type: 'virement',
        statut: 'Effectué'
      };

      // Mettre à jour l'utilisateur
      const updatedUser = {
        ...user,
        solde: user.solde - montant,
        virements: [...virements, newVirement],
        transactions: [...(user.transactions || []), newTransaction]
      };

      // Sauvegarder dans UserService
      await UserService.updateUser(user.code, updatedUser);

      // Mettre à jour le contexte
      updateUser(updatedUser);

      // Afficher le succès
      setSuccess(`✅ Virement de ${formatCurrency(montant, devise, symbole)} effectué avec succès vers ${formData.beneficiaire} !`);
      
      // Réinitialiser le formulaire
      setFormData({ beneficiaire: '', iban: '', montant: '', motif: '' });
      
      // Retourner à l'historique après 3 secondes
      setTimeout(() => {
        setShowForm(false);
        setActiveTab('historique');
        setSuccess('');
      }, 3000);

    } catch (error) {
      setError('Une erreur s\'est produite lors du virement');
      console.error('Erreur virement:', error);
    }
  };

  const handleNewVirement = () => {
    if (!isCompteBloque) {
      setShowForm(true);
      setActiveTab('nouveau');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        {/* ✅ Bannière adaptée selon le statut */}
        {isCompteBloque && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 mb-4 md:mb-6 rounded-lg flex items-start">
            <span className="text-lg sm:text-xl md:text-2xl mr-2 md:mr-3">🔒</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-red-800 text-sm sm:text-base md:text-lg">Compte bloqué</h3>
              <p className="text-red-700 text-xs sm:text-sm md:text-base mt-1">
                Les virements sont temporairement suspendus. Contactez votre conseiller pour débloquer votre compte.
              </p>
            </div>
          </div>
        )}

        {!isCompteBloque && virements.length === 0 && !showForm && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 mb-4 md:mb-6 rounded-lg flex items-start">
            <span className="text-lg sm:text-xl md:text-2xl mr-2 md:mr-3">ℹ️</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-blue-800 text-sm sm:text-base md:text-lg">Prêt à effectuer vos virements</h3>
              <p className="text-blue-700 text-xs sm:text-sm md:text-base mt-1">
                Vous pouvez maintenant effectuer des virements en toute sécurité. Ajoutez d'abord des bénéficiaires pour faciliter vos transactions.
              </p>
            </div>
          </div>
        )}

        {/* Messages de succès/erreur */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 md:p-4 mb-4 rounded-lg">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 mb-4 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-1 sm:gap-2 mb-4 md:mb-6 border-b overflow-x-auto">
          <button 
            onClick={() => {
              setActiveTab('historique');
              setShowForm(false);
            }}
            className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-sm md:text-base whitespace-nowrap ${
              activeTab === 'historique'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Historique
          </button>
          <button 
            onClick={handleNewVirement}
            className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-sm md:text-base flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
              isCompteBloque
                ? 'text-gray-400 cursor-not-allowed'
                : activeTab === 'nouveau'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-700 hover:text-blue-600'
            }`}
            disabled={isCompteBloque}
          >
            Nouveau virement {isCompteBloque && <span>🔒</span>}
          </button>
        </div>

        {/* ✅ FORMULAIRE DE VIREMENT */}
        {showForm && !isCompteBloque && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Effectuer un virement</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setActiveTab('historique');
                  setFormData({ beneficiaire: '', iban: '', montant: '', motif: '' });
                  setError('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Afficher le solde disponible */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
              <p className="text-blue-800 font-semibold">
                💰 Solde disponible : {formatCurrency(user.solde, devise, symbole)}
              </p>
            </div>

            <div className="space-y-4">
              {/* Sélection bénéficiaire */}
              {beneficiaires.length > 0 && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Bénéficiaire enregistré (optionnel)
                  </label>
                  <select
                    onChange={handleBeneficiaireSelect}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Sélectionner un bénéficiaire --</option>
                    {beneficiaires.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} - {b.bank}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nom du bénéficiaire */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Nom du bénéficiaire <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="beneficiaire"
                  value={formData.beneficiaire}
                  onChange={handleInputChange}
                  placeholder="Ex: Jean Dupont"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* IBAN */}
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

              {/* Montant */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Montant ({symbole}) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="montant"
                  value={formData.montant}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Motif */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Motif (optionnel)
                </label>
                <input
                  type="text"
                  name="motif"
                  value={formData.motif}
                  onChange={handleInputChange}
                  placeholder="Ex: Remboursement, Loyer, etc."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitVirement}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Effectuer le virement
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setActiveTab('historique');
                    setFormData({ beneficiaire: '', iban: '', montant: '', motif: '' });
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

        {/* ✅ HISTORIQUE DES VIREMENTS */}
        {!showForm && (
          <>
            {/* Message si pas de virements */}
            {virements.length === 0 && !isCompteBloque && (
              <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium text-base mb-2">Aucun virement effectué</p>
                <p className="text-gray-500 text-sm mb-4">Vos futurs virements apparaîtront ici</p>
                <button
                  onClick={handleNewVirement}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
                >
                  Effectuer mon premier virement
                </button>
              </div>
            )}

            {virements.length === 0 && isCompteBloque && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                <p className="text-orange-800">Aucun virement enregistré pour le moment.</p>
              </div>
            )}

            {/* Tableau Desktop */}
            {virements.length > 0 && (
              <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bénéficiaire</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {virements.map((v, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDateShort(v.date, devise)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{v.beneficiaire}</td>
                        <td className={`px-6 py-4 text-sm font-semibold ${v.montant < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {v.montant < 0 ? '-' : '+'}{formatCurrency(Math.abs(v.montant), devise, symbole)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                            {v.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cartes Mobile/Tablette */}
            {virements.length > 0 && (
              <div className="md:hidden space-y-3">
                {virements.map((v, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{v.beneficiaire}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {formatDateShort(v.date, devise)}
                        </p>
                      </div>
                      <span className={`text-base sm:text-lg font-bold ${v.montant < 0 ? 'text-red-600' : 'text-green-600'} ml-2`}>
                        {v.montant < 0 ? '-' : '+'}{formatCurrency(Math.abs(v.montant), devise, symbole)}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span className="px-2 sm:px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        {v.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message informatif en bas */}
            {!isCompteBloque && virements.length > 0 && (
              <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <strong>✅ Compte actif :</strong> Vous pouvez effectuer de nouveaux virements à tout moment. N'oubliez pas d'ajouter vos bénéficiaires pour faciliter vos transactions.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Virements;