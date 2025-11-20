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
      const res = await apiDarna.get("/properties/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
    } catch (e) {
      console.error("Erreur lors du chargement des propriétés:", e);
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (data) => {
    if (!token || !user) throw new Error("Vous devez être connecté");

    setLoading(true);
    try {
      const res = await apiDarna.post("/properties", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties([...properties, res.data]);
      return res.data;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (!token || !user) throw new Error("Vous devez être connecté");

    setLoading(true);
    try {
      await apiDarna.delete(`/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.filter((p) => p._id !== id));
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id, data) => {
    if (!token || !user) throw new Error("Vous devez être connecté");

    setLoading(true);
    try {
      const res = await apiDarna.put(`/properties/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.map((p) => (p._id === id ? res.data : p)));
      return res.data;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const getPropertyById = async (id) => {
    setLoading(true);
    try {
      const res = await apiDarna.get(`/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.user !== user._id) return null;
      return res.data;
    } catch (e) {
      console.error("Erreur lors du chargement de la propriété:", e);
      return null;
    } finally {
      setLoading(false);
    }
  };

const getAllProperties = async () => {
  setLoading(true);
  try {
    const res = await apiDarna.get("/properties/all"); 
    return res.data;
  } catch (e) {
    console.error("Erreur :", e);
    return [];
  } finally {
    setLoading(false);
  }
};

const getPropertyByIdd = async (id) => {
  setLoading(true);
  try {
    const res = await apiDarna.get(`/properties/${id}/all`);
    return res.data;
  } catch (e) {
    console.error("Erreur lors du chargement :", e);
    return null;
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (token && user) getProperties();
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
        getPropertyById,
        getAllProperties,
        getPropertyByIdd,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperties = () => useContext(PropertyContext);
