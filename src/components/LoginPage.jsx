import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserService from "../services/UserService";

export default function LoginPage({ onLogin }) {
  const { login } = useAuth();
  const [identifiant, setIdentifiant] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    
    if (!identifiant) {
      setError("Veuillez saisir votre identifiant");
      return;
    }

    if (identifiant.length !== 11) {
      setError("L'identifiant doit contenir 11 chiffres");
      return;
    }

    // ✅ Connexion SANS mot de passe - uniquement avec l'identifiant
    const result = UserService.loginUser(identifiant);
    
    if (result.success) {
      const userData = {
        code: identifiant,
        nom: result.user.nom,
        solde: result.user.solde,
        email: result.user.email,
        telephone: result.user.telephone,
        adresse: result.user.adresse,
        notification: result.user.notification || null,
        conseiller: result.user.conseiller,
        numeroCompte: result.user.numeroCompte,
        iban: result.user.iban,
        bic: result.user.bic,
        agence: result.user.agence,
        dateOuverture: result.user.dateOuverture,
        notaire: result.user.notaire
      };
      
      // ✅ Appeler login du contexte pour sauvegarder dans localStorage
      login(identifiant, "", userData);
      
      // ✅ Appeler onLogin pour mettre à jour l'état de App
      onLogin(userData);
    } else {
      setError("Identifiant incorrect");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setIdentifiant(value);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header avec logo */}
      <div className="bg-white py-6 px-4 text-center border-b">
        <div className="flex justify-center mb-2">
          <img 
            src="/images/logo-transparent.png" 
            alt="Crédit Agricole" 
            className="h-20 w-auto object-contain"
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Accéder à mes comptes
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Champ identifiant */}
            <div>
              <label className="block text-gray-700 font-medium mb-3 text-base">
                Identifiant
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Saisissez votre identifiant à 11 chiffres
              </p>
              <input
                type="tel"
                inputMode="numeric"
                value={identifiant}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Exemple 23654578121"
                maxLength="11"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-green-600 focus:ring-0"
              />
            </div>

            {/* Bouton de connexion */}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-700 text-white py-4 rounded-lg font-semibold text-base hover:bg-green-800 transition duration-200 uppercase tracking-wide"
            >
              Entrer mon code personnel
            </button>

            {/* Lien "pas encore client" */}
            <div className="text-center pt-4">
              <p className="text-gray-700 mb-4">Vous n'êtes pas encore client ?</p>
              <button
                className="w-full bg-green-700 text-white py-4 rounded-lg font-semibold text-base hover:bg-green-800 transition duration-200 uppercase tracking-wide"
              >
                Devenir client
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer avec sections */}
      <div className="bg-white py-6 px-4 text-center border-t">
        <div className="flex justify-center mb-4">
          <img 
            src="/images/logo-transparent.png" 
            alt="Crédit Agricole" 
            className="h-12 w-auto object-contain"
          />
        </div>
        
        <div className="space-y-2 mb-6">
          <h2 className="font-bold text-lg text-gray-900">Pour vous connecter</h2>
          <p className="text-sm text-gray-600 px-4">
            Saisissez votre identifiant (numéro de compte ou numéro de contrat CAEL) et votre code personnel habituels.
          </p>
          <a href="#" className="text-green-700 font-medium text-sm inline-block mt-2">
            Code perdu / oublié ?
          </a>
        </div>

        {/* Section Sécurité */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-bold text-base text-gray-900 mb-2">Sécurité</h3>
          <p className="text-sm text-gray-600 mb-3">
            Restez vigilants et veillez à protéger vos données personnelles.
          </p>
          <a href="#" className="text-green-700 font-medium text-sm inline-block">
            Consultez nos conseils de sécurité
          </a>
        </div>

        {/* Section Votre espace fidélité */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-bold text-base text-gray-900 mb-4">Votre espace fidélité</h3>
          <p className="text-sm text-gray-600 mb-4">
            Cliquez sur l'image pour participer.
          </p>
          
          {/* Image promotionnelle */}
          <div className="flex justify-center">
            <div className="rounded-lg overflow-hidden max-w-md shadow-lg">
              <img 
                src="images/logo j.jpg" 
                alt="Programme fidélité" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}