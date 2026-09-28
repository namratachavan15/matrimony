// CastContext.jsx
import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const CastContext = createContext();

export const useCastContext = () => useContext(CastContext);

export const CastProvider = ({ children }) => {
  const [cast, setCast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // CREATE
  const createCast = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post(`/api/admin/cast`, payload);
      setCast((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Error creating cast:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create cast";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // READ: get all
  const fetchCasts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/admin/cast");
      setCast(data);
    } catch (err) {
      console.error("Error fetching casts:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch casts";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const updateCast = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/admin/cast/${id}`, payload);
      setCast((prev) =>
        prev.map((c) => (c.id === id ? data : c))
      );
      return data;
    } catch (err) {
      console.error("Error updating cast:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update cast";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteCast = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/cast/${id}`);
      setCast((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting cast:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete cast";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CastContext.Provider
      value={{
        cast,
        loading,
        error,
        createCast,
        fetchCasts,
        updateCast,
        deleteCast,
      }}
    >
      {children}
    </CastContext.Provider>
  );
};
