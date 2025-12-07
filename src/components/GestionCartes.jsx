import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import { useAuth } from '../context/AuthContext';

const GestionCartes = () => {
  const [userData, setUserData] = useState(null);
  const { userCode } = useAuth();

  useEffect(() => {
    console.log('Code utilisateur depuis Context:', userCode);
    
    if (userCode) {
      const user = UserService.getUserByCode(userCode);
      console.log('Données utilisateur:', user);
      if (user) {
        setUserData(user);
      } else {
        console.error('Aucun utilisateur trouvé pour le code:', userCode);
      }
    } else {
      console.error('Aucun userCode dans le Context');
    }
  }, [userCode]);

  const handleOpposition = () => {
    if (window.confirm('Voulez-vous vraiment faire opposition sur cette carte ?')) {
      alert('Votre demande d\'opposition a été enregistrée. Un conseiller vous contactera sous 24h.');
      sessionStorage.setItem('oppositionDemandee', 'true');
    }
  };

  const maskCardNumber = (numeroCompte) => {
    if (!numeroCompte) return '•••• •••• •••• ••••';
    const digits = numeroCompte.replace(/\s/g, '').replace(/[A-Z]/g, '');
    const last4 = digits.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const getExpirationDate = (dateOuverture) => {
    if (!dateOuverture) return '12/26';
    const [day, month, year] = dateOuverture.split('/');
    const expirationYear = (parseInt(year) + 5).toString().slice(-2);
    return `${month}/${expirationYear}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Mes cartes bancaires</h2>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        {/* Carte bloquée - fond blanc */}
        <div className="relative bg-white border-2 border-gray-300 rounded-xl p-4 sm:p-5 text-gray-800 mb-4 sm:mb-6 w-full max-w-sm h-48 sm:h-52 flex flex-col justify-between shadow-lg mx-auto">
          
          <div className="relative z-10">
            <div className="flex justify-end">
              <span className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                BLOQUÉE
              </span>
            </div>
          </div>
          
          <div className="relative z-10">
            <p className="text-lg sm:text-xl tracking-widest mb-3 sm:mb-4 font-light text-gray-700">
              {maskCardNumber(userData?.numeroCompte)}
            </p>
            <div className="flex justify-between items-end gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase mb-1">Titulaire</p>
                <p className="font-medium uppercase text-xs sm:text-sm tracking-wide text-gray-800 truncate">{userData?.nom || 'Chargement...'}</p>
              </div>
              <div className="text-right ">
                <div className="flex items-start gap-2 justify-end">
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500 uppercase">Expire</p>
                    <p className="text-xs text-gray-500 uppercase">fin</p>
                  </div>
                  <p className="font-medium text-sm text-gray-800">{getExpirationDate(userData?.dateOuverture)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full bg-gray-300 text-gray-500 px-4 sm:px-6 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base" disabled>
            <span>🔒</span> Modifier le plafond
          </button>
          <button className="w-full bg-gray-300 text-gray-500 px-4 sm:px-6 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base" disabled>
            <span>🔒</span> Commander une nouvelle carte
          </button>
          <button className="w-full bg-gray-300 text-gray-500 px-4 sm:px-6 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base" disabled>
            <span>🔒</span> Activer paiements en ligne
          </button>
          
          <button 
            onClick={handleOpposition}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm sm:text-base"
          >
            <span>⛔</span> Faire opposition
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionCartes;