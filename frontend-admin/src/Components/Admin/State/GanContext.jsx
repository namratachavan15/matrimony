import { createContext, useContext, useState } from "react";
import { api } from "../../Config/api";

const GanContext = createContext();
export const useGanContext = () => useContext(GanContext);

export const GanProvider = ({ children }) => {
  const [gans, setGans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createGan = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/admin/gan", payload);
      setGans((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchGans = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/admin/gan");
      setGans(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateGan = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/admin/gan/${id}`, payload);
      setGans((prev) => prev.map((g) => (g.id === id ? data : g)));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGan = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/gan/${id}`);
      setGans((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GanContext.Provider
      value={{ gans, loading, error, createGan, fetchGans, updateGan, deleteGan }}
    >
      {children}
    </GanContext.Provider>
  );
};
