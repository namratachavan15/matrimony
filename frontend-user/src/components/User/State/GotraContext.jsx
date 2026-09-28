// src/Component/State/GotraContext.jsx
import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const GotraContext = createContext();

export const useGotraContext = () => useContext(GotraContext);

export const GotraProvider = ({ children }) => {
  const [gotras, setGotras] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // CREATE
  const createGotra = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post(`/api/admin/gotra`, payload);
      setGotras((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Error creating gotra:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create gotra";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // READ
  const fetchGotras = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/admin/gotra");
      setGotras(data);
    } catch (err) {
      console.error("Error fetching gotras:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch gotras";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const updateGotra = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/admin/gotra/${id}`, payload);
      setGotras((prev) => prev.map((g) => (g.id === id ? data : g)));
      return data;
    } catch (err) {
      console.error("Error updating gotra:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update gotra";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteGotra = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/gotra/${id}`);
      setGotras((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Error deleting gotra:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete gotra";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GotraContext.Provider
      value={{
        gotras,
        loading,
        error,
        createGotra,
        fetchGotras,
        updateGotra,
        deleteGotra,
      }}
    >
      {children}
    </GotraContext.Provider>
  );
};
