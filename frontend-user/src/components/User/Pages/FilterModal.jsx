// src/Components/FilterModal.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./FilterModal.css";

import { 
  FaFilter, 
  FaTimes, 
  FaSearch, 
  FaCalendarAlt, 
  FaMoneyBillAlt, 
  FaGraduationCap,
  FaRulerVertical,
  FaUsers,
  FaHeart,
  FaGlobeAmericas,
  FaStethoscope,
  FaSyncAlt
} from "react-icons/fa";

import { useIncomeContext } from "../State/IncomeContext";
import { useEducationContext } from "../State/EducationContext";
import { useCastContext } from "../State/CastContext";
import { useSubcastContext } from "../State/SubcastContext";
import { useMarriageContext } from "../State/MarriageContext";
import { useCountryContext } from "../State/CountryContext";
import { useHeightBetweenContext } from "../State/HeightBetweenContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "../Components/Toast/ToastContext";
import { savedSearchService } from "../Services/savedSearchService";

const FilterModalContent = ({ isOpen, onClose, onApply }) => {
  const { incomes, loading, error } = useIncomeContext();
  const navigate = useNavigate();
  const {
    educations,
    loading: eduLoading,
    error: eduError,
  } = useEducationContext();
  const {
    cast: castOptions,
    loading: castLoading,
    error: castError,
    fetchCasts,
  } = useCastContext();
  const {
    subcasts,
    loading: subcastLoading,
    error: subcastError,
    fetchSubcasts,
  } = useSubcastContext();
  const {
    marriages,
    loading: marriageLoading,
    error: marriageError,
    fetchMarriages,
  } = useMarriageContext();
  const {
    countries,
    loading: countryLoading,
    error: countryError,
    fetchCountries,
  } = useCountryContext();
  const {
    heights,
    fetchHeights,
    loading: heightLoading,
    error: heightError,
  } = useHeightBetweenContext();

  const [loadingStates, setLoadingStates] = useState(false);
  const toast = useToast();
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [savingSearch, setSavingSearch] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = 1950; y <= currentYear; y++) {
    years.push(y);
  }

 useEffect(() => {
  if (!isOpen) return;

  document.body.classList.add("filter-modal-open");

  fetchCasts();
  fetchSubcasts();
  fetchMarriages();
  fetchCountries();
  fetchHeights();

  return () => {
    document.body.classList.remove("filter-modal-open");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isOpen]);

if (!isOpen) return null;  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingStates(true);

    const form = new FormData(e.target);

    const filters = {
      fromBirthYear: form.get("fromBirthYear") || "",
      toBirthYear: form.get("toBirthYear") || "",
      income: form.get("income") || "",
      education: form.get("education") || "",
      height: form.get("height") || "",
      cast: form.get("cast") || "",
      subcast: form.get("subcast") || "",
      disease: form.get("disease") || "",
      marriageType: form.get("marriageType") || "",
      workCountry: form.get("workCountry") || "",
    };

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onApply(filters);
    navigate("/dashboard");
  
    setLoadingStates(false);
  };

  const handleReset = () => {
    const form = document.querySelector('.filter-modal-form');
    if (form) form.reset();
  };

  // Part 12 (Saved Search): reads the same fields handleSubmit does, but from
  // the live form directly, so "Save Search" captures whatever is currently
  // filled in without requiring the user to hit Apply first.
  const readCurrentFilters = () => {
    const form = document.querySelector('.filter-modal-form');
    if (!form) return null;
    const fd = new FormData(form);
    return {
      fromBirthYear: fd.get("fromBirthYear") || "",
      toBirthYear: fd.get("toBirthYear") || "",
      income: fd.get("income") || "",
      education: fd.get("education") || "",
      height: fd.get("height") || "",
      cast: fd.get("cast") || "",
      subcast: fd.get("subcast") || "",
      disease: fd.get("disease") || "",
      marriageType: fd.get("marriageType") || "",
      workCountry: fd.get("workCountry") || "",
    };
  };

  const handleSaveSearch = async () => {
    if (!searchName.trim()) {
      toast.info("Give this search a name first.");
      return;
    }
    const filters = readCurrentFilters();
    setSavingSearch(true);
    try {
      await savedSearchService.create(searchName.trim(), filters);
      toast.success(`Saved search "${searchName.trim()}".`);
      setSearchName("");
      setShowSaveInput(false);
    } catch (e) {
      const msg = e?.response?.data || "Could not save this search.";
      toast.error(typeof msg === "string" ? msg : "Could not save this search.");
    } finally {
      setSavingSearch(false);
    }
  };

  return (
    <div className="filter-modal-backdrop">
      <div className="filter-modal">
        {/* Header */}
        <div className="filter-modal-header">
          <div className="filter-header-content">
            <div className="filter-icon-title">
              <FaFilter className="filter-header-icon" />
              <h2>Filter Profiles</h2>
            </div>
            <p>Refine your search to find perfect matches</p>
          </div>
          <button
            type="button"
            className="filter-modal-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="filter-modal-form">
          <div className="filter-modal-body">
            {/* Birth Year Range */}
            <div className="filter-section">
              <h3 className="filter-section-title">
                <FaCalendarAlt className="section-icon" />
                Age Range
              </h3>
              <div className="filter-row">
                <div className="filter-field">
                  <label className="filter-label">
                    From Year
                  </label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <select name="fromBirthYear" className="filter-input">
                      <option value="">Select Start Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="filter-field">
                  <label className="filter-label">
                    To Year
                  </label>
                  <div className="input-with-icon">
                    <FaCalendarAlt className="input-icon" />
                    <select name="toBirthYear" className="filter-input">
                      <option value="">Select End Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Income & Education */}
            <div className="filter-section">
              <h3 className="filter-section-title">
                <FaMoneyBillAlt className="section-icon" />
                Career & Education
              </h3>
              <div className="filter-row">
                <div className="filter-field">
                  <label className="filter-label">
                    Income Range
                  </label>
                  <div className="input-with-icon">
                    <FaMoneyBillAlt className="input-icon" />
                    <select name="income" className="filter-input">
                      <option value="">Any Income</option>
                      {loading && <option>Loading incomes...</option>}
                      {error && <option disabled>Error loading incomes</option>}
                      {!loading &&
                        !error &&
                        incomes.map((income) => (
                          <option key={income.id} value={income.income}>
                            {income.income}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="filter-field">
                  <label className="filter-label">
                    Education
                  </label>
                  <div className="input-with-icon">
                    <FaGraduationCap className="input-icon" />
                    <select name="education" className="filter-input">
                      <option value="">Any Education</option>
                      {eduLoading && <option>Loading education...</option>}
                      {eduError && (
                        <option disabled>Error loading education</option>
                      )}
                      {!eduLoading &&
                        !eduError &&
                        educations.map((edu) => (
                          <option key={edu.id} value={edu.education}>
                            {edu.education}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="filter-section">
              <h3 className="filter-section-title">
                <FaRulerVertical className="section-icon" />
                Physical Attributes
              </h3>
              <div className="filter-row">
                <div className="filter-field">
                  <label className="filter-label">
                    Height
                  </label>
                  <div className="input-with-icon">
                    <FaRulerVertical className="input-icon" />
                    <select name="height" className="filter-input">
                      <option value="">Any Height</option>
                      {heightLoading && <option>Loading heights...</option>}
                      {heightError && (
                        <option disabled>Error loading heights</option>
                      )}
                      {!heightLoading &&
                        !heightError &&
                        heights.map((h) => (
                          <option key={h.id} value={h.heightBetween}>
                            {h.heightBetween}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="filter-field">
                  <label className="filter-label">
                    Health Condition
                  </label>
                  <div className="input-with-icon">
                    <FaStethoscope className="input-icon" />
                    <select name="disease" className="filter-input">
                      <option value="">Any Condition</option>
                      <option value="none">No Disease</option>
                      <option value="minor">Minor Issues</option>
                      <option value="major">Major Issues</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Background & Culture */}
            <div className="filter-section">
              <h3 className="filter-section-title">
                <FaUsers className="section-icon" />
                Background & Culture
              </h3>
              <div className="filter-row">
                <div className="filter-field">
                  <label className="filter-label">
                    Cast
                  </label>
                  <div className="input-with-icon">
                    <FaUsers className="input-icon" />
                    <select name="cast" className="filter-input">
                      <option value="">Any Cast</option>
                      {castLoading && <option>Loading casts...</option>}
                      {castError && <option disabled>Error loading casts</option>}
                      {!castLoading &&
                        !castError &&
                        castOptions.map((c) => (
                          <option key={c.id} value={c.cast}>
                            {c.cast}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="filter-field">
                  <label className="filter-label">
                    Subcast
                  </label>
                  <div className="input-with-icon">
                    <FaUsers className="input-icon" />
                    <select name="subcast" className="filter-input">
                      <option value="">Any Subcast</option>
                      {subcastLoading && <option>Loading subcasts...</option>}
                      {subcastError && (
                        <option disabled>Error loading subcasts</option>
                      )}
                      {!subcastLoading &&
                        !subcastError &&
                        subcasts.map((s) => (
                          <option key={s.id} value={s.subcast}>
                            {s.subcast}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifestyle & Location */}
            <div className="filter-section">
              <h3 className="filter-section-title">
                <FaHeart className="section-icon" />
                Lifestyle & Location
              </h3>
              <div className="filter-row">
                <div className="filter-field">
                  <label className="filter-label">
                    Marriage Type
                  </label>
                  <div className="input-with-icon">
                    <FaHeart className="input-icon" />
                    <select name="marriageType" className="filter-input">
                      <option value="">Any Type</option>
                      {marriageLoading && <option>Loading types...</option>}
                      {marriageError && (
                        <option disabled>Error loading marriage types</option>
                      )}
                      {!marriageLoading &&
                        !marriageError &&
                        marriages.map((m) => (
                          <option key={m.id} value={m.marriageType}>
                            {m.marriage}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="filter-field">
                  <label className="filter-label">
                    Work Country
                  </label>
                  <div className="input-with-icon">
                    <FaGlobeAmericas className="input-icon" />
                    <select name="workCountry" className="filter-input">
                      <option value="">Any Country</option>
                      {countryLoading && <option>Loading countries...</option>}
                      {countryError && (
                        <option disabled>Error loading countries</option>
                      )}
                      {!countryLoading &&
                        !countryError &&
                        countries.map((c) => (
                          <option key={c.id} value={c.country}>
                            {c.country}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="filter-modal-footer">
            <button
              type="button"
              className="filter-btn filter-btn-secondary"
              onClick={handleReset}
            >
              <FaSyncAlt className="btn-icon" />
              Reset Filters
            </button>

            {showSaveInput ? (
              <div className="save-search-inline">
                <input
                  type="text"
                  className="save-search-input"
                  placeholder="Name this search..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  maxLength={100}
                  autoFocus
                />
                <button
                  type="button"
                  className="filter-btn filter-btn-primary save-search-confirm-btn"
                  onClick={handleSaveSearch}
                  disabled={savingSearch}
                >
                  {savingSearch ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="filter-btn filter-btn-outline"
                  onClick={() => {
                    setShowSaveInput(false);
                    setSearchName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="filter-btn filter-btn-outline"
                onClick={() => setShowSaveInput(true)}
              >
                Save Search
              </button>
            )}

            <div className="filter-action-buttons">
              <button
                type="button"
                className="filter-btn filter-btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="filter-btn filter-btn-primary"
                disabled={loadingStates}
              >
                {loadingStates ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Applying...
                  </>
                ) : (
                  <>
                    <FaSearch className="btn-icon" />
                    Apply Filters
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const FilterModal = (props) => {
  const { isOpen } = props;
  if (!isOpen) return null;     // 👈 only control here

  return ReactDOM.createPortal(
    <FilterModalContent {...props} />,
    document.body
  );
};


export default FilterModal;