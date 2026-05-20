import React from 'react';
import { FileText, File, TrendingUp, Wallet, Users, BarChart3, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currencyFormatter';

export default function TransactionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const devise = user?.devise || "EUR";
  const symbole = user?.symboleDevise || "€";

  const estNouveauCompte = user?.solde === 0 && (!user?.transactions || user.transactions.length === 0);

  const accounts = [
    { name: "Livret A", balance: estNouveauCompte ? 0 : (user?.livretA || 0) },
    { name: "Assurance", balance: estNouveauCompte ? 0 : (user?.assurance || 0) },
    { name: "Épargne", balance: estNouveauCompte ? 0 : (user?.epargne || 0) }
  ];

  // ✅ Supprimé "Télécharger mes transactions", gardé seulement RIB et Documents
  const topActions = [
    { icon: FileText, label: "Mon RIB", onClick: () => navigate("/rib") },
    { icon: File, label: "Gestion des documents", onClick: () => navigate("/documents") }
  ];

  const bottomActions = [
    { icon: TrendingUp, label: "Comparaison de dépenses", onClick: () => navigate("/expenses") },
    { icon: Wallet, label: "Épargne automatique", onClick: () => navigate("/savings") },
    { icon: Users, label: "Gestion des bénéficiaires", onClick: () => navigate("/beneficiaries") },
    { icon: BarChart3, label: "Mes plafonds", onClick: () => navigate("/limits") },
    { icon: Calculator, label: "Simulation de prêt", onClick: () => navigate("/loan") },
    { icon: Calculator, label: "Calculateur d'épargne", onClick: () => navigate("/calculator") }
  ];

  const transactions = user?.transactions || [];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes transactions</h1>

      {/* Actions principales — 2 boutons seulement */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {topActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="bg-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-300 transition cursor-pointer"
          >
            <action.icon size={32} className="text-teal-700" />
            <span className="text-sm font-semibold text-gray-800 text-center">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Comptes */}
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

      {/* ✅ Toutes les transactions affichées directement */}
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Toutes mes transactions</h2>
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        {transactions.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">Aucune transaction disponible</p>
        ) : (
          transactions.map((tx, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-4 py-3 ${
                index !== transactions.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-xs text-gray-400 w-24 shrink-0">{tx.date}</span>
              <span className="text-sm text-gray-800 flex-1 px-2">{tx.libelle || tx.beneficiaire}</span>
              {tx.credit ? (
                <span className="text-sm font-semibold text-green-600">
                  +{formatCurrency(parseFloat(tx.credit), devise, symbole)}
                </span>
              ) : (
                <span className="text-sm font-semibold text-red-500">
                  -{formatCurrency(parseFloat(tx.debit || Math.abs(tx.montant || 0)), devise, symbole)}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Actions secondaires */}
      <div className="grid grid-cols-3 gap-3">
        {bottomActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="bg-gray-200 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-300 transition cursor-pointer"
          >
            <action.icon size={28} className="text-teal-700" />
            <span className="text-xs font-semibold text-gray-800 text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}