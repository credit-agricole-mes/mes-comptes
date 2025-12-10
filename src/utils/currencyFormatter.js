// ==================== UTILITAIRE DE FORMATAGE DEVISE ====================

/**
 * Formate un montant selon la devise de l'utilisateur
 * @param {number} montant - Le montant à formater
 * @param {string} devise - Code devise (EUR, USD, XOF, CAD, GBP)
 * @param {string} symbole - Symbole de la devise (€, $, FCFA, £)
 * @returns {string} - Montant formaté
 */
export const formatCurrency = (montant, devise = "EUR", symbole = "€") => {
  // Configuration selon la devise
  const config = {
    EUR: { locale: 'fr-FR', decimals: 2, symbolAfter: true },
    USD: { locale: 'en-US', decimals: 2, symbolAfter: false },
    CAD: { locale: 'en-CA', decimals: 2, symbolAfter: false },
    XOF: { locale: 'fr-FR', decimals: 0, symbolAfter: true }, // Pas de centimes pour FCFA
    GBP: { locale: 'en-GB', decimals: 2, symbolAfter: false },
  };

  const deviseConfig = config[devise] || config.EUR;

  // Formater le nombre selon la locale
  const formattedNumber = new Intl.NumberFormat(deviseConfig.locale, {
    minimumFractionDigits: deviseConfig.decimals,
    maximumFractionDigits: deviseConfig.decimals
  }).format(montant);

  // Position du symbole
  if (deviseConfig.symbolAfter) {
    return `${formattedNumber} ${symbole}`;
  } else {
    return `${symbole}${formattedNumber}`;
  }
};

/**
 * Formate un montant avec signe + ou -
 * Utile pour les transactions (débit/crédit)
 */
export const formatCurrencyWithSign = (montant, devise, symbole, isCredit = true) => {
  const formatted = formatCurrency(Math.abs(montant), devise, symbole);
  return isCredit ? `+${formatted}` : `-${formatted}`;
};

/**
 * Parse un montant formaté en nombre
 * Utile pour les calculs
 */
export const parseCurrency = (montantFormate) => {
  // Retirer tous les caractères non numériques sauf point et virgule
  const cleaned = montantFormate.replace(/[^\d,.-]/g, '');
  // Remplacer virgule par point pour JS
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
};

/**
 * Obtenir le séparateur décimal selon la devise
 */
export const getDecimalSeparator = (devise) => {
  return ['USD', 'CAD', 'GBP'].includes(devise) ? '.' : ',';
};

/**
 * Obtenir le séparateur de milliers selon la devise
 */
export const getThousandsSeparator = (devise) => {
  return ['USD', 'CAD', 'GBP'].includes(devise) ? ',' : ' ';
};