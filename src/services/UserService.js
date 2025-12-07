// Données initiales (SANS MOT DE PASSE)
const initialUsers = [
  {
    code: "12345678901",
    nom: "Christine Dubois",
    email: "christine.dubois@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "15 Rue de la Paix, 75002 Paris",
    solde: 2450.75,
    numeroCompte: "FR76 3000 4000 0100 0123 4567 890",
    iban: "FR76 3000 4000 0100 0123 4567 890",
    bic: "BNPAFRPPXXX",
    agence: "Agence Paris Opéra - 29 Boulevard des Capucines, 75009 Paris",
    dateOuverture: "15/03/2018",
    notification: "Votre virement de 500€ a été effectué avec succès",
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
    code: "56789012345",
    nom: "Pierre Martin",
    email: "pierre.martin@email.com",
    telephone: "+33 6 98 76 54 32",
    adresse: "42 Avenue Victor Hugo, 75016 Paris",
    solde: 15230.50,
    numeroCompte: "FR76 3000 4000 0200 5678 9012 345",
    iban: "FR76 3000 4000 0200 5678 9012 345",
    bic: "BNPAFRPPXXX",
    agence: "Agence Paris Victor Hugo - 50 Avenue Victor Hugo, 75016 Paris",
    dateOuverture: "22/07/2020",
    notification: null,
    conseiller: {
      nom: 'Jean Dupont',
      telephone: '01 98 76 54 32',
      email: 'jean.dupont@banque.fr',
    },
    notaire: {
      nom: "MAÎTRE JEAN DUPONT",
      prenom: "Jean",
      titre: "NOTAIRE",
      adresse: "123 Avenue des Champs-Élysées",
      ville: "75008 PARIS",
      telephone: "01 23 45 67 89",
      email: "jean.dupont@notaire-paris.fr"
    }
  },
  {
    code: "99999999999",
    nom: "Sophie Lefebvre",
    email: "sophie.lefebvre@email.com",
    telephone: "+33 7 11 22 33 44",
    adresse: "8 Boulevard Saint-Germain, 75005 Paris",
    solde: 3890.25,
    numeroCompte: "FR76 3000 4000 0300 9999 1111 222",
    iban: "FR76 3000 4000 0300 9999 1111 222",
    bic: "BNPAFRPPXXX",
    agence: "Agence Paris Saint-Germain - 12 Boulevard Saint-Germain, 75005 Paris",
    dateOuverture: "10/01/2019",
    notification: null,
    conseiller: {
      nom: 'Claire Bernard',
      telephone: '01 55 44 33 22',
      email: 'claire.bernard@banque.fr',
    },
    notaire: {
      nom: "MAÎTRE CLAIRE ROUSSEAU",
      prenom: "Claire",
      titre: "NOTAIRE",
      adresse: "28 Rue de Tournon",
      ville: "75006 PARIS",
      telephone: "01 43 26 78 90",
      email: "claire.rousseau@notaire-paris.fr"
    }
  }
];

// Charger les utilisateurs depuis localStorage ou utiliser les données initiales
const loadUsers = () => {
  try {
    const stored = localStorage.getItem('bankUsers');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Utilisateurs chargés depuis localStorage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  }
  console.log('Utilisation des données initiales');
  return [...initialUsers];
};

// Sauvegarder les utilisateurs dans localStorage
const saveUsers = (usersToSave) => {
  try {
    localStorage.setItem('bankUsers', JSON.stringify(usersToSave));
    console.log('Utilisateurs sauvegardés dans localStorage');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

// Initialiser les utilisateurs
let users = loadUsers();

const UserService = {
  // ✅ CONNEXION SANS MOT DE PASSE - uniquement avec le code
  loginUser: (code) => {
    console.log('UserService.loginUser appelé avec code:', code);
    const user = users.find(u => u.code === code);
    
    if (user) {
      console.log('Utilisateur trouvé:', user.nom, 'Solde:', user.solde);
      return {
        success: true,
        user: { ...user }
      };
    }
    
    console.log('Utilisateur non trouvé');
    return {
      success: false,
      message: "Identifiant incorrect"
    };
  },

  getUserByCode: (code) => {
    console.log('UserService.getUserByCode appelé avec code:', code);
    const user = users.find(u => u.code === code);
    console.log('Utilisateur trouvé:', user ? `${user.nom} - Solde: ${user.solde}€` : 'AUCUN');
    return user ? { ...user } : null;
  },

  getAllUsers: () => {
    return users.map(u => ({ ...u }));
  },

  updateUserBalance: (code, newBalance) => {
    const userIndex = users.findIndex(u => u.code === code);
    if (userIndex !== -1) {
      users[userIndex].solde = newBalance;
      saveUsers(users);
      console.log(`Solde mis à jour pour ${users[userIndex].nom}: ${newBalance}€`);
      return true;
    }
    return false;
  },

  updateUserNotary: (code, notaryInfo) => {
    const userIndex = users.findIndex(u => u.code === code);
    if (userIndex !== -1) {
      users[userIndex].notaire = {
        ...users[userIndex].notaire,
        ...notaryInfo
      };
      saveUsers(users);
      return true;
    }
    return false;
  },

  getUserNotary: (code) => {
    const user = users.find(u => u.code === code);
    return user ? { ...user.notaire } : null;
  },

  // Méthode pour réinitialiser toutes les données (développement)
  resetData: () => {
    users = [...initialUsers];
    saveUsers(users);
    console.log('✅ Données réinitialisées aux valeurs par défaut');
    return true;
  }
};

export default UserService;