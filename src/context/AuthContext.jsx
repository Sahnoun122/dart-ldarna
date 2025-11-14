import { createContext , useContext , useState } from "react";

import { apiDarna ,apiTirelire } from "../services/api";
import { useNavigate } from "react-router-dom"; 



const AuthContext = createContext();

export function AuthProvider ({children}){
  const [utilisateur, setUtilisateur] = useState(null);
  const navigate = useNavigate(); 

  const enregistrer = async (donnes, type) => {
    const api = type === "darna" ? apiDarna : apiTirelire;

    const reponse = await api.post("/auth/register", donnes);
    setUtilisateur(reponse.data.utilisateur);

    navigate(type === "darna" ? "/dashboard-darna" : "/dashboard-tirelire");
  };

  const connecter = async (type, donnes) => {
    const api = type === "darna" ? apiDarna : apiTirelire;
    const response = await api.post("/auth/login", donnes);

    setUtilisateur(response.data.utilisateur);

    navigate(type === "darna" ? "/dashboard-darna" : "/dashboard-tirelire");
  };

    const deconnecter = () => {
      setUtilisateur(null); 
      navigate("/login"); 
    };

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        setUtilisateur,
        enregistrer,
        connecter,
        deconnecter,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=> useContext(AuthContext);