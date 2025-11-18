import { createContext, useContext, useState, useEffect } from "react";
import { apiDarna } from "../services/api";
import { useAuth } from "./AuthContext";

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  const getProperties = async () => {
    if (!token || !user) {
      setProperties([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await apiDarna.get("/properties");
      setProperties(res.data);
    } catch (e) {
      console.error("Erreur lors du chargement des propriétés:", e);
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (data) => {
    if (!token || !user) {
      throw new Error("Vous devez être connecté pour créer une annonce");
    }
    
    setLoading(true);
    try {
      const res = await apiDarna.post("/properties", data);
      setProperties([...properties, res.data]);
      return res.data;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (!token || !user) {
      throw new Error("Vous devez être connecté pour supprimer une annonce");
    }
    
    setLoading(true);
    try {
      await apiDarna.delete(`/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id, data) => {
    if (!token || !user) {
      throw new Error("Vous devez être connecté pour modifier une annonce");
    }
    
    setLoading(true);
    try {
      const res = await apiDarna.put(`/properties/${id}`, data);
      setProperties(properties.map((p) => (p._id === id ? res.data : p)));
      return res.data;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch properties if user is authenticated
    if (token && user) {
      getProperties();
    }
  }, [token, user]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        createProperty,
        deleteProperty,
        updateProperty,
        refreshProperties: getProperties,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperties = () => useContext(PropertyContext);
