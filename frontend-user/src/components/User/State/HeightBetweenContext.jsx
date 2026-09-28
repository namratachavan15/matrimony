import React, { createContext, useContext, useState } from "react";
import { api } from "../Config/api";

const HeightBetweenContext = createContext();

export const useHeightBetweenContext = () => useContext(HeightBetweenContext);

export const HeightBetweenProvider = ({ children }) => {
  const [heights, setHeights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHeights = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/heightbetween");
      setHeights(data);
      setError("");
    } catch (err) {
      console.error("Error fetching heights:", err);
      setError(err.message || "Failed to fetch heights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeightBetweenContext.Provider
      value={{ heights, fetchHeights, loading, error }}
    >
      {children}
    </HeightBetweenContext.Provider>
  );
};
