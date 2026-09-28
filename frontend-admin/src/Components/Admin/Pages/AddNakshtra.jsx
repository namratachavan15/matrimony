// src/Components/Nakshtra/AddNakshtra.jsx
import React, { useEffect, useState } from "react";
import { useNakshtraContext } from "../State/NakshtraContext";
import { api } from "../../Config/api";

const AddNakshtra = ({ editingNakshtra, clearEditing }) => {
  const [formData, setFormData] = useState({ nakshtra: "", ctid: "" });
  const [castOptions, setCastOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createNakshtra, updateNakshtra, loading } = useNakshtraContext();

  // load cast once
  useEffect(() => {
    let mounted = true;
    const loadCasts = async () => {
      try {
        const { data } = await api.get("/api/admin/cast");
        if (mounted) setCastOptions(data || []);
      } catch (err) {
        console.error("Failed to fetch cast list", err);
      }
    };
    loadCasts();
    return () => (mounted = false); // cleanup
  }, []);

  // fill form in edit mode
  useEffect(() => {
    if (editingNakshtra) {
      setFormData({
        nakshtra: editingNakshtra.nakshtra || "",
        ctid: editingNakshtra.ctid || "",
      });
      setErrors({});
    } else {
      setFormData({ nakshtra: "", ctid: "" });
      setErrors({});
    }
  }, [editingNakshtra]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nakshtra.trim()) newErrors.nakshtra = "Enter Nakshtra name";
    if (!formData.ctid) newErrors.ctid = "Select Cast";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    const payload = { nakshtra: formData.nakshtra.trim(), ctid: Number(formData.ctid) };

    try {
      if (editingNakshtra) {
        await updateNakshtra(editingNakshtra.id, payload);
      } else {
        await createNakshtra(payload);
      }
      resetForm();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Operation failed";
      setErrors({ submit: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ nakshtra: "", ctid: "" });
    setErrors({});
    if (clearEditing) clearEditing();
  };

  const isEditMode = !!editingNakshtra;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-stars me-2"></i>
            {isEditMode ? "Update Nakshtra" : "Add New Nakshtra"}
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
                <i className="bi bi-moon-stars me-2"></i>
                Nakshtra Information
              </h5>
            </div>

            {/* Cast dropdown */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Cast * <span className="text-danger">*</span>
              </label>
              <select
                name="ctid"
                value={formData.ctid}
                className={`form-control ${errors.ctid ? "is-invalid" : ""}`}
                onChange={handleChange}
                disabled={isSubmitting || loading}
              >
                <option value="">--- Select Cast ---</option>
                {castOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.cast}</option>
                ))}
              </select>
              {errors.ctid && <div className="invalid-feedback">{errors.ctid}</div>}
            </div>

            {/* Nakshtra name */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Nakshtra Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="nakshtra"
                value={formData.nakshtra}
                onChange={handleChange}
                className={`form-control ${errors.nakshtra ? "is-invalid" : ""}`}
                placeholder="Enter Nakshtra Name"
                disabled={isSubmitting || loading}
              />
              {errors.nakshtra && <div className="invalid-feedback">{errors.nakshtra}</div>}
              <div className="form-text">
                Enter the nakshtra name (e.g., Ashwini, Bharani, Krittika)
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
                  {isEditMode ? "Update Nakshtra" : "Add Nakshtra"}
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

          {errors.submit && (
            <div className="alert alert-danger mt-3">{errors.submit}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddNakshtra;