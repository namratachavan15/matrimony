import React, { useEffect, useState } from "react";
import { useCountryContext } from "../State/CountryContext";

const AddCountry = ({ editingCountry, clearEditing }) => {
  const { createCountry, updateCountry, loading } = useCountryContext();
  const [formData, setFormData] = useState({ country: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCountry) {
      setFormData({ country: editingCountry.country || "" });
      setError("");
    } else {
      setFormData({ country: "" });
      setError("");
    }
  }, [editingCountry]);

  const handleChange = (e) => {
    setFormData({ country: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!formData.country.trim()) {
      setError("Please enter country name.");
      return false;
    } else if (formData.country.trim().length < 2) {
      setError("Country name must be at least 2 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const resetForm = () => {
    setFormData({ country: "" });
    setError("");
    if (clearEditing) clearEditing();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = { country: formData.country.trim(), status: 1 };
      if (editingCountry) {
        await updateCountry(editingCountry.id, payload);
      } else {
        await createCountry(payload);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!editingCountry;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-globe-americas me-2"></i>
            {isEditMode ? "Update Country" : "Add New Country"}
          </h4>
          {isEditMode && (
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={resetForm}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to List
            </button>
          )}
        </div>
      </div>

      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="text-primary mb-3 border-bottom pb-2">
                <i className="bi bi-info-circle me-2"></i>
                Country Information
              </h5>
            </div>

            {/* Country name */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Country Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder="Enter Country Name"
                disabled={isSubmitting || loading}
              />
              {error && (
                <div className="invalid-feedback">{error}</div>
              )}
              <div className="form-text">
                Enter full country name (e.g., United States, India, United Kingdom, etc.)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 pt-3 border-top">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <i className={`bi ${isEditMode ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                  {isEditMode ? "Update Country" : "Add Country"}
                </>
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              <i className="bi bi-x-lg me-2"></i>
              {isEditMode ? "Cancel" : "Reset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCountry;