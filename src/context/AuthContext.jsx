import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiDarna, apiTirelire } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [apiType, setApiType] = useState("darna");
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour charger l'état depuis localStorage
  const loadAuthState = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const storedApiType = localStorage.getItem("apiType") || "darna";

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        setApiType(storedApiType);
        
        // Configurer l'API avec le token
        const api = storedApiType === "darna" ? apiDarna : apiTirelire;
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error("Erreur lors de la restauration de l'état d'authentification:", error);
      // Nettoyer les données corrompues
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("apiType");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'état au démarrage
  useEffect(() => {
    loadAuthState();
  }, []);

  const chooseAPI = (type) => {
    setApiType(type);
    localStorage.setItem("apiType", type);
  };

  const getAPI = () => (apiType === "darna" ? apiDarna : apiTirelire);

  const register = async (payload) => {
    const api = getAPI();
    const res = await api.post("/auth/register", payload);
    
    const { user: u, token: t, accessToken } = res.data;
    const tokenToUse = t || accessToken;
    
    if (tokenToUse) {
      setToken(tokenToUse);
      localStorage.setItem("token", tokenToUse);
      localStorage.setItem("apiType", apiType);
      api.defaults.headers.common["Authorization"] = `Bearer ${tokenToUse}`;
    } else {
      throw new Error("Aucun token d'authentification reçu");
    }
    
    if (u) {
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
    }
    
    navigate(apiType === "darna" ? "/dashboard-darna" : "/dashboard-tirelire");
  };

  const login = async (payload) => {
    const api = getAPI();
    const res = await api.post("/auth/login", payload);
    
    const { user: u, token: t, accessToken } = res.data;
    const tokenToUse = t || accessToken;
    
    if (tokenToUse) {
      setToken(tokenToUse);
      localStorage.setItem("token", tokenToUse);
      localStorage.setItem("apiType", apiType);
      api.defaults.headers.common["Authorization"] = `Bearer ${tokenToUse}`;
    } else {
      throw new Error("Aucun token d'authentification reçu");
    }
    
    if (u) {
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
    }
    
    navigate(apiType === "darna" ? "/dashboard-darna" : "/dashboard-tirelire");
  };

  const logout = () => {
    const api = getAPI();
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("apiType");
    delete api.defaults.headers.common["Authorization"];
    navigate("/");
  };

  // Fonction pour debug
  const debugAuthState = () => {
    return {
      user: user,
      token: token ? "Present" : "Missing",
      apiType: apiType,
      localStorage: {
        user: localStorage.getItem("user") ? "Present" : "Missing",
        token: localStorage.getItem("token") ? "Present" : "Missing",
        apiType: localStorage.getItem("apiType") || "Not set"
      }
    };
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        token, 
        register, 
        login, 
        logout, 
        chooseAPI, 
        apiType, 
        isLoading,
        debugAuthState 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
