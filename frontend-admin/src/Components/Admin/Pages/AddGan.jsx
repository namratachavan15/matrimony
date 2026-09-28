// src/Components/Gan/AddGan.jsx
import React, { useEffect, useState } from "react";
import { useGanContext } from "../State/GanContext";
import { api } from "../../Config/api";

const AddGan = ({ editingGan, clearEditing }) => {
  const [formData, setFormData] = useState({ gan: "", ctid: "" });
  const [castOptions, setCastOptions] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createGan, updateGan, loading } = useGanContext();

  useEffect(() => {
    const loadCasts = async () => {
      try {
        const { data } = await api.get("/api/admin/cast");
        setCastOptions(data || []);
      } catch (err) {
        console.error("Failed to fetch cast list", err);
      }
    };
    loadCasts();
  }, []);

  useEffect(() => {
    if (editingGan) {
      setFormData({
        gan: editingGan.gan || "",
        ctid: editingGan.ctid || "",
      });
      setError("");
    } else {
      setFormData({ gan: "", ctid: "" });
      setError("");
    }
  }, [editingGan]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const resetForm = () => {
    setFormData({ gan: "", ctid: "" });
    setError("");
    if (clearEditing) clearEditing();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.gan.trim()) {
      setError("Enter Gan name");
      setIsSubmitting(false);
      return;
    }
    if (!formData.ctid) {
      setError("Select Cast");
      setIsSubmitting(false);
      return;
    }

    const payload = { gan: formData.gan.trim(), ctid: Number(formData.ctid) };
    try {
      if (editingGan) {
        await updateGan(editingGan.id, payload);
      } else {
        await createGan(payload);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!editingGan;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-diagram-2 me-2"></i>
            {isEditMode ? "Update Gan" : "Add New Gan"}
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
                Gan Information
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
                onChange={handleChange}
                className={`form-control ${error && !formData.ctid ? "is-invalid" : ""}`}
                disabled={isSubmitting || loading}
              >
                <option value="">--- Select Cast ---</option>
                {castOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.cast}</option>
                ))}
              </select>
              {error && !formData.ctid && (
                <div className="invalid-feedback">{error}</div>
              )}
            </div>

            {/* Gan name */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Gan Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="gan"
                value={formData.gan}
                onChange={handleChange}
                className={`form-control ${error && !formData.gan ? "is-invalid" : ""}`}
                placeholder="Enter Gan Name"
                disabled={isSubmitting || loading}
              />
              {error && !formData.gan && (
                <div className="invalid-feedback">{error}</div>
              )}
              <div className="form-text">
                Enter the gan name (e.g., Deva, Manushya, Rakshasa)
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
                  {isEditMode ? "Update Gan" : "Add Gan"}
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

          {error && formData.ctid && formData.gan && (
            <div className="alert alert-danger mt-3">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddGan;