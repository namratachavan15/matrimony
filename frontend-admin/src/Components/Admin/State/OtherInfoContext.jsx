// src/Component/State/OtherInfoContext.jsx
import { createContext, useContext, useState } from "react";
import { api } from "../../Config/api";

const OtherInfoContext = createContext();
export const useOtherInfoContext = () => useContext(OtherInfoContext);

export const OtherInfoProvider = ({ children }) => {
  const [otherInfos, setOtherInfos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CREATE
  const createOtherInfo = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/admin/otherinfo", payload);
      setOtherInfos((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to create OtherInfo";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getOtherInfoByUserId = async (uid) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/admin/otherinfo/by-user/${uid}`);
      return data; // <-- This returns { rsid, nkid, ... }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to fetch user OtherInfo";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // READ (optional: fetch all or search by ID/username)
  const fetchOtherInfos = async (searchQuery = "") => {
    setLoading(true);
    setError(null);
    try {
      // If searchQuery is empty, fetch all
      const { data } = await api.get(`/api/admin/otherinfo?search=${searchQuery}`);
      setOtherInfos(data);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to fetch OtherInfo";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const updateOtherInfo = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/api/admin/otherinfo/${id}`, payload);
      setOtherInfos((prev) => prev.map((o) => (o.id === id ? data : o)));
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to update OtherInfo";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteOtherInfo = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/otherinfo/${id}`);
      setOtherInfos((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to delete OtherInfo";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OtherInfoContext.Provider
      value={{
        otherInfos,
        loading,
        error,
        createOtherInfo,
        fetchOtherInfos,
        updateOtherInfo,
        deleteOtherInfo,
        getOtherInfoByUserId
      }}
    >
      {children}
    </OtherInfoContext.Provider>
  );
};
