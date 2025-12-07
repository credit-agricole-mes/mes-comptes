import React from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const TransactionsDownload = () => {
  const { userCode } = useAuth();
  const user = UserService.getUserByCode(userCode);

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
    solde: user.solde ? `${user.solde.toLocaleString('fr-FR')} €` : '0.00 €'
  };

  const transactions = [
    { date: '01/12/2024', libelle: 'Salaire', debit: '', credit: '2500.00' },
    { date: '03/12/2024', libelle: 'Loyer', debit: '800.00', credit: '' },
    { date: '05/12/2024', libelle: 'Courses Carrefour', debit: '150.00', credit: '' },
    { date: '10/12/2024', libelle: 'Virement reçu', debit: '', credit: '300.00' },
    { date: '15/12/2024', libelle: 'Restaurant', debit: '45.50', credit: '' }
  ];

  const genererReleveBancaire = (mois) => {
    const doc = new jsPDF();
    
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('BANQUE XYZ', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Relevé de compte bancaire', 105, 23, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    let y = 45;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Titulaire :', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(compteInfo.titulaire, 60, y);
    
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('N° de compte :', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(compteInfo.numeroCompte, 60, y);
    
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Période :', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(mois.charAt(0).toUpperCase() + mois.slice(1) + ' 2024', 60, y);
    
    y += 15;
    doc.line(20, y, 190, y);
    
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 20, y);
    doc.text('Libellé', 50, y);
    doc.text('Débit', 130, y);
    doc.text('Crédit', 160, y);
    
    y += 5;
    doc.line(20, y, 190, y);
    
    doc.setFont('helvetica', 'normal');
    transactions.forEach(t => {
      y += 7;
      doc.text(t.date, 20, y);
      doc.text(t.libelle, 50, y);
      if(t.debit) doc.text(t.debit + ' €', 130, y);
      if(t.credit) doc.text(t.credit + ' €', 160, y);
    });
    
    y += 10;
    doc.line(20, y, 190, y);
    
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Solde au 30/11/2024 :', 20, y);
    doc.text(compteInfo.solde, 160, y);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Document généré le ' + new Date().toLocaleDateString('fr-FR'), 105, 280, { align: 'center' });
    
    doc.save(`releve_bancaire_${mois}_2024.pdf`);
  };

  const documents = [
    {
      icon: '📄',
      titre: 'Relevé bancaire - Décembre 2024',
      description: 'Toutes les transactions du mois de décembre',
      badge: 'PDF',
      action: () => genererReleveBancaire('décembre'),
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      icon: '📄',
      titre: 'Relevé bancaire - Novembre 2024',
      description: 'Toutes les transactions du mois de novembre',
      badge: 'PDF',
      action: () => genererReleveBancaire('novembre'),
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      icon: '📄',
      titre: 'Relevé bancaire - Octobre 2024',
      description: 'Toutes les transactions du mois d\'octobre',
      badge: 'PDF',
      action: () => genererReleveBancaire('octobre'),
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Télécharger mes transactions</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Relevés bancaires de {compteInfo.titulaire}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {documents.map((doc, index) => (
          <div key={index} className="bg-white rounded-lg shadow hover:shadow-xl transition p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <span className="text-3xl sm:text-5xl ">{doc.icon}</span>
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
                 Télécharger
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsDownload;