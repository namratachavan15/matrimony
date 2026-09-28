// src/Component/State/DistrictContext.jsx
import React, { createContext, useContext, useState } from "react";
import { api } from "../../Config/api";

const DistrictContext = createContext();

export const DistrictProvider = ({ children }) => {
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [districtError, setDistrictError] = useState(null);

  // stateId = stid
  const fetchDistrictsByState = async (stateId) => {
    try {
      setLoadingDistricts(true);
      setDistrictError(null);

      if (!stateId) {
        setDistricts([]);
        return;
      }

      const { data } = await api.get(
        `/api/admin/district/by-state/${stateId}`
      );
      setDistricts(data || []);
    } catch (err) {
      console.error("Error fetching districts:", err);
      setDistrictError("Failed to load districts");
    } finally {
      setLoadingDistricts(false);
    }
  };

  return (
    <DistrictContext.Provider
      value={{
        districts,
        loadingDistricts,
        districtError,
        fetchDistrictsByState,
      }}
    >
      {children}
    </DistrictContext.Provider>
  );
};

export const useDistrictContext = () => useContext(DistrictContext);
