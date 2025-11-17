import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiDarna, apiTirelire } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [apiType, setApiType] = useState("darna"); // default Darna

  // choisir l'API
  const chooseAPI = (type) => setApiType(type);

  const getAPI = () => (apiType === "darna" ? apiDarna : apiTirelire);

  const register = async (payload) => {
    const api = getAPI();
    const res = await api.post("/auth/register", payload);
    const { user: u, token: t } = res.data;
    if (t) {
      setToken(t);
      localStorage.setItem("token", t);
      api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
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
    const { user: u, token: t } = res.data;
    if (t) {
      setToken(t);
      localStorage.setItem("token", t);
      api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
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
    delete api.defaults.headers.common["Authorization"];
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, register, login, logout, chooseAPI, apiType }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
