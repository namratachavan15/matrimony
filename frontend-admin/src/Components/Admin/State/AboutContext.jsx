import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../../Config/api";

const AboutContext = createContext();
export const useAboutContext = () => useContext(AboutContext);

export const AboutProvider = ({ children }) => {
  const [abouts, setAbouts] = useState([]);

  const [loading, setLoading] = useState(false);

  // GET ALL ABOUTS
  const fetchAbouts = async () => {
    setLoading(true);
    const res = await api.get("/api/admin/about");
    setAbouts(res.data);
    setLoading(false);
  };



  // CREATE
  const createAbout = async (payload) => {
    await api.post("/api/admin/about", payload);
    fetchAbouts();
  };

  // DELETE
  const deleteAbout = async (id) => {
    await api.delete(`/api/admin/about/${id}`);
    setAbouts((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    
    fetchAbouts();
  }, []);

  return (
    <AboutContext.Provider
      value={{
        abouts,
       
        loading,
        fetchAbouts,
        createAbout,
        deleteAbout,
      }}
    >
      {children}
    </AboutContext.Provider>
  );
};
