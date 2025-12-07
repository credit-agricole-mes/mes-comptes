import React from 'react';
import { Lock, Users, User } from 'lucide-react';

const BeneficiariesPage = () => {
  const beneficiaries = [
    { id: 1, name: "Clarisse Bianchi", iban: "FR76 9876 5432 1098 7654", bank: "Société Générale" },
    { id: 2, name: "Jean Nolivie", iban: "FR76 1111 2222 3333 4444", bank: "BICICI" },
    { id: 3, name: "Fati Clara", iban: "FR76 5555 6666 7777 8888", bank: "SGBCI" },
    { id: 4, name: "Koman Lucien", iban: "FR76 9999 8888 7777 6666", bank: "Ecobank" }
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <Users className="text-blue-600" size={24} />
          Gestion des bénéficiaires
        </h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
          <p className="text-blue-800 font-semibold text-base sm:text-lg">
            🔒 Mode lecture seule activé
          </p>
          <p className="text-blue-700 text-xs sm:text-sm mt-2">
            Vous pouvez consulter vos bénéficiaires mais pas les ajouter, modifier ou supprimer tant que votre compte est bloqué.
          </p>
        </div>
        
        <h3 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-base sm:text-lg">
          📋 Mes bénéficiaires ({beneficiaries.length})
        </h3>
        
        {beneficiaries.map(beneficiary => (
          <div key={beneficiary.id} className="border-2 border-gray-300 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4 hover:bg-gray-50 transition">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <User size={20} className="text-blue-600 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{beneficiary.name}</h3>
                  <p className="text-gray-600 mt-1 text-xs sm:text-sm break-all">{beneficiary.iban}</p>
                  <p className="text-gray-500 text-xs mt-1">🏦 {beneficiary.bank}</p>
                </div>
              </div>
              <Users size={18} className="text-gray-400 sm:w-5 sm:h-5" />
            </div>
          </div>
        ))}
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 sm:mt-6">
          <button disabled className="bg-gray-300 text-gray-500 py-3 sm:py-4 rounded-lg cursor-not-allowed flex items-center justify-center font-semibold text-sm sm:text-base">
            <Lock size={16} className="mr-2 sm:w-5 sm:h-5" />
            Ajouter
          </button>
          <button disabled className="bg-gray-300 text-gray-500 py-3 sm:py-4 rounded-lg cursor-not-allowed flex items-center justify-center font-semibold text-sm sm:text-base">
            <Lock size={16} className="mr-2 sm:w-5 sm:h-5" />
            Modifier
          </button>
          <button disabled className="bg-gray-300 text-gray-500 py-3 sm:py-4 rounded-lg cursor-not-allowed flex items-center justify-center font-semibold text-sm sm:text-base">
            <Lock size={16} className="mr-2 sm:w-5 sm:h-5" />
            Supprimer
          </button>
        </div>

        <div className="mt-4 sm:mt-6 bg-green-50 border border-green-300 rounded-lg p-3 sm:p-4">
          <p className="text-green-800 text-xs sm:text-sm">
            <strong>✅ Consultation autorisée :</strong> Vous pouvez voir tous vos bénéficiaires enregistrés. Les modifications seront à nouveau possibles après le déblocage de votre compte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeneficiariesPage;