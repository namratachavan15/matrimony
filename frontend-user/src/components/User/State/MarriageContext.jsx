import React, { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const MarriageContext = createContext();

export const MarriageProvider = ({ children }) => {
  const [marriages, setMarriages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMarriages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/marriage");
      setMarriages(data);
      console.log("Marriage API data ===>", data);  
      setError("");
    } catch (err) {
      setError("Failed to fetch marriage types");
    } finally {
      setLoading(false);
    }
  };

  const createMarriage = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/marriage", payload);
      setMarriages((prev) => [...prev, data]);
      setError("");
    } catch (err) {
      setError("Failed to add marriage type");
    } finally {
      setLoading(false);
    }
  };

  const updateMarriage = async (id, payload) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/api/admin/marriage/${id}`, payload);
      setMarriages((prev) => prev.map((m) => (m.id === id ? data : m)));
      setError("");
    } catch (err) {
      setError("Failed to update marriage type");
    } finally {
      setLoading(false);
    }
  };

  const deleteMarriage = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/admin/marriage/${id}`);
      setMarriages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError("Failed to delete marriage type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarriageContext.Provider
      value={{
        marriages,
        loading,
        error,
        fetchMarriages,
        createMarriage,
        updateMarriage,
        deleteMarriage,
      }}
    >
      {children}
    </MarriageContext.Provider>
  );
};

export const useMarriageContext = () => useContext(MarriageContext);
