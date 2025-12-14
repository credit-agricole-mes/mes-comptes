import React, { useState } from 'react';
import { Lock, Calculator, TrendingUp, Home, Car, GraduationCap, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const LoanPage = () => {
  const { userCode } = useAuth();
  const user = UserService.getUserByCode(userCode);
  
  const [loanType, setLoanType] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);

  // ✅ Vérifier si le compte est VRAIMENT bloqué
  const isCompteBloque = user?.dateBlocage && user.dateBlocage !== "" && user.dateBlocage !== null;

  const defaultData = {
    contactNumber: "+33 6 02 03 04 05",
    contactName: "Service Client"
  };

  const accountData = user ? {
    contactNumber: user.notaire?.telephone || user.conseiller?.telephone || defaultData.contactNumber,
    contactName: user.notaire?.nom || user.conseiller?.nom || defaultData.contactName
  } : defaultData;

  const devise = user?.devise || 'EUR';
  const symbole = user?.symboleDevise || '€';

  // Calculer la simulation de prêt
  const calculateLoan = () => {
    if (!loanType || !amount || !duration) {
      alert('⚠️ Veuillez remplir tous les champs');
      return;
    }

    const principal = parseFloat(amount);
    const months = parseInt(duration);
    
    // Taux d'intérêt selon le type de prêt (exemple)
    const rates = {
      personnel: 0.05,
      immobilier: 0.02,
      auto: 0.04,
      etudiant: 0.03
    };
    
    const rate = rates[loanType] || 0.05;
    const monthlyRate = rate / 12;
    
    // Formule de calcul de mensualité
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = monthlyPayment * months;
    const totalInterest = totalAmount - principal;

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      rate: (rate * 100).toFixed(2)
    });
  };

  // ✅ SI LE COMPTE EST BLOQUÉ → Afficher le message de blocage
  if (isCompteBloque) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 sm:p-8 text-center shadow-lg">
          <Lock className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-3 sm:mb-4">Simulation de prêt indisponible</h2>
          <p className="text-red-700 mb-3 sm:mb-4 text-base sm:text-lg">
            Les demandes de prêt ne sont pas disponibles pour un compte bloqué.
          </p>
          <p className="text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Un compte bloqué ne peut pas contracter de nouveaux engagements financiers pour des raisons de sécurité et de conformité réglementaire.
          </p>
          
          <div className="bg-red-100 p-4 sm:p-6 rounded-lg max-w-full sm:max-w-lg mx-auto">
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
            
            <div className="bg-red-200 p-3 sm:p-4 rounded mt-4">
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
  }

  // ✅ SI LE COMPTE N'EST PAS BLOQUÉ → Afficher le simulateur
  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <Calculator size={24} className="sm:w-7 sm:h-7" />
          Simulateur de prêt
        </h2>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
          <p className="text-blue-800 font-semibold text-base sm:text-lg">
            💰 Estimez vos mensualités
          </p>
          <p className="text-blue-700 text-xs sm:text-sm mt-2">
            Utilisez notre simulateur pour calculer le coût de votre futur prêt.
          </p>
        </div>

        {/* Formulaire de simulation */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Type de prêt
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLoanType('personnel')}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                  loanType === 'personnel' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <User size={24} />
                <span className="font-semibold text-sm">Personnel</span>
              </button>
              <button
                onClick={() => setLoanType('immobilier')}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                  loanType === 'immobilier' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <Home size={24} />
                <span className="font-semibold text-sm">Immobilier</span>
              </button>
              <button
                onClick={() => setLoanType('auto')}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                  loanType === 'auto' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <Car size={24} />
                <span className="font-semibold text-sm">Auto</span>
              </button>
              <button
                onClick={() => setLoanType('etudiant')}
                className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                  loanType === 'etudiant' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <GraduationCap size={24} />
                <span className="font-semibold text-sm">Étudiant</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Montant du prêt ({symbole})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 10000"
              min="0"
              step="100"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Durée (en mois)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ex: 36"
              min="1"
              step="1"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={calculateLoan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Calculer
          </button>
        </div>

        {/* Résultats */}
        {result && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <TrendingUp size={24} />
              Résultat de la simulation
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded">
                <span className="font-semibold text-gray-700">Mensualité :</span>
                <span className="text-xl font-bold text-green-700">{result.monthlyPayment} {symbole}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white rounded">
                <span className="font-semibold text-gray-700">Taux d'intérêt :</span>
                <span className="text-lg font-bold text-blue-700">{result.rate}%</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white rounded">
                <span className="font-semibold text-gray-700">Coût total :</span>
                <span className="text-lg font-bold text-gray-800">{result.totalAmount} {symbole}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white rounded">
                <span className="font-semibold text-gray-700">Intérêts totaux :</span>
                <span className="text-lg font-bold text-orange-700">{result.totalInterest} {symbole}</span>
              </div>
            </div>

            <div className="mt-4 bg-blue-100 p-3 rounded">
              <p className="text-blue-900 text-sm">
                <strong>ℹ️ Note :</strong> Cette simulation est donnée à titre indicatif. Le taux réel peut varier selon votre profil.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanPage;