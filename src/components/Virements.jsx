import React from 'react';

const Virements = () => {
  const virements = [
    { date: '2024-11-20', beneficiaire: 'EDF', montant: -85.50, statut: 'Effectué' },
    { date: '2024-11-18', beneficiaire: 'Marie Dubois', montant: -200.00, statut: 'Effectué' },
    { date: '2024-11-15', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        {/* Bannière d'alerte */}
        <div className="bg-green-300 border-l-4 border-red-500 p-3 md:p-4 mb-4 md:mb-6 rounded-lg flex items-start">
          <span className="text-lg sm:text-xl md:text-2xl mr-2 md:mr-3">⚠️</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-red-800 text-sm sm:text-base md:text-lg">Compte bloqué</h3>
            <p className="text-red-700 text-xs sm:text-sm md:text-base mt-1">Les virements sont temporairement suspendus. Contactez votre conseiller.</p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 sm:gap-2 mb-4 md:mb-6 border-b overflow-x-auto">
          <button className="px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-sm md:text-base text-blue-600 border-b-2 border-blue-600 whitespace-nowrap">
            Historique
          </button>
          <button className="px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-sm md:text-base text-gray-400 cursor-not-allowed flex items-center gap-1 sm:gap-2 whitespace-nowrap" disabled>
            Nouveau virement <span>🔒</span>
          </button>
        </div>

        {/* Tableau Desktop */}
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
                  <td className="px-6 py-4 text-sm text-gray-900">{v.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{v.beneficiaire}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${v.montant < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {v.montant.toFixed(2)} €
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

        {/* Cartes Mobile/Tablette */}
        <div className="md:hidden space-y-3">
          {virements.map((v, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{v.beneficiaire}</h4>
                  <p className="text-xs sm:text-sm text-gray-500">{v.date}</p>
                </div>
                <span className={`text-base sm:text-lg font-bold ${v.montant < 0 ? 'text-red-600' : 'text-green-600'} ml-2`}>
                  {v.montant.toFixed(2)} €
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
      </div>
    </div>
  );
};

export default Virements;