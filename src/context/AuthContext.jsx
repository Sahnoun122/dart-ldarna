import { createContext , useContext , useState } from "react";

import { apiDarna ,apiTirelire } from "../services/api";


const AuthContext = createContext();

export function AuthProvider ({children}){
    const [utilisateur , setUtilisateur] = useState(null);


    const enregistrer = async(donnes , type)=>{
    const api = type === "darna" ? apiDarna : apiTirelire;

        const reponse = await api.post("/auth/register" , donnes);
        setUtilisateur(reponse.data.utilisateur);
    };

   const connecter = async(type , donnes)=>{

    const api = type === "darna" ? apiDarna : apiTirelire;
    const response = await api.post("/auth/login" , donnes);

    setUtilisateur(response.data.utilisateur);
   }

   const deconnecter = ()=>{
    setUtilisateur(null);
   }

   return(

    <AuthContext.Provider
      value={{
        utilisateur,
        setUtilisateur,
        enregistrer,
        connecter,
        deconnecter
      }}

    >
        {children}
    </AuthContext.Provider>
   )

};

export const useAuth = ()=> useContext(AuthContext);