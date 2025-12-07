export default function DownloadSection() {
  return (
    <div className="bg-white py-6 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        <div className="text-center space-y-6">
          <p className="text-gray-800 text-lg leading-relaxed">
            Téléchargez l'application mobile<br />
            Mes Comptes* pour vous inscrire<br />
            au programme de cashback Mes<br />
            Extras.
          </p>
          
          <p className="text-gray-700 text-base">
            Rendez-vous dans la rubrique<br />
            "Offres".
          </p>
          
          <div className="flex flex-col items-center gap-0 pt-4">
            {/* App Store Button */}
            <a 
              href="#" 
              className="block hover:opacity-80 transition"
            >
              <img 
                src="images/logo a.jpg" 
                alt="Télécharger dans l'App Store" 
                className="h-14 w-auto"
              />
            </a>
            
            {/* Google Play Button - décalé à droite */}
            <a 
              href="#" 
              className="block hover:opacity-80 transition ml-8"
            >
              <img 
                src="images/logo p.jpg" 
                alt="Disponible sur Google Play" 
                className="h-14 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}