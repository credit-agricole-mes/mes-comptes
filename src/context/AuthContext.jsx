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

  // Vérification au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Initialiser les utilisateurs
        await UserService.initializeUsers();
        
        // Vérifier s'il y a une session
        const validation = await UserService.checkCurrentUserValidity();
        
        if (validation.valid && validation.user) {
          console.log('✅ SESSION VALIDE - Connexion automatique');
          console.log('👤 Utilisateur:', validation.user.nom);
          console.log('💰 Solde:', validation.user.solde, '€');
          setUser(validation.user);
          setIsAuthenticated(true);
        } else if (validation.shouldLogout) {
          console.log('❌ Session expirée');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          console.log('ℹ️ Pas de session sauvegardée');
        }
      } catch (error) {
        console.error('❌ Erreur restauration:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData) => {
    console.log('✅ CONNEXION:', userData.nom);
    console.log('💰 Solde:', userData.solde, '€');
    console.log('🔑 Code:', userData.code);
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // Sauvegarder dans le storage
    try {
      await window.storage.set('currentUser', JSON.stringify(userData));
    } catch (error) {
      console.error('Erreur sauvegarde session:', error);
    }
  };

  const logout = async () => {
    console.log('🚪 DÉCONNEXION');
    setUser(null);
    setIsAuthenticated(false);
    
    // Supprimer du storage
    try {
      await window.storage.delete('currentUser');
    } catch (error) {
      console.error('Erreur suppression session:', error);
    }
  };

  const updateUser = async (updatedData) => {
    console.log('🔄 UPDATE USER:', updatedData.nom);
    console.log('💰 Nouveau solde:', updatedData.solde, '€');
    
    setUser(updatedData);
    setIsAuthenticated(true);
    
    // Mettre à jour dans le storage
    try {
      await window.storage.set('currentUser', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Erreur update session:', error);
    }
  };

  // Logger les changements d'état
  useEffect(() => {
    if (user) {
      console.log('👤 STATE USER:', user.nom);
      console.log('💰 STATE SOLDE:', user.solde);
      console.log('🔑 STATE CODE:', user.code);
    } else {
      console.log('❌ Pas d\'utilisateur connecté');
    }
  }, [user]);

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