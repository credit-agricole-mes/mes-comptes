import React, { createContext, useContext, useState, useEffect } from 'react';
import UserService from '../services/UserService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ VÉRIFICATION AU CHARGEMENT - CORRIGÉE
  useEffect(() => {
    const initAuth = async () => {
      console.log('🚀 DÉBUT INIT AUTH');
      
      try {
        setIsLoading(true);
        
        // Initialiser les utilisateurs
        console.log('📦 Initialisation UserService...');
        await UserService.initializeUsers();
        console.log('✅ UserService initialisé');
        
        // ✅ Récupérer depuis localStorage
        console.log('🔍 Recherche session dans localStorage...');
        const storedData = localStorage.getItem('currentUser');
        
        if (storedData) {
          console.log('📦 Session trouvée dans localStorage');
          
          try {
            const storedUser = JSON.parse(storedData);
            console.log('✅ User parsé:', storedUser.nom);
            
            // ✅ FORCER le rechargement depuis bankUsers pour avoir les données à jour
            const bankUsers = JSON.parse(localStorage.getItem('bankUsers') || '[]');
            const freshUser = bankUsers.find(u => u.code === storedUser.code);
            
            if (freshUser) {
              console.log('✅ SESSION RESTAURÉE');
              console.log('👤 Nom:', freshUser.nom);
              console.log('💰 Solde:', freshUser.solde);
              console.log('📋 Virements:', freshUser.virements?.length || 0);
              console.log('📋 Transactions:', freshUser.transactions?.length || 0);
              
              setUser(freshUser);
              setIsAuthenticated(true);
              
              // ✅ Mettre à jour currentUser avec les données fraîches
              localStorage.setItem('currentUser', JSON.stringify(freshUser));
            } else {
              console.log('❌ Utilisateur introuvable dans bankUsers');
              localStorage.removeItem('currentUser');
            }
          } catch (parseError) {
            console.error('❌ Erreur parsing JSON:', parseError);
            localStorage.removeItem('currentUser');
          }
        } else {
          console.log('ℹ️ Pas de session dans localStorage');
        }
        
      } catch (error) {
        console.error('❌ Erreur init:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        console.log('🏁 FIN INIT');
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData) => {
    console.log('🔐 LOGIN:', userData.nom);
    console.log('💰 Solde:', userData.solde);
    console.log('📋 Virements:', userData.virements?.length || 0);
    console.log('📋 Transactions:', userData.transactions?.length || 0);
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // ✅ Sauvegarder dans localStorage
    try {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('✅ Session sauvegardée dans localStorage');
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
    }
  };

  const logout = async () => {
    console.log('🚪 LOGOUT');
    setUser(null);
    setIsAuthenticated(false);
    
    // ✅ Supprimer de localStorage
    try {
      localStorage.removeItem('currentUser');
      console.log('✅ Session supprimée');
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    }
  };

  const updateUser = async (updatedData) => {
    console.log('🔄 UPDATE USER:', updatedData.nom);
    console.log('💰 Nouveau solde:', updatedData.solde);
    console.log('📋 Virements:', updatedData.virements?.length || 0);
    console.log('📋 Transactions:', updatedData.transactions?.length || 0);
    
    setUser(updatedData);
    setIsAuthenticated(true);
    
    // ✅ Mettre à jour localStorage (currentUser ET bankUsers)
    try {
      // Mise à jour currentUser
      localStorage.setItem('currentUser', JSON.stringify(updatedData));
      console.log('✅ currentUser mis à jour');
      
      // Mise à jour bankUsers
      const users = JSON.parse(localStorage.getItem('bankUsers') || '[]');
      const userIndex = users.findIndex(u => u.code === updatedData.code);
      if (userIndex !== -1) {
        users[userIndex] = updatedData;
        localStorage.setItem('bankUsers', JSON.stringify(users));
        console.log('✅ bankUsers mis à jour');
      }
    } catch (error) {
      console.error('❌ Erreur update:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};