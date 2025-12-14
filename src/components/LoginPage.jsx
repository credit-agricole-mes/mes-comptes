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
  const [showNumericKeyboard, setShowNumericKeyboard] = useState(false);
  
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
  const [newUserIdentifiant, setNewUserIdentifiant] = useState("");

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

    const result = await UserService.loginUser(identifiant);
    
    if (!result.success) {
      setError("Identifiant incorrect");
      return;
    }

    console.log('✅ Identifiant validé:', identifiant);
    setShowPasswordPage(true);
    setShowNumericKeyboard(false);
  };

  const handlePasswordSubmit = async () => {
    setError("");
    
    if (!motDePasse) {
      setError("Veuillez saisir votre mot de passe");
      return;
    }

    if (motDePasse.length !== 6) {
      setError("Le mot de passe doit contenir exactement 6 chiffres");
      return;
    }

    console.log('🔐 Vérification connexion avec:', identifiant, 'mot de passe:', motDePasse);

    // Utilisez la NOUVELLE fonction verifyLogin qui vérifie les deux
    const result = await UserService.verifyLogin(identifiant, motDePasse);
    
    if (!result.success) {
      setError(result.message || "Erreur de connexion");
      return;
    }

    const userData = result.user;

    console.log('✅ Données utilisateur reçues:', userData);
    console.log('💰 Solde reçu:', userData.solde);
    
    login(userData);
    
    if (onLogin) {
      onLogin(userData);
    }
    
    console.log('✅ Connexion terminée');
  };

  const handleBackToIdentifiant = () => {
    setShowPasswordPage(false);
    setMotDePasse("");
    setError("");
    setShowNumericKeyboard(false);
  };

  // Fonctions du clavier numérique pour l'identifiant
  const handleIdentifiantKeyPress = (num) => {
    if (identifiant.length < 11) {
      setIdentifiant(prev => prev + num);
    }
  };

  const handleIdentifiantBackspace = () => {
    setIdentifiant(prev => prev.slice(0, -1));
  };

  const handleClearIdentifiant = () => {
    setIdentifiant("");
  };

  // Fonctions du clavier numérique pour le mot de passe
  const handlePasswordKeyPress = (num) => {
    if (motDePasse.length < 6) {
      setMotDePasse(prev => prev + num);
    }
  };

  const handlePasswordBackspace = () => {
    setMotDePasse(prev => prev.slice(0, -1));
  };

  const handleClearPassword = () => {
    setMotDePasse("");
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

    if (!signupData.nom || !signupData.prenom || !signupData.dateNaissance || 
        !signupData.telephone || !signupData.email || !signupData.motDePasse || 
        !signupData.confirmMotDePasse) {
      setSignupError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setSignupError("Veuillez saisir une adresse email valide");
      return;
    }

    const phoneDigits = signupData.telephone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setSignupError("Le numéro de téléphone doit contenir au moins 10 chiffres");
      return;
    }

    if (signupData.motDePasse.length < 6) {
      setSignupError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Vérifier que le mot de passe ne contient que des chiffres
    const passwordRegex = /^\d+$/;
    if (!passwordRegex.test(signupData.motDePasse)) {
      setSignupError("Le mot de passe doit contenir uniquement des chiffres");
      return;
    }

    if (signupData.motDePasse !== signupData.confirmMotDePasse) {
      setSignupError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      console.log('📝 Création du compte...');
      
      let newIdentifiant;
      let identifiantExists = true;
      
      while (identifiantExists) {
        newIdentifiant = Math.floor(10000000000 + Math.random() * 90000000000).toString();
        const existingUser = await UserService.getUserByCode(newIdentifiant);
        identifiantExists = existingUser !== null;
      }
      
      const today = new Date();
      const dateFormatted = today.toLocaleDateString('fr-FR');
      
      const newUser = {
        code: newIdentifiant,
        motDePasse: signupData.motDePasse, // Déjà en string (chiffres uniquement)
        nom: `${signupData.prenom} ${signupData.nom}`,
        email: signupData.email,
        telephone: signupData.telephone,
        adresse: signupData.adresse ? `${signupData.adresse}, ${signupData.codePostal} ${signupData.ville}` : "",
        solde: 0,
        devise: "EUR",
        symboleDevise: "€",
        numeroCompte: `FR76 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(100 + Math.random() * 900)}`,
        iban: `FR76 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(100 + Math.random() * 900)}`,
        bic: "BNPAFRPPXXX",
        agence: "Agence Paris Opéra - 29 Boulevard des Capucines, 75009 Paris",
        dateOuverture: dateFormatted,
        dateBlocage: "",
        dateAttestation: dateFormatted,
        notification: " Bienvenue ! Votre compte a été créé avec succès Vous pouvez maintenant profiter de tous nos services bancaires ",
        transactions: [],
        relevesMensuels: [],
        virements: [],
        depots: [],
        decouvert: [],
        conseiller: {
          nom: 'Marie Martin',
          telephone: '+33 6 23 45 67 89',
          email: 'marie.martin@banque.fr',
        },
        notaire: {
          nom: "MAÎTRE SOPHIE BERNARD",
          prenom: "Sophie",
          titre: "NOTAIRE",
          adresse: "45 Avenue Montaigne",
          ville: "75008 PARIS",
          telephone: "+33 6 42 89 33 44",
          email: "sophie.bernard@notaire-paris.fr"
        }
      };

      const users = UserService.getAllUsers ? UserService.getAllUsers() : 
                    (localStorage.getItem('bankUsers') ? JSON.parse(localStorage.getItem('bankUsers')) : []);
      
      users.push(newUser);
      localStorage.setItem('bankUsers', JSON.stringify(users));
      
      console.log('✅ Compte créé avec succès:', newIdentifiant);
      
      setNewUserIdentifiant(newIdentifiant);
      setSignupSuccess(`✅ Votre compte a été créé avec succès !

📋 Votre identifiant de connexion : ${newIdentifiant}

⚠️ IMPORTANT : Notez bien cet identifiant, vous en aurez besoin pour vous connecter !

Votre mot de passe : ${signupData.motDePasse}

Vous pouvez maintenant vous connecter avec cet identifiant et le mot de passe que vous avez choisi.`);
      
    } catch (error) {
      setSignupError("Une erreur s'est produite lors de la création du compte. Veuillez réessayer.");
      console.error('Erreur inscription:', error);
    }
  };

  const handleBackToLogin = () => {
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
    setSignupError("");
    setNewUserIdentifiant("");
  };

  // Composant du clavier numérique
  const NumericKeyboard = ({ onKeyPress, onBackspace, onClear }) => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', '⌫']
    ];

    return (
      <div className="mt-6 bg-white rounded-xl p-6">
        <div className="grid grid-cols-3 gap-8">
          {keys.map((row, rowIndex) => (
            row.map((key, keyIndex) => {
              if (key === '') {
                return <div key={`${rowIndex}-${keyIndex}`} className="h-16"></div>;
              }
              return (
                <button
                  key={`${rowIndex}-${keyIndex}`}
                  onClick={() => {
                    if (key === '⌫') {
                      onBackspace();
                    } else {
                      onKeyPress(key);
                    }
                  }}
                  className="h-16 font-bold text-4xl text-gray-900 hover:text-green-600 active:scale-90 transition-all duration-150 cursor-pointer"
                >
                  {key}
                </button>
              );
            })
          ))}
        </div>
      </div>
    );
  };

  // Composant pour afficher les 6 carrés du mot de passe
  const PasswordBoxes = () => {
    const boxes = Array(6).fill(null);
    
    return (
      <div className="flex justify-center gap-3 mb-4">
        {boxes.map((_, index) => (
          <div
            key={index}
            className={`
              w-14 h-16 border-3 rounded-lg flex items-center justify-center text-2xl font-bold
              ${motDePasse.length > index 
                ? 'border-green-600 bg-green-50' 
                : 'border-gray-300 bg-white'}
              transition-all duration-200
            `}
          >
            {motDePasse[index] ? '●' : ''}
          </div>
        ))}
      </div>
    );
  };

  // Affichage du formulaire d'inscription
  if (showSignupForm) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-white py-6 px-4 text-center border-b">
          <div className="flex justify-center mb-2">
            <img 
              src="/images/logo-transparent.png" 
              alt="Crédit Agricole" 
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>

        <div className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {!signupSuccess && (
              <button
                onClick={handleBackToLogin}
                className="text-green-700 mb-4 flex items-center gap-2 hover:underline"
              >
                ← Retour à la connexion
              </button>
            )}

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
              <div className="bg-green-50 border-2 border-green-400 text-green-800 px-6 py-4 rounded-lg mb-6">
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {signupSuccess}
                </div>
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleBackToLogin}
                    className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
                  >
                    Se connecter maintenant
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newUserIdentifiant);
                      alert('Identifiant copié dans le presse-papiers !');
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    📋 Copier l'identifiant
                  </button>
                </div>
              </div>
            )}

            {!signupSuccess && (
              <div className="space-y-5">
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

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Mot de passe (6 chiffres) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    name="motDePasse"
                    value={signupData.motDePasse}
                    onChange={handleSignupInputChange}
                    placeholder="Exemple : 123456"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Uniquement des chiffres (6 chiffres)</p>
                </div>

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

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleSignupSubmit}
                    className="w-full bg-green-700 text-white py-4 rounded-lg font-semibold text-base hover:bg-green-800 transition duration-200 uppercase tracking-wide"
                  >
                    Créer mon compte
                  </button>
                  <button
                    onClick={handleBackToLogin}
                    className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-base hover:bg-gray-300 transition duration-200"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Affichage de la page du mot de passe
  if (showPasswordPage) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-white py-6 px-4 text-center border-b">
          <div className="flex justify-center mb-2">
            <img 
              src="/images/logo-transparent.png" 
              alt="Crédit Agricole" 
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>

        <div className="flex-1 px-6 py-8 overflow-y-auto">
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
              <div>
                <label className="block text-gray-700 font-medium mb-3 text-base">
                  Code personnel (6 chiffres)
                </label>
                
                {/* 6 carrés pour afficher le mot de passe */}
                <PasswordBoxes />
              </div>

              {/* Clavier numérique */}
              <NumericKeyboard
                onKeyPress={handlePasswordKeyPress}
                onBackspace={handlePasswordBackspace}
                onClear={handleClearPassword}
              />

              <button
                onClick={handlePasswordSubmit}
                className="w-full bg-green-700 text-white py-4 rounded-lg font-semibold text-base hover:bg-green-800 transition duration-200 uppercase tracking-wide"
              >
                Se connecter
              </button>

              <div className="text-center">
                <a href="#" className="text-green-700 font-medium text-sm hover:underline">
                  Code personnel oublié ?
                </a>
              </div>
            </div>
          </div>
        </div>

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

  // Affichage du formulaire de connexion - Identifiant
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-white py-6 px-4 text-center border-b">
        <div className="flex justify-center mb-2">
          <img 
            src="/images/logo-transparent.png" 
            alt="Crédit Agricole" 
            className="h-20 w-auto object-contain"
          />
        </div>
      </div>

      <div className="flex-1 px-6 py-8 overflow-y-auto">
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
            <div>
              <label className="block text-gray-700 font-medium mb-3 text-base">
                Identifiant (11 chiffres)
              </label>
              <input
                type="text"
                value={identifiant}
                readOnly
                onClick={() => setShowNumericKeyboard(true)}
                placeholder=""
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-green-600 focus:ring-0 text-center font-mono tracking-wider"
              />
            </div>

            {/* Clavier numérique pour l'identifiant */}
            {showNumericKeyboard && (
              <NumericKeyboard
                onKeyPress={handleIdentifiantKeyPress}
                onBackspace={handleIdentifiantBackspace}
                onClear={handleClearIdentifiant}
              />
            )}

            <button
              onClick={handleIdentifiantSubmit}
              className="w-full bg-green-700 text-white py-4 rounded-lg font-semibold text-base hover:bg-green-800 transition duration-200 uppercase tracking-wide"
            >
              Suivant
            </button>

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

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-bold text-base text-gray-900 mb-2">Sécurité</h3>
          <p className="text-sm text-gray-600 mb-3">
            Restez vigilants et veillez à protéger vos données personnelles.
          </p>
          <a href="#" className="text-green-700 font-medium text-sm inline-block">
            Consultez nos conseils de sécurité
          </a>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-bold text-base text-gray-900 mb-4">Votre espace fidélité</h3>
          <p className="text-sm text-gray-600 mb-4">
            Cliquez sur l'image pour participer.
          </p>
          
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