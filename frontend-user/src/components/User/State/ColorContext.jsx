// src/components/User/State/ColorContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [colorError, setColorError] = useState(null);

  const fetchColors = async () => {
    try {
      setLoadingColors(true);
      setColorError(null);
      const res = await axios.get("http://localhost:5454/api/colors");
      setColors(res.data);
    } catch (err) {
      console.error("Error fetching colors", err);
      setColorError("Failed to load colors");
    } finally {
      setLoadingColors(false);
    }
  };

  const addColor = async (newColorName) => {
    try {
      const res = await axios.post("http://localhost:5454/api/colors", {
        color: newColorName,
      });
      // add the new color to state
      setColors((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding color", err);
      setColorError("Failed to add color");
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <ColorContext.Provider
      value={{
        colors,
        loadingColors,
        colorError,
        fetchColors,
        addColor,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => useContext(ColorContext);
