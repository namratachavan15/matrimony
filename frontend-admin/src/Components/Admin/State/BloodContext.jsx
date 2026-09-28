import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../../Config/api";

const BloodContext = createContext();

export const useBloodContext = () => useContext(BloodContext);

export const BloodProvider = ({ children }) => {
  const [bloods, setBloods] = useState([]);
  const [loadingBloods, setLoadingBloods] = useState(false);
  const [bloodError, setBloodError] = useState(null);

  const fetchBloods = async () => {
    try {
      setLoadingBloods(true);
      const res = await api.get("/api/admin/blood");
      setBloods(res.data || []);
    } catch (error) {
      setBloodError("Failed to load blood groups");
      console.error(error);
    } finally {
      setLoadingBloods(false);
    }
  };

  useEffect(() => {
    fetchBloods();
  }, []);

  return (
    <BloodContext.Provider
      value={{ bloods, loadingBloods, bloodError, fetchBloods }}
    >
      {children}
    </BloodContext.Provider>
  );
};
