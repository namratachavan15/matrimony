import React, { createContext, useContext, useState } from "react";
import { api } from "../../Config/api";

const CountryContext = createContext();

export const useCountryContext = () => useContext(CountryContext);

export const CountryProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/country");
      setCountries(data);
      console.log("fetched countries",data)
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  const createCountry = async (payload) => {
    setLoading(true);
    try {
      await api.post("/api/admin/country", payload);
      fetchCountries();
    } catch (err) {
      setError(err.message || "Failed to add country");
    } finally {
      setLoading(false);
    }
  };

  const updateCountry = async (id, payload) => {
    setLoading(true);
    try {
      await api.put(`/api/admin/country/${id}`, payload);
      fetchCountries();
    } catch (err) {
      setError(err.message || "Failed to update country");
    } finally {
      setLoading(false);
    }
  };

  const deleteCountry = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/admin/country/${id}`);
      fetchCountries();
    } catch (err) {
      setError(err.message || "Failed to delete country");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CountryContext.Provider value={{
      countries,
      fetchCountries,
      createCountry,
      updateCountry,
      deleteCountry,
      loading,
      error
    }}>
      {children}
    </CountryContext.Provider>
  );
};
