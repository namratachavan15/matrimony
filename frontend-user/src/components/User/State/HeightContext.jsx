import React, { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const HeightContext = createContext();

export const HeightProvider = ({ children }) => {
  const [heights, setHeights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHeights = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/height");
      setHeights(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch heights");
    } finally {
      setLoading(false);
    }
  };

  const createHeight = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/height", payload);
      setHeights((prev) => [...prev, data]);
      setError("");
    } catch (err) {
      setError("Failed to add height");
    } finally {
      setLoading(false);
    }
  };

  const updateHeight = async (id, payload) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/api/admin/height/${id}`, payload);
      setHeights((prev) => prev.map((h) => (h.id === id ? data : h)));
      setError("");
    } catch (err) {
      setError("Failed to update height");
    } finally {
      setLoading(false);
    }
  };

  const deleteHeight = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/admin/height/${id}`);
      setHeights((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      setError("Failed to delete height");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeightContext.Provider
      value={{
        heights,
        loading,
        error,
        fetchHeights,
        createHeight,
        updateHeight,
        deleteHeight,
      }}
    >
      {children}
    </HeightContext.Provider>
  );
};

export const useHeightContext = () => useContext(HeightContext);
