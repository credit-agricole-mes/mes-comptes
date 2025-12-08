// Données initiales (SANS MOT DE PASSE)
const initialUsers = [
  {
    code: "12345678927",
    nom: "Christine Dubois",
    email: "christine.dubois@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "15 Rue de la Paix, 75002 Paris",
    solde: 2000000.75,
    numeroCompte: "FR76 3000 4000 0100 0123 4567 890",
    iban: "FR76 3000 4000 0100 0123 4567 890",
    bic: "BNPAFRPPXXX",
    agence: "Agence Paris Opéra - 29 Boulevard des Capucines, 75009 Paris",
    dateOuverture: "15/03/2018",
    notification: "Votre compte a été temporairement bloqué pour des raisons d'une anomalie détectée. Afin de réactiver votre accès,nous vous invitons à régler les frais de  déblocage s'élevant à 12 800 €. Merci de votre compréhension. ",
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

// 🔑 VERSION DES DONNÉES - Incrémentez ce numéro à chaque changement de code/structure
const DATA_VERSION = 9;

// 🔧 FONCTION POUR RECHARGER LES UTILISATEURS DEPUIS LOCALSTORAGE
const reloadUsers = () => {
  try {
    const stored = localStorage.getItem('bankUsers');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('❌ Erreur rechargement:', error);
  }
  return [...initialUsers];
};

// ✅ Charger les utilisateurs avec vérification de version automatique
const loadUsers = () => {
  try {
    const storedVersion = localStorage.getItem('dataVersion');
    const stored = localStorage.getItem('bankUsers');
    
    // ✅ Si la version a changé, on écrase avec les nouvelles données
    if (storedVersion != DATA_VERSION) {
      console.log('🔄 Nouvelle version détectée (v' + DATA_VERSION + ') - Mise à jour automatique');
      const initialData = [...initialUsers];
      localStorage.setItem('bankUsers', JSON.stringify(initialData));
      localStorage.setItem('dataVersion', DATA_VERSION);
      console.log('✅ Données mises à jour');
      console.log('💰 Nouveaux codes:', initialData.map(u => u.code));
      
      // ⚠️ Déconnecter l'utilisateur actuel si son code a changé
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        try {
          const parsed = JSON.parse(currentUser);
          const stillExists = initialData.find(u => u.code === parsed.code);
          if (!stillExists) {
            console.log('⚠️ Code utilisateur obsolète - Déconnexion automatique');
            localStorage.removeItem('currentUser');
          }
        } catch (e) {
          console.error('Erreur vérification currentUser:', e);
        }
      }
      
      return initialData;
    }
    
    // ✅ Sinon, charger depuis localStorage
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('✅ Utilisateurs chargés (v' + DATA_VERSION + ')');
      console.log('💰 Codes disponibles:', parsed.map(u => u.code));
      return parsed;
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement:', error);
  }
  
  // ✅ Première installation
  console.log('📦 Première installation - Données initiales');
  const initialData = [...initialUsers];
  
  try {
    localStorage.setItem('bankUsers', JSON.stringify(initialData));
    localStorage.setItem('dataVersion', DATA_VERSION);
    console.log('💾 Données initiales sauvegardées (v' + DATA_VERSION + ')');
    console.log('💰 Codes initiaux:', initialData.map(u => u.code));
  } catch (e) {
    console.error('❌ Erreur sauvegarde initiale:', e);
  }
  
  return initialData;
};

// Sauvegarder les utilisateurs dans localStorage
const saveUsers = (usersToSave) => {
  try {
    localStorage.setItem('bankUsers', JSON.stringify(usersToSave));
    console.log('💾 Utilisateurs sauvegardés');
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
  }
};

// Initialiser les utilisateurs
let users = loadUsers();

const UserService = {
  // ✅ VÉRIFIER SI L'UTILISATEUR CONNECTÉ EXISTE TOUJOURS
  checkCurrentUserValidity: () => {
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) {
        return { valid: true };
      }

      const currentUser = JSON.parse(currentUserStr);
      console.log('🔍 Vérification pour:', currentUser.nom, '(Code:', currentUser.code, ')');
      
      // 🔄 RECHARGER les données
      users = reloadUsers();
      
      // ✅ Chercher l'utilisateur dans les données actuelles
      const userStillExists = users.find(u => u.code === currentUser.code);

      if (!userStillExists) {
        console.log('⚠️ CODE INVALIDE - Utilisateur introuvable');
        console.log('📋 Codes disponibles:', users.map(u => u.code));
        localStorage.removeItem('currentUser');
        return { 
          valid: false, 
          shouldLogout: true,
          message: "Votre session a expiré. Veuillez vous reconnecter."
        };
      }

      console.log('✅ Session valide - Solde:', userStillExists.solde, '€');
      
      return { 
        valid: true,
        user: { ...userStillExists }
      };
    } catch (error) {
      console.error('❌ Erreur vérification session:', error);
      localStorage.removeItem('currentUser');
      return { valid: false, shouldLogout: true };
    }
  },

  // ✅ CONNEXION SANS MOT DE PASSE
  loginUser: (code) => {
    console.log('🔐 Tentative de connexion avec code:', code);
    
    // 🔄 Recharger les données
    users = reloadUsers();
    
    const user = users.find(u => u.code === code);
    
    if (user) {
      console.log('✅ Connexion réussie:', user.nom);
      console.log('💰 Solde:', user.solde, '€');
      return {
        success: true,
        user: { ...user }
      };
    }
    
    console.log('❌ Code incorrect');
    console.log('📋 Codes valides:', users.map(u => u.code));
    return {
      success: false,
      message: "Identifiant incorrect"
    };
  },

  getUserByCode: (code) => {
    users = reloadUsers();
    const user = users.find(u => u.code === code);
    if (user) {
      console.log('✅ Utilisateur trouvé:', user.nom, '- Solde:', user.solde, '€');
      return { ...user };
    }
    return null;
  },

  getAllUsers: () => {
    users = reloadUsers();
    return users.map(u => ({ ...u }));
  },

  updateUserBalance: (code, newBalance) => {
    users = reloadUsers();
    
    const userIndex = users.findIndex(u => u.code === code);
    if (userIndex !== -1) {
      console.log(`💰 Mise à jour solde pour ${users[userIndex].nom}`);
      console.log(`   Ancien: ${users[userIndex].solde}€`);
      console.log(`   Nouveau: ${newBalance}€`);
      
      users[userIndex].solde = newBalance;
      saveUsers(users);
      
      // ✅ Mettre à jour aussi dans currentUser
      try {
        const currentUserStr = localStorage.getItem('currentUser');
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.code === code) {
            currentUser.solde = newBalance;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('💾 currentUser synchronisé');
          }
        }
      } catch (e) {
        console.error('❌ Erreur mise à jour currentUser:', e);
      }
      
      return true;
    }
    
    return false;
  },

  updateUserNotary: (code, notaryInfo) => {
    users = reloadUsers();
    
    const userIndex = users.findIndex(u => u.code === code);
    if (userIndex !== -1) {
      users[userIndex].notaire = {
        ...users[userIndex].notaire,
        ...notaryInfo
      };
      saveUsers(users);
      
      // Sync avec currentUser
      try {
        const currentUserStr = localStorage.getItem('currentUser');
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.code === code) {
            currentUser.notaire = users[userIndex].notaire;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          }
        }
      } catch (e) {
        console.error('Erreur sync notaire:', e);
      }
      
      return true;
    }
    return false;
  },

  getUserNotary: (code) => {
    users = reloadUsers();
    const user = users.find(u => u.code === code);
    return user ? { ...user.notaire } : null;
  },

  // 🔄 Méthode pour réinitialiser (garde pour debug)
  resetData: () => {
    console.log('🔄 RÉINITIALISATION MANUELLE...');
    users = [...initialUsers];
    saveUsers(users);
    localStorage.setItem('dataVersion', DATA_VERSION);
    localStorage.removeItem('currentUser');
    console.log('✅ Données réinitialisées');
    return true;
  },

  // 🔍 DEBUG
  debugState: () => {
    console.log('=== DEBUG STATE ===');
    console.log('Version données:', localStorage.getItem('dataVersion'), '(actuelle: ' + DATA_VERSION + ')');
    console.log('Users en mémoire:', users);
    console.log('bankUsers localStorage:', JSON.parse(localStorage.getItem('bankUsers') || '[]'));
    console.log('currentUser localStorage:', JSON.parse(localStorage.getItem('currentUser') || 'null'));
    return {
      version: localStorage.getItem('dataVersion'),
      currentVersion: DATA_VERSION,
      usersInMemory: users,
      bankUsers: JSON.parse(localStorage.getItem('bankUsers') || '[]'),
      currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null')
    };
  }
};

export default UserService;