import React, { useState } from 'react';
import { TrendingDown, Calendar, Euro, AlertCircle, Clock } from 'lucide-react';

const OverdraftPage = () => {
  // Données d'historique
  const [historique] = useState([
    { id: 1, date: '2024-12-05', montant: -250, duree: 3, frais: 7.5 },
    { id: 2, date: '2024-11-28', montant: -180, duree: 5, frais: 9.0 },
    { id: 3, date: '2024-11-15', montant: -320, duree: 2, frais: 6.4 },
    { id: 4, date: '2024-11-01', montant: -150, duree: 4, frais: 6.0 },
    { id: 5, date: '2024-10-20', montant: -280, duree: 6, frais: 16.8 },
    { id: 6, date: '2024-10-05', montant: -200, duree: 3, frais: 6.0 }
  ]);

  const [periode, setPeriode] = useState('6mois');

  // Calculs
  const totalFrais = historique.reduce((sum, h) => sum + h.frais, 0);
  const moyenneDecouvert = Math.abs(Math.round(historique.reduce((sum, h) => sum + h.montant, 0) / historique.length));
  const decouvertMax = Math.abs(Math.max(...historique.map(h => h.montant)));

  // Taux et frais
  const tauxInteret = 8.5; // Taux annuel
  const fraisFixe = 8; // Frais mensuels si découvert
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
                  <p className="text-2xl font-bold text-orange-600">{fraisFixe} €</p>
                  <p className="text-xs text-gray-500 mt-1">Si découvert utilisé dans le mois</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <p className="text-sm text-gray-600">Découvert autorisé</p>
                  <p className="text-2xl font-bold text-green-600">{decouvertAutorise} €</p>
                  <p className="text-xs text-gray-500 mt-1">Montant maximum disponible</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <div className="flex items-start">
                <span className="text-2xl mr-3">⚡</span>
                <div>
                  <p className="text-sm text-gray-600">Frais de dépassement</p>
                  <p className="text-2xl font-bold text-purple-600">20 €</p>
                  <p className="text-xs text-gray-500 mt-1">Par incident de dépassement</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-green-50 border border-green-300 rounded-lg p-3">
            <div className="flex items-start">
              <AlertCircle className="text-green-600 mr-2 " size={20} />
              <p className="text-sm text-yellow-800">
                <strong>Important :</strong> Le découvert est un crédit renouvelable. Utilisez-le avec modération pour éviter des frais importants.
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
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
              <p className="text-3xl font-bold text-red-600">{totalFrais.toFixed(2)} €</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 text-center border-2 border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Découvert moyen</p>
              <p className="text-3xl font-bold text-orange-600">{moyenneDecouvert} €</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Découvert maximum</p>
              <p className="text-3xl font-bold text-purple-600">{decouvertMax} €</p>
            </div>
          </div>

          {/* Graphique visuel */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">📈 Évolution des découverts</h3>
            <div className="space-y-2">
              {historique.slice(0, 6).reverse().map((item, index) => {
                const percentage = (Math.abs(item.montant) / decouvertMax) * 100;
                return (
                  <div key={item.id}>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1">
                      <span>{new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                      <span className="font-semibold">{item.montant} €</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full from-red-500 to-red-600 flex items-center justify-end pr-2 text-white text-xs font-semibold"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 20 && `${Math.abs(item.montant)}€`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Historique détaillé */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="mr-2 text-green-600" size={24} />
            Historique des Découverts
          </h2>

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
                          {new Date(item.date).toLocaleDateString('fr-FR', { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-bold text-red-600 text-sm sm:text-base">{item.montant} €</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="text-sm text-gray-700">{item.duree} jours</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-semibold text-orange-600 text-sm sm:text-base">{item.frais.toFixed(2)} €</span>
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
                    <span className="font-bold text-red-600 text-lg">{totalFrais.toFixed(2)} €</span>
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
        </div>
      </div>
    </div>
  );
};

export default OverdraftPage;