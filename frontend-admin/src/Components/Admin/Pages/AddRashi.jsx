// src/Components/Rashi/AddRashi.jsx
import React, { useEffect, useState } from "react";
import { useRashiContext } from "../State/RashiContext";

const AddRashi = ({ editingRashi, clearEditing }) => {
  const [ras, setRas] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createRashi, updateRashi, loading } = useRashiContext();

  useEffect(() => {
    if (editingRashi) setRas(editingRashi.ras || "");
    else setRas("");
    setError("");
  }, [editingRashi]);

  const resetForm = () => {
    setRas("");
    setError("");
    if (clearEditing) clearEditing();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!ras.trim()) {
      setError("Enter Rashi name");
      setIsSubmitting(false);
      return;
    }

    const payload = { ras: ras.trim() };

    try {
      if (editingRashi) {
        await updateRashi(editingRashi.id, payload);
      } else {
        await createRashi(payload);
      }
      resetForm();
    } catch {
      setError("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!editingRashi;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-sun me-2"></i>
            {isEditMode ? "Update Rashi" : "Add New Rashi"}
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
                Rashi Information
              </h5>
            </div>
            
            <div className="col-md-12">
              <label className="form-label fw-semibold">
                Rashi Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${error ? "is-invalid" : ""}`}
                value={ras}
                onChange={(e) => {
                  setRas(e.target.value);
                  setError("");
                }}
                placeholder="Enter Rashi Name"
                disabled={isSubmitting || loading}
              />
              {error && <div className="invalid-feedback">{error}</div>}
              <div className="form-text">
                Enter the rashi name (e.g., Mesha, Vrishabha, Mithuna)
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
                  {isEditMode ? "Update Rashi" : "Add Rashi"}
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

export default AddRashi;