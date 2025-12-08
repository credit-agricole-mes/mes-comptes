// Fichier: src/context/AuthContext.jsx
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

  // ✅ VÉRIFICATION AU CHARGEMENT
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('📱 Restauration session:', parsedUser.nom);
          console.log('💰 Solde stocké:', parsedUser.solde);
          console.log('🔑 Code stocké:', parsedUser.code);
          
          // ✅ Vérifier que l'utilisateur existe encore
          const validation = UserService.checkCurrentUserValidity();
          
          if (validation.valid && validation.user) {
            console.log('✅ SESSION VALIDE - Connexion automatique');
            console.log('💰 Solde actuel:', validation.user.solde, '€');
            setUser(validation.user);
            setIsAuthenticated(true);
          } else if (validation.shouldLogout) {
            console.log('❌ CODE OBSOLÈTE - Déconnexion');
            console.log('💡 Raison:', validation.message || 'Code utilisateur introuvable');
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('currentUser');
          } else {
            console.log('❌ Session expirée');
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('currentUser');
          }
        } else {
          console.log('ℹ️ Pas de session sauvegardée');
        }
      } catch (error) {
        console.error('❌ Erreur restauration:', error);
        localStorage.removeItem('currentUser');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔍 Synchroniser avec les changements de localStorage (autre onglet)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'currentUser') {
        if (e.newValue) {
          try {
            const newUser = JSON.parse(e.newValue);
            console.log('🔄 Mise à jour depuis autre onglet:', newUser.nom);
            setUser(newUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Erreur parsing storage:', error);
          }
        } else {
          console.log('🚪 Déconnexion depuis autre onglet');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      // ✅ Détecter les changements de version dans un autre onglet
      if (e.key === 'dataVersion') {
        console.log('🔄 Version changée dans un autre onglet');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData) => {
    console.log('✅ CONNEXION:', userData.nom);
    console.log('💰 Solde:', userData.solde, '€');
    console.log('🔑 Code:', userData.code);
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('🚪 DÉCONNEXION');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedData) => {
    console.log('🔄 UPDATE USER:', updatedData.nom);
    console.log('💰 Nouveau solde:', updatedData.solde, '€');
    
    setUser(updatedData);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(updatedData));
  };

  // 🔍 DEBUG - Logger à chaque changement
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