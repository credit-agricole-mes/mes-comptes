// components/Profil.jsx
import React from 'react';

const Profil = ({ user }) => {
  // Chaque utilisateur a son conseiller assigné
  const conseiller = user.conseiller || {
    nom: 'Non assigné',
    telephone: 'N/A',
    email: 'N/A',
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Mon Profil</h2>
      
      {/* Bannière info */}
      <div className="bg-green-300 border-l-4 border-green-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg flex flex-col sm:flex-row items-start">
        <span className="text-xl sm:text-2xl mb-2 sm:mb-0 sm:mr-3">ℹ️</span>
        <p className="text-blue-800 text-sm sm:text-base">Vos informations sont en lecture seule. Contactez votre conseiller pour toute modification.</p>
      </div>
      
      {/* Carte profil */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold mb-4">Informations personnelles</h3>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <div className="relative">
              <input 
                type="text" 
                value={user.nom || 'Non renseigné'} 
                disabled 
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
              />
              <span className="absolute right-3 top-3 text-lg sm:text-xl">🔒</span>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input 
                type="email" 
                value={user.email || 'Non renseigné'} 
                disabled 
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
              />
              <span className="absolute right-3 top-3 text-lg sm:text-xl">🔒</span>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <div className="relative">
              <input 
                type="tel" 
                value={user.telephone || 'Non renseigné'} 
                disabled 
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
              />
              <span className="absolute right-3 top-3 text-lg sm:text-xl">🔒</span>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
            <div className="relative">
              <textarea 
                value={user.adresse || 'Non renseignée'} 
                disabled 
                rows="3"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
              />
              <span className="absolute right-3 top-3 text-lg sm:text-xl">🔒</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact conseiller */}
      <div className="bg-blue-50 rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-2">Besoin de modifier vos informations ?</h3>
        <p className="text-gray-700 mb-4 text-sm sm:text-base">Contactez votre conseiller :</p>
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="font-bold text-base sm:text-lg">{conseiller.nom}</p>
          <p className="text-gray-700 text-sm sm:text-base">📞 {conseiller.telephone}</p>
          <p className="text-gray-700 text-sm sm:text-base">✉️ {conseiller.email}</p>
        </div>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition text-sm sm:text-base">
          Envoyer un message
        </button>
      </div>
    </div>
  );
};

export default Profil;