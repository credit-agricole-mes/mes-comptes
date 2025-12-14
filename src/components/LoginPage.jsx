import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserService from "../services/UserService";

export default function LoginPage({ onLogin }) {
  const { login } = useAuth();
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [showPasswordPage, setShowPasswordPage] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  
  // États pour le formulaire d'inscription
  const [signupData, setSignupData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    email: "",
    adresse: "",
    ville: "",
    codePostal: "",
    motDePasse: "",
    confirmMotDePasse: ""
  });
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const handleIdentifiantSubmit = async () => {
    setError("");
    
    if (!identifiant) {
      setError("Veuillez saisir votre identifiant");
      return;
    }

    if (identifiant.length !== 11) {
      setError("L'identifiant doit contenir 11 chiffres");
      return;
    }

    // Vérifier si l'identifiant existe
    const result = await UserService.loginUser(identifiant);
    
    if (!result.success) {
      setError("Identifiant incorrect");
      return;
    }

    console.log('✅ Identifiant validé:', identifiant);
    // Passer à la page du mot de passe
    setShowPasswordPage(true);
  };

  const handlePasswordSubmit = async () => {
    setError("");
    
    if (!motDePasse) {
      setError("Veuillez saisir votre mot de passe");
      return;
    }

    if (motDePasse.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    console.log('🔐 Vérification connexion avec:', identifiant);

    // Récupérer l'utilisateur
    const result = await UserService.loginUser(identifiant);
    
    if (!result.success) {
      setError("Erreur de connexion");
      return;
    }

    const userData = result.user;

    // Vérifier le mot de passe
    // Si l'utilisateur n'a pas de mot de passe enregistré, on accepte n'importe quel mot de passe de 6+ caractères
    // Sinon, on vérifie que ça correspond
    if (userData.motDePasse && userData.motDePasse !== motDePasse) {
      setError("Mot de passe incorrect");
      return;
    }

    console.log('✅ Données utilisateur reçues:', userData);
    console.log('💰 Solde reçu:', userData.solde);
    
    login(userData);
    
    if (onLogin) {
      onLogin(userData);
    }
    
    console.log('✅ Connexion terminée');
  };

  const handleKeyPressIdentifiant = (e) => {
    if (e.key === 'Enter') {
      handleIdentifiantSubmit();
    }
  };

  const handleKeyPressPassword = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setIdentifiant(value);
    }
  };

  const handleBackToIdentifiant = () => {
    setShowPasswordPage(false);
    setMotDePasse("");
    setError("");
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupSubmit = async () => {
    setSignupError("");
    setSignupSuccess("");

    // Validation des champs
    if (!signupData.nom || !signupData.prenom || !signupData.dateNaissance || 
        !signupData.telephone || !signupData.email || !signupData.motDePasse || 
        !signupData.confirmMotDePasse) {
      setSignupError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setSignupError("Veuillez saisir une adresse email valide");
      return;
    }

    // Validation téléphone (10 chiffres)
    if (signupData.telephone.replace(/\D/g, '').length !== 10) {
      setSignupError("Le numéro de téléphone doit contenir 10 chiffres");
      return;
    }

    // Validation mot de passe
    if (signupData.motDePasse.length < 6) {
      setSignupError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (signupData.motDePasse !== signupData.confirmMotDePasse) {
      setSignupError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      console.log('📝 Données d\'inscription:', signupData);
      
      // Simulation de succès
      setSignupSuccess("Votre demande a été enregistrée avec succès ! Un conseiller vous contactera sous 48h pour finaliser l'ouverture de votre compte.");
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setShowSignupForm(false);
        setSignupData({
          nom: "",
          prenom: "",
          dateNaissance: "",
          telephone: "",
          email: "",
          adresse: "",
          ville: "",
          codePostal: "",
          motDePasse: "",
          confirmMotDePasse: ""
        });
        setSignupSuccess("");
      }, 3000);
      
    } catch (error) {
      setSignupError("Une erreur s'est produite. Veuillez réessayer.");
      console.error('Erreur inscription:', error);
    }
  };

  // Affichage du formulaire d'inscription
  if (showSignupForm) {
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

        {/* Formulaire d'inscription */}
        <div className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setShowSignupForm(false)}
              className="text-green-700 mb-4 flex items-center gap-2 hover:underline"
            >
              ← Retour à la connexion
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Devenir client
            </h1>
            <p className="text-gray-600 mb-6 text-sm">
              Remplissez le formulaire ci-dessous pour ouvrir un compte
            </p>

            {signupError && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {signupError}
              </div>
            )}

            {signupSuccess && (
              <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {signupSuccess}
              </div>
            )}

            <div className="space-y-5">
              {/* Nom */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Nom <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={signupData.nom}
                  onChange={handleSignupInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Prénom <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={signupData.prenom}
                  onChange={handleSignupInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              {/* Date de naissance */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Date de naissance <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={signupData.dateNaissance}
                  onChange={handleSignupInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Téléphone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={signupData.telephone}
                  onChange={handleSignupInputChange}
                  placeholder="0612345678"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupInputChange}
                  placeholder="exemple@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Mot de passe <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="motDePasse"
                  value={signupData.motDePasse}
                  onChange={handleSignupInputChange}
                  placeholder="Minimum 6 caractères"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Confirmer le mot de passe <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="confirmMotDePasse"
                  value={signupData.confirmMotDePasse}
                  onChange={handleSignupInputChange}
                  placeholder="Retapez votre mot de passe"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Adresse
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={signupData.adresse}
                  onChange={handleSignupInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              {/* Ville et Code postal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="ville"
                    value={signupData.ville}
                    onChange={handleSignupInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="codePostal"
                    value={signupData.codePostal}
                    onChange={handleSignupInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleSignupSubmit}
                  className="w-full bg-green-700 text-white py-4 rounded-lg font-semibold text-base hover:bg-green-800 transition duration-200 uppercase tracking-wide"
                >
                  Soumettre ma demande
                </button>
                <button
                  onClick={() => setShowSignupForm(false)}
                  className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-base hover:bg-gray-300 transition duration-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de la page du mot de passe
  if (showPasswordPage) {
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

        {/* Contenu principal - Mot de passe */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleBackToIdentifiant}
              className="text-green-700 mb-4 flex items-center gap-2 hover:underline"
            >
              ← Retour
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Code personnel
            </h1>
            <p className="text-gray-600 mb-8 text-sm">
              Identifiant : <span className="font-semibold">{identifiant}</span>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Champ mot de passe */}
              <div>
                <label className="block text-gray-700 font-medium mb-3 text-base">
                  Code personnel
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Saisissez votre code personnel (mot de passe)
                </p>
                <input
                  type="password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  onKeyPress={handleKeyPressPassword}
                  placeholder="••••••••"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-green-600 focus:ring-0"
                  autoFocus
                />
              </div>

              {/* Bouton de connexion */}
              <button
                onClick={handlePasswordSubmit}
                className="w-full bg-green-700 text-white py-4 rounded-lg font-semibold text-base hover:bg-green-800 transition duration-200 uppercase tracking-wide"
              >
                Se connecter
              </button>

              {/* Lien mot de passe oublié */}
              <div className="text-center">
                <a href="#" className="text-green-700 font-medium text-sm hover:underline">
                  Code personnel oublié ?
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white py-6 px-4 text-center border-t">
          <div className="flex justify-center mb-4">
            <img 
              src="/images/logo-transparent.png" 
              alt="Crédit Agricole" 
              className="h-12 w-auto object-contain"
            />
          </div>
          
          <div className="mt-6">
            <h3 className="font-bold text-base text-gray-900 mb-2">Sécurité</h3>
            <p className="text-sm text-gray-600 mb-3">
              Restez vigilants et veillez à protéger vos données personnelles.
            </p>
            <a href="#" className="text-green-700 font-medium text-sm inline-block">
              Consultez nos conseils de sécurité
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Affichage du formulaire de connexion - Identifiant (page par défaut)
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
                onKeyPress={handleKeyPressIdentifiant}
                placeholder="Exemple 23654578121"
                maxLength="11"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-green-600 focus:ring-0"
              />
            </div>

            {/* Bouton suivant */}
            <button
              onClick={handleIdentifiantSubmit}
              className="w-full bg-green-700 text-white py-4 rounded-lg font-semibold text-base hover:bg-green-800 transition duration-200 uppercase tracking-wide"
            >
              Suivant
            </button>

            {/* Lien "pas encore client" */}
            <div className="text-center pt-4">
              <p className="text-gray-700 mb-4">Vous n'êtes pas encore client ?</p>
              <button
                onClick={() => setShowSignupForm(true)}
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