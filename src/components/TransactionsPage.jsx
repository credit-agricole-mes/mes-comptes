import React from 'react';
import { FileDown, FileText, File, TrendingUp, Wallet, Users, BarChart3, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currencyFormatter';

export default function TransactionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Récupération de la devise et du symbole de l'utilisateur connecté
  const devise = user?.devise || "EUR";
  const symbole = user?.symboleDevise || "€";

  // ✅ Vérifier si c'est un nouveau compte
  const estNouveauCompte = user?.solde === 0 && (!user?.transactions || user.transactions.length === 0);

  // ✅ Comptes avec soldes dynamiques
  const accounts = [
    { 
      name: "Livret A", 
      balance: estNouveauCompte ? 0 : (user?.livretA || 0)
    },
    { 
      name: "Assurance", 
      balance: estNouveauCompte ? 0 : (user?.assurance || 0)
    },
    { 
      name: "Épargne", 
      balance: estNouveauCompte ? 0 : (user?.epargne || 0)
    }
  ];

  const topActions = [
    { 
      icon: FileDown, 
      label: "Télécharger mes transactions", 
      onClick: () => navigate("/transactions")
    },
    { 
      icon: FileText, 
      label: "Mon RIB", 
      onClick: () => navigate("/rib")
    },
    { 
      icon: File, 
      label: "Gestion des documents", 
      onClick: () => navigate("/documents")
    }
  ];

  const bottomActions = [
    { icon: TrendingUp, label: "Comparaison de dépenses", onClick: () => navigate("/expenses") },
    { icon: Wallet, label: "Épargne automatique", onClick: () => navigate("/savings") },
    { icon: Users, label: "Gestion des bénéficiaires", onClick: () => navigate("/beneficiaries") },
    { icon: BarChart3, label: "Mes plafonds", onClick: () => navigate("/limits") },
    { icon: Calculator, label: "Simulation de prêt", onClick: () => navigate("/loan") },
    { icon: Calculator, label: "Calculateur d'épargne", onClick: () => navigate("/calculator") }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes transactions</h1>

      {/* Actions principales avec navigation */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {topActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="bg-gray-200 p-4 text-3xl rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-300 transition cursor-pointer"
          >
            <action.icon size={32} className="text-teal-700" />
            <span className="text-sm font-semibold text-gray-800 text-center">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Liste des comptes - FORMATAGE DEVISE */}
      <div className="space-y-4 mb-6">
        {accounts.map((account, index) => (
          <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>
              <span className="text-lg font-bold text-green-500">
                {formatCurrency(account.balance, devise, symbole)}
              </span>
            </div>
            <div className="w-full h-2 bg-yellow-100 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Actions secondaires avec navigation */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {bottomActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="bg-gray-200 p-6 rounded-xl flex flex-col text-3xl items-center justify-center gap-2 hover:bg-gray-300 transition cursor-pointer"
          >
            <action.icon size={28} className="text-teal-700" />
            <span className="text-xs font-semibold text-gray-800 text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}