// ==================== SERVICE DE FORMATAGE DEVISE ====================
export const formatCurrency = (montant, devise = "EUR", symbole = "€") => {
  const formattedNumber = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(montant);
  
  // Position du symbole selon la devise
  if (devise === "USD" || devise === "CAD") {
    return `${symbole}${formattedNumber}`; // $1,234.56
  } else {
    return `${formattedNumber} ${symbole}`; // 1 234,56 €
  }
};

// ==================== SERVICE DE STOCKAGE ====================
const StorageService = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.log(`Key "${key}" not found`);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('LocalStorage set error:', error);
      return false;
    }
  },

  delete(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('LocalStorage delete error:', error);
      return false;
    }
  }
};

// ==================== DONNÉES INITIALES ====================
const initialUsers = [
  {
    code: "12345678927",
    motDePasse: "123456",
    nom: "Christine Dubois",
    email: "christine.dubois@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "15 Rue de la Paix, 75002 Paris",
    solde: 2000000.75,
    devise: "EUR",
    symboleDevise: "€",
    numeroCompte: "FR76 3000 4000 0100 0123 4567 890",
    iban: "FR76 3000 4000 0100 0123 4567 890",
    bic: "BNPAFRPPXXX",
    agence: "Agence Paris Opéra - 29 Boulevard des Capucines, 75009 Paris",
    dateOuverture: "15/03/2018",
    dateBlocage: "28/11/2024",
    dateAttestation: "05/12/2024",
    notification: "Votre compte a été temporairement bloqué pour des raisons d'une anomalie détectée. Afin de réactiver votre accès, nous vous invitons à régler les frais de déblocage s'élevant à 12 800 €. Merci de votre compréhension.",
    transactions: [
      { date: '25/11/2024', libelle: 'Virement Notaire - Succession', debit: '', credit: '1500000.00' },
      { date: '26/11/2024', libelle: 'Virement entrant', debit: '', credit: '250000.00' },
      { date: '27/11/2024', libelle: 'Frais de gestion compte', debit: '45.00', credit: '' },
      { date: '28/11/2024', libelle: 'Achat Bijouterie Cartier', debit: '8500.00', credit: '' },
      { date: '30/11/2024', libelle: 'Restaurant Le Grand Véfour', debit: '320.75', credit: '' }
    ],
    relevesMensuels: [
      { mois: 'décembre', annee: '2024', dateGeneration: '05/12/2024' },
      { mois: 'novembre', annee: '2024', dateGeneration: '01/12/2024' },
      { mois: 'octobre', annee: '2024', dateGeneration: '01/11/2024' }
    ],
    virements: [
      { date: '20/11/2024', beneficiaire: 'EDF', montant: -85.50, statut: 'Effectué' },
      { date: '18/11/2024', beneficiaire: 'Marie Dubois', montant: -200.00, statut: 'Effectué' },
      { date: '15/11/2024', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
    ],
    depots: [
      { type: 'Dépôt de chèque', date: '15/11/2024', montant: 1250.00, icon: '📝' },
      { type: 'Dépôt espèces', date: '10/11/2024', montant: 500.00, icon: '💵' },
    ],
    decouvert: [
      { id: 1, date: '05/12/2024', montant: -250, duree: 3, frais: 7.5 },
      { id: 2, date: '28/11/2024', montant: -180, duree: 5, frais: 9.0 },
      { id: 3, date: '15/11/2024', montant: -320, duree: 2, frais: 6.4 },
      { id: 4, date: '01/11/2024', montant: -150, duree: 4, frais: 6.0 },
      { id: 5, date: '20/10/2024', montant: -280, duree: 6, frais: 16.8 },
      { id: 6, date: '05/10/2024', montant: -200, duree: 3, frais: 6.0 }
    ],
    conseiller: {
      nom: 'Marie Martin',
      telephone: '01 23 45 67 89',
      email: 'marie.martin@banque.fr',
    },
    notaire: {
      nom: "MAÎTRE SOPHIE BERNARD",
      prenom: "Sophie",
      titre: "NOTAIRE",
      adresse: "45 Avenue Montaigne",
      ville: "75008 PARIS",
      telephone: "01 42 89 33 44",
      email: "sophie.bernard@notaire-paris.fr"
    }
  },
  {
    code: "33333333333",
    motDePasse: "111111", // Changé de "azerty" à "111111"
    nom: "Clarisse Bianchi",
    email: "clarisse.bianchi@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "15 Rue de la Paix, 75002 Paris",
    solde: 1000000.75,
    devise: "EUR",
    symboleDevise: "€",
    numeroCompte: "FR76 3000 5000 0200 0123 4567 890",
    iban: "FR76 3000 5000 0200 0123 4567 890",
    bic: "BNPAFRPPXXX",
    agence: "Agence Paris Opéra - 29 Boulevard des Capucines, 75009 Paris",
    dateOuverture: "15/03/2022",
    dateBlocage: "28/11/2025",
    dateAttestation: "05/12/2024",
    notification: "Votre compte a été temporairement bloqué pour des raisons d'une anomalie détectée. Afin de réactiver votre accès, nous vous invitons à régler les frais de déblocage s'élevant à 20 000 €. Merci de votre compréhension.",
    transactions: [
      { date: '25/11/2025', libelle: 'Virement Notaire - Succession', debit: '', credit: '1500000.00' },
      { date: '26/11/2025', libelle: 'Virement entrant', debit: '', credit: '250000.00' },
      { date: '27/11/2025', libelle: 'Frais de gestion compte', debit: '45.00', credit: '' },
      { date: '28/11/2025', libelle: 'Achat Bijouterie Cartier', debit: '8500.00', credit: '' },
      { date: '30/11/2025', libelle: 'Restaurant Le Grand Véfour', debit: '320.75', credit: '' }
    ],
    relevesMensuels: [
      { mois: 'décembre', annee: '2025', dateGeneration: '02/12/2025' },
      { mois: 'novembre', annee: '2025', dateGeneration: '01/11/2025' },
      { mois: 'octobre', annee: '2025', dateGeneration: '01/10/2025' }
    ],
    virements: [
      { date: '20/11/2025', beneficiaire: 'EDF', montant: -85.50, statut: 'Effectué' },
      { date: '18/11/2025', beneficiaire: 'Marie Dubois', montant: -200.00, statut: 'Effectué' },
      { date: '15/11/2025', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
    ],
    depots: [
      { type: 'Dépôt de chèque', date: '15/11/2025', montant: 1250.00, icon: '📝' },
      { type: 'Dépôt espèces', date: '10/11/2025', montant: 500.00, icon: '💵' },
    ],
    decouvert: [
      { id: 1, date: '05/12/2025', montant: -250, duree: 3, frais: 7.5 },
      { id: 2, date: '28/11/2025', montant: -180, duree: 5, frais: 9.0 },
      { id: 3, date: '15/11/2025', montant: -320, duree: 2, frais: 6.4 },
      { id: 4, date: '01/11/2025', montant: -150, duree: 4, frais: 6.0 },
      { id: 5, date: '20/10/2025', montant: -280, duree: 6, frais: 16.8 },
      { id: 6, date: '05/10/2025', montant: -200, duree: 3, frais: 6.0 }
    ],
    conseiller: {
      nom: 'Marie Martin',
      telephone: '+33 6 23 45 67 89',
      email: 'marie.martin@banque.fr',
    },
    notaire: {
      nom: "MAÎTRE SOPHIE BERNARD",
      prenom: "Sophie",
      titre: "NOTAIRE",
      adresse: "45 Avenue Montaigne",
      ville: "75008 PARIS",
      telephone: " +33 6 42 89 33 44",
      email: "sophie.bernard@notaire-paris.fr"
    }
  },
  {
    code: "33333444444",
    motDePasse: "123456",
    nom: "Émelie Marie Louise",
    email: "",
    livretA: 50.00,
    assurance: 2000.00,
    epargne: 50000.25,
    telephone: "+33 7 56 81 18 00",
    adresse: "15 Rue de la Paix, 75002 Paris",
    solde: 2345065.75,
    devise: "EUR",
    symboleDevise: "€",
    numeroCompte: "FR76 1723 8000 0100 2542 9080 351",
    iban: "FR76 3000 5000 0200 0123 4567 890",
    bic: "BNPAFRPPXXX",
    agence: "Agence Paris Opéra - 29 Boulevard des Capucines, 75009 Paris",
    dateOuverture: "15/11/2015",
    dateBlocage: "28/12/2019",
    dateAttestation: "05/12/2015",
    notification: "Votre compte a été temporairement bloqué pour des raisons d'une anomalie détectée. Afin de réactiver votre accès, nous vous invitons à régler les frais de déblocage s'élevant à 30 000 €. Merci de votre compréhension.",
    transactions: [
      { date: '09/12/2019', libelle: 'Virement Notaire - Succession', debit: '', credit: '1500000.00' },
      { date: '06/12/2019', libelle: 'Virement entrant', debit: '', credit: '250000.00' },
      { date: '06/12/2019', libelle: 'Frais de gestion compte', debit: '45.00', credit: '' },
      { date: '04/12/2019', libelle: 'Achat Bijouterie Cartier', debit: '8500.00', credit: '' },
      { date: '04/12/2019', libelle: 'Restaurant Le Grand Véfour', debit: '320.75', credit: '' },
      { date: '01/12/2019', libelle: 'Abonnement Internet', debit: '30.00', credit: '' },
      { date: '28/11/2019', libelle: 'Restaurant', debit: '500.00', credit: '' },
      { date: '20/11/2019', libelle: 'Fast-food', debit: '350.75', credit: '' },
      { date: '20/11/2019', libelle: 'Abonnement Netflix', debit: '50.00', credit: '' },
      { date: '18/11/2019', libelle: 'Achat Bijouterie Cartier', debit: '800.00', credit: '' },
      { date: '30/10/2019', libelle: 'Restaurant Le Grand Véfour', debit: '350.75', credit: '' },
    ],
    relevesMensuels: [
      { mois: 'novembre', annee: '2019', dateGeneration: '01/12/2019' },
      { mois: 'octobre', annee: '2019', dateGeneration: '01/11/2019' },
      { mois: 'septembre', annee: '2019', dateGeneration: '01/10/2019' }
    ],
    virements: [
      { date: '10/12/2019', beneficiaire: 'EDF', montant: -85.50, statut: 'Effectué' },
      { date: '18/11/2019', beneficiaire: 'Marie Dubois', montant: -2000.00, statut: 'Effectué' },
      { date: '10/11/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '06/10/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '05/09/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '07/08/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '07/07/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '06/06/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '06/05/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '07/04/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '05/03/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '06/02/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '05/01/2019', beneficiaire: 'Loyer', montant: -950.00, statut: 'Effectué' },
      { date: '02/08/2019', beneficiaire: 'Assurance', montant: -1000.00, statut: 'Effectué' },
      { date: '02/08/2018', beneficiaire: 'Assurance', montant: -1000.00, statut: 'Effectué' },
      { date: '02/07/2017', beneficiaire: 'Assurance', montant: -1000.00, statut: 'Effectué' },
      { date: '02/06/2016', beneficiaire: 'Assurance', montant: -1000.00, statut: 'Effectué' },
    ],
    depots: [
      { type: 'Dépôt de chèque', date: '15/11/2019', montant: 1250.00, icon: '📝' },
      { type: 'Dépôt espèces', date: '10/11/2019', montant: 500.00, icon: '💵' },
    ],
    decouvert: [
      { id: 1, date: '05/12/2019', montant: -250, duree: 3, frais: 7.5 },
      { id: 2, date: '28/11/2019', montant: -180, duree: 5, frais: 9.0 },
      { id: 3, date: '15/11/2019', montant: -320, duree: 2, frais: 6.4 },
      { id: 4, date: '01/11/2019', montant: -150, duree: 4, frais: 6.0 },
      { id: 5, date: '20/10/2019', montant: -280, duree: 6, frais: 16.8 },
      { id: 6, date: '05/10/2019', montant: -200, duree: 3, frais: 6.0 }
    ],
    conseiller: {
      nom: 'Marie Martin',
      telephone: '+33 6 22 45 67 89',
      email: 'marie.martin@banque.fr',
    },
    notaire: {
      nom: "Maitre",
      prenom: "Hermann",
      titre: "NOTAIRE",
      adresse: "45 Avenue Montaigne",
      ville: "75008 PARIS",
      email: "Hermann1643@gmail.com"
    }
  },
  {
    code: "00111111111",
    motDePasse: "222222", // Changé de "secure2021" à "222222"
    nom: "Marcelin Rolzou",
    email: "Marcelin.Rolzou@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "15 Rue de la Paix, 75002 Paris",
    solde: 600000.75,
    devise: "EUR",
    symboleDevise: "€",
    numeroCompte: "FR76 3000 4000 0100 0123 4567 890",
    iban: "FR76 3000 4000 0100 0123 4567 890",
    bic: "BNPAFRPPXXX",
    agence: "Agence Paris Opéra - 29 Boulevard des Capucines, 75009 Paris",
    dateOuverture: "15/03/2018",
    dateBlocage: "28/12/2021",
    dateAttestation: "25/03/2018",
    notification: "Votre compte a été temporairement bloqué pour des raisons d'une anomalie détectée. Afin de réactiver votre accès, nous vous invitons à régler les frais de déblocage s'élevant à 14 950 €. Merci de votre compréhension.",
    transactions: [
      { date: '23/11/2021', libelle: 'Virement Notaire - Succession', debit: '', credit: '15000.00' },
      { date: '07/11/2021', libelle: 'Frais de gestion compte', debit: '45.00', credit: '' },
      { date: '16/10/2021', libelle: 'Virement entrant', debit: '', credit: '25000.00' },
      { date: '05/10/2021', libelle: 'Achat Bijouterie Cartier', debit: '8500.00', credit: '' },
      { date: '20/10/2021', libelle: 'Restaurant Le Grand Véfour', debit: '320.75', credit: '' }
    ],
    relevesMensuels: [
      { mois: 'décembre', annee: '2021', dateGeneration: '05/01/2021' },
      { mois: 'novembre', annee: '2021', dateGeneration: '01/12/2021' },
      { mois: 'décembre', annee: '2020', dateGeneration: '05/01/2020' },
      { mois: 'novembre', annee: '2020', dateGeneration: '01/12/2020' }
    ],
    virements: [
      { date: '10/11/2021', beneficiaire: 'Électricité', montant: -120.00, statut: 'Effectué' },
      { date: '05/11/2021', beneficiaire: 'Jean Martin', montant: -300.00, statut: 'Effectué' },
    ],
    depots: [
      { type: 'Dépôt de chèque', date: '01/11/2021', montant: 800.00, icon: '📝' },
    ],
    decouvert: [
      { id: 1, date: '15/10/2021', montant: -180, duree: 4, frais: 7.2 },
      { id: 2, date: '05/10/2021', montant: -220, duree: 3, frais: 6.6 },
    ],
    conseiller: {
      nom: 'Marie Martin',
      telephone: '+33 6 23 45 67 89',
      email: 'marie.martin@banque.fr',
    },
    notaire: {
      nom: "MAÎTRE BERNARD",
      prenom: "Sophie",
      titre: "NOTAIRE",
      adresse: "45 Avenue Montaigne",
      ville: "75008 PARIS",
      telephone: "+33 6 44 68 49 73",
      email: "sophie.bernard@notaire-paris.fr"
    }
  },
  {
    code: "00000111111",
    motDePasse: "333333", // Changé de "gauthier2019" à "333333"
    nom: "Jean Patrick Gauthier",
    email: "gauthierjeanpatrick05@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "15 Rue de la Paix, 75002 Paris",
    solde: 342407.70,
    devise: "EUR",
    symboleDevise: "€",
    numeroCompte: "FR76 3000 4000 0120 0123 4557 890",
    iban: "FR76 3000 4000 0120 0123 4557 890",
    bic: "BNPAFRPPXXX",
    agence: "Agence Paris Opéra - 29 Boulevard des Capucines, 75009 Paris",
    dateOuverture: "15/03/2013",
    dateBlocage: "13/06/2019",
    dateAttestation: "25/03/2013",
    notification: "Votre compte a été temporairement bloqué pour des raisons d'une anomalie détectée. Afin de réactiver votre accès, nous vous invitons à régler les frais de déblocage s'élevant à 8750 €. Merci de votre compréhension.",
    transactions: [
      { date: '10/06/2019', libelle: 'Virement Notaire - Succession', debit: '', credit: '15000.00' },
      { date: '07/06/2019', libelle: 'Frais de gestion compte', debit: '45.00', credit: '' },
      { date: '16/05/2019', libelle: 'Virement entrant', debit: '', credit: '25000.00' },
      { date: '05/05/2019', libelle: 'Achat Bijouterie Cartier', debit: '8500.00', credit: '' },
      { date: '20/05/2019', libelle: 'Restaurant Le Grand Véfour', debit: '320.75', credit: '' }
    ],
    relevesMensuels: [
      { mois: 'mai', annee: '2019', dateGeneration: '01/06/2019'},
      { mois: 'avril', annee: '2019', dateGeneration: '01/05/2019'},
      { mois: 'mars', annee: '2019', dateGeneration: '01/04/2019' },
      { mois: 'février', annee: '2019', dateGeneration: '01/03/2019' }
    ],
    virements: [
      { date: '10/06/2019', beneficiaire: 'Électricité', montant: -120.00, statut: 'Effectué' },
      { date: '05/06/2019', beneficiaire: 'Jean Martin', montant: -300.00, statut: 'Effectué' },
    ],
    depots: [
      { type: 'Dépôt de chèque', date: '01/06/2019', montant: 800.00, icon: '📝' },
    ],
    decouvert: [
      { id: 1, date: '15/05/2019', montant: -180, duree: 4, frais: 7.2 },
      { id: 2, date: '05/05/2019', montant: -220, duree: 3, frais: 6.6 },
    ],
    conseiller: {
      nom: 'Marie Martin',
      telephone: '+33 6 22 45 67 89',
      email: 'marie.martin@banque.fr',
    },
    notaire: {
      nom: "MAÎTRE BERNARD",
      prenom: "Sophie",
      titre: "NOTAIRE",
      adresse: "45 Avenue Montaigne",
      ville: "75008 PARIS",
      telephone: "+33 6 44 58 45 73",
      email: "sophie.bernard@notaire-paris.fr"
    }
  },
  {
    code: "22222222222",
    motDePasse: "444444", // Changé de "newyork2025" à "444444"
    nom: "Florence Deschênes",
    email: "ginetteb040@email.com",
    telephone: "+1 438 896 3897",
    adresse: "123 Wall Street, New York, NY 10005",
    solde: 150000,
    devise: "USD",
    symboleDevise: "$",
    numeroCompte: "US12 3456 7890 1234 5678 90",
    iban: "US12 3456 7890 1234 5678 90",
    bic: "CHASUS33XXX",
    agence: "Wall Street Branch - 123 Wall Street, New York, NY 10005",
    dateOuverture: "10/01/2021",
    dateBlocage: "02/12/2025",
    dateAttestation: "08/12/2021",
    notification: "Votre compte a été temporairement bloqué pour des raisons d'une anomalie détectée. Afin de réactiver votre accès, nous vous invitons à régler les frais de déblocage s'élevant à 15 050 $. Merci de votre compréhension.",
    transactions: [
      { date: '28/11/2025', libelle: 'Virement international depuis Suisse', debit: '', credit: '450000.00' },
      { date: '29/11/2025', libelle: 'Investissement immobilier', debit: '', credit: '150000.00' },
      { date: '30/11/2025', libelle: 'Frais bancaires internationaux', debit: '125.00', credit: '' },
      { date: '01/12/2025', libelle: 'Achat Mercedes Benz', debit: '75000.00', credit: '' },
      { date: '02/12/2025', libelle: 'Restaurant gastronomique', debit: '450.00', credit: '' }
    ],
    relevesMensuels: [
      { mois: 'décembre', annee: '2025', dateGeneration: '05/12/2025' },
      { mois: 'novembre', annee: '2025', dateGeneration: '01/12/2025' }
    ],
    virements: [
      { date: '25/11/2025', beneficiaire: 'ConEd Electric', montant: -150.00, statut: 'Effectué' },
      { date: '20/11/2025', beneficiaire: 'John Smith', montant: -500.00, statut: 'Effectué' },
      { date: '15/11/2025', beneficiaire: 'Paiement loyer', montant: -2500.00, statut: 'Effectué' },
    ],
    depots: [
      { type: 'Dépôt de chèque', date: '15/11/2025', montant: 3500.00, icon: '📝' },
      { type: 'Dépôt espèces', date: '12/11/2025', montant: 1000.00, icon: '💵' },
    ],
    decouvert: [
      { id: 1, date: '01/12/2025', montant: -300, duree: 2, frais: 6.0 },
      { id: 2, date: '25/11/2025', montant: -250, duree: 4, frais: 10.0 },
      { id: 3, date: '10/11/2025', montant: -400, duree: 5, frais: 20.0 },
    ],
    conseiller: {
      nom: 'Michael Johnson',
      telephone: '+1 212 555 0199',
      email: 'michael.johnson@bank.com',
    },
    notaire: {
      nom: "COHEN",
      prenom: "David",
      titre: "NOTAIRE",
      adresse: "450 Lexington Avenue",
      ville: "New York, NY 10017",
      telephone: "+1 438 896 3897",
      email: "demersy589@gmail.com"
    }
  },
  {
    code: "11122233344",
    motDePasse: "555555", // Changé de "abidjan2024" à "555555"
    nom: "Ahmed Koné",
    email: "ahmed.kone@email.com",
    telephone: "+225 07 12 34 56 78",
    adresse: "Cocody, Abidjan",
    solde: 5000000,
    devise: "XOF",
    symboleDevise: "FCFA",
    numeroCompte: "CI93 1234 5678 9012 3456 7890 12",
    iban: "CI93 1234 5678 9012 3456 7890 12",
    bic: "BICIIVBJXXX",
    agence: "Agence Cocody - Boulevard Latrille, Abidjan",
    dateOuverture: "12/05/2020",
    dateBlocage: "01/12/2024",
    dateAttestation: "06/12/2024",
    notification: "Votre compte a été temporairement bloqué pour des raisons de sécurité. Pour le débloquer, veuillez régler les frais de 7 500 000 FCFA. Merci.",
    transactions: [
      { date: '20/11/2024', libelle: 'Transfert International', debit: '', credit: '3000000.00' },
      { date: '22/11/2024', libelle: 'Achat terrain Riviera', debit: '1500000.00', credit: '' },
      { date: '25/11/2024', libelle: 'Salaire Entreprise ABC', debit: '', credit: '2500000.00' },
      { date: '28/11/2024', libelle: 'Frais bancaires', debit: '25000.00', credit: '' },
      { date: '30/11/2024', libelle: 'Shopping Cap Sud', debit: '150000.00', credit: '' }
    ],
    relevesMensuels: [
      { mois: 'novembre', annee: '2024', dateGeneration: '01/12/2024' },
      { mois: 'octobre', annee: '2024', dateGeneration: '01/11/2024' }
    ],
    virements: [
      { date: '25/11/2024', beneficiaire: 'CIE Électricité', montant: -45000, statut: 'Effectué' },
      { date: '20/11/2024', beneficiaire: 'Fatou Koné', montant: -100000, statut: 'Effectué' },
      { date: '15/11/2024', beneficiaire: 'Loyer Cocody', montant: -250000, statut: 'Effectué' },
    ],
    depots: [
      { type: 'Dépôt de chèque', date: '18/11/2024', montant: 800000, icon: '📝' },
      { type: 'Dépôt espèces', date: '10/11/2024', montant: 300000, icon: '💵' },
    ],
    decouvert: [
      { id: 1, date: '28/11/2024', montant: -150000, duree: 3, frais: 4500 },
      { id: 2, date: '20/11/2024', montant: -200000, duree: 5, frais: 10000 },
      { id: 3, date: '10/11/2024', montant: -100000, duree: 2, frais: 2000 },
    ],
    conseiller: {
      nom: 'Fatou Traoré',
      telephone: '+225 27 22 45 67 89',
      email: 'fatou.traore@banque.ci',
    },
    notaire: {
      nom: "MAÎTRE KOUASSI",
      prenom: "Marcel",
      titre: "NOTAIRE",
      adresse: "Plateau, Immeuble SCIAM",
      ville: "Abidjan",
      telephone: "+225 27 20 30 40 50",
      email: "marcel.kouassi@notaire.ci"
    }
  }
];

// ==================== USER SERVICE ====================
const DATA_VERSION = 1;

const UserService = {
  initializeUsers() {
    const storedVersion = StorageService.get('dataVersion');
    const stored = StorageService.get('bankUsers');
    
    if (storedVersion != DATA_VERSION || !stored) {
      console.log('🔄 Initialisation des données (v' + DATA_VERSION + ')');
      StorageService.set('bankUsers', initialUsers);
      StorageService.set('dataVersion', DATA_VERSION);
      console.log('✅ Données sauvegardées avec localStorage');
      
      StorageService.delete('currentUser');
      console.log('✅ Session effacée - reconnexion requise');
      
      return initialUsers;
    }
    
    return stored;
  },

  // NOUVELLE FONCTION : Vérifie le login avec identifiant ET mot de passe
  verifyLogin(code, motDePasse) {
    const users = StorageService.get('bankUsers') || initialUsers;
    const user = users.find(u => u.code === code);
    
    if (!user) {
      return {
        success: false,
        message: "Identifiant incorrect"
      };
    }
    
    // Conversion forcée en string pour la comparaison
    if (String(user.motDePasse) !== String(motDePasse)) {
      console.log('🔍 Comparaison mot de passe:');
      console.log('Stocké:', user.motDePasse, 'Type:', typeof user.motDePasse);
      console.log('Saisi:', motDePasse, 'Type:', typeof motDePasse);
      return {
        success: false,
        message: "Mot de passe incorrect"
      };
    }
    
    return {
      success: true,
      user: { ...user }
    };
  },

  checkCurrentUserValidity() {
    try {
      const currentUser = StorageService.get('currentUser');
      
      if (!currentUser) {
        return { valid: false };
      }

      const users = StorageService.get('bankUsers') || initialUsers;
      const userStillExists = users.find(u => u.code === currentUser.code);

      if (!userStillExists) {
        StorageService.delete('currentUser');
        return { 
          valid: false, 
          shouldLogout: true,
          message: "Votre session a expiré. Veuillez vous reconnecter."
        };
      }

      return { 
        valid: true,
        user: { ...userStillExists }
      };
    } catch (error) {
      console.error('Erreur validation session:', error);
      StorageService.delete('currentUser');
      return { valid: false, shouldLogout: true };
    }
  },

  loginUser(code) {
    const users = StorageService.get('bankUsers') || initialUsers;
    const user = users.find(u => u.code === code);
    
    if (user) {
      return {
        success: true,
        user: { ...user }
      };
    }
    
    return {
      success: false,
      message: "Identifiant incorrect"
    };
  },

  getUserByCode(code) {
    const users = StorageService.get('bankUsers') || initialUsers;
    return users.find(u => u.code === code) || null;
  },

  updateUserBalance(code, newBalance) {
    const users = StorageService.get('bankUsers') || initialUsers;
    const userIndex = users.findIndex(u => u.code === code);
    
    if (userIndex !== -1) {
      users[userIndex].solde = newBalance;
      StorageService.set('bankUsers', users);
      
      const currentUser = StorageService.get('currentUser');
      if (currentUser && currentUser.code === code) {
        currentUser.solde = newBalance;
        StorageService.set('currentUser', currentUser);
      }
      
      return true;
    }
    
    return false;
  }
};

export default UserService;