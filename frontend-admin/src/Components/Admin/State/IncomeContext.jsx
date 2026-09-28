// src/State/IncomeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const IncomeContext = createContext();
export const useIncomeContext = () => useContext(IncomeContext);

export const IncomeProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchIncomes = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("http://localhost:5454/api/income");
      setIncomes(data);
    } catch (err) {
      setError(err.message || "Failed to fetch incomes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []); // fetch once on mount

  return (
    <IncomeContext.Provider
      value={{ incomes, loading, error, fetchIncomes }}
    >
      {children}
    </IncomeContext.Provider>
  );
};
