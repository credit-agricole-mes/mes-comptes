import React from 'react';
import { Lock, CreditCard, TrendingUp, DollarSign } from 'lucide-react';

const LimitsPage = () => {
  const plafonds = {
    carteBancaire: { limit: 10000, used: 450, period: "Mensuel" },
    virementJournalier: { limit: 5000, used: 0, period: "Journalier" },
    retraitATM: { limit: 500, used: 0, period: "Journalier" },
    paiementInternet: { limit: 500, used: 0, period: "Mensuel" }
  };

  const calculatePercentage = (used, limit) => {
    return ((used / limit) * 100).toFixed(0);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <CreditCard className="text-blue-600" size={24} />
          Mes plafonds
        </h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
          <p className="text-blue-800 font-semibold text-base sm:text-lg">
            👁️ Consultation uniquement
          </p>
          <p className="text-blue-700 text-xs sm:text-sm mt-2">
            Les plafonds ne peuvent pas être modifiés sur un compte bloqué. Ils restent visibles pour information.
          </p>
        </div>
        
        <h3 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-base sm:text-lg">📊 Plafonds actuels</h3>
        
        {/* Carte bancaire */}
        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
            <div className="flex-1">
              <span className="text-gray-800 font-semibold text-base sm:text-lg flex items-center gap-2">
                <CreditCard size={18} className="text-blue-600 sm:w-5 sm:h-5" />
                Carte bancaire
              </span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Limite {plafonds.carteBancaire.period.toLowerCase()}</p>
            </div>
            <span className="text-blue-800 font-bold text-xl sm:text-2xl">
              {plafonds.carteBancaire.limit.toLocaleString()} €
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5 sm:h-3">
            <div 
              className="bg-blue-600 h-2.5 sm:h-3 rounded-full transition-all"
              style={{ width: `${calculatePercentage(plafonds.carteBancaire.used, plafonds.carteBancaire.limit)}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Utilisé : {plafonds.carteBancaire.used} € ({calculatePercentage(plafonds.carteBancaire.used, plafonds.carteBancaire.limit)}%)
          </p>
        </div>
        
        {/* Virement journalier */}
        <div className="border-l-4 border-green-500 bg-green-50 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
            <div className="flex-1">
              <span className="text-gray-800 font-semibold text-base sm:text-lg flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600 sm:w-5 sm:h-5" />
                Virement journalier
              </span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Limite {plafonds.virementJournalier.period.toLowerCase()}</p>
            </div>
            <span className="text-green-800 font-bold text-xl sm:text-2xl">
              {plafonds.virementJournalier.limit.toLocaleString()} €
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2.5 sm:h-3">
            <div 
              className="bg-green-600 h-2.5 sm:h-3 rounded-full transition-all"
              style={{ width: `${calculatePercentage(plafonds.virementJournalier.used, plafonds.virementJournalier.limit)}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Utilisé : {plafonds.virementJournalier.used} € ({calculatePercentage(plafonds.virementJournalier.used, plafonds.virementJournalier.limit)}%)
          </p>
        </div>
        
        {/* Retrait DAB */}
        <div className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
            <div className="flex-1">
              <span className="text-gray-800 font-semibold text-base sm:text-lg flex items-center gap-2">
                <DollarSign size={18} className="text-purple-600 sm:w-5 sm:h-5" />
                Retrait DAB
              </span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Limite {plafonds.retraitATM.period.toLowerCase()}</p>
            </div>
            <span className="text-purple-800 font-bold text-xl sm:text-2xl">
              {plafonds.retraitATM.limit.toLocaleString()} €
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2.5 sm:h-3">
            <div 
              className="bg-purple-600 h-2.5 sm:h-3 rounded-full transition-all"
              style={{ width: `${calculatePercentage(plafonds.retraitATM.used, plafonds.retraitATM.limit)}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Utilisé : {plafonds.retraitATM.used} € ({calculatePercentage(plafonds.retraitATM.used, plafonds.retraitATM.limit)}%)
          </p>
        </div>

        {/* Paiement Internet */}
        <div className="border-l-4 border-orange-500 bg-orange-50 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
            <div className="flex-1">
              <span className="text-gray-800 font-semibold text-base sm:text-lg flex items-center gap-2">
                <CreditCard size={18} className="text-orange-600 sm:w-5 sm:h-5" />
                Paiement Internet
              </span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Limite {plafonds.paiementInternet.period.toLowerCase()}</p>
            </div>
            <span className="text-orange-800 font-bold text-xl sm:text-2xl">
              {plafonds.paiementInternet.limit.toLocaleString()} €
            </span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2.5 sm:h-3">
            <div 
              className="bg-orange-600 h-2.5 sm:h-3 rounded-full transition-all"
              style={{ width: `${calculatePercentage(plafonds.paiementInternet.used, plafonds.paiementInternet.limit)}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Utilisé : {plafonds.paiementInternet.used} € ({calculatePercentage(plafonds.paiementInternet.used, plafonds.paiementInternet.limit)}%)
          </p>
        </div>
        
        <button disabled className="w-full mt-4 sm:mt-6 bg-gray-300 text-gray-500 py-3 sm:py-4 rounded-lg cursor-not-allowed flex items-center justify-center font-semibold text-base sm:text-lg">
          <Lock size={18} className="mr-2 sm:w-5 sm:h-5" />
          Modifier les plafonds (bloqué)
        </button>

        <div className="mt-4 sm:mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-3 sm:p-4">
          <p className="text-yellow-800 text-xs sm:text-sm">
            <strong>ℹ️ Information :</strong> Vos plafonds actuels restent actifs. Vous pourrez les modifier une fois votre compte débloqué.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LimitsPage;