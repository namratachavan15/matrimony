// src/Component/State/StateContext.jsx
import React, { createContext, useContext, useState } from "react";
import { api } from "../../Config/api";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [stateError, setStateError] = useState(null);

  // countryId = cnid
  const fetchStatesByCountry = async (countryId) => {
    try {
      setLoadingStates(true);
      setStateError(null);

      if (!countryId) {
        setStates([]);
        return;
      }

      const { data } = await api.get(
        `/api/admin/state/by-country/${countryId}`
      );
      setStates(data || []);
    } catch (err) {
      console.error("Error fetching states:", err);
      setStateError("Failed to load states");
    } finally {
      setLoadingStates(false);
    }
  };

  return (
    <StateContext.Provider
      value={{ states, loadingStates, stateError, fetchStatesByCountry }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContextCustom = () => useContext(StateContext);
