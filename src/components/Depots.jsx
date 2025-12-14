import React from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDateShort } from '../utils/dateFormatter';
import { useAuth } from '../context/AuthContext';
import { Inbox } from 'lucide-react';

const Depots = () => {
  const { user } = useAuth();
  
  // ✅ Vérifier si le compte est vraiment bloqué
  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;
  
  // ✅ Récupérer les dépôts de l'utilisateur connecté
  const depots = user?.depots || [];
  const devise = user?.devise || "EUR";
  const symbole = user?.symboleDevise || "€";

  return (
    <div className="w-full max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
      {/* ✅ BANNIÈRE ADAPTÉE SELON LE STATUT DU COMPTE */}
      {isCompteBloque && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 mb-4 md:mb-6 rounded-lg flex items-start">
          <span className="text-lg sm:text-xl md:text-2xl mr-2 md:mr-3">🔒</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-red-800 text-sm sm:text-base md:text-lg">Dépôts temporairement suspendus</h3>
            <p className="text-red-700 text-xs sm:text-sm md:text-base mt-1">
              Votre compte est bloqué. Pour effectuer un dépôt, veuillez contacter votre conseiller ou vous rendre en agence.
            </p>
          </div>
        </div>
      )}

      {!isCompteBloque && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 mb-4 md:mb-6 rounded-lg flex items-start">
          <span className="text-lg sm:text-xl md:text-2xl mr-2 md:mr-3">ℹ️</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-blue-800 text-sm sm:text-base md:text-lg">Dépôts en agence uniquement</h3>
            <p className="text-blue-700 text-xs sm:text-sm md:text-base mt-1">
              Pour effectuer un dépôt, veuillez vous rendre dans l'une de nos agences avec vos fonds. Les dépôts en ligne ne sont pas encore disponibles.
            </p>
          </div>
        </div>
      )}

      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4">Historique des dépôts</h3>

      {/* ✅ MESSAGE SI PAS DE DÉPÔTS - ADAPTÉ */}
      {depots.length === 0 && !isCompteBloque && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Inbox size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium text-base mb-2">Aucun dépôt enregistré</p>
          <p className="text-gray-500 text-sm">Vos futurs dépôts en agence apparaîtront ici</p>
        </div>
      )}

      {depots.length === 0 && isCompteBloque && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
          <p className="text-orange-800">Aucun dépôt enregistré pour le moment.</p>
        </div>
      )}

      {/* Liste des dépôts */}
      {depots.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          {depots.map((depot, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-4 hover:shadow-lg transition">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                <span className="text-2xl sm:text-3xl md:text-4xl">{depot.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">{depot.type}</h4>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {formatDateShort(depot.date, devise)}
                  </p>
                </div>
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 w-full sm:w-auto text-right">
                +{formatCurrency(depot.montant, devise, symbole)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ✅ BOUTON ADAPTÉ SELON LE STATUT */}
      {isCompteBloque && (
        <button 
          className="mt-4 md:mt-6 w-full bg-gray-300 text-gray-500 px-4 md:px-6 py-3 md:py-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base" 
          disabled
        >
          <span>🔒</span> <span>Nouveau dépôt (compte bloqué)</span>
        </button>
      )}

      {!isCompteBloque && (
        <div className="mt-4 md:mt-6 space-y-3">
          <button 
            className="w-full bg-gray-300 text-gray-500 px-4 md:px-6 py-3 md:py-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base" 
            disabled
          >
            <span>🏦</span> <span>Dépôt en ligne (bientôt disponible)</span>
          </button>
          
          <div className="bg-green-50 border border-green-300 rounded-lg p-3 md:p-4">
            <p className="text-green-800 text-xs sm:text-sm">
              <strong>💡 Pour effectuer un dépôt :</strong> Rendez-vous dans l'une de nos agences avec vos fonds en espèces ou par chèque. Notre équipe vous assistera pour créditer votre compte immédiatement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Depots;