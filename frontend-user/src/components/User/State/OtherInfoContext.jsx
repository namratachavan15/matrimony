// src/Components/State/OtherInfoContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../Config/api";

const OtherInfoContext = createContext();

export const useOtherInfoContext = () => useContext(OtherInfoContext);

export const OtherInfoProvider = ({ children }) => {
  const [otherInfo, setOtherInfo] = useState(null); // ✅ single record for a user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOtherInfoByUserId = useCallback(async (uid) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/api/admin/otherinfo/by-user/${uid}`);
      setOtherInfo(res.data || null);
      return res.data;
    } catch (err) {
      // ✅ If backend returns 404, just treat it as "no other info", not an error
      if (err.response && err.response.status === 404) {
        console.log("No other info found for user", uid);
        setOtherInfo(null);
        return null;
      }
  
      console.error("Error fetching other info:", err);
      setError(err.response?.data?.message || "Failed to load other info");
      setOtherInfo(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  

  const updateOtherInfo = useCallback(async (id, payload) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.put(`/api/admin/otherinfo/${id}`, payload);
      setOtherInfo(res.data); // update local state with new data
      return res.data;
    } catch (err) {
      console.error("Error updating other info:", err);
      setError(err.response?.data?.message || "Failed to update other info");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <OtherInfoContext.Provider
      value={{
        otherInfo,           // ✅ single record
        loading,
        error,
        fetchOtherInfoByUserId,
        updateOtherInfo,
      }}
    >
      {children}
    </OtherInfoContext.Provider>
  );
};
