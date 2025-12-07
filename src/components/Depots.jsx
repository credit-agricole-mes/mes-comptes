import React from 'react';

const Depots = () => {
  const depots = [
    { type: 'Dépôt de chèque', date: '15 novembre 2024', montant: 1250.00, icon: ' ' },
    { type: 'Dépôt espèces', date: '10 novembre 2024', montant: 500.00, icon: '' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
      {/* Bannière */}
      <div className="bg-green-300 border-l-4 border-red-500 p-3 md:p-4 mb-4 md:mb-6 rounded-lg flex items-start">
        <span className="text-lg sm:text-xl md:text-2xl mr-2 md:mr-3 ">⚠</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-yellow-800 text-sm sm:text-base md:text-lg">Dépôts suspendus</h3>
          <p className="text-yellow-700 text-xs sm:text-sm md:text-base mt-1">Pour effectuer un dépôt, veuillez vous rendre en agence</p>
        </div>
      </div>

      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4">Historique des dépôts</h3>

      <div className="space-y-3 md:space-y-4">
        {depots.map((depot, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-4 hover:shadow-lg transition">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
              <span className="text-2xl sm:text-3xl md:text-4xl ">{depot.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">{depot.type}</h4>
                <p className="text-gray-500 text-xs sm:text-sm">{depot.date}</p>
              </div>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 w-full sm:w-auto text-right">+{depot.montant.toFixed(2)} €</span>
          </div>
        ))}
      </div>

      {/* Bouton désactivé */}
      <button className="mt-4 md:mt-6 w-full bg-gray-300 text-gray-500 px-4 md:px-6 py-3 md:py-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base" disabled>
        <span>🔒</span> <span>Nouveau dépôt (indisponible)</span>
      </button>
    </div>
  );
};

export default Depots;