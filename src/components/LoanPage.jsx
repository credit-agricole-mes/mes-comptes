import React from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const LoanPage = () => {
  const { userCode } = useAuth();
  const user = UserService.getUserByCode(userCode);

  // Données par défaut si l'utilisateur n'est pas trouvé
  const defaultData = {
    contactNumber: "+33 6 02 03 04 05",
    contactName: "Service Client"
  };

  // Utiliser les informations du notaire si disponibles, sinon conseiller, sinon défaut
  const accountData = user ? {
    contactNumber: user.notaire?.telephone || user.conseiller?.telephone || defaultData.contactNumber,
    contactName: user.notaire?.nom || user.conseiller?.nom || defaultData.contactName
  } : defaultData;

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-green-50 border-2 border-red-300 rounded-lg p-6 sm:p-8 text-center shadow-lg">
        <Lock className="text-red-500 mx-auto mb-4" size={48} />
        <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-3 sm:mb-4">Simulation de prêt indisponible</h2>
        <p className="text-red-700 mb-3 sm:mb-4 text-base sm:text-lg">
          Les demandes de prêt ne sont pas disponibles pour un compte bloqué.
        </p>
        <p className="text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Un compte bloqué ne peut pas contracter de nouveaux engagements financiers pour des raisons de sécurité et de conformité réglementaire.
        </p>
        
        <div className="bg-green-200 p-4 sm:p-6 rounded-lg max-w-full sm:max-w-lg mx-auto">
          <p className="text-red-800 font-semibold text-base sm:text-lg mb-3">💡 Pour faire une demande de prêt</p>
          <ol className="text-left text-red-700 space-y-2 sm:space-y-3 mb-4 text-sm sm:text-base">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Contactez votre {user?.notaire ? 'notaire' : 'conseiller'} au <strong className="break-all">{accountData.contactNumber}</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Réglez la situation ayant causé le blocage de votre compte</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Une fois votre compte débloqué, vous pourrez effectuer une simulation de prêt</span>
            </li>
          </ol>
          
          <div className="bg-green-200 p-3 sm:p-4 rounded mt-4">
            <p className="text-red-900 font-semibold text-sm sm:text-base">📋 Types de prêts disponibles (après déblocage)</p>
            <ul className="text-red-800 text-xs sm:text-sm mt-2 space-y-1">
              <li>• Prêt personnel</li>
              <li>• Prêt immobilier</li>
              <li>• Crédit auto</li>
              <li>• Prêt étudiant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPage;