import { useState } from 'react';
import { ArrowLeft, Search, MessageCircle, HelpCircle, Lock, CreditCard, FileText, DollarSign, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function AssistantPage({ onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'all', name: 'Tout', icon: MessageCircle, color: 'blue' },
    { id: 'blocked', name: 'Compte bloqué', icon: Lock, color: 'red' },
    { id: 'cards', name: 'Cartes', icon: CreditCard, color: 'green' },
    { id: 'transactions', name: 'Transactions', icon: DollarSign, color: 'purple' },
    { id: 'documents', name: 'Documents', icon: FileText, color: 'orange' },
    { id: 'other', name: 'Autres', icon: HelpCircle, color: 'gray' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'blocked',
      question: 'Pourquoi mon compte est-il bloqué ?',
      answer: 'Votre compte peut être bloqué pour plusieurs raisons : activité suspecte détectée, document manquant ou expiré, vérification de sécurité en cours. Contactez notre support au 0800 123 456 pour débloquer votre compte rapidement.',
      quickActions: ['Contacter le support', 'Envoyer un document']
    },
    {
      id: 2,
      category: 'blocked',
      question: 'Comment débloquer mon compte ?',
      answer: 'Pour débloquer votre compte : 1) Vérifiez vos emails pour toute demande de document, 2) Assurez-vous que vos documents d\'identité sont à jour, 3) Contactez notre support client qui traitera votre demande sous 24-48h.',
      quickActions: ['Voir mes documents', 'Contacter le support']
    },
    {
      id: 3,
      category: 'blocked',
      question: 'Puis-je recevoir des virements si mon compte est bloqué ?',
      answer: 'Oui, vous pouvez toujours recevoir des virements sur votre compte bloqué. Cependant, vous ne pourrez pas effectuer de retraits ou de paiements tant que le blocage n\'est pas levé.',
      quickActions: ['Voir mon RIB']
    },
    {
      id: 4,
      category: 'cards',
      question: 'Comment commander une nouvelle carte ?',
      answer: 'Pour commander une nouvelle carte : Allez dans "Mes cartes" > "Commander une carte" > Choisissez le type de carte > Confirmez votre adresse de livraison. Délai de réception : 5-7 jours ouvrés.',
      quickActions: ['Accéder à Mes cartes']
    },
    {
      id: 5,
      category: 'cards',
      question: 'Ma carte a été volée, que faire ?',
      answer: 'URGENT : 1) Faites opposition immédiatement en appelant le 0800 123 456 (24h/24), 2) Déclarez le vol au commissariat, 3) Une nouvelle carte vous sera envoyée automatiquement sous 48h.',
      quickActions: ['Faire opposition', 'Appeler le support']
    },
    {
      id: 6,
      category: 'cards',
      question: 'Comment activer ma nouvelle carte ?',
      answer: 'Pour activer votre carte : 1) Effectuez un premier paiement avec code PIN dans un commerce, OU 2) Allez dans "Mes cartes" > Sélectionnez la carte > "Activer". Votre carte sera active immédiatement.',
      quickActions: ['Activer ma carte']
    },
    {
      id: 7,
      category: 'transactions',
      question: 'Comment consulter mes transactions ?',
      answer: 'Accédez à "Mes transactions" dans le menu. Vous pouvez filtrer par date, montant, catégorie. Exportez vos relevés en PDF ou Excel pour vos archives.',
      quickActions: ['Voir mes transactions']
    },
    {
      id: 8,
      category: 'transactions',
      question: 'Une transaction est incorrecte, que faire ?',
      answer: 'Si vous contestez une transaction : 1) Notez le montant et la date, 2) Allez dans "Mes transactions" > Cliquez sur la transaction > "Signaler un problème", 3) Notre équipe enquêtera sous 48h.',
      quickActions: ['Signaler une transaction']
    },
    {
      id: 9,
      category: 'transactions',
      question: 'Quand les virements sont-ils traités ?',
      answer: 'Les virements sont traités : Virements SEPA : sous 24h ouvrées, Virements internes : instantanés, Virements internationaux : 2-5 jours ouvrés. Les virements effectués après 17h sont traités le jour ouvré suivant.',
      quickActions: ['Faire un virement']
    },
    {
      id: 10,
      category: 'documents',
      question: 'Quels documents dois-je fournir ?',
      answer: 'Documents requis : Pièce d\'identité (carte nationale, passeport ou permis de conduire) valide, Justificatif de domicile de moins de 3 mois (facture électricité, eau, téléphone). Format accepté : PDF, JPG, PNG (max 5 Mo).',
      quickActions: ['Envoyer un document']
    },
    {
      id: 11,
      category: 'documents',
      question: 'Comment envoyer mes documents ?',
      answer: 'Pour envoyer vos documents : Allez dans "Mes documents" > "Ajouter un document" > Sélectionnez le type de document > Téléchargez le fichier > Validez. Vos documents seront vérifiés sous 24-48h.',
      quickActions: ['Envoyer un document']
    },
    {
      id: 12,
      category: 'other',
      question: 'Comment modifier mes informations personnelles ?',
      answer: 'Pour modifier vos informations : Allez dans "Mon profil" > Modifiez les champs souhaités > Cliquez sur "Enregistrer". Note : pour changer votre adresse ou téléphone, un document justificatif peut être demandé.',
      quickActions: ['Accéder à Mon profil']
    },
    {
      id: 13,
      category: 'other',
      question: 'Comment obtenir mon RIB ?',
      answer: 'Pour obtenir votre RIB : Allez dans "RIB" dans le menu > Téléchargez ou partagez votre RIB en PDF. Vous pouvez aussi le recevoir par email en cliquant sur "Envoyer par email".',
      quickActions: ['Télécharger mon RIB']
    },
    {
      id: 14,
      category: 'other',
      question: 'Comment contacter le support ?',
      answer: 'Plusieurs moyens de nous contacter : Téléphone : 0800 123 456 (lun-ven 8h-20h, sam 9h-17h), Email : support@banque.com (réponse sous 24h), Chat : disponible du lundi au vendredi de 9h à 18h.',
      quickActions: ['Appeler le support', 'Envoyer un email']
    },
    {
      id: 15,
      category: 'other',
      question: 'Vos services sont-ils sécurisés ?',
      answer: 'Oui, votre sécurité est notre priorité : Cryptage SSL 256 bits, Authentification à deux facteurs, Surveillance 24/7 des transactions, Garantie bancaire européenne. Vos données ne sont jamais partagées avec des tiers.',
      quickActions: ['En savoir plus sur la sécurité']
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      red: 'bg-red-100 text-red-600 hover:bg-red-200',
      green: 'bg-green-100 text-green-600 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      gray: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec bouton retour */}
      <div className="bg-green-500 p-6 text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-blue-700 hover:bg-white hover:bg-opacity-20 rounded-lg px-4 py-2 transition mb-4"
          >
            <ArrowLeft size={20} />
            Retour
          </button>

          <div>
            <h1 className="text-3xl font-bold mb-2">Assistant Virtuel</h1>
            <p className="text-white opacity-90">Comment puis-je vous aider aujourd'hui ?</p>
          </div>

          {/* Search bar */}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Categories */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? `${getColorClasses(cat.color)} font-semibold`
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                  }`}
                >
                  <Icon size={18} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div className="mb-6">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-lg">Aucune question trouvée</p>
              <p className="text-gray-400 text-sm mt-2">Essayez d'autres mots-clés ou catégories</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map(faq => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <span className="font-semibold text-gray-800 pr-4 text-lg">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="text-green-500 " size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400 " size={24} />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6 bg-gray-50">
                      <p className="text-gray-700 mb-4 leading-relaxed text-base">{faq.answer}</p>
                      
                      {faq.quickActions && faq.quickActions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {faq.quickActions.map((action, idx) => (
                            <button
                              key={idx}
                              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer contact */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-green-500" />
              <span className="font-medium">Besoin d'aide supplémentaire ?</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <a href="tel:0800123456" className="text-green-600 font-bold hover:text-green-700">
                📞 0800 123 456
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a href="mailto:support@banque.com" className="text-green-600 font-bold hover:text-green-700">
                ✉️ support@banque.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}