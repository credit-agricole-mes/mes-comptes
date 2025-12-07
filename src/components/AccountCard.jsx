import { X, Menu, Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountCard({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [notificationRead, setNotificationRead] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleNotificationClick = () => {
    setNotificationRead(true);
    handleNavigate('/notifications');
  };

  const handleLogout = () => {
    setMenuOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <>
      <div className="bg-green-500 rounded-bl-3xl rounded-br-3xl z-50">
        <div className="flex justify-between items-start px-4 sm:px-20 pt-4 pb-32">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="images/logo-transparent.png" 
              alt="Logo" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          <div className="flex items-center gap-6">
            {user?.notification && (
              <button 
                className="relative cursor-pointer hover:opacity-80 transition"
                onClick={handleNotificationClick}
              >
                <Bell className="text-white w-6 h-6" />
                {!notificationRead && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </span>
                )}
              </button>
            )}

            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white md:hidden w-10 h-10 flex items-center justify-center"
            >
              {menuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>

            <button 
              onClick={handleLogout}
              className="hidden md:block bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-6 rounded-lg transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-100 md:hidden pointer-events-none">
          <div className="bg-white w-64 h-full ml-auto p-4 shadow-2xl overflow-y-auto pointer-events-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <X size={24} className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <nav className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Compte</h3>
                <div className="space-y-2">
                  <button onClick={() => handleNavigate('/')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    🏠 Accueil
                  </button>
                  <button onClick={() => handleNavigate('/profil')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    👤 Mon profil
                  </button>
                  <button onClick={() => handleNavigate('/cartes')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    💳 Mes cartes
                  </button>
                  <button onClick={() => handleNavigate('/documents')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    📄 Mes documents
                  </button>
                  <button onClick={() => handleNavigate('/rib')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    🧾 RIB
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Transactions</h3>
                <div className="space-y-2">
                  <button onClick={() => handleNavigate('/transactions')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    📊 Mes transactions
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed">
                    💸 Virements <span className="text-xs">(bloqué)</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed">
                    💰 Dépôts <span className="text-xs">(bloqué)</span>
                  </button>
                  <button onClick={() => handleNavigate('/overdraft')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    📈 Mes découverts
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Outils</h3>
                <div className="space-y-2">
                  <button onClick={() => handleNavigate('/calculator')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    🧮 Calculateur d'épargne
                  </button>
                  <button onClick={() => handleNavigate('/loan')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    💵 Simulation de prêt
                  </button>
                  <button onClick={() => handleNavigate('/expenses')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    📉 Comparaison de dépenses
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Paramètres</h3>
                <div className="space-y-2">
                  <button onClick={() => handleNavigate('/settings')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    ⚙️ Paramètres
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    💬 Aide & Support
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium">
                    ℹ️ À propos
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                >
                  🚪 Déconnexion
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <div className="-mt-20 px-4 z-60 relative">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl mx-auto relative">
          {/* La bannière peut être fermée indépendamment */}
          {user?.notification && showBanner && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-200 text-blue-800 rounded-lg p-4 flex items-start gap-3">
              <div className="mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{user.notification}</p>
              </div>
              <button
                onClick={() => {
                  setShowBanner(false);
                  setNotificationRead(true);
                }}
                className="hover:opacity-70 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl text-gray-700 text-center mb-4 sm:mb-6">Informations du compte</h2>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
            {user?.nom || "Nom d'utilisateur"}
          </h1>

          <div className="text-4xl sm:text-5xl font-bold text-green-400 text-center mb-6 sm:mb-8">
            {user?.solde !== undefined && user?.solde !== null 
              ? user.solde.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €' 
              : '0,00 €'}
          </div>

          <div className="text-red-600 text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6">
            Compte temporairement bloqué !
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => handleNavigate('/assistant')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl text-lg sm:text-xl shadow-lg transition"
            >
              Assistant virtuel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}