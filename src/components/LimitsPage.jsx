import React, { useState } from 'react';
import { Lock, CreditCard, TrendingUp, DollarSign, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../services/UserService';

const LimitsPage = () => {
  const { user, updateUser } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  
  // ✅ Vérifier si le compte est VRAIMENT bloqué
  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;
  
  // Utiliser la devise de l'utilisateur connecté
  const devise = user?.devise || 'EUR';
  const symbole = user?.symboleDevise || '€';

  const [plafonds, setPlafonds] = useState({
    carteBancaire: { limit: 10000, used: 450, period: "Mensuel" },
    virementJournalier: { limit: 5000, used: 0, period: "Journalier" },
    retraitATM: { limit: 500, used: 0, period: "Journalier" },
    paiementInternet: { limit: 500, used: 0, period: "Mensuel" }
  });

  // État pour le formulaire
  const [formData, setFormData] = useState({
    carteBancaire: plafonds.carteBancaire.limit,
    virementJournalier: plafonds.virementJournalier.limit,
    retraitATM: plafonds.retraitATM.limit,
    paiementInternet: plafonds.paiementInternet.limit
  });

  const calculatePercentage = (used, limit) => {
    return ((used / limit) * 100).toFixed(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSaveLimits = () => {
    // Valider que tous les montants sont positifs
    if (Object.values(formData).some(val => val <= 0)) {
      alert('⚠️ Tous les plafonds doivent être supérieurs à 0');
      return;
    }

    // Mettre à jour les plafonds
    setPlafonds({
      carteBancaire: { ...plafonds.carteBancaire, limit: formData.carteBancaire },
      virementJournalier: { ...plafonds.virementJournalier, limit: formData.virementJournalier },
      retraitATM: { ...plafonds.retraitATM, limit: formData.retraitATM },
      paiementInternet: { ...plafonds.paiementInternet, limit: formData.paiementInternet }
    });

    // Sauvegarder dans le contexte utilisateur si disponible
    if (updateUser) {
      updateUser({ ...user, plafonds: formData });
    }

    setShowEditForm(false);
    alert('✅ Plafonds mis à jour avec succès !');
  };

  const handleCancel = () => {
    // Réinitialiser le formulaire avec les valeurs actuelles
    setFormData({
      carteBancaire: plafonds.carteBancaire.limit,
      virementJournalier: plafonds.virementJournalier.limit,
      retraitATM: plafonds.retraitATM.limit,
      paiementInternet: plafonds.paiementInternet.limit
    });
    setShowEditForm(false);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <CreditCard className="text-blue-600" size={24} />
          Mes plafonds
        </h2>
        
        {/* ✅ Message adapté selon le statut du compte */}
        {isCompteBloque ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
            <p className="text-red-800 font-semibold text-base sm:text-lg">
              ⚠️ Consultation uniquement
            </p>
            <p className="text-red-700 text-xs sm:text-sm mt-2">
              Les plafonds ne peuvent pas être modifiés sur un compte bloqué. Ils restent visibles pour information.
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
            <p className="text-green-800 font-semibold text-base sm:text-lg">
              ✅ Gestion des plafonds
            </p>
            <p className="text-green-700 text-xs sm:text-sm mt-2">
              Consultez et modifiez vos plafonds de dépenses pour mieux contrôler votre budget.
            </p>
          </div>
        )}

        {/* ✅ FORMULAIRE D'ÉDITION */}
        {showEditForm && !isCompteBloque && (
          <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-blue-900">
                ✏️ Modifier les plafonds
              </h3>
              <button 
                onClick={handleCancel}
                className="text-blue-600 hover:text-blue-800"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <CreditCard size={18} className="text-blue-600" />
                  Carte bancaire - Mensuel ({symbole})
                </label>
                <input
                  type="number"
                  name="carteBancaire"
                  value={formData.carteBancaire}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-600" />
                  Virement journalier ({symbole})
                </label>
                <input
                  type="number"
                  name="virementJournalier"
                  value={formData.virementJournalier}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <DollarSign size={18} className="text-purple-600" />
                  Retrait DAB - Journalier ({symbole})
                </label>
                <input
                  type="number"
                  name="retraitATM"
                  value={formData.retraitATM}
                  onChange={handleInputChange}
                  min="0"
                  step="50"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className=" text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <CreditCard size={18} className="text-orange-600" />
                  Paiement Internet - Mensuel ({symbole})
                </label>
                <input
                  type="number"
                  name="paiementInternet"
                  value={formData.paiementInternet}
                  onChange={handleInputChange}
                  min="0"
                  step="50"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveLimits}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Save size={20} />
                  Enregistrer
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
        
        <h3 className="font-semibold text-gray-700 mb-3 sm:mb-4 text-base sm:text-lg">📊 Plafonds actuels</h3>
        
        {/* Carte bancaire */}
        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
            <div className="flex-1">
              <span className="text-gray-800 font-semibold text-base sm:text-lg flex items-center gap-2">
                <CreditCard size={18} className="text-blue-600 sm:w-5 sm:h-5" />
                Carte bancaire
              </span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Limite {plafonds.carteBancaire.period.toLowerCase()}</p>
            </div>
            <span className="text-blue-800 font-bold text-xl sm:text-2xl">
              {formatCurrency(plafonds.carteBancaire.limit, devise, symbole)}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5 sm:h-3">
            <div 
              className="bg-blue-600 h-2.5 sm:h-3 rounded-full transition-all"
              style={{ width: `${calculatePercentage(plafonds.carteBancaire.used, plafonds.carteBancaire.limit)}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Utilisé : {formatCurrency(plafonds.carteBancaire.used, devise, symbole)} ({calculatePercentage(plafonds.carteBancaire.used, plafonds.carteBancaire.limit)}%)
          </p>
        </div>
        
        {/* Virement journalier */}
        <div className="border-l-4 border-green-500 bg-green-50 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
            <div className="flex-1">
              <span className="text-gray-800 font-semibold text-base sm:text-lg flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600 sm:w-5 sm:h-5" />
                Virement journalier
              </span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Limite {plafonds.virementJournalier.period.toLowerCase()}</p>
            </div>
            <span className="text-green-800 font-bold text-xl sm:text-2xl">
              {formatCurrency(plafonds.virementJournalier.limit, devise, symbole)}
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2.5 sm:h-3">
            <div 
              className="bg-green-600 h-2.5 sm:h-3 rounded-full transition-all"
              style={{ width: `${calculatePercentage(plafonds.virementJournalier.used, plafonds.virementJournalier.limit)}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Utilisé : {formatCurrency(plafonds.virementJournalier.used, devise, symbole)} ({calculatePercentage(plafonds.virementJournalier.used, plafonds.virementJournalier.limit)}%)
          </p>
        </div>
        
        {/* Retrait DAB */}
        <div className="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
            <div className="flex-1">
              <span className="text-gray-800 font-semibold text-base sm:text-lg flex items-center gap-2">
                <DollarSign size={18} className="text-purple-600 sm:w-5 sm:h-5" />
                Retrait DAB
              </span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Limite {plafonds.retraitATM.period.toLowerCase()}</p>
            </div>
            <span className="text-purple-800 font-bold text-xl sm:text-2xl">
              {formatCurrency(plafonds.retraitATM.limit, devise, symbole)}
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2.5 sm:h-3">
            <div 
              className="bg-purple-600 h-2.5 sm:h-3 rounded-full transition-all"
              style={{ width: `${calculatePercentage(plafonds.retraitATM.used, plafonds.retraitATM.limit)}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Utilisé : {formatCurrency(plafonds.retraitATM.used, devise, symbole)} ({calculatePercentage(plafonds.retraitATM.used, plafonds.retraitATM.limit)}%)
          </p>
        </div>

        {/* Paiement Internet */}
        <div className="border-l-4 border-orange-500 bg-orange-50 rounded-lg p-4 sm:p-5 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
            <div className="flex-1">
              <span className="text-gray-800 font-semibold text-base sm:text-lg flex items-center gap-2">
                <CreditCard size={18} className="text-orange-600 sm:w-5 sm:h-5" />
                Paiement Internet
              </span>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Limite {plafonds.paiementInternet.period.toLowerCase()}</p>
            </div>
            <span className="text-orange-800 font-bold text-xl sm:text-2xl">
              {formatCurrency(plafonds.paiementInternet.limit, devise, symbole)}
            </span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2.5 sm:h-3">
            <div 
              className="bg-orange-600 h-2.5 sm:h-3 rounded-full transition-all"
              style={{ width: `${calculatePercentage(plafonds.paiementInternet.used, plafonds.paiementInternet.limit)}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Utilisé : {formatCurrency(plafonds.paiementInternet.used, devise, symbole)} ({calculatePercentage(plafonds.paiementInternet.used, plafonds.paiementInternet.limit)}%)
          </p>
        </div>
        
        {/* ✅ Bouton adapté selon le statut */}
        <button 
          disabled={isCompteBloque}
          onClick={() => setShowEditForm(!showEditForm)}
          className={`w-full mt-4 sm:mt-6 py-3 sm:py-4 rounded-lg flex items-center justify-center font-semibold text-base sm:text-lg transition ${
            isCompteBloque
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : showEditForm
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isCompteBloque ? (
            <>
              <Lock size={18} className="mr-2 sm:w-5 sm:h-5" />
              Modifier les plafonds (bloqué)
            </>
          ) : showEditForm ? (
            <>
              <X size={18} className="mr-2 sm:w-5 sm:h-5" />
              Fermer le formulaire
            </>
          ) : (
            <>
              <Edit size={18} className="mr-2 sm:w-5 sm:h-5" />
              Modifier les plafonds
            </>
          )}
        </button>

        {/* ✅ Message informatif adapté */}
        {isCompteBloque ? (
          <div className="mt-4 sm:mt-6 bg-orange-50 border border-orange-300 rounded-lg p-3 sm:p-4">
            <p className="text-orange-800 text-xs sm:text-sm">
              <strong>ℹ️ Information :</strong> Vos plafonds actuels restent actifs. Vous pourrez les modifier une fois votre compte débloqué.
            </p>
          </div>
        ) : (
          <div className="mt-4 sm:mt-6 bg-green-50 border border-green-300 rounded-lg p-3 sm:p-4">
            <p className="text-green-800 text-xs sm:text-sm">
              <strong>✅ Compte actif :</strong> Vous pouvez modifier vos plafonds à tout moment pour mieux gérer vos dépenses et sécuriser votre compte.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LimitsPage;