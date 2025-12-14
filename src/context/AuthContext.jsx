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

  // ✅ VÉRIFICATION AU CHARGEMENT - avec localStorage
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
            
            // Vérifier que l'utilisateur existe toujours dans la base
            const freshUser = await UserService.getUserByCode(storedUser.code);
            
            if (freshUser) {
              console.log('✅ SESSION RESTAURÉE');
              console.log('👤 Nom:', freshUser.nom);
              console.log('💰 Solde:', freshUser.solde);
              setUser(freshUser);
              setIsAuthenticated(true);
            } else {
              console.log('❌ Utilisateur introuvable dans la base');
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
    console.log('🔄 UPDATE:', updatedData.nom);
    console.log('💰 Nouveau solde:', updatedData.solde);
    
    setUser(updatedData);
    setIsAuthenticated(true);
    
    // ✅ Mettre à jour localStorage
    try {
      localStorage.setItem('currentUser', JSON.stringify(updatedData));
      console.log('✅ Session mise à jour');
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