import React from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDateShort } from '../utils/dateFormatter';

const TransactionsDownload = () => {
  const { user } = useAuth();

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
    solde: formatCurrency(user.solde || 0, user.devise || 'EUR', user.symboleDevise || '€')
  };

  // ✅ Date actuelle formatée selon la devise de l'utilisateur
  const dateReleve = formatDateShort(new Date(), user.devise);
  const transactions = user.transactions || [];

  // ✅ Fonction pour filtrer les transactions par mois
  const filtrerTransactionsParMois = (mois, annee) => {
    const moisIndex = {
      'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
      'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
      'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
    };
    
    const moisStr = moisIndex[mois.toLowerCase()];
    
    return transactions.filter(t => {
      const [jour, moisTransaction, anneeTransaction] = t.date.split('/');
      return moisTransaction === moisStr && anneeTransaction === annee;
    });
  };

  // ✅ Calculer dynamiquement le nombre de transactions par mois
  const compterTransactionsParMois = (mois, annee) => {
    return filtrerTransactionsParMois(mois, annee).length;
  };

  const genererReleveBancaire = (mois, annee, dateGenerationReleve) => {
    try {
      const transactionsDuMois = filtrerTransactionsParMois(mois, annee);
      
      if (transactionsDuMois.length === 0) {
        alert(`Aucune transaction trouvée pour ${mois} ${annee}`);
        return;
      }

      const doc = new jsPDF();
      // ✅ Utiliser la date de génération du relevé
      const dateFooter = dateGenerationReleve 
        ? formatDateShort(dateGenerationReleve, user.devise)
        : dateReleve;
      
      // En-tête bleu
      doc.setFillColor(0, 51, 102);
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CRÉDIT AGRICOLE', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Relevé de compte bancaire', 105, 23, { align: 'center' });
      
      // Informations du compte
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
      doc.text(mois.charAt(0).toUpperCase() + mois.slice(1) + ' ' + annee, 60, y);
      
      y += 15;
      doc.line(20, y, 190, y);
      
      // En-têtes des colonnes
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Date', 20, y);
      doc.text('Libellé', 50, y);
      doc.text('Débit', 130, y);
      doc.text('Crédit', 160, y);
      
      y += 5;
      doc.line(20, y, 190, y);
      
      // Transactions avec DATES et MONTANTS FORMATÉS
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      transactionsDuMois.forEach(t => {
        y += 7;
        
        if (y > 270) {
          doc.addPage();
          y = 20;
          doc.setFont('helvetica', 'bold');
          doc.text('Date', 20, y);
          doc.text('Libellé', 50, y);
          doc.text('Débit', 130, y);
          doc.text('Crédit', 160, y);
          y += 5;
          doc.line(20, y, 190, y);
          y += 7;
          doc.setFont('helvetica', 'normal');
        }
        
        // ✅ DATE FORMATÉE SELON LA DEVISE
        doc.text(formatDateShort(t.date, user.devise), 20, y);
        
        const maxLibelleWidth = 75;
        const libelleLines = doc.splitTextToSize(t.libelle, maxLibelleWidth);
        doc.text(libelleLines, 50, y);
        
        // ✅ MONTANTS FORMATÉS SELON LA DEVISE
        if(t.debit) {
          const montantDebit = formatCurrency(parseFloat(t.debit), user.devise, user.symboleDevise);
          doc.text(montantDebit, 130, y);
        }
        if(t.credit) {
          const montantCredit = formatCurrency(parseFloat(t.credit), user.devise, user.symboleDevise);
          doc.text(montantCredit, 160, y);
        }
        
        if (libelleLines.length > 1) {
          y += (libelleLines.length - 1) * 5;
        }
      });
      
      y += 10;
      doc.line(20, y, 190, y);
      
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Solde actuel :', 20, y);
      doc.text(compteInfo.solde, 160, y);
      
      // ✅ Footer avec date de génération du relevé
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      const pageCount = doc.internal.getNumberOfPages();
      doc.setPage(pageCount);
      doc.text('Document généré le ' + dateFooter, 105, 280, { align: 'center' });
      
      doc.save(`releve_bancaire_${mois}_${annee}.pdf`);
      
      console.log(`✅ Relevé généré pour ${mois} ${annee} (${transactionsDuMois.length} transactions)`);
    } catch (error) {
      console.error('❌ Erreur génération relevé:', error);
      alert('Erreur lors de la génération du relevé');
    }
  };

  // ✅ UTILISATION DES RELEVÉS DÉFINIS MANUELLEMENT dans user.relevesMensuels
  const relevesMensuels = user.relevesMensuels || [];
  
  const documents = relevesMensuels.map((releve, index) => {
    const nbTransactions = compterTransactionsParMois(releve.mois, releve.annee);
    // ✅ Utiliser la date de génération du relevé si définie, sinon date du jour
    const dateGen = releve.dateGeneration 
      ? formatDateShort(releve.dateGeneration, user.devise)
      : dateReleve;
    
    return {
      icon: '📄',
      titre: `Relevé bancaire - ${releve.mois.charAt(0).toUpperCase() + releve.mois.slice(1)} ${releve.annee}`,
      mois: releve.mois,
      annee: releve.annee,
      description: `${nbTransactions} transaction${nbTransactions > 1 ? 's' : ''} - Généré le ${dateGen}`,
      badge: 'PDF',
      action: () => genererReleveBancaire(releve.mois, releve.annee, releve.dateGeneration),
      badgeColor: 'bg-blue-100 text-blue-800'
    };
  });

  const totalTransactions = transactions.length;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Télécharger mes transactions</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Relevés bancaires de {compteInfo.titulaire}
        </p>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          {totalTransactions} transaction{totalTransactions > 1 ? 's' : ''} enregistrée{totalTransactions > 1 ? 's' : ''} au total
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Aucun relevé disponible pour le moment</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TransactionsDownload;