import React from 'react';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const RibPage = () => {
  const { userCode } = useAuth();
  const user = UserService.getUserByCode(userCode);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const compteInfo = {
    titulaire: user.nom,
    iban: user.iban || 'FR76 1234 5678 9012 3456 7890 123',
    bic: user.bic || 'BNPAFRPPXXX',
    agence: user.agence || 'Agence Paris Centre - 123 Avenue des Champs-Élysées, 75008 Paris'
  };

  const genererRIB = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RELEVÉ D\'IDENTITÉ BANCAIRE', 105, 30, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.rect(20, 50, 170, 100);
    
    let y = 70;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TITULAIRE', 30, y);
    doc.setFont('helvetica', 'normal');
    doc.text(compteInfo.titulaire, 30, y + 7);
    
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('IBAN', 30, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(compteInfo.iban, 30, y + 7);
    
    y += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BIC', 30, y);
    doc.setFont('helvetica', 'normal');
    doc.text(compteInfo.bic, 30, y + 7);
    
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('AGENCE', 30, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(compteInfo.agence, 30, y + 7);
    
    doc.save('RIB_' + compteInfo.titulaire.replace(' ', '_') + '.pdf');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Mon RIB</h2>
        <p className="text-gray-600 mt-2">Relevé d'Identité Bancaire</p>
      </div>

      {/* Affichage du RIB */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="border-2 border-gray-300 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-6 text-gray-800">RELEVÉ D'IDENTITÉ BANCAIRE</h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">TITULAIRE</p>
              <p className="text-lg font-bold text-gray-900">{compteInfo.titulaire}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">IBAN</p>
              <p className="text-lg font-mono font-bold text-gray-900">{compteInfo.iban}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">BIC</p>
              <p className="text-lg font-mono font-bold text-gray-900">{compteInfo.bic}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">AGENCE</p>
              <p className="text-base text-gray-900">{compteInfo.agence}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de téléchargement */}
      <div className="flex justify-center">
        <button 
          onClick={genererRIB}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center gap-3 shadow-lg"
        >
           Télécharger mon RIB
        </button>
      </div>
   
    </div>
  );
};

export default RibPage;