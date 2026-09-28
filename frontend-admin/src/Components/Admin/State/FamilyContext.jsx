import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../Config/api"; // axios instance

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

  const createFamily = async (data) => {
    try {
      const res = await api.post("/api/admin/family", data);
      setFamilies((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
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

  const deleteFamily = async (id) => {
    try {
      await api.delete(`/api/admin/family/${id}`);
      setFamilies((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const searchFamilies = async (keyword) => {
    try {
      const res = await api.get(`/api/admin/family/search?keyword=${keyword}`);
      setFamilies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FamilyContext.Provider
      value={{
        families,
        loading,
        createFamily,
        updateFamily,
        deleteFamily,
        searchFamilies,
        fetchFamilies,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};
