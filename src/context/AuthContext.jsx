// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userCode, setUserCode] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ CHARGEMENT AU DÉMARRAGE depuis localStorage
  useEffect(() => {
    console.log('🔄 Vérification de la session...');
    const savedAuth = localStorage.getItem('authData');
    
    if (savedAuth) {
      try {
        const { code, userData } = JSON.parse(savedAuth);
        console.log('✅ Session restaurée:', code, userData.nom);
        setIsAuthenticated(true);
        setUserCode(code);
        setUser(userData);
      } catch (error) {
        console.error('❌ Erreur restauration session:', error);
        localStorage.removeItem('authData');
      }
    } else {
      console.log('ℹ️ Aucune session sauvegardée');
    }
    
    setIsLoading(false);
  }, []);

  // ✅ LOGIN avec sauvegarde dans localStorage
  const login = (code, _password, userData) => {
    console.log('✅ Login:', code, userData.nom);
    
    // Sauvegarder dans localStorage
    const authData = {
      code,
      userData
    };
    localStorage.setItem('authData', JSON.stringify(authData));
    console.log('💾 Session sauvegardée dans localStorage');
    
    setIsAuthenticated(true);
    setUserCode(code);
    setUser(userData);
  };

  // ✅ LOGOUT avec suppression du localStorage
  const logout = () => {
    console.log('🚪 Déconnexion...');
    localStorage.removeItem('authData');
    console.log('🗑️ Session supprimée du localStorage');
    
    setIsAuthenticated(false);
    setUserCode(null);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    userCode,
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};