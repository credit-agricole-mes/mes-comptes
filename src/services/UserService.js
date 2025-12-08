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
    code: "11111111111",
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
    dateBlocage: "28/11/2021",
    dateAttestation: "25/03/2018",
    notification: "Votre compte a été temporairement bloqué pour des raisons d'une anomalie détectée. Afin de réactiver votre accès, nous vous invitons à régler les frais de déblocage s'élevant à 14 950 €. Merci de votre compréhension.",
    transactions: [
      { date: '25/11/2019', libelle: 'Virement Notaire - Succession', debit: '', credit: '15000.00' },
      { date: '27/12/2019', libelle: 'Frais de gestion compte', debit: '45.00', credit: '' },
      { date: '26/11/2020', libelle: 'Virement entrant', debit: '', credit: '25000.00' },
      { date: '28/11/2020', libelle: 'Achat Bijouterie Cartier', debit: '8500.00', credit: '' },
      { date: '30/11/2020', libelle: 'Restaurant Le Grand Véfour', debit: '320.75', credit: '' }
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
    code: "99999999999",
    nom: "Florence Deschenes",
    email: "john.smith@email.com",
    telephone: "+1 555 123 4567",
    adresse: "123 Wall Street, New York, NY 10005",
    solde: 600000,
    devise: "USD",
    symboleDevise: "$",
    numeroCompte: "US12 3456 7890 1234 5678 90",
    iban: "US12 3456 7890 1234 5678 90",
    bic: "CHASUS33XXX",
    agence: "Wall Street Branch - 123 Wall Street, New York, NY 10005",
    dateOuverture: "10/01/2019",
    dateBlocage: "02/12/2024",
    dateAttestation: "08/12/2024",
    notification: "Your account has been temporarily blocked due to a detected anomaly. To reactivate your access, please pay the unblocking fee of $14,950. Thank you for your understanding.",
    transactions: [
      { date: '28/11/2024', libelle: 'International Wire from Switzerland', debit: '', credit: '450000.00' },
      { date: '29/11/2024', libelle: 'Real Estate Investment', debit: '', credit: '150000.00' },
      { date: '30/11/2024', libelle: 'International Banking Fees', debit: '125.00', credit: '' },
      { date: '01/12/2024', libelle: 'Mercedes Benz Purchase', debit: '75000.00', credit: '' },
      { date: '02/12/2024', libelle: 'Fine Dining Restaurant', debit: '450.00', credit: '' }
    ],
    conseiller: {
      nom: 'Michael Johnson',
      telephone: '+1 212 555 0199',
      email: 'michael.johnson@bank.com',
    },
    notaire: {
      nom: "DAVID COHEN",
      prenom: "David",
      titre: "ATTORNEY AT LAW",
      adresse: "450 Lexington Avenue",
      ville: "New York, NY 10017",
      telephone: "+1 212 555 0145",
      email: "david.cohen@lawfirm.com"
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

// ✅ CHANGEZ CE NUMÉRO pour forcer la réinitialisation (9 au lieu de 7 ou 8)
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
      console.log('✅ Données sauvegardées avec devises');
      
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