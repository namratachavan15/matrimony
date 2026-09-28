import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../Config/api";

const EducationContext = createContext();

export const EducationProvider = ({ children }) => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEducations = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/api/admin/education");
      setEducations(data);
    } catch (err) {
      setError("Failed to fetch education list");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch educations automatically on mount
  useEffect(() => {
    fetchEducations();
  }, []);

  const createEducation = async (education) => {
    const { data } = await api.post("/api/admin/education", education);
    setEducations((prev) => [...prev, data]);
  };

  const updateEducation = async (id, education) => {
    const { data } = await api.put(`/api/admin/education/${id}`, education);
    setEducations((prev) => prev.map((e) => (e.id === id ? data : e)));
  };

  const deleteEducation = async (id) => {
    await api.delete(`/api/admin/education/${id}`);
    setEducations((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <EducationContext.Provider
      value={{
        educations,
        fetchEducations,
        createEducation,
        updateEducation,
        deleteEducation,
        loading,
        error,
      }}
    >
      {children}
    </EducationContext.Provider>
  );
};

export const useEducationContext = () => useContext(EducationContext);
