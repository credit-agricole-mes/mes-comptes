import React, { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

const CalculatorPage = () => {
  const [montantInitial, setMontantInitial] = useState(1000);
  const [montantMensuel, setMontantMensuel] = useState(100);
  const [duree, setDuree] = useState(12);
  const [tauxInteret, setTauxInteret] = useState(2.5);

  const calculerEpargne = () => {
    const totalVerse = montantInitial + (montantMensuel * duree);
    const interets = (totalVerse * tauxInteret * duree) / (12 * 100);
    return { 
      totalVerse, 
      interets: Math.round(interets), 
      totalAvecInterets: Math.round(totalVerse + interets)
    };
  };

  const resultat = calculerEpargne();

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Alerte positive */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
          <p className="text-green-800 font-semibold text-lg">
            ✅ Outil de simulation disponible
          </p>
          <p className="text-green-700 text-sm mt-2">
            Le calculateur d'épargne est un simple outil de calcul. Aucune action ne sera effectuée sur votre compte. Vous pouvez l'utiliser librement pour planifier vos projets.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calculator className="mr-3 text-green-600" size={28} />
            Calculateur d'épargne
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                💰 Montant initial (€)
              </label>
              <input
                type="number"
                value={montantInitial}
                onChange={(e) => setMontantInitial(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-base sm:text-lg"
                min="0"
              />
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Le montant que vous avez déjà</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                📅 Épargne mensuelle (€)
              </label>
              <input
                type="number"
                value={montantMensuel}
                onChange={(e) => setMontantMensuel(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-base sm:text-lg"
                min="0"
              />
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Combien vous pouvez épargner par mois</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                ⏱️ Durée (mois)
              </label>
              <input
                type="number"
                value={duree}
                onChange={(e) => setDuree(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-base sm:text-lg"
                min="1"
              />
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Pendant combien de temps</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                📊 Taux d'intérêt annuel (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={tauxInteret}
                onChange={(e) => setTauxInteret(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-base sm:text-lg"
                min="0"
                max="100"
              />
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Le taux de rendement estimé</p>
            </div>
          </div>

          {/* Résultats */}
          <div className=" from-green-50 to-blue-50 rounded-lg p-4 sm:p-6 border-2 border-green-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-green-600" size={24} />
              Résultats de la simulation
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">💵 Total épargné (capital)</span>
                  <span className="font-bold text-lg sm:text-xl text-gray-800">
                    {resultat.totalVerse.toLocaleString()} €
                  </span>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Votre apport personnel total</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">✨ Intérêts générés</span>
                  <span className="font-bold text-lg sm:text-xl text-green-600">
                    +{resultat.interets.toLocaleString()} €
                  </span>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Gains grâce au taux d'intérêt</p>
              </div>

              <div className=" from-green-500 to-green-600 rounded-lg p-4 sm:p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-white font-bold text-base sm:text-lg">🎯 Total avec intérêts</span>
                  <span className="font-bold text-2xl sm:text-3xl text-white">
                    {resultat.totalAvecInterets.toLocaleString()} €
                  </span>
                </div>
                <p className="text-green-100 text-xs sm:text-sm mt-2">
                  Votre capital final après {duree} mois
                </p>
              </div>
            </div>

            {/* Graphique visuel simple */}
            <div className="mt-6 bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">📈 Répartition</h4>
              <div className="flex h-10 sm:h-12 rounded-lg overflow-hidden">
                <div 
                  className="bg-blue-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold"
                  style={{ width: `${(resultat.totalVerse / resultat.totalAvecInterets * 100)}%` }}
                >
                  Capital
                </div>
                <div 
                  className="bg-green-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold"
                  style={{ width: `${(resultat.interets / resultat.totalAvecInterets * 100)}%` }}
                >
                  Intérêts
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>💵 {((resultat.totalVerse / resultat.totalAvecInterets) * 100).toFixed(1)}%</span>
                <span>✨ {((resultat.interets / resultat.totalAvecInterets) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>⚠️ Simulation uniquement</strong> - Cet outil vous aide à planifier vos projets d'épargne. Pour mettre en place une épargne automatique, vous devrez d'abord débloquer votre compte.
            </p>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-300 rounded-lg p-4">
            <p className="text-blue-800 text-xs sm:text-sm">
              <strong>💡 Astuce :</strong> Ce calculateur reste accessible même avec un compte bloqué car il ne réalise aucune opération bancaire. Il s'agit uniquement d'un outil de planification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;