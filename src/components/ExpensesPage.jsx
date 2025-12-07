import React, { useState } from 'react';
import { Lock, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const ExpensesPage = () => {
  const { userCode } = useAuth();
  const user = UserService.getUserByCode(userCode);
  const [showBlockedAlert, setShowBlockedAlert] = useState(true);

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

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Alerte de blocage */}
        {showBlockedAlert && (
          <div className="bg-red-100 border-l-4 border-green-500 p-4 sm:p-6 mb-4 sm:mb-6 relative rounded-lg">
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
                <p className="text-red-600 mt-2 text-xs sm:text-sm">
                  Certaines fonctionnalités sont temporairement indisponibles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="bg-green-200 border-2 border-red-300 rounded-lg p-6 sm:p-8 text-center shadow-lg">
          <Lock className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-3 sm:mb-4">Fonctionnalité indisponible</h2>
          <p className="text-red-700 mb-3 sm:mb-4 text-base sm:text-lg">
            La comparaison de dépenses n'est pas disponible pour un compte bloqué.
          </p>
          <p className="text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Aucune nouvelle opération ne peut être effectuée sur ce compte, il n'y a donc pas de nouvelles dépenses à comparer.
          </p>
          
          <div className="bg-green-50 p-4 sm:p-6 rounded-lg max-w-full sm:max-w-md mx-auto">
            <p className="text-red-800 font-semibold text-base sm:text-lg mb-2">💡 Que faire ?</p>
            <p className="text-red-700 mb-3 text-sm sm:text-base">
              Contactez votre {user?.notaire ? 'notaire' : 'conseiller'} pour débloquer votre compte et accéder à nouveau à cette fonctionnalité.
            </p>
            <div className="bg-white p-3 sm:p-4 rounded border border-red-300">
              <p className="text-red-900 font-semibold text-sm sm:text-base">{accountData.contactName}</p>
              <p className="text-red-700 text-xs sm:text-sm mt-1">
                📞 <strong>{accountData.contactNumber}</strong>
              </p>
              <p className="text-red-700 text-xs sm:text-sm break-all">
                ✉️ {accountData.contactEmail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;