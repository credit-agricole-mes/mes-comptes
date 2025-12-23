import React, { useState } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDateShort } from '../utils/dateFormatter';
import { useAuth } from '../context/AuthContext';
import { Inbox, X, Send, CheckCircle, Download, Eye } from 'lucide-react';
import emailjs from '@emailjs/browser';
import jsPDF from 'jspdf';

const Virements = () => {
  const { user, updateUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('historique');
  const [formData, setFormData] = useState({
    beneficiaire: '',
    iban: '',
    bic: '',
    email: '',
    montant: '',
    motif: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  
  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;
  
  const virements = user?.virements || [];
  const beneficiaires = user?.beneficiaires || [];
  const devise = user?.devise || "EUR";
  const symbole = user?.symboleDevise || "€";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBeneficiaireSelect = (e) => {
    const selectedId = parseInt(e.target.value);
    const beneficiaire = beneficiaires.find(b => b.id === selectedId);
    
    if (beneficiaire) {
      setFormData(prev => ({
        ...prev,
        beneficiaire: beneficiaire.name,
        iban: beneficiaire.iban,
        bic: beneficiaire.bic || '',
        email: beneficiaire.email || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        beneficiaire: '',
        iban: '',
        bic: '',
        email: ''
      }));
    }
  };

  const validateIBAN = (iban) => {
    const ibanClean = iban.replace(/\s/g, '');
    return ibanClean.length >= 15;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateBIC = (bic) => {
    const bicClean = bic.replace(/\s/g, '');
    return bicClean.length >= 8 && bicClean.length <= 11;
  };

  // 📄 Afficher le reçu dans une modale
  const showReceipt = (virementData) => {
    setCurrentReceipt(virementData);
    setShowReceiptModal(true);
  };

  // 📄 Générer et télécharger le reçu PDF
  const downloadReceipt = (virementData) => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(40, 120, 200);
    doc.text('REÇU DE VIREMENT', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Document officiel - Confidentiel', 105, 28, { align: 'center' });
    
    // Ligne de séparation
    doc.setDrawColor(40, 120, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Informations du virement
    doc.setFontSize(12);
    doc.setTextColor(0);
    
    let y = 50;
    
    doc.setFont(undefined, 'bold');
    doc.text('INFORMATIONS DE L\'ÉMETTEUR', 20, y);
    doc.setFont(undefined, 'normal');
    y += 8;
    
    doc.text(`Nom: ${user.nom}`, 25, y);
    y += 6;
    doc.text(`Compte: ${user.numeroCompte}`, 25, y);
    y += 6;
    doc.text(`Agence: ${user.agence}`, 25, y);
    y += 12;
    
    doc.setFont(undefined, 'bold');
    doc.text('INFORMATIONS DU BÉNÉFICIAIRE', 20, y);
    doc.setFont(undefined, 'normal');
    y += 8;
    
    doc.text(`Nom: ${virementData.beneficiaire}`, 25, y);
    y += 6;
    doc.text(`IBAN: ${virementData.iban}`, 25, y);
    y += 6;
    doc.text(`BIC: ${virementData.bic}`, 25, y);
    y += 6;
    doc.text(`Email: ${virementData.email}`, 25, y);
    y += 12;
    
    doc.setFont(undefined, 'bold');
    doc.text('DÉTAILS DU VIREMENT', 20, y);
    doc.setFont(undefined, 'normal');
    y += 8;
    
    doc.text(`Date: ${virementData.date}`, 25, y);
    y += 6;
    doc.text(`Montant: ${formatCurrency(virementData.montant, devise, symbole)}`, 25, y);
    y += 6;
    doc.text(`Motif: ${virementData.motif}`, 25, y);
    y += 6;
    doc.text(`Statut: ${virementData.statut}`, 25, y);
    y += 6;
    doc.text(`Référence: VIR-${Date.now()}`, 25, y);
    
    // Pied de page
    y = 260;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Ce document a été généré automatiquement.', 105, y, { align: 'center' });
    doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 105, y + 5, { align: 'center' });
    
    // Télécharger le PDF
    doc.save(`Recu_Virement_${virementData.date.replace(/\//g, '-')}.pdf`);
  };

  // 📧 Envoyer l'email avec EmailJS
  const sendEmailToRecipient = async (virementData) => {
    try {
      // Initialiser EmailJS avec ta clé publique
      emailjs.init('KcxGOCDI7HkrPtheP');
      
      const templateParams = {
        to_email: virementData.email,
        to_name: virementData.beneficiaire,
        from_name: user.nom,
        amount: formatCurrency(virementData.montant, devise, symbole),
        date: virementData.date,
        motif: virementData.motif,
        reference: `VIR-${Date.now()}`,
        iban: virementData.iban,
        bic: virementData.bic
      };

      console.log('📧 Envoi email avec params:', templateParams);

      const response = await emailjs.send(
        'service_p68f14c',
        'template_u6pdiyp',
        templateParams
      );
      
      console.log('✅ Email envoyé avec succès:', response);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      console.error('Détails erreur:', error.text || error.message);
      return false;
    }
  };

  const handleSubmitVirement = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.beneficiaire.trim()) {
      setError('Le nom du bénéficiaire est obligatoire');
      setLoading(false);
      return;
    }

    if (!formData.iban.trim()) {
      setError('L\'IBAN est obligatoire');
      setLoading(false);
      return;
    }

    if (!validateIBAN(formData.iban)) {
      setError('L\'IBAN doit contenir au moins 15 caractères');
      setLoading(false);
      return;
    }

    if (!formData.bic.trim()) {
      setError('Le BIC est obligatoire');
      setLoading(false);
      return;
    }

    if (!validateBIC(formData.bic)) {
      setError('Le BIC doit contenir entre 8 et 11 caractères');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('L\'email du bénéficiaire est obligatoire');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('L\'adresse email est invalide');
      setLoading(false);
      return;
    }

    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      setError('Le montant doit être supérieur à 0');
      setLoading(false);
      return;
    }

    const montant = parseFloat(formData.montant);

    if (montant > user.solde) {
      setError(`Solde insuffisant. Votre solde actuel est de ${formatCurrency(user.solde, devise, symbole)}`);
      setLoading(false);
      return;
    }

    try {
      const today = new Date();
      const dateFormatted = today.toLocaleDateString('fr-FR');

      const newVirement = {
        date: dateFormatted,
        beneficiaire: formData.beneficiaire.trim(),
        iban: formData.iban.trim().toUpperCase(),
        bic: formData.bic.trim().toUpperCase(),
        email: formData.email.trim().toLowerCase(),
        montant: montant,
        motif: formData.motif.trim() || 'Virement',
        statut: 'Effectué'
      };

      const newTransaction = {
        date: dateFormatted,
        libelle: `Virement vers ${formData.beneficiaire.trim()}`,
        debit: montant.toString(),
        credit: '',
        type: 'virement',
        statut: 'Effectué'
      };

      // ✅ MISE À JOUR DU USER AVEC DÉDUCTION DU SOLDE
      const updatedUser = {
        ...user,
        solde: user.solde - montant,
        virements: [...virements, newVirement],
        transactions: [...(user.transactions || []), newTransaction]
      };

      // Mise à jour dans le localStorage
      const users = JSON.parse(localStorage.getItem('bankUsers') || '[]');
      const userIndex = users.findIndex(u => u.code === user.code);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('bankUsers', JSON.stringify(users));
      }

      // Mise à jour du contexte
      updateUser(updatedUser);

      // 📧 Envoyer l'email au bénéficiaire
      const emailSent = await sendEmailToRecipient(newVirement);
      
      // 📄 Afficher le reçu automatiquement
      setCurrentReceipt(newVirement);
      setShowReceiptModal(true);

      setSuccess(
        `✅ Virement de ${formatCurrency(montant, devise, symbole)} effectué avec succès vers ${formData.beneficiaire} !\n${emailSent ? '📧 Email de notification envoyé au bénéficiaire.' : '⚠️ Email non envoyé (vérifiez votre configuration EmailJS).'}`
      );
      
      setFormData({ beneficiaire: '', iban: '', bic: '', email: '', montant: '', motif: '' });
      
      setTimeout(() => {
        setShowForm(false);
        setActiveTab('historique');
        setSuccess('');
      }, 5000);

    } catch (error) {
      setError('Une erreur s\'est produite lors du virement');
      console.error('Erreur virement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewVirement = () => {
    if (!isCompteBloque) {
      setShowForm(true);
      setActiveTab('nouveau');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        
        {/* ✅ BANNIÈRE COMPTE BLOQUÉ */}
        {isCompteBloque && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 mb-4 md:mb-6 rounded-lg flex items-start">
            <span className="text-lg sm:text-xl md:text-2xl mr-2 md:mr-3">🔒</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-red-800 text-sm sm:text-base md:text-lg">Compte bloqué</h3>
              <p className="text-red-700 text-xs sm:text-sm md:text-base mt-1">
                {user.notification || "Les virements sont temporairement suspendus. Contactez votre conseiller pour débloquer votre compte."}
              </p>
            </div>
          </div>
        )}

        {/* ✅ BANNIÈRE COMPTE ACTIF */}
        {!isCompteBloque && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 md:p-4 mb-4 md:mb-6 rounded-lg flex items-start">
            <CheckCircle className="text-green-600 mr-2 md:mr-3" size={24} />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-green-800 text-sm sm:text-base md:text-lg">Compte actif</h3>
              <p className="text-green-700 text-xs sm:text-sm md:text-base mt-1">
                Votre compte est entièrement opérationnel. Vous pouvez effectuer des virements en toute sécurité.
              </p>
            </div>
          </div>
        )}

        {/* Messages de succès/erreur */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 md:p-4 mb-4 rounded-lg">
            <p className="text-green-800 text-sm whitespace-pre-line">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 mb-4 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-1 sm:gap-2 mb-4 md:mb-6 border-b overflow-x-auto">
          <button 
            onClick={() => {
              setActiveTab('historique');
              setShowForm(false);
            }}
            className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-sm md:text-base whitespace-nowrap ${
              activeTab === 'historique'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Historique
          </button>
          <button 
            onClick={handleNewVirement}
            className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 font-semibold text-sm md:text-base flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
              isCompteBloque
                ? 'text-gray-400 cursor-not-allowed'
                : activeTab === 'nouveau'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-700 hover:text-blue-600'
            }`}
            disabled={isCompteBloque}
          >
            Nouveau virement {isCompteBloque && <span>🔒</span>}
          </button>
        </div>

        {/* FORMULAIRE DE VIREMENT */}
        {showForm && !isCompteBloque && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Effectuer un virement</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setActiveTab('historique');
                  setFormData({ beneficiaire: '', iban: '', bic: '', email: '', montant: '', motif: '' });
                  setError('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
              <p className="text-blue-800 font-semibold">
                💰 Solde disponible : {formatCurrency(user.solde, devise, symbole)}
              </p>
            </div>

            <div className="space-y-4">
              {beneficiaires.length > 0 && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Bénéficiaire enregistré (optionnel)
                  </label>
                  <select
                    onChange={handleBeneficiaireSelect}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Sélectionner un bénéficiaire --</option>
                    {beneficiaires.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} - {b.bank}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Nom du bénéficiaire <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="beneficiaire"
                  value={formData.beneficiaire}
                  onChange={handleInputChange}
                  placeholder="Ex: Jean Dupont"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    IBAN <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="iban"
                    value={formData.iban}
                    onChange={handleInputChange}
                    placeholder="Ex: FR76 1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    BIC/SWIFT <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="bic"
                    value={formData.bic}
                    onChange={handleInputChange}
                    placeholder="Ex: BNPAFRPPXXX"
                    maxLength="11"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Email du bénéficiaire <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ex: beneficiaire@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">📧 Le bénéficiaire recevra une notification par email</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Montant ({symbole}) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="montant"
                  value={formData.montant}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Motif (optionnel)
                </label>
                <input
                  type="text"
                  name="motif"
                  value={formData.motif}
                  onChange={handleInputChange}
                  placeholder="Ex: Remboursement, Loyer, etc."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitVirement}
                  disabled={loading}
                  className={`flex-1 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Effectuer le virement
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setActiveTab('historique');
                    setFormData({ beneficiaire: '', iban: '', bic: '', email: '', montant: '', motif: '' });
                    setError('');
                  }}
                  disabled={loading}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HISTORIQUE DES VIREMENTS */}
        {!showForm && (
          <>
            {virements.length === 0 && !isCompteBloque && (
              <div className="bg-white rounded-lg border-2 border-gray-200 p-8 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium text-base mb-2">Aucun virement effectué</p>
                <p className="text-gray-500 text-sm mb-4">Vos futurs virements apparaîtront ici</p>
                <button
                  onClick={handleNewVirement}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
                >
                  Effectuer mon premier virement
                </button>
              </div>
            )}

            {virements.length === 0 && isCompteBloque && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                <p className="text-orange-800">Aucun virement enregistré pour le moment.</p>
              </div>
            )}

            {/* Tableau Desktop */}
            {virements.length > 0 && (
              <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bénéficiaire</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {virements.map((v, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDateShort(v.date, devise)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{v.beneficiaire}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-red-600">
                          -{formatCurrency(Math.abs(v.montant), devise, symbole)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                            {v.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => showReceipt(v)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                          >
                            <Eye size={16} />
                            Voir le reçu
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cartes Mobile/Tablette */}
            {virements.length > 0 && (
              <div className="md:hidden space-y-3">
                {virements.map((v, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{v.beneficiaire}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {formatDateShort(v.date, devise)}
                        </p>
                      </div>
                      <span className="text-base sm:text-lg font-bold text-red-600 ml-2">
                        -{formatCurrency(Math.abs(v.montant), devise, symbole)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="px-2 sm:px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        {v.statut}
                      </span>
                      <button
                        onClick={() => showReceipt(v)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      >
                        <Eye size={16} />
                        Voir le reçu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALE DU REÇU */}
      {showReceiptModal && currentReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête de la modale */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">Reçu de virement</h2>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenu du reçu */}
            <div className="p-6">
              {/* En-tête du document */}
              <div className="text-center mb-6 pb-6 border-b-2 border-blue-600">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">REÇU DE VIREMENT</h1>
                <p className="text-sm text-gray-500">Document officiel - Confidentiel</p>
              </div>

              {/* Informations de l'émetteur */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">INFORMATIONS DE L'ÉMETTEUR</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Nom :</span>
                    <span className="text-gray-900 font-semibold">{user.nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Compte :</span>
                    <span className="text-gray-900 font-semibold">{user.numeroCompte}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Agence :</span>
                    <span className="text-gray-900 font-semibold">{user.agence}</span>
                  </div>
                </div>
              </div>

              {/* Informations du bénéficiaire */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">INFORMATIONS DU BÉNÉFICIAIRE</h3>
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Nom :</span>
                    <span className="text-gray-900 font-semibold">{currentReceipt.beneficiaire}</span>
                  </div>
                  <div className="flex justify-between flex-wrap">
                    <span className="text-gray-600 font-medium">IBAN :</span>
                    <span className="text-gray-900 font-semibold break-all text-right ml-2">{currentReceipt.iban}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">BIC :</span>
                    <span className="text-gray-900 font-semibold">{currentReceipt.bic}</span>
                  </div>
                  <div className="flex justify-between flex-wrap">
                    <span className="text-gray-600 font-medium">Email :</span>
                    <span className="text-gray-900 font-semibold break-all text-right ml-2">{currentReceipt.email}</span>
                  </div>
                </div>
              </div>

              {/* Détails du virement */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">DÉTAILS DU VIREMENT</h3>
                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Date :</span>
                    <span className="text-gray-900 font-semibold">{currentReceipt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Montant :</span>
                    <span className="text-green-700 font-bold text-lg">{formatCurrency(currentReceipt.montant, devise, symbole)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Motif :</span>
                    <span className="text-gray-900 font-semibold">{currentReceipt.motif}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Statut :</span>
                    <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                      {currentReceipt.statut}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Référence :</span>
                    <span className="text-gray-900 font-mono font-semibold">VIR-{Date.now()}</span>
                  </div>
                </div>
              </div>

              {/* Pied de page */}
              <div className="border-t pt-4 text-center text-xs text-gray-500">
                <p>Ce document a été généré automatiquement.</p>
                <p className="mt-1">Généré le {new Date().toLocaleString('fr-FR')}</p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
              <button
                onClick={() => downloadReceipt(currentReceipt)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Télécharger le PDF
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Virements;