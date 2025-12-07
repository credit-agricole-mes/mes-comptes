// data/usersData.js

// Base de données des informations bancaires par code utilisateur
export const usersDatabase = {
  '1234': {
    compteInfo: {
      titulaire: 'Dubois Christine',
      numeroCompte: 'FR76 3000 4000 0100 0012 3456 789',
      iban: 'FR76 3000 4000 0100 0012 3456 789',
      bic: 'BNPAFRPPXXX',
      agence: 'Paris Champs-Élysées - 15 Avenue des Champs-Élysées',
      solde: '4,000,000.00 €',
      dateOuverture: '10/01/2015'
    },
    transactions: [
      { date: '01/12', libelle: 'Virement entrant - Héritage', debit: '', credit: '3,500,000.00' },
      { date: '02/12', libelle: 'Placement Assurance Vie', debit: '500,000.00', credit: '' },
      { date: '03/12', libelle: 'Loyer appartement Paris 8ème', debit: '3,500.00', credit: '' },
      { date: '04/12', libelle: 'Carte bancaire - Boutique Hermès', debit: '12,450.00', credit: '' },
      { date: '05/12', libelle: 'Virement - Charges copropriété', debit: '2,800.00', credit: '' },
      { date: '06/12', libelle: 'Intérêts compte épargne', debit: '', credit: '18,750.00' }
    ]
  },
  '56789012': {
    compteInfo: {
      titulaire: 'Martin Pierre',
      numeroCompte: 'FR76 3000 4000 0156 7890 1234 567',
      iban: 'FR76 3000 4000 0156 7890 1234 567',
      bic: 'BNPAFRPPYYY',
      agence: 'Paris Rivoli - 42 Rue de Rivoli',
      solde: '15,230.50 €',
      dateOuverture: '22/06/2018'
    },
    transactions: [
      { date: '01/12', libelle: 'Salaire', debit: '', credit: '3,200.00' },
      { date: '02/12', libelle: 'Loyer', debit: '1,250.00', credit: '' },
      { date: '05/12', libelle: 'Courses Monoprix', debit: '156.80', credit: '' },
      { date: '08/12', libelle: 'EDF - Électricité', debit: '89.50', credit: '' },
      { date: '10/12', libelle: 'Restaurant Le Relais', debit: '78.30', credit: '' }
    ]
  },
  '9999': {
    compteInfo: {
      titulaire: 'Lefebvre Sophie',
      numeroCompte: 'FR76 3000 4000 0199 9987 6543 210',
      iban: 'FR76 3000 4000 0199 9987 6543 210',
      bic: 'BNPAFRPPZZZ',
      agence: 'Paris Saint-Germain - 88 Boulevard Saint-Germain',
      solde: '8,750.25 €',
      dateOuverture: '15/03/2020'
    },
    transactions: [
      { date: '01/12', libelle: 'Salaire', debit: '', credit: '2,800.00' },
      { date: '03/12', libelle: 'Loyer', debit: '950.00', credit: '' },
      { date: '06/12', libelle: 'Courses Carrefour', debit: '112.45', credit: '' },
      { date: '09/12', libelle: 'Abonnement Netflix', debit: '15.99', credit: '' },
      { date: '11/12', libelle: 'Pharmacie', debit: '32.80', credit: '' }
    ]
  },
  
};

// Fonction pour obtenir les données d'un utilisateur par son code
export const getUserData = (userCode) => {
  return usersDatabase[userCode] || null;
};

// Fonction pour obtenir le RIB d'un utilisateur
export const getUserRIB = (userCode) => {
  const userData = getUserData(userCode);
  return userData ? userData.compteInfo : null;
};

// Fonction pour obtenir les transactions d'un utilisateur
export const getUserTransactions = (userCode) => {
  const userData = getUserData(userCode);
  return userData ? userData.transactions : [];
};

// Fonction pour calculer le solde d'un utilisateur
export const calculateUserSolde = (userCode) => {
  const transactions = getUserTransactions(userCode);
  let total = 0;
  
  transactions.forEach(t => {
    if (t.credit) {
      const creditValue = t.credit.replace(/,/g, '').replace(/ /g, '');
      total += parseFloat(creditValue);
    }
    if (t.debit) {
      const debitValue = t.debit.replace(/,/g, '').replace(/ /g, '');
      total -= parseFloat(debitValue);
    }
  });
  
  return total.toFixed(2);
};