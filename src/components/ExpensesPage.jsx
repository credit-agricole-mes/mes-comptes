import React, { useState } from 'react';
import { Lock, AlertCircle, X, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ExpensesPage = () => {
  const { user } = useAuth();
  const [showBlockedAlert, setShowBlockedAlert] = useState(true);

  // ✅ Vérifier si le compte est vraiment bloqué
  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;

  // Données par défaut
  const defaultData = {
    blockedReason: "Mesure de sécurité suite à des transactions suspectes",
    contactNumber: "+33 6 44 68 49 73",
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
        {/* ✅ Alerte de blocage - UNIQUEMENT SI BLOQUÉ */}
        {showBlockedAlert && isCompteBloque && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 sm:p-6 mb-4 sm:mb-6 relative rounded-lg">
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

        {/* ✅ CONTENU POUR COMPTE BLOQUÉ */}
        {isCompteBloque && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 sm:p-8 text-center shadow-lg">
            <Lock className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-3 sm:mb-4">Fonctionnalité indisponible</h2>
            <p className="text-red-700 mb-3 sm:mb-4 text-base sm:text-lg">
              La comparaison de dépenses n'est pas disponible pour un compte bloqué.
            </p>
            <p className="text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Aucune nouvelle opération ne peut être effectuée sur ce compte, il n'y a donc pas de nouvelles dépenses à comparer.
            </p>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg max-w-full sm:max-w-md mx-auto">
              <p className="text-red-800 font-semibold text-base sm:text-lg mb-2">💡 Que faire ?</p>
              <p className="text-red-700 mb-3 text-sm sm:text-base">
                Contactez votre {user?.notaire ? 'notaire' : 'conseiller'} pour débloquer votre compte et accéder à nouveau à cette fonctionnalité.
              </p>
              <div className="bg-gray-50 p-3 sm:p-4 rounded border border-red-300">
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
        )}

        {/* ✅ CONTENU POUR COMPTE ACTIF/NOUVEAU */}
        {!isCompteBloque && (
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
              <TrendingUp className="text-blue-500 mx-auto mb-4" size={48} />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Comparaison de dépenses</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Analysez et comparez vos dépenses pour mieux gérer votre budget
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 mb-6 rounded-lg">
              <p className="text-blue-800 font-semibold text-base sm:text-lg mb-2">
                📊 Fonctionnalité en développement
              </p>
              <p className="text-blue-700 text-sm sm:text-base">
                Nous travaillons actuellement sur cette fonctionnalité pour vous offrir une analyse détaillée de vos dépenses. Elle sera bientôt disponible !
              </p>
            </div>

            <div className="space-y-4">
              <div className=" from-purple-50 to-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🔍 Ce que vous pourrez faire :</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✅ Comparer vos dépenses mois par mois</li>
                  <li>✅ Identifier vos principales catégories de dépenses</li>
                  <li>✅ Suivre l'évolution de votre budget</li>
                  <li>✅ Recevoir des conseils personnalisés</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>💡 En attendant :</strong> Consultez vos transactions pour avoir un aperçu de vos dépenses récentes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;