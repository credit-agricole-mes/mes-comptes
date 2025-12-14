import React, { useState, useEffect } from 'react';
import { X, Save, CreditCard, Plus, Shield } from 'lucide-react';
import UserService from '../services/UserService';
import { useAuth } from '../context/AuthContext';

const GestionCartes = () => {
  const [userData, setUserData] = useState(null);
  const { user, updateUser } = useAuth();
  const [showPlafondForm, setShowPlafondForm] = useState(false);
  const [showCommandeForm, setShowCommandeForm] = useState(false);
  const [showPaiementForm, setShowPaiementForm] = useState(false);

  // ✅ Vérifier si le compte est bloqué
  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;

  // États pour les formulaires
  const [plafondData, setPlafondData] = useState({
    plafondRetrait: 500,
    plafondPaiement: 1000,
    plafondSansContact: 50
  });

  const [commandeData, setCommandeData] = useState({
    typeCarte: 'classique',
    adresseLivraison: '',
    motif: ''
  });

  const [paiementEnLigne, setPaiementEnLigne] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.code) {
        const fetchedUser = await UserService.getUserByCode(user.code);
        if (fetchedUser) {
          setUserData(fetchedUser);
          setCommandeData(prev => ({
            ...prev,
            adresseLivraison: fetchedUser.adresse || ''
          }));
          setPaiementEnLigne(fetchedUser.paiementEnLigne || false);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleOpposition = () => {
    if (window.confirm('Voulez-vous vraiment faire opposition sur cette carte ?')) {
      alert('Votre demande d\'opposition a été enregistrée. Un conseiller vous contactera sous 24h.');
    }
  };

  const handlePlafondSubmit = () => {
    if (updateUser) {
      updateUser({ ...user, plafondsCarte: plafondData });
    }
    alert('✅ Plafonds mis à jour avec succès !');
    setShowPlafondForm(false);
  };

  const handleCommandeSubmit = () => {
    if (!commandeData.adresseLivraison || !commandeData.motif) {
      alert('⚠️ Veuillez remplir tous les champs');
      return;
    }
    alert('✅ Votre commande de carte a été enregistrée. Vous recevrez votre nouvelle carte sous 7 jours ouvrés.');
    setShowCommandeForm(false);
  };

  const handlePaiementToggle = () => {
    const newStatus = !paiementEnLigne;
    setPaiementEnLigne(newStatus);
    if (updateUser) {
      updateUser({ ...user, paiementEnLigne: newStatus });
    }
    alert(newStatus ? '✅ Paiements en ligne activés' : '⚠️ Paiements en ligne désactivés');
    setShowPaiementForm(false);
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

      {/* Message adapté selon le statut */}
      {isCompteBloque ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <p className="text-red-800 font-semibold">⚠️ Carte bloquée</p>
          <p className="text-red-700 text-sm mt-1">
            Suite au blocage de votre compte, votre carte bancaire est temporairement désactivée.
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
          <p className="text-green-800 font-semibold">✅ Carte active</p>
          <p className="text-green-700 text-sm mt-1">
            Votre carte bancaire est opérationnelle. Gérez vos paramètres ci-dessous.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        {/* Carte bancaire */}
        <div className={`relative rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 w-full max-w-sm h-48 sm:h-52 flex flex-col justify-between shadow-lg mx-auto ${
          isCompteBloque 
            ? 'bg-white border-2 border-gray-300 text-gray-800' 
            : 'bg-blue-700 text-white'
        }`}>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <img 
                  src="/images/logo-transparent.png" 
                  alt="Logo" 
                  className="h-8 sm:h-10 w-auto"
                />
              </div>
              <span className={`px-2 sm:px-3 py-1 text-xs font-bold rounded-full ${
                isCompteBloque 
                  ? 'bg-red-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                {isCompteBloque ? 'BLOQUÉE' : 'ACTIVE'}
              </span>
            </div>
          </div>
          
          <div className="relative z-10">
            <p className={`text-lg sm:text-xl tracking-widest mb-3 sm:mb-4 font-light ${
              isCompteBloque ? 'text-gray-700' : 'text-white'
            }`}>
              {maskCardNumber(userData?.numeroCompte)}
            </p>
            <div className="flex justify-between items-end gap-2">
              <div className="flex-1 min-w-0">
                <p className={`text-xs uppercase mb-1 ${
                  isCompteBloque ? 'text-gray-500' : 'text-blue-200'
                }`}>Titulaire</p>
                <p className={`font-medium uppercase text-xs sm:text-sm tracking-wide truncate ${
                  isCompteBloque ? 'text-gray-800' : 'text-white'
                }`}>{userData?.nom || 'Chargement...'}</p>
              </div>
              <div className="text-right">
                <div className="flex items-start gap-2 justify-end">
                  <div className="flex flex-col">
                    <p className={`text-xs uppercase ${
                      isCompteBloque ? 'text-gray-500' : 'text-blue-200'
                    }`}>Expire</p>
                    <p className={`text-xs uppercase ${
                      isCompteBloque ? 'text-gray-500' : 'text-blue-200'
                    }`}>fin</p>
                  </div>
                  <p className={`font-medium text-sm ${
                    isCompteBloque ? 'text-gray-800' : 'text-white'
                  }`}>{getExpirationDate(userData?.dateOuverture)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FORMULAIRE PLAFOND */}
        {showPlafondForm && !isCompteBloque && (
          <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 sm:p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                <CreditCard size={20} />
                Modifier les plafonds
              </h3>
              <button onClick={() => setShowPlafondForm(false)} className="text-blue-600 hover:text-blue-800">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Plafond retrait (€/jour)</label>
                <input
                  type="number"
                  value={plafondData.plafondRetrait}
                  onChange={(e) => setPlafondData({...plafondData, plafondRetrait: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Plafond paiement (€/mois)</label>
                <input
                  type="number"
                  value={plafondData.plafondPaiement}
                  onChange={(e) => setPlafondData({...plafondData, plafondPaiement: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Plafond sans contact (€/opération)</label>
                <input
                  type="number"
                  value={plafondData.plafondSansContact}
                  onChange={(e) => setPlafondData({...plafondData, plafondSansContact: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handlePlafondSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Save size={20} />
                  Enregistrer
                </button>
                <button onClick={() => setShowPlafondForm(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FORMULAIRE COMMANDE CARTE */}
        {showCommandeForm && !isCompteBloque && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 sm:p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                <Plus size={20} />
                Commander une nouvelle carte
              </h3>
              <button onClick={() => setShowCommandeForm(false)} className="text-green-600 hover:text-green-800">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Type de carte</label>
                <select
                  value={commandeData.typeCarte}
                  onChange={(e) => setCommandeData({...commandeData, typeCarte: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="classique">Visa Classique</option>
                  <option value="premier">Visa Premier</option>
                  <option value="infinite">Visa Infinite</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Adresse de livraison</label>
                <textarea
                  value={commandeData.adresseLivraison}
                  onChange={(e) => setCommandeData({...commandeData, adresseLivraison: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Motif de la commande</label>
                <select
                  value={commandeData.motif}
                  onChange={(e) => setCommandeData({...commandeData, motif: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="">Sélectionnez un motif</option>
                  <option value="perte">Perte</option>
                  <option value="vol">Vol</option>
                  <option value="deterioration">Détérioration</option>
                  <option value="renouvellement">Renouvellement</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleCommandeSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Save size={20} />
                  Commander
                </button>
                <button onClick={() => setShowCommandeForm(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FORMULAIRE PAIEMENT EN LIGNE */}
        {showPaiementForm && !isCompteBloque && (
          <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-4 sm:p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                <Shield size={20} />
                Paiements en ligne
              </h3>
              <button onClick={() => setShowPaiementForm(false)} className="text-purple-600 hover:text-purple-800">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-white border-2 border-purple-300 rounded-lg p-4">
                <p className="text-gray-700 mb-4">
                  Les paiements en ligne sont actuellement <strong>{paiementEnLigne ? 'activés' : 'désactivés'}</strong>.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {paiementEnLigne 
                    ? '⚠️ En désactivant les paiements en ligne, vous ne pourrez plus effectuer d\'achats sur Internet avec cette carte.'
                    : '✅ En activant les paiements en ligne, vous pourrez effectuer des achats sur Internet en toute sécurité.'
                  }
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handlePaiementToggle} 
                  className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    paiementEnLigne 
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {paiementEnLigne ? '🔒 Désactiver' : '✅ Activer'}
                </button>
                <button onClick={() => setShowPaiementForm(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        {!showPlafondForm && !showCommandeForm && !showPaiementForm && (
          <div className="space-y-3">
            <button 
              disabled={isCompteBloque}
              onClick={() => setShowPlafondForm(true)}
              className={`w-full px-4 sm:px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base transition ${
                isCompteBloque
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isCompteBloque ? <span>🔒</span> : <CreditCard size={20} />}
              Modifier le plafond
            </button>
            
            <button 
              disabled={isCompteBloque}
              onClick={() => setShowCommandeForm(true)}
              className={`w-full px-4 sm:px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base transition ${
                isCompteBloque
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isCompteBloque ? <span>🔒</span> : <Plus size={20} />}
              Commander une nouvelle carte
            </button>
            
            <button 
              disabled={isCompteBloque}
              onClick={() => setShowPaiementForm(true)}
              className={`w-full px-4 sm:px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base transition ${
                isCompteBloque
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isCompteBloque ? <span>🔒</span> : <Shield size={20} />}
              {paiementEnLigne ? 'Gérer paiements en ligne' : 'Activer paiements en ligne'}
            </button>
            
            <button 
              onClick={handleOpposition}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm sm:text-base"
            >
              <span>⛔</span> Faire opposition
            </button>
          </div>
        )}

        {/* Message informatif */}
        {isCompteBloque ? (
          <div className="mt-6 bg-orange-50 border border-orange-300 rounded-lg p-4">
            <p className="text-orange-800 text-sm">
              <strong>ℹ️ Information :</strong> Votre carte sera réactivée automatiquement une fois votre compte débloqué. Contactez votre conseiller pour plus d'informations.
            </p>
          </div>
        ) : (
          <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>💡 Astuce :</strong> Personnalisez les paramètres de votre carte pour une expérience bancaire optimale. Vous pouvez modifier vos plafonds et gérer les paiements en ligne à tout moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionCartes;