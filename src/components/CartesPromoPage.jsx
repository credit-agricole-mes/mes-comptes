export default function CartesPromoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
       
      </div>

      {/* Globe Trotter Card - Image responsive */}
      <div className="my-6 bg-gray-50 flex justify-center px-4">
        <img 
          src="images/carte1.jpg" 
          alt="Globe Trotter Card" 
          className="w-full max-w-2xl rounded-xl shadow-lg"
        />
      </div>

      {/* Carte Biométrique */}
      <div className="bg-white p-6 m-4 rounded-2xl shadow-md">
        <h3 className="text-gray-800 font-bold text-xl mb-3 text-center">
          CARTE BIOMÉTRIQUE
        </h3>
        
        <p className="text-gray-700 text-center mb-6 leading-relaxed">
          Payez sans contact avec votre empreinte digitale grâce à la 1ère carte bancaire biométrique*
        </p>
      </div>

      {/* Cards Carousel - Image responsive */}
      <div className="py-6 pb-8 bg-gray-50 flex justify-center px-4">
        <img 
          src="images/carte2.jpg" 
          alt="Credit Cards" 
          className="w-full max-w-2xl rounded-xl shadow-lg"
        />
      </div>

      <div className="bg-white p-6 m-4 rounded-2xl shadow-md">
        <h3 className="text-gray-800 font-bold text-xl mb-3 text-center">
          CRYPTOGRAMME DYNAMIQUE
        </h3>
        
        <p className="text-gray-700 text-center mb-6 leading-relaxed">
          Maintenant disponible pour votre carte Crédit Agricole Option à 12,50 € (1) par an. 
        </p>
      </div>

      <div className="py-6 bg-gray-50 flex justify-center px-4">
        <img 
          src="images/carte3.jpg" 
          alt="Globe pub" 
          className="w-full max-w-2xl rounded-xl shadow-lg"
        />
      </div> 

      <div className="bg-white p-6 m-4 rounded-2xl shadow-md">
        <h3 className="text-gray-800 font-bold text-xl mb-3 text-center">
          OPTION TRAVAIL
        </h3>
        
        <p className="text-gray-700 text-center mb-6 leading-relaxed">
          Bénéficier d'un forfait mensuel limittant vos frais en cas d'usage de la carte en devises(1)
        </p>
      </div>
    </div>
  );
}