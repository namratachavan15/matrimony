import { createContext, useContext, useState } from "react";
import { api } from "../../Config/api";

const RashiContext = createContext();
export const useRashiContext = () => useContext(RashiContext);

export const RashiProvider = ({ children }) => {
  const [rashis, setRashis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRashis = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/admin/rashi");
      setRashis(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRashi = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/admin/rashi", payload);
      setRashis((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRashi = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/admin/rashi/${id}`, payload);
      setRashis((prev) => prev.map((r) => (r.id === id ? data : r)));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRashi = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/rashi/${id}`);
      setRashis((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RashiContext.Provider
      value={{
        rashis,
        loading,
        error,
        fetchRashis,
        createRashi,
        updateRashi,
        deleteRashi,
      }}
    >
      {children}
    </RashiContext.Provider>
  );
};
