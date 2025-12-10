import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';

/**
 * Composant de sélection de devise
 * À placer dans la page Paramètres
 */
const CurrencySelector = ({ currentCurrency, currentSymbol, onCurrencyChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Liste des devises disponibles
  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'USD', symbol: '$', name: 'Dollar US', flag: '🇺🇸' },
    { code: 'CAD', symbol: '$', name: 'Dollar Canadien', flag: '🇨🇦' },
    { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA', flag: '🇨🇮' },
    { code: 'GBP', symbol: '£', name: 'Livre Sterling', flag: '🇬🇧' },
  ];

  const handleSelect = (currency) => {
    if (onCurrencyChange) {
      onCurrencyChange(currency.code, currency.symbol);
    }
    setIsOpen(false);
  };

  const currentCurrencyData = currencies.find(c => c.code === currentCurrency);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Globe className="text-blue-600" size={24} />
        Devise d'affichage
      </h3>

      <p className="text-gray-600 text-sm mb-4">
        Choisissez la devise dans laquelle vous souhaitez voir vos montants affichés.
      </p>

      {/* Sélecteur actuel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 rounded-lg p-4 flex items-center justify-between transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentCurrencyData?.flag}</span>
          <div className="text-left">
            <div className="font-semibold text-gray-800">
              {currentCurrencyData?.name}
            </div>
            <div className="text-sm text-gray-500">
              {currentCurrencyData?.code} ({currentCurrencyData?.symbol})
            </div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Liste déroulante */}
      {isOpen && (
        <div className="mt-2 border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleSelect(currency)}
              className={`w-full p-4 flex items-center justify-between hover:bg-blue-50 transition ${
                currency.code === currentCurrency ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currency.flag}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">
                    {currency.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currency.code} ({currency.symbol})
                  </div>
                </div>
              </div>
              {currency.code === currentCurrency && (
                <Check className="text-blue-600" size={20} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Info importante */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-800 text-sm">
          <strong>ℹ️ Information :</strong> Ce paramètre change uniquement l'affichage des montants. Votre solde réel reste inchangé.
        </p>
      </div>
    </div>
  );
};

export default CurrencySelector;