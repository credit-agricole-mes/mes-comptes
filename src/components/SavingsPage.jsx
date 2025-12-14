import React, { useState } from 'react';
import { Lock, AlertCircle, X, PiggyBank, Plus, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currencyFormatter';

const SavingsPage = () => {
  const { user, updateUser } = useAuth();
  const [showBlockedAlert, setShowBlockedAlert] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly'
  });

  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;
  const devise = user?.devise || 'EUR';
  const symbole = user?.symboleDevise || '€';

  const defaultData = {
    blockedReason: "Mesure de sécurité suite à des transactions suspectes",
    contactNumber: "+225 01 02 03 04 05",
    contactName: "Service Client",
    contactEmail: "support@banque.fr"
  };

  const accountData = user ? {
    blockedReason: user.motifBlocage || "Mesure de sécurité suite à des transactions suspectes",
    contactNumber: user.notaire?.telephone || user.conseiller?.telephone || defaultData.contactNumber,
    contactName: user.notaire?.nom || user.conseiller?.nom || defaultData.contactName,
    contactEmail: user.notaire?.email || user.conseiller?.email || defaultData.contactEmail,
    userName: user.nom
  } : defaultData;

  const automaticSavings = user?.regleEpargne || [];
  const hasNoSavings = automaticSavings.length === 0;

  // Gérer les changements du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ajouter une règle d'épargne
  const handleAddRule = () => {
    if (!formData.name || !formData.amount) {
      alert('⚠️ Veuillez remplir tous les champs');
      return;
    }

    const newRule = {
      id: Date.now().toString(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      createdAt: new Date().toISOString(),
      active: true
    };

    const updatedRules = [...automaticSavings, newRule];
    
    // Mettre à jour l'utilisateur avec la nouvelle règle
    if (updateUser) {
      updateUser({ ...user, regleEpargne: updatedRules });
    }

    // Réinitialiser le formulaire
    setFormData({ name: '', amount: '', frequency: 'monthly' });
    setShowAddForm(false);
    alert('✅ Règle d\'épargne ajoutée avec succès !');
  };

  return (
    <div className="p-4 sm:p-6">
      {showBlockedAlert && isCompteBloque && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-6 mb-4 sm:mb-6 relative rounded-lg">
          <button 
            onClick={() => setShowBlockedAlert(false)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <div className="flex-1">
              <h3 className="text-red-800 font-bold text-base sm:text-lg">⚠️ COMPTE BLOQUÉ</h3>
              <p className="text-red-700 mt-2 text-sm sm:text-base">{accountData.blockedReason}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <PiggyBank size={24} className="sm:w-7 sm:h-7" />
          Épargne automatique
        </h2>
        
        {isCompteBloque && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
            <p className="text-red-800 font-semibold text-base sm:text-lg">
              ⚠️ Les virements automatiques sont suspendus
            </p>
            <p className="text-red-700 text-xs sm:text-sm mt-2">
              Suite au blocage de votre compte, aucun débit ne peut être effectué. Vos règles d'épargne automatique sont temporairement en pause.
            </p>
          </div>
        )}

        {!isCompteBloque && hasNoSavings && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
            <p className="text-blue-800 font-semibold text-base sm:text-lg">
              💡 Automatisez votre épargne
            </p>
            <p className="text-blue-700 text-xs sm:text-sm mt-2">
              Configurez des virements automatiques pour épargner sans effort. Commencez dès maintenant !
            </p>
          </div>
        )}

        {!isCompteBloque && !hasNoSavings && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
            <p className="text-green-800 font-semibold text-base sm:text-lg">
              ✅ Vos règles d'épargne sont actives
            </p>
            <p className="text-green-700 text-xs sm:text-sm mt-2">
              Vos virements automatiques fonctionnent normalement. Continuez à épargner !
            </p>
          </div>
        )}

        {/* ✅ FORMULAIRE D'AJOUT DE RÈGLE */}
        {showAddForm && !isCompteBloque && (
          <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-blue-900">
                ➕ Nouvelle règle d'épargne
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nom de la règle
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Épargne mensuelle"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Montant ({symbole})
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Ex: 100"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Fréquence
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                  <option value="quarterly">Trimestriel</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddRule}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Save size={20} />
                  Enregistrer
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Liste des règles */}
        {!hasNoSavings && (
          <>
            <h3 className="font-semibold text-black mb-3 sm:mb-4 text-base sm:text-lg">
              📋 Règles d'épargne configurées ({automaticSavings.length})
            </h3>
            
            {automaticSavings.map(saving => (
              <div key={saving.id} className={`border-2 border-gray-300 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4 ${isCompteBloque ? 'bg-gray-50 opacity-50' : 'bg-white'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{saving.name}</h3>
                    <p className="text-gray-900 mt-1 text-sm sm:text-base">
                      {saving.amount > 0 ? `${formatCurrency(saving.amount, devise, symbole)}/mois` : 'Montant variable'}
                    </p>
                  </div>
                  <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap ${
                    isCompteBloque 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isCompteBloque ? '🔒 Suspendu' : '✅ Actif'}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Message si pas de règles */}
        {hasNoSavings && !showAddForm && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <PiggyBank size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium text-base mb-2">Aucune règle d'épargne configurée</p>
            <p className="text-gray-500 text-sm mb-4">Commencez à épargner automatiquement</p>
          </div>
        )}
        
        {/* Boutons */}
        <div className="mt-4 sm:mt-6 space-y-3">
          <button 
            disabled={isCompteBloque}
            onClick={() => setShowAddForm(!showAddForm)}
            className={`w-full py-3 sm:py-4 rounded-lg flex items-center justify-center font-semibold text-base sm:text-lg transition ${
              isCompteBloque
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : showAddForm 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isCompteBloque ? (
              <>
                <Lock size={18} className="mr-2 sm:w-5 sm:h-5" />
                Ajouter une règle (bloqué)
              </>
            ) : showAddForm ? (
              <>
                <X size={18} className="mr-2 sm:w-5 sm:h-5" />
                Fermer le formulaire
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2 sm:w-5 sm:h-5" />
                Ajouter une règle
              </>
            )}
          </button>
          
          <button 
            disabled={isCompteBloque || hasNoSavings}
            onClick={() => !isCompteBloque && !hasNoSavings && alert('Fonctionnalité "Modifier les règles" en développement')}
            className={`w-full py-3 sm:py-4 rounded-lg flex items-center justify-center font-semibold text-base sm:text-lg transition ${
              isCompteBloque || hasNoSavings
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Lock size={18} className="mr-2 sm:w-5 sm:h-5" />
            Modifier les règles {(isCompteBloque || hasNoSavings) && '(indisponible)'}
          </button>
        </div>

        {/* Message informatif */}
        {isCompteBloque && (
          <div className="mt-4 sm:mt-6 bg-orange-50 border border-orange-300 rounded-lg p-3 sm:p-4">
            <p className="text-orange-800 text-xs sm:text-sm">
              <strong>ℹ️ Information :</strong> Vos règles d'épargne seront réactivées automatiquement une fois votre compte débloqué.
            </p>
          </div>
        )}

        {!isCompteBloque && (
          <div className="mt-4 sm:mt-6 bg-green-50 border border-green-300 rounded-lg p-3 sm:p-4">
            <p className="text-green-800 text-xs sm:text-sm">
              <strong>✅ Compte actif :</strong> Configurez vos règles d'épargne pour automatiser vos économies et atteindre vos objectifs financiers plus facilement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsPage;