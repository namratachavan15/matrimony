// src/Component/State/SubcastContext.jsx
import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const SubcastContext = createContext();

export const useSubcastContext = () => useContext(SubcastContext);

export const SubcastProvider = ({ children }) => {
  const [subcasts, setSubcasts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // CREATE
  const createSubcast = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post(`/api/admin/subcast`, payload);
      setSubcasts((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Error creating subcast:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create subcast";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // READ: get all
  const fetchSubcasts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/admin/subcast");
      setSubcasts(data);
    } catch (err) {
      console.error("Error fetching subcasts:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch subcasts";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const updateSubcast = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/admin/subcast/${id}`, payload);
      setSubcasts((prev) =>
        prev.map((s) => (s.id === id ? data : s))
      );
      return data;
    } catch (err) {
      console.error("Error updating subcast:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update subcast";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteSubcast = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/subcast/${id}`);
      setSubcasts((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting subcast:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete subcast";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubcastContext.Provider
      value={{
        subcasts,
        loading,
        error,
        createSubcast,
        fetchSubcasts,
        updateSubcast,
        deleteSubcast,
      }}
    >
      {children}
    </SubcastContext.Provider>
  );
};
