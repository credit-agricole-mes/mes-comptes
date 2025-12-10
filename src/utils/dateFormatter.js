// ==================== UTILITAIRE DE FORMATAGE DES DATES ====================

/**
 * Convertir une date de DIFFÉRENTS formats vers le format devise
 * Supporte: DD/MM/YYYY, YYYY-MM-DD, Date objects
 */
const normalizeDate = (dateInput) => {
  if (!dateInput) return null;

  let day, month, year;

  // Si c'est un objet Date
  if (dateInput instanceof Date) {
    day = String(dateInput.getDate()).padStart(2, '0');
    month = String(dateInput.getMonth() + 1).padStart(2, '0');
    year = dateInput.getFullYear();
    return { day, month, year };
  }

  const dateString = String(dateInput);

  // Format YYYY-MM-DD (ex: 2024-11-20)
  if (dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
      return { day, month, year };
    }
  }

  // Format DD/MM/YYYY (ex: 20/11/2024)
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      day = parts[0];
      month = parts[1];
      year = parts[2];
      return { day, month, year };
    }
  }

  return null;
};

/**
 * Formate une date au format court selon la devise
 * @param {string|Date} dateInput - Date à formater (DD/MM/YYYY, YYYY-MM-DD, ou Date)
 * @param {string} devise - Code devise (EUR, USD, CAD, XOF, GBP)
 * @returns {string} - Date formatée
 */
export const formatDateShort = (dateInput, devise = "EUR") => {
  const normalized = normalizeDate(dateInput);
  if (!normalized) return dateInput;

  const { day, month, year } = normalized;

  // Format USD/CAD = MM/DD/YYYY
  if (devise === "USD" || devise === "CAD") {
    return `${month}/${day}/${year}`;
  }
  
  // Format EUR/XOF/GBP = DD/MM/YYYY
  return `${day}/${month}/${year}`;
};

/**
 * Formate une date au format long selon la devise
 * @param {string|Date} dateInput - Date à formater
 * @param {string} devise - Code devise
 * @returns {string} - Date formatée avec nom du mois
 */
export const formatDateLong = (dateInput, devise = "EUR") => {
  const normalized = normalizeDate(dateInput);
  if (!normalized) return dateInput;

  const { day, month, year } = normalized;

  // Créer un objet Date pour utiliser Intl.DateTimeFormat
  const date = new Date(year, parseInt(month) - 1, day);

  // Déterminer la locale selon la devise
  const localeMap = {
    EUR: 'fr-FR',
    USD: 'en-US',
    CAD: 'en-CA',
    XOF: 'fr-FR',
    GBP: 'en-GB'
  };

  const locale = localeMap[devise] || 'fr-FR';

  // Formater avec le nom du mois
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

/**
 * Formate une date au format medium (ex: 10 déc. 2024)
 * @param {string|Date} dateInput - Date à formater
 * @param {string} devise - Code devise
 * @returns {string} - Date formatée
 */
export const formatDateMedium = (dateInput, devise = "EUR") => {
  const normalized = normalizeDate(dateInput);
  if (!normalized) return dateInput;

  const { day, month, year } = normalized;
  const date = new Date(year, parseInt(month) - 1, day);

  const localeMap = {
    EUR: 'fr-FR',
    USD: 'en-US',
    CAD: 'en-CA',
    XOF: 'fr-FR',
    GBP: 'en-GB'
  };

  const locale = localeMap[devise] || 'fr-FR';

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

/**
 * Obtenir la date actuelle au format de la devise
 * @param {string} devise - Code devise
 * @returns {string} - Date du jour formatée
 */
export const getCurrentDate = (devise = "EUR") => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  if (devise === "USD" || devise === "CAD") {
    return `${month}/${day}/${year}`; // MM/DD/YYYY
  }
  return `${day}/${month}/${year}`; // DD/MM/YYYY
};

/**
 * Convertir une date du format utilisateur vers DD/MM/YYYY (pour stockage)
 * @param {string} dateString - Date saisie par l'utilisateur
 * @param {string} devise - Code devise
 * @returns {string} - Date au format DD/MM/YYYY
 */
export const parseDate = (dateString, devise = "EUR") => {
  if (!dateString) return '';
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return dateString;
  
  const [part1, part2, year] = parts;
  
  if (devise === "USD" || devise === "CAD") {
    // Format source MM/DD/YYYY, convertir en DD/MM/YYYY
    return `${part2}/${part1}/${year}`;
  }
  
  // Déjà au format DD/MM/YYYY
  return dateString;
};

/**
 * Formater une heure selon la locale
 * @param {Date|string} date - Date ou timestamp
 * @param {string} devise - Code devise
 * @returns {string} - Heure formatée
 */
export const formatTime = (date, devise = "EUR") => {
  const localeMap = {
    EUR: 'fr-FR',
    USD: 'en-US',
    CAD: 'en-CA',
    XOF: 'fr-FR',
    GBP: 'en-GB'
  };

  const locale = localeMap[devise] || 'fr-FR';
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Formater date et heure ensemble
 * @param {Date|string} date - Date
 * @param {string} devise - Code devise
 * @returns {string} - Date et heure formatées
 */
export const formatDateTime = (date, devise = "EUR") => {
  return `${formatDateShort(date, devise)} ${formatTime(date, devise)}`;
};