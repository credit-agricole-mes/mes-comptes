import React from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';

// Fonction pour dessiner le sceau bancaire officiel
const drawBankStamp = (doc, centerX, centerY) => {
  const radius = 15;
  
  doc.setDrawColor(0, 102, 51);
  doc.setLineWidth(0.8);
  doc.circle(centerX, centerY, radius);
  doc.setLineWidth(0.5);
  doc.circle(centerX, centerY, radius - 1);
  
  doc.setLineWidth(0.3);
  doc.circle(centerX, centerY, radius - 4);
  
  doc.setTextColor(0, 102, 51);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('CRÉDIT AGRICOLE', centerX, centerY - 8, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('€', centerX, centerY, { align: 'center' });
  
  doc.setLineWidth(0.3);
  doc.line(centerX - 10, centerY + 3, centerX + 10, centerY + 3);
  
  doc.setFontSize(6);
  doc.text('BANQUE AGRÉÉE', centerX, centerY + 8, { align: 'center' });
  
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('DIRECTION PARIS', centerX, centerY + 12, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
};

const GestionDocument = () => {
  const { user } = useAuth();

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

  const banqueInfo = {
    nom: 'CRÉDIT AGRICOLE',
    agence: 'Agence Paris Centre',
    adresse: '91-93 Boulevard Pasteur',
    ville: '75015 PARIS',
    telephone: '01 43 23 46 00',
    email: 'contact@ca-paris.fr',
    directeur: 'M. Pierre MARTIN',
    siret: '784 608 416 00241'
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
        `La BANQUE ${banqueInfo.nom} atteste que :`,
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
      doc.text('Le Directeur d\'Agence', 130, y);
      doc.text(banqueInfo.directeur, 130, y + 7);
      doc.text(banqueInfo.nom, 130, y + 14);
      
      doc.save('attestation_compte.pdf');
      console.log('✅ Attestation générée');
    } catch (error) {
      console.error('❌ Erreur attestation:', error);
      alert('Erreur lors de la génération de l\'attestation');
    }
  };

  const genererActeBlocage = () => {
    try {
      const doc = new jsPDF();
      
      // En-tête bancaire
      doc.setFillColor(0, 102, 51);
      doc.rect(0, 0, 210, 25, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(banqueInfo.nom, 105, 12, { align: 'center' });
      doc.setFontSize(10);
      doc.text(banqueInfo.agence, 105, 19, { align: 'center' });
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('NOTIFICATION DE BLOCAGE DE COMPTE', 105, 40, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Document officiel', 105, 47, { align: 'center' });
      
      doc.line(20, 52, 190, 52);
      
      let y = 65;
      doc.setFontSize(11);
      
      const texte = [
        `${banqueInfo.adresse}`,
        `${banqueInfo.ville}`,
        `Tél : ${banqueInfo.telephone}`,
        `SIRET : ${banqueInfo.siret}`,
        '',
        '',
        `Destinataire : ${compteInfo.titulaire}`,
        `Compte n° : ${compteInfo.numeroCompte}`,
        '',
        '',
        'OBJET : Notification de blocage de compte bancaire',
        '',
        '',
        'Madame, Monsieur,',
        '',
        `Par la présente, la BANQUE ${banqueInfo.nom} vous informe que votre`,
        `compte bancaire n° ${compteInfo.numeroCompte}`,
        'fait l\'objet d\'une mesure de blocage conformément aux dispositions',
        'légales et réglementaires en vigueur.',
        '',
        '',
        'MOTIFS DU BLOCAGE :',
        '',
        '• Vérification de conformité réglementaire',
        '• Documents justificatifs manquants ou incomplets',
        '• Mesure conservatoire dans le cadre de la lutte anti-blanchiment',
        '• Protection du compte dans l\'attente de régularisation',
        '',
        '',
        `DATE D'EFFET : ${dateBlocage}`,
        '',
        '',
        'CONSÉQUENCES DE CETTE MESURE :',
        '',
        'Le blocage entraîne la suspension immédiate des opérations suivantes :',
        '',
        '✗ Virements sortants (nationaux et internationaux)',
        '✗ Retraits d\'espèces aux distributeurs automatiques',
        '✗ Paiements par carte bancaire',
        '✗ Prélèvements automatiques',
        '✗ Émission de chèques',
        '',
        'Seuls les versements entrants restent autorisés.',
        '',
        '',
        'DÉMARCHES POUR RÉGULARISATION :',
        '',
        'Pour lever cette mesure de blocage, nous vous invitons à :',
        '',
        '1. Contacter notre service clientèle dans les plus brefs délais',
        '2. Fournir les documents justificatifs demandés',
        '3. Régulariser votre situation administrative',
        '',
        '',
        'CONTACTS :',
        '',
        `Service Clientèle : ${banqueInfo.telephone}`,
        `Email : ${banqueInfo.email}`,
        `Horaires : Du lundi au vendredi, 9h-18h`,
        '',
        '',
        'Le présent document fait foi et a valeur d\'acte officiel.',
        '',
        '',
        `Fait à Paris, le ${dateBlocage}`,
      ];
      
      texte.forEach(ligne => {
        if (ligne.startsWith('OBJET') || ligne.startsWith('MOTIFS') || 
            ligne.startsWith('DATE D\'EFFET') || ligne.startsWith('CONSÉQUENCES') || 
            ligne.startsWith('DÉMARCHES') || ligne.startsWith('CONTACTS')) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
        } else if (ligne.startsWith('✗')) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
        }
        
        doc.text(ligne, 20, y);
        y += 6;
        
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      
      // Signature et cachet
      y += 15;
      if (y > 250) {
        doc.addPage();
        y = 30;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Pour la Direction', 20, y);
      doc.text('Signature et cachet officiel', 140, y);
      
      // Signature manuscrite simulée
      doc.setFontSize(18);
      doc.setFont('times', 'italic');
      doc.setTextColor(50, 50, 50);
      doc.text('P. Martin', 35, y + 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(banqueInfo.directeur, 20, y + 28);
      doc.text('Directeur d\'Agence', 20, y + 34);
      
      // Cachet bancaire
      const centerX = 170;
      const centerY = y + 20;
      drawBankStamp(doc, centerX, centerY);
      
      // Pied de page
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`${banqueInfo.nom} - ${banqueInfo.agence} - SIRET ${banqueInfo.siret}`, 105, 287, { align: 'center' });
      
      doc.save('acte_blocage_compte_bancaire.pdf');
      console.log('✅ Acte de blocage généré');
    } catch (error) {
      console.error('❌ Erreur document blocage:', error);
      alert('Erreur lors de la génération de l\'acte de blocage');
    }
  };

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

  if (isCompteBloque) {
    documents.unshift({
      icon: '🏦',
      titre: 'Acte de blocage de compte',
      description: `Notification officielle émise par ${banqueInfo.nom} - ${dateBlocage}`,
      badge: 'Officiel',
      action: genererActeBlocage,
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
          {banqueInfo.nom} - {banqueInfo.agence}
        </p>
      </div>

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