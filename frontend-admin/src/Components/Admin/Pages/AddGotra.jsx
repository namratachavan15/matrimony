// src/Components/Gotra/AddGotra.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../Config/api";
import { useGotraContext } from "../State/GotraContext";

const AddGotra = ({ editingGotra, clearEditing }) => {
  const [formData, setFormData] = useState({ gotra: "", ctid: "" });
  const [errors, setErrors] = useState({});
  const [castOptions, setCastOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createGotra, updateGotra, loading } = useGotraContext();

  // Load cast dropdown
  useEffect(() => {
    const loadCasts = async () => {
      try {
        const { data } = await api.get("/api/admin/cast");
        setCastOptions(data || []);
      } catch (err) {
        console.error("Error fetching cast list for gotra form:", err);
      }
    };
    loadCasts();
  }, []);

  // Edit mode: fill data
  useEffect(() => {
    if (editingGotra) {
      setFormData({
        gotra: editingGotra.gotra || "",
        ctid: editingGotra.ctid || "",
      });
      setErrors({});
    } else {
      setFormData({ gotra: "", ctid: "" });
      setErrors({});
    }
  }, [editingGotra]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.ctid) newErrors.ctid = "Please select Cast.";
    if (!formData.gotra.trim()) newErrors.gotra = "Please enter Gotra Name.";
    else if (formData.gotra.trim().length < 2)
      newErrors.gotra = "Gotra name must be at least 2 characters.";
    
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

    const payload = {
      gotra: formData.gotra.trim(),
      ctid: Number(formData.ctid),
    };

    try {
      if (editingGotra) {
        await updateGotra(editingGotra.id, payload);
      } else {
        await createGotra(payload);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message ||
        (editingGotra ? "Failed to update gotra." : "Failed to add gotra.");
      setErrors({ submit: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ gotra: "", ctid: "" });
    setErrors({});
    if (clearEditing) clearEditing();
  };

  const isEditMode = !!editingGotra;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-tree me-2"></i>
            {isEditMode ? "Update Gotra" : "Add New Gotra"}
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
                Gotra Information
              </h5>
            </div>

            {/* Cast dropdown */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Cast * <span className="text-danger">*</span>
              </label>
              <select
                name="ctid"
                className={`form-control ${errors.ctid ? "is-invalid" : ""}`}
                value={formData.ctid}
                onChange={handleChange}
                disabled={isSubmitting || loading}
              >
                <option value="">--- Select Cast ---</option>
                {castOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cast}
                  </option>
                ))}
              </select>
              {errors.ctid && <div className="invalid-feedback">{errors.ctid}</div>}
            </div>

            {/* Gotra name */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Gotra Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.gotra ? "is-invalid" : ""}`}
                name="gotra"
                value={formData.gotra}
                onChange={handleChange}
                placeholder="Enter Gotra Name"
                disabled={isSubmitting || loading}
              />
              {errors.gotra && <div className="invalid-feedback">{errors.gotra}</div>}
              <div className="form-text">
                Enter the gotra name (minimum 2 characters)
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
                  {isEditMode ? "Update Gotra" : "Add Gotra"}
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

export default AddGotra;