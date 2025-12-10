import React, { useState } from 'react';
import { Shield, Bell, Palette, Lock, Smartphone, Mail, Globe, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // ✅ Import ajouté
import CurrencySelector from './CurrencySelector'; // ✅ Import ajouté

const SettingsPage = () => {
  const { user, updateUser } = useAuth(); // ✅ Récupération user et updateUser
  const [expandedSection, setExpandedSection] = useState(null);
  
  const [settings, setSettings] = useState({
    // Sécurité
    twoFactorAuth: false,
    biometricAuth: true,
    
    // Préférences
    language: 'fr',
    theme: 'light',
    
    // Notifications
    emailNotif: true,
    smsNotif: false,
    pushNotif: true,
    securityAlert: true
  });

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // ✅ Fonction pour changer la devise
  const handleCurrencyChange = async (newCurrency, newSymbol) => {
    try {
      console.log('🔄 Changement de devise:', newCurrency, newSymbol);
      
      // 1. Mettre à jour l'utilisateur local
      const updatedUser = {
        ...user,
        devise: newCurrency,
        symboleDevise: newSymbol
      };
      
      // 2. Mettre à jour dans le storage (bankUsers)
      const result = await window.storage.get('bankUsers');
      if (result) {
        const users = JSON.parse(result.value);
        const userIndex = users.findIndex(u => u.code === user.code);
        
        if (userIndex !== -1) {
          users[userIndex].devise = newCurrency;
          users[userIndex].symboleDevise = newSymbol;
          await window.storage.set('bankUsers', JSON.stringify(users));
          console.log('✅ Devise mise à jour dans bankUsers');
        }
      }
      
      // 3. Mettre à jour le contexte auth
      updateUser(updatedUser);
      console.log('✅ Devise changée avec succès !');
      
    } catch (error) {
      console.error('❌ Erreur changement devise:', error);
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">⚙️ Paramètres</h1>

        {/* Alerte compte bloqué */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <p className="text-red-800 font-semibold">
            🔒 Compte bloqué
          </p>
          <p className="text-red-700 text-sm mt-1">
            Certaines fonctionnalités sont limitées. Débloquez votre compte pour accéder à toutes les options.
          </p>
        </div>

        {/* ✅ NOUVEAU : Sélecteur de devise */}
        <div className="mb-6">
          <CurrencySelector 
            currentCurrency={user?.devise || 'EUR'}
            currentSymbol={user?.symboleDevise || '€'}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        {/* Sécurité et Confidentialité */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <button
            onClick={() => toggleSection('security')}
            className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              <Shield className="mr-3 text-blue-600" size={24} />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Sécurité et Confidentialité</h2>
            </div>
            {expandedSection === 'security' ? (
              <ChevronUp className="text-gray-600" size={24} />
            ) : (
              <ChevronDown className="text-gray-600" size={24} />
            )}
          </button>

          {expandedSection === 'security' && (
            <div className="p-4 sm:p-6 border-t space-y-4">
              {/* Mot de passe */}
              <div className="border-b pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <Lock className="mr-3 text-gray-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Mot de passe</p>
                      <p className="text-sm text-gray-500">Dernière modification il y a 45 jours</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                    Modifier
                  </button>
                </div>
              </div>

              {/* Code PIN - Bloqué */}
              <div className="border-b pb-4 opacity-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <Smartphone className="mr-3 text-gray-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Code PIN</p>
                      <p className="text-sm text-gray-500">Code à 4 chiffres pour l'application</p>
                      <p className="text-xs text-red-600 mt-1">🔒 Débloquez votre compte pour activer</p>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed text-sm font-semibold">
                    Configurer
                  </button>
                </div>
              </div>

              {/* Authentification à deux facteurs - Bloqué */}
              <div className="border-b pb-4 opacity-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <Shield className="mr-3 text-gray-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Authentification à deux facteurs (2FA)</p>
                      <p className="text-sm text-gray-500">Sécurité renforcée pour vos connexions</p>
                      <p className="text-xs text-red-600 mt-1">🔒 Débloquez votre compte pour activer</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed ml-4">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      disabled
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              {/* Authentification biométrique */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <Smartphone className="mr-3 text-gray-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Authentification biométrique</p>
                      <p className="text-sm text-gray-500">Empreinte digitale ou reconnaissance faciale</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.biometricAuth}
                      onChange={() => toggleSetting('biometricAuth')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Préférences de l'application */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <button
            onClick={() => toggleSection('preferences')}
            className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              <Palette className="mr-3 text-purple-600" size={24} />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Préférences de l'application</h2>
            </div>
            {expandedSection === 'preferences' ? (
              <ChevronUp className="text-gray-600" size={24} />
            ) : (
              <ChevronDown className="text-gray-600" size={24} />
            )}
          </button>

          {expandedSection === 'preferences' && (
            <div className="p-4 sm:p-6 border-t space-y-4">
              {/* Langue */}
              <div className="border-b pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <Globe className="mr-3 text-gray-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Langue</p>
                      <p className="text-sm text-gray-500">Langue de l'interface</p>
                    </div>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  >
                    <option value="fr">🇫🇷 Français</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="pt">🇵🇹 Português</option>
                    <option value="nl">🇳🇱 Nederlands</option>
                    <option value="pl">🇵🇱 Polski</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="ar">🇸🇦 العربية</option>
                    <option value="zh">🇨🇳 中文</option>
                    <option value="ja">🇯🇵 日本語</option>
                  </select>
                </div>
              </div>

              {/* Thème */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    {settings.theme === 'light' ? (
                      <Sun className="mr-3 text-gray-600" size={20} />
                    ) : (
                      <Moon className="mr-3 text-gray-600" size={20} />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">Thème</p>
                      <p className="text-sm text-gray-500">Apparence de l'application</p>
                    </div>
                  </div>
                  <select
                    value={settings.theme}
                    onChange={(e) => updateSetting('theme', e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  >
                    <option value="light">☀️ Clair</option>
                    <option value="dark">🌙 Sombre</option>
                    <option value="auto">🔄 Automatique</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications et Alertes */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <button
            onClick={() => toggleSection('notifications')}
            className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              <Bell className="mr-3 text-orange-600" size={24} />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Notifications et Alertes</h2>
            </div>
            {expandedSection === 'notifications' ? (
              <ChevronUp className="text-gray-600" size={24} />
            ) : (
              <ChevronDown className="text-gray-600" size={24} />
            )}
          </button>

          {expandedSection === 'notifications' && (
            <div className="p-4 sm:p-6 border-t space-y-4">
              {/* Email */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <Mail className="mr-3 text-gray-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Notifications par email</p>
                      <p className="text-sm text-gray-500">Recevoir les alertes par email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.emailNotif}
                      onChange={() => toggleSetting('emailNotif')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>

              {/* SMS */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <Smartphone className="mr-3 text-gray-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Notifications par SMS</p>
                      <p className="text-sm text-gray-500">Recevoir les alertes par SMS</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.smsNotif}
                      onChange={() => toggleSetting('smsNotif')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>

              {/* Push */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <Bell className="mr-3 text-gray-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Notifications push</p>
                      <p className="text-sm text-gray-500">Notifications sur votre appareil</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.pushNotif}
                      onChange={() => toggleSetting('pushNotif')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
              </div>

              {/* Alerte sécurité */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center flex-1">
                    <Shield className="mr-3 text-gray-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-800">Alertes de sécurité</p>
                      <p className="text-sm text-gray-500">Tentatives de connexion suspectes</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.securityAlert}
                      onChange={() => toggleSetting('securityAlert')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                {settings.securityAlert && (
                  <div className="ml-8 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Message type :</strong> "Tentative de connexion détectée depuis un nouvel appareil le [date] à [heure]. Si ce n'est pas vous, changez immédiatement votre mot de passe."
                    </p>
                  </div>
                )}
              </div>

              {/* Bouton de sauvegarde dans les notifications */}
              <div className="pt-2">
                <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
                  💾 Sauvegarder les modifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;