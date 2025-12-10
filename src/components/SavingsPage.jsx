import React, { useState } from 'react';
import { Lock, AlertCircle, X, PiggyBank } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../services/UserService';

const SavingsPage = () => {
  const { user } = useAuth();
  const [showBlockedAlert, setShowBlockedAlert] = useState(true);

  // Utiliser la devise de l'utilisateur
  const devise = user?.devise || 'EUR';
  const symbole = user?.symboleDevise || '€';

  // Données par défaut si l'utilisateur n'est pas trouvé
  const defaultData = {
    blockedReason: "Mesure de sécurité suite à des transactions suspectes",
    contactNumber: "+225 01 02 03 04 05",
    contactName: "Service Client",
    contactEmail: "support@banque.fr"
  };

  // Utiliser les informations du notaire si disponibles, sinon conseiller, sinon défaut
  const accountData = user ? {
    blockedReason: user.motifBlocage || "Mesure de sécurité suite à des transactions suspectes",
    contactNumber: user.notaire?.telephone || user.conseiller?.telephone || defaultData.contactNumber,
    contactName: user.notaire?.nom || user.conseiller?.nom || defaultData.contactName,
    contactEmail: user.notaire?.email || user.conseiller?.email || defaultData.contactEmail,
    userName: user.nom
  } : defaultData;

  const automaticSavings = [
    { id: 1, name: "Épargne mensuelle", amount: 500, status: "Suspendu" },
    { id: 2, name: "Arrondi automatique", amount: 10, status: "Suspendu" },
    { id: 3, name: "Versement salaire", amount: 2000, status: "Suspendu" }
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Alerte de blocage */}
      {showBlockedAlert && (
        <div className="bg-red-50 border-l-4 border-green-500 p-4 sm:p-6 mb-4 sm:mb-6 relative rounded-lg">
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

      {/* Contenu principal */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <PiggyBank size={24} className="sm:w-7 sm:h-7" />
          Épargne automatique
        </h2>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
          <p className="text-yellow-800 font-semibold text-base sm:text-lg">
            ⚠️ Les virements automatiques sont suspendus
          </p>
          <p className="text-yellow-700 text-xs sm:text-sm mt-2">
            Suite au blocage de votre compte, aucun débit ne peut être effectué. Vos règles d'épargne automatique sont temporairement en pause.
          </p>
        </div>
        
        <h3 className="font-semibold text-black mb-3 sm:mb-4 text-base sm:text-lg">📋 Règles d'épargne configurées</h3>
        
        {automaticSavings.map(saving => (
          <div key={saving.id} className="border-2 border-gray-300 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="opacity-50 flex-1">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{saving.name}</h3>
                <p className="text-gray-900 mt-1 text-sm sm:text-base">
                  {saving.amount > 0 ? `${formatCurrency(saving.amount, devise, symbole)}/mois` : 'Montant variable'}
                </p>
              </div>
              <span className="bg-red-100 text-red-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
                🔒 {saving.status}
              </span>
            </div>
          </div>
        ))}
        
        <div className="mt-4 sm:mt-6 space-y-3">
          <button disabled className="w-full bg-gray-300 text-gray-500 py-3 sm:py-4 rounded-lg cursor-not-allowed flex items-center justify-center font-semibold text-base sm:text-lg">
            <Lock size={18} className="mr-2 sm:w-5 sm:h-5" />
            Ajouter une règle (bloqué)
          </button>
          <button disabled className="w-full bg-gray-300 text-gray-500 py-3 sm:py-4 rounded-lg cursor-not-allowed flex items-center justify-center font-semibold text-base sm:text-lg">
            <Lock size={18} className="mr-2 sm:w-5 sm:h-5" />
            Modifier les règles (bloqué)
          </button>
        </div>

        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-300 rounded-lg p-3 sm:p-4">
          <p className="text-blue-800 text-xs sm:text-sm">
            <strong>ℹ️ Information :</strong> Vos règles d'épargne seront réactivées automatiquement une fois votre compte débloqué.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavingsPage;