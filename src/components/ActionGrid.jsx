import { Send, Euro, AlertTriangle, CreditCard, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";

export default function ActionGrid({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto mt-8 px-4">

      <ActionButton 
        icon={Send} 
        label="Virement" 
        onClick={() => navigate("/virements")} 
      />
      <ActionButton 
        icon={Euro} 
        label="Dépôt de fonds" 
        onClick={() => navigate("/depots")} 
      />
      <ActionButton 
        icon={AlertTriangle} 
        label="Mes découverts" 
        onClick={() => navigate("/overdraft")} 
      />

      <ActionButton 
        icon={CreditCard} 
        label="Gestion des cartes" 
        onClick={() => navigate("/cartes")} 
      />
      <ActionButton 
        icon={User} 
        label="Profil" 
        onClick={() => navigate("/profil")} 
      />
      <ActionButton 
        icon={Settings} 
        label="Paramètres" 
        onClick={() => navigate("/settings")} 
      />

    </div>
  );
}