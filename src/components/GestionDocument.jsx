import React from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';

// Fonction pour dessiner un cachet notarial professionnel
const drawNotaryStamp = (doc, centerX, centerY, notaryInfo) => {
  const radius = 15;
  
  doc.setDrawColor(0, 51, 153);
  doc.setLineWidth(0.8);
  doc.circle(centerX, centerY, radius);
  doc.setLineWidth(0.5);
  doc.circle(centerX, centerY, radius - 1);
  
  doc.setLineWidth(0.3);
  doc.circle(centerX, centerY, radius - 4);
  
  doc.setTextColor(0, 51, 153);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text(notaryInfo.nom, centerX, centerY - 8, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('⚖', centerX, centerY - 1, { align: 'center' });
  
  doc.setLineWidth(0.3);
  doc.line(centerX - 10, centerY + 3, centerX + 10, centerY + 3);
  
  doc.setFontSize(7);
  doc.text(notaryInfo.titre, centerX, centerY + 8, { align: 'center' });
  
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(notaryInfo.ville, centerX, centerY + 12, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text('★', centerX - 11, centerY + 1, { align: 'center' });
  doc.text('★', centerX + 11, centerY + 1, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
};

const GestionDocument = () => {
  const { user } = useAuth();

  // ✅ Vérifier si le compte est bloqué
  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const compteInfo = {
    titulaire: user.nom,
    numeroCompte: user.numeroCompte || 'FR76 1234 5678 9012 3456 7890 123',
    dateOuverture: user.dateOuverture || '15/03/2020'
  };

  const notaireInfo = {
    nom: user.notaire?.nom || 'MAÎTRE JEAN DUPONT',
    prenom: user.notaire?.prenom || 'Jean',
    titre: user.notaire?.titre || 'NOTAIRE',
    adresse: user.notaire?.adresse || '123 Avenue des Champs-Élysées',
    ville: user.notaire?.ville || '75008 PARIS',
    telephone: user.notaire?.telephone || '01 23 45 67 89',
    email: user.notaire?.email || 'contact@notaire-dupont.fr'
  };

  const dateAttestation = user.dateAttestation || new Date().toLocaleDateString('fr-FR');
  const dateBlocage = user.dateBlocage || new Date().toLocaleDateString('fr-FR');

  const genererAttestation = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('ATTESTATION DE COMPTE BANCAIRE', 105, 30, { align: 'center' });
      
      let y = 60;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      const texte = [
        'La BANQUE Crédit Agricole atteste que :',
        '',
        `Monsieur/Madame ${compteInfo.titulaire},`,
        '',
        `est titulaire du compte bancaire n° ${compteInfo.numeroCompte},`,
        '',
        `ouvert le ${compteInfo.dateOuverture} auprès de notre établissement.`,
        '',
        'Ce compte est actuellement actif.',
        '',
        'La présente attestation est délivrée pour servir et valoir ce que de droit.',
        '',
        '',
        `Fait à Paris, le ${dateAttestation}`
      ];
      
      texte.forEach(ligne => {
        doc.text(ligne, 20, y);
        y += 7;
      });
      
      y += 20;
      doc.setFont('helvetica', 'bold');
      doc.text('Le Directeur', 130, y);
      doc.text('BANQUE Crédit Agricole', 130, y + 7);
      
      doc.save('attestation_compte.pdf');
      console.log('✅ Attestation générée');
    } catch (error) {
      console.error('❌ Erreur attestation:', error);
      alert('Erreur lors de la génération de l\'attestation');
    }
  };

  const genererDocumentNotaire = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('ACTE DE BLOCAGE DE COMPTE', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Document officiel établi par ${notaireInfo.nom}`, 105, 30, { align: 'center' });
      doc.text(`${notaireInfo.titre} à ${notaireInfo.ville.split(' ')[1] || 'Paris'}`, 105, 37, { align: 'center' });
      
      doc.line(20, 42, 190, 42);
      
      let y = 55;
      doc.setFontSize(11);
      
      const texteNotaire = [
        'Étude notariale',
        `${notaireInfo.adresse}, ${notaireInfo.ville}`,
        `Tél : ${notaireInfo.telephone}`,
        `Email : ${notaireInfo.email}`,
        '',
        'OBJET : Notification officielle de blocage de compte bancaire',
        '',
        `Par la présente, ${notaireInfo.nom}, ${notaireInfo.titre} à ${notaireInfo.ville.split(' ')[1] || 'Paris'}, certifie que :`,
        '',
        `Le compte bancaire n° ${compteInfo.numeroCompte},`,
        `au nom de ${compteInfo.titulaire},`,
        'détenu auprès de la BANQUE Crédit Agricole',
        '',
        'fait l\'objet d\'une mesure de blocage conformément aux',
        'dispositions légales et réglementaires en vigueur.',
        '',
        'MOTIFS DU BLOCAGE :',
        '• Vérification de conformité réglementaire',
        '• En attente de justificatifs complémentaires',
        '• Mesure conservatoire',
        '',
        `Date d'effet : ${dateBlocage}`,
        '',
        'CONSÉQUENCES :',
        'Cette mesure suspend temporairement :',
        '- Les opérations de virement',
        '- Les retraits d\'espèces',
        '- L\'utilisation des moyens de paiement',
        '- Les prélèvements automatiques',
        '',
        'DÉMARCHES À SUIVRE :',
        'Pour régulariser votre situation, veuillez contacter :',
        `Service Client : ${notaireInfo.telephone}`,
        `Email : ${notaireInfo.email}`,
        '',
        'Le présent acte est établi en un seul exemplaire.',
        '',
        '',
        `Fait à ${notaireInfo.ville.split(' ')[1] || 'Paris'}, le ${dateBlocage}`
      ];
      
      texteNotaire.forEach(ligne => {
        if (ligne.startsWith('OBJET') || ligne.startsWith('MOTIFS') || ligne.startsWith('CONSÉQUENCES') || ligne.startsWith('DÉMARCHES')) {
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setFont('helvetica', 'normal');
        }
        doc.text(ligne, 20, y);
        y += 6;
        
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.text(notaireInfo.nom, 20, y);
      doc.text('Signature et cachet du notaire', 130, y);
      
      doc.setFontSize(18);
      doc.setFont('times', 'italic');
      doc.setTextColor(50, 50, 50);
      const initiales = notaireInfo.prenom.charAt(0) + '. ' + notaireInfo.nom.split(' ').pop();
      doc.text(initiales, 145, y + 20, { align: 'center' });
      
      const centerX = 170;
      const centerY = y + 20;
      drawNotaryStamp(doc, centerX, centerY, notaireInfo);
      
      doc.save('acte_blocage_compte_notarie.pdf');
      console.log('✅ Acte notarié généré');
    } catch (error) {
      console.error('❌ Erreur document notaire:', error);
      alert('Erreur lors de la génération du document notarié');
    }
  };

  // ✅ Liste des documents adaptée selon le statut
  const documents = [
    {
      icon: '✓',
      titre: 'Attestation de compte',
      description: `Émise le ${dateAttestation}`,
      badge: 'PDF',
      action: genererAttestation,
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  // ✅ Ajouter l'acte de blocage SEULEMENT si le compte est bloqué
  if (isCompteBloque) {
    documents.unshift({
      icon: '📜',
      titre: 'Acte de blocage de compte',
      description: `Document notarié par ${notaireInfo.nom} - ${dateBlocage}`,
      badge: 'Officiel',
      action: genererDocumentNotaire,
      badgeColor: 'bg-red-100 text-red-800'
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Gestion des documents</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Documents administratifs de {compteInfo.titulaire}
        </p>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Notaire assigné : {notaireInfo.nom}
        </p>
      </div>

      {/* ✅ Message adapté selon le statut */}
      {isCompteBloque ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <p className="text-red-800 font-semibold">⚠️ Compte bloqué</p>
          <p className="text-red-700 text-sm mt-1">
            Votre compte fait l'objet d'une mesure de blocage. Les documents officiels sont disponibles ci-dessous.
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
          <p className="text-green-800 font-semibold">✅ Compte actif</p>
          <p className="text-green-700 text-sm mt-1">
            Vos documents administratifs sont disponibles au téléchargement.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {documents.map((doc, index) => (
          <div key={index} className="bg-white rounded-lg shadow hover:shadow-xl transition p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <span className="text-3xl sm:text-5xl">{doc.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-base sm:text-lg text-gray-900">{doc.titre}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">{doc.description}</p>
                  <span className={`inline-block mt-2 px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${doc.badgeColor}`}>
                    {doc.badge}
                  </span>
                </div>
              </div>
              <button 
                onClick={doc.action}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                📥 Télécharger
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GestionDocument;