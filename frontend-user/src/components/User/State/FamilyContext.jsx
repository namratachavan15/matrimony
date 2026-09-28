import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../Config/api";

const FamilyContext = createContext();

export const useFamilyContext = () => useContext(FamilyContext);

export const FamilyProvider = ({ children }) => {
    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(false);
  

    const fetchFamilies = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/family");
        setFamilies(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchFamilies();
    }, []);


   // avoid unnecessary state updates
const fetchFamilyByUserId = async (uid) => {
  try {
    const res = await api.get(`/api/admin/family/by-user/${uid}`);
    return res.data || null;
  } catch (err) {
    console.error("Error fetching family:", err);
    return null;
  }
};

const updateFamily = async (id, data) => {
  try {
    const res = await api.put(`/api/admin/family/${id}`, data);
    setFamilies((prev) => prev.map((f) => (f.id === id ? res.data : f)));
  } catch (err) {
    console.error(err);
  }
};

    return (
      <FamilyContext.Provider
        value={{
          families,
          loading,
          updateFamily,
          fetchFamilyByUserId,
          fetchFamilies
        }}
      >
        {children}
      </FamilyContext.Provider>
    );
  };
  