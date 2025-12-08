import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserService from "./services/UserService";
import AccountCard from "./components/AccountCard";
import ActionGrid from "./components/ActionGrid";
import LoginPage from "./components/LoginPage";
import TransactionsPage from "./components/TransactionsPage";
import CartesPromoPage from "./components/CartesPromoPage";
import DownloadSection from "./components/DownloadSection";
import Footer from "./components/Footer";
import Virements from "./components/Virements";
import Depots from "./components/Depots";
import Profil from "./components/Profil";
import GestionCartes from "./components/GestionCartes";
import GestionDocument from "./components/GestionDocument";
import TransactionsDownload from "./components/TransactionsDownload";
import RibPage from "./components/RibPage";
import LoadingScreen from "./components/LoadingScreen";

// Import des pages de compte bloqué
import ExpensesPage from "./components/ExpensesPage";
import SavingsPage from "./components/SavingsPage";
import BeneficiariesPage from "./components/BeneficiariesPage";
import LimitsPage from "./components/LimitsPage";
import LoanPage from "./components/LoanPage";
import CalculatorPage from "./components/CalculatorPage";

// Import des nouvelles pages
import SettingsPage from "./components/SettingsPage";
import OverdraftPage from "./components/OverdraftPage";
import AssistantPage from "./components/AssistantPage";
import NotificationsPage from "./components/NotificationsPage";

// Composant pour la page d'accueil
function HomePage({ user }) {
  return (
    <>
      <div className="px-4 pb-6">
        <TransactionsPage />
      </div>
      <div className="pb-6">
        <CartesPromoPage />
      </div>
      <div className="pb-6">
        <DownloadSection />
      </div>
      <div className="pb-6">
        <Footer />
      </div>
    </>
  );
}

// Composant wrapper pour les pages avec bouton retour
function PageWithBack({ children }) {
  return (
    <div className="min-h-screen m-0 p-0 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <button 
          onClick={() => window.history.back()}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Retour
        </button>
      </div>
      {children}
    </div>
  );
}

// Composant qui gère le contenu avec Router
function AppContent({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen m-0 p-0 bg-gray-50">
      {/* Afficher AccountCard et ActionGrid UNIQUEMENT sur la page d'accueil */}
      {isHomePage && (
        <>
          <AccountCard user={user} onLogout={onLogout} />
          <ActionGrid onLogout={onLogout} />
        </>
      )}
      
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/virements" element={<PageWithBack><Virements /></PageWithBack>} />
        <Route path="/depots" element={<PageWithBack><Depots /></PageWithBack>} />
        <Route path="/profil" element={<PageWithBack><Profil user={user} /></PageWithBack>} />
        <Route path="/cartes" element={<PageWithBack><GestionCartes /></PageWithBack>} />
        <Route path="/documents" element={<PageWithBack><GestionDocument /></PageWithBack>} />
        <Route path="/transactions" element={<PageWithBack><TransactionsDownload /></PageWithBack>} />
        <Route path="/rib" element={<PageWithBack><RibPage /></PageWithBack>} />
        <Route path="/expenses" element={<PageWithBack><ExpensesPage /></PageWithBack>} />
        <Route path="/savings" element={<PageWithBack><SavingsPage /></PageWithBack>} />
        <Route path="/beneficiaries" element={<PageWithBack><BeneficiariesPage /></PageWithBack>} />
        <Route path="/limits" element={<PageWithBack><LimitsPage /></PageWithBack>} />
        <Route path="/loan" element={<PageWithBack><LoanPage /></PageWithBack>} />
        <Route path="/calculator" element={<PageWithBack><CalculatorPage /></PageWithBack>} />
        <Route path="/settings" element={<PageWithBack><SettingsPage /></PageWithBack>} />
        <Route path="/overdraft" element={<PageWithBack><OverdraftPage /></PageWithBack>} />
        <Route path="/assistant" element={<AssistantPage onBack={() => navigate('/')} />} />
        <Route path="/notifications" element={<PageWithBack><NotificationsPage /></PageWithBack>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// ✅ ÉCRAN "SESSION EXPIRÉE" SANS RECHARGEMENT
function SessionExpiredScreen({ onReturn }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center animate-fade-in">
        <div className="text-7xl mb-6">🔒</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Session expirée
        </h2>
        <p className="text-gray-600 mb-3 text-lg">
          Votre code d'accès a été modifié.
        </p>
        <p className="text-gray-500 mb-8">
          Veuillez vous reconnecter avec votre nouveau code.
        </p>
        <button
          onClick={onReturn}
          className="w-full bg-green-700 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-800 transition duration-200 text-lg"
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  );
}

// Wrapper interne pour gérer l'authentification
function AppWrapper() {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  // ✅ VÉRIFICATION PÉRIODIQUE CRITIQUE - Détecte les changements de code
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    console.log('🔍 Démarrage vérification périodique...');

    const checkValidity = () => {
      console.log('🔍 Vérification validité code utilisateur...');
      const validation = UserService.checkCurrentUserValidity();
      
      if (validation.shouldLogout) {
        console.log('⚠️ CODE INVALIDE DÉTECTÉ - Déconnexion immédiate');
        setShowSessionExpired(true);
        logout();
      } else if (validation.valid && validation.user) {
        console.log('✅ Code valide');
      }
    };

    // Vérification immédiate au montage
    checkValidity();

    // ✅ Vérification toutes les 2 secondes
    const interval = setInterval(checkValidity, 2000);

    return () => {
      console.log('🛑 Arrêt vérification périodique');
      clearInterval(interval);
    };
  }, [isAuthenticated, user, logout]);

  const handleLogout = () => {
    console.log('🚪 Déconnexion manuelle');
    logout();
  };

  const handleReturnToLogin = () => {
    console.log('🔄 Retour à la page de connexion');
    setShowSessionExpired(false);
    logout();
  };

  // ✅ Afficher un écran de chargement pendant la vérification de la session
  if (isLoading) {
    return <LoadingScreen />;
  }

  // ✅ ÉCRAN SESSION EXPIRÉE (SANS RECHARGEMENT)
  if (showSessionExpired) {
    return <SessionExpiredScreen onReturn={handleReturnToLogin} />;
  }

  // ✅ Afficher la page de login si non authentifié
  if (!isAuthenticated || !user) {
    return <LoginPage onLogin={() => {}} />;
  }

  return (
    <Router>
      <AppContent 
        user={user} 
        onLogout={handleLogout}
      />
    </Router>
  );
}

// Composant principal avec AuthProvider
export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // ✅ Réduction du temps de chargement initial à 800ms
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}