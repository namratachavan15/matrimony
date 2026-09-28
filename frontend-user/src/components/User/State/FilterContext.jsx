import React, { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const useFilterContext = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    fromBirthYear: "",
    toBirthYear: "",
    income: "",
    education: "",
    height: "",
    cast: "",
    subcast: "",
    disease: "",
    marriageType: "",
    workCountry: "",
  });

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      fromBirthYear: "",
      toBirthYear: "",
      income: "",
      education: "",
      height: "",
      cast: "",
      subcast: "",
      disease: "",
      marriageType: "",
      workCountry: "",
    });
  };

  return (
    <FilterContext.Provider value={{ filters, applyFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
