// src/Component/State/NadiContext.jsx
import { createContext, useContext, useState } from "react";
import { api } from "../../Config/api";

const NadiContext = createContext();

export const useNadiContext = () => useContext(NadiContext);

export const NadiProvider = ({ children }) => {
  const [nadis, setNadis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNadis = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/admin/nadi");
      setNadis(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch nadis");
    } finally {
      setLoading(false);
    }
  };

  const createNadi = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/admin/nadi", payload);
      setNadis((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create nadi");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNadi = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/admin/nadi/${id}`, payload);
      setNadis((prev) => prev.map((n) => (n.id === id ? data : n)));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update nadi");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNadi = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/nadi/${id}`);
      setNadis((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete nadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NadiContext.Provider
      value={{
        nadis,
        loading,
        error,
        fetchNadis,
        createNadi,
        updateNadi,
        deleteNadi,
      }}
    >
      {children}
    </NadiContext.Provider>
  );
};
