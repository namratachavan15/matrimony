// src/Component/State/NakshtraContext.jsx
import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const NakshtraContext = createContext();
export const useNakshtraContext = () => useContext(NakshtraContext);

export const NakshtraProvider = ({ children }) => {
  const [nakshtras, setNakshtras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNakshtras = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/admin/nakshtra");
      setNakshtras(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Nakshtras");
    } finally {
      setLoading(false);
    }
  };

  const createNakshtra = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/admin/nakshtra", payload);
      setNakshtras((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create Nakshtra");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNakshtra = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/admin/nakshtra/${id}`, payload);
      setNakshtras((prev) => prev.map((n) => (n.id === id ? data : n)));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update Nakshtra");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNakshtra = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/nakshtra/${id}`);
      setNakshtras((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete Nakshtra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NakshtraContext.Provider
      value={{
        nakshtras,
        loading,
        error,
        fetchNakshtras,
        createNakshtra,
        updateNakshtra,
        deleteNakshtra,
      }}
    >
      {children}
    </NakshtraContext.Provider>
  );
};
