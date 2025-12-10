import React, { useState } from 'react';
import { TrendingDown, Calendar, Euro, AlertCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDateShort, formatDateLong } from '../utils/dateFormatter';
import { useAuth } from '../context/AuthContext';

const OverdraftPage = () => {
  const { user } = useAuth();
  
  // ✅ Récupérer l'historique des découverts de l'utilisateur connecté
  const historique = user?.decouvert || [];
  const [periode, setPeriode] = useState('6mois');

  // ✅ Récupérer devise et symbole
  const devise = user?.devise || "EUR";
  const symbole = user?.symboleDevise || "€";

  // Calculs basés sur les données de l'utilisateur
  const totalFrais = historique.reduce((sum, h) => sum + h.frais, 0);
  const moyenneDecouvert = historique.length > 0 
    ? Math.abs(Math.round(historique.reduce((sum, h) => sum + h.montant, 0) / historique.length))
    : 0;
  const decouvertMax = historique.length > 0 
    ? Math.abs(Math.max(...historique.map(h => h.montant)))
    : 0;

  // Taux et frais (peuvent être personnalisés par utilisateur plus tard)
  const tauxInteret = 8.5;
  const fraisFixe = 8;
  const decouvertAutorise = 500;

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">💳 Découvert Bancaire</h1>

        {/* Alerte compte bloqué */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <p className="text-red-800 font-semibold">
            🔒 Compte bloqué
          </p>
          <p className="text-red-700 text-sm mt-1">
            Le découvert n'est pas disponible tant que votre compte est bloqué. Vous pouvez consulter votre historique et les informations tarifaires.
          </p>
        </div>

        {/* Informations sur les taux et frais */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Euro className="mr-2 text-blue-600" size={24} />
            Taux et Frais Appliqués
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <p className="text-sm text-gray-600">Taux d'intérêt annuel</p>
                  <p className="text-2xl font-bold text-blue-600">{tauxInteret}%</p>
                  <p className="text-xs text-gray-500 mt-1">Appliqué au découvert utilisé</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💰</span>
                <div>
                  <p className="text-sm text-gray-600">Frais mensuels</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(fraisFixe, devise, symbole)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Si découvert utilisé dans le mois</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <p className="text-sm text-gray-600">Découvert autorisé</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(decouvertAutorise, devise, symbole)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Montant maximum disponible</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">⚡</span>
                <div>
                  <p className="text-sm text-gray-600">Frais de dépassement</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(20, devise, symbole)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Par incident de dépassement</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
            <div className="flex items-start">
              <AlertCircle className="text-yellow-600 mr-2" size={20} />
              <p className="text-sm text-yellow-800">
                <strong>Important :</strong> Le découvert est un crédit renouvelable. Utilisez-le avec modération pour éviter des frais importants.
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {historique.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-3 sm:mb-0">
                <TrendingDown className="mr-2 text-red-600" size={24} />
                Statistiques d'Utilisation
              </h2>
              <select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="1mois">1 mois</option>
                <option value="3mois">3 mois</option>
                <option value="6mois">6 mois</option>
                <option value="1an">1 an</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 rounded-lg p-4 text-center border-2 border-red-200">
                <p className="text-sm text-gray-600 mb-1">Total des frais payés</p>
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(totalFrais, devise, symbole)}
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 text-center border-2 border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Découvert moyen</p>
                <p className="text-3xl font-bold text-orange-600">
                  {formatCurrency(moyenneDecouvert, devise, symbole)}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center border-2 border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Découvert maximum</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(decouvertMax, devise, symbole)}
                </p>
              </div>
            </div>

            {/* Graphique visuel */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">📈 Évolution des découverts</h3>
              <div className="space-y-2">
                {historique.slice(0, 6).reverse().map((item) => {
                  const percentage = (Math.abs(item.montant) / decouvertMax) * 100;
                  return (
                    <div key={item.id}>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1">
                        <span>{formatDateShort(item.date, devise)}</span>
                        <span className="font-semibold">
                          {formatCurrency(Math.abs(item.montant), devise, symbole)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full  bg-green-500 flex items-center justify-end pr-2 text-white text-xs font-semibold"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 20 && formatCurrency(Math.abs(item.montant), devise, symbole)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Historique détaillé */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="mr-2 text-green-600" size={24} />
            Historique des Découverts
          </h2>

          {historique.length === 0 ? (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-blue-800">Aucun découvert enregistré pour le moment.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Montant</th>
                      <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Durée</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Frais</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique.map((item, index) => (
                      <tr key={item.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                            <Clock className="text-gray-400 mr-2" size={16} />
                            <span className="text-sm text-gray-800">
                              {formatDateLong(item.date, devise)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="font-bold text-red-600 text-sm sm:text-base">
                            -{formatCurrency(Math.abs(item.montant), devise, symbole)}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-sm text-gray-700">{item.duree} jours</span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="font-semibold text-orange-600 text-sm sm:text-base">
                            {formatCurrency(item.frais, devise, symbole)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 bg-gray-100">
                      <td colSpan="3" className="py-3 px-2 text-right font-bold text-gray-800">
                        Total des frais :
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="font-bold text-red-600 text-lg">
                          {formatCurrency(totalFrais, devise, symbole)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-300 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>💡 Conseil :</strong> Consultez régulièrement votre historique pour mieux gérer vos finances et éviter les frais de découvert.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverdraftPage;