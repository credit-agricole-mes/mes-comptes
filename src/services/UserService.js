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
  async get(key) {
    try {
      const result = await window.storage.get(key);
      return result ? JSON.parse(result.value) : null;
    } catch (error) {
      console.log(`Key "${key}" not found`);
      return null;
    }
  },

  async set(key, value) {
    try {
      await window.storage.set(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },

  async delete(key) {
    try {
      await window.storage.delete(key);
      return true;
    } catch (error) {
      console.error('Storage delete error:', error);
      return false;
    }
  }
};

// ==================== DONNÉES INITIALES ====================
// ✅ TOUTES LES DATES EN FORMAT DD/MM/YYYY - TOUT EN FRANÇAIS
const initialUsers = [
  {
    code: "12345678927",
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
    code: "00111111111",
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
    code: "22222222222",
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
    // ✅ TOUT EN FRANÇAIS (mois en français)
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

// ✅ Version 4 avec tout en français
const DATA_VERSION = 5;

// ==================== USER SERVICE ====================
const UserService = {
  async initializeUsers() {
    const storedVersion = await StorageService.get('dataVersion');
    const stored = await StorageService.get('bankUsers');
    
    if (storedVersion != DATA_VERSION || !stored) {
      console.log('🔄 Initialisation des données (v' + DATA_VERSION + ')');
      await StorageService.set('bankUsers', initialUsers);
      await StorageService.set('dataVersion', DATA_VERSION);
      console.log('✅ Données sauvegardées - tout en français');
      
      const currentUser = await StorageService.get('currentUser');
      if (currentUser) {
        const stillExists = initialUsers.find(u => u.code === currentUser.code);
        if (!stillExists) {
          await StorageService.delete('currentUser');
        }
      }
      
      return initialUsers;
    }
    
    return stored;
  },

  async checkCurrentUserValidity() {
    try {
      const currentUser = await StorageService.get('currentUser');
      if (!currentUser) return { valid: true };

      const users = await StorageService.get('bankUsers') || initialUsers;
      const userStillExists = users.find(u => u.code === currentUser.code);

      if (!userStillExists) {
        await StorageService.delete('currentUser');
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
      await StorageService.delete('currentUser');
      return { valid: false, shouldLogout: true };
    }
  },

  async loginUser(code) {
    const users = await StorageService.get('bankUsers') || initialUsers;
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

  async getUserByCode(code) {
    const users = await StorageService.get('bankUsers') || initialUsers;
    return users.find(u => u.code === code) || null;
  },

  async updateUserBalance(code, newBalance) {
    const users = await StorageService.get('bankUsers') || initialUsers;
    const userIndex = users.findIndex(u => u.code === code);
    
    if (userIndex !== -1) {
      users[userIndex].solde = newBalance;
      await StorageService.set('bankUsers', users);
      
      const currentUser = await StorageService.get('currentUser');
      if (currentUser && currentUser.code === code) {
        currentUser.solde = newBalance;
        await StorageService.set('currentUser', currentUser);
      }
      
      return true;
    }
    
    return false;
  }
};

export default UserService;