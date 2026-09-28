import React, { useEffect, useState } from "react";
import { useMarriageContext } from "../State/MarriageContext";

const AddMarriage = ({ editingMarriage, clearEditing }) => {
  const { createMarriage, updateMarriage, loading } = useMarriageContext();
  const [formData, setFormData] = useState({ marriage: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingMarriage) {
      setFormData({ marriage: editingMarriage.marriage || "" });
      setError("");
    } else {
      setFormData({ marriage: "" });
      setError("");
    }
  }, [editingMarriage]);

  const handleChange = (e) => {
    setFormData({ marriage: e.target.value });
    setError("");
  };

  const resetForm = () => {
    setFormData({ marriage: "" });
    setError("");
    if (clearEditing) clearEditing();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.marriage.trim()) {
      setError("Enter marriage type");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingMarriage) {
        await updateMarriage(editingMarriage.id, { marriage: formData.marriage.trim() });
      } else {
        await createMarriage({ marriage: formData.marriage.trim() });
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!editingMarriage;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-hearts me-2"></i>
            {isEditMode ? "Update Marriage Type" : "Add New Marriage Type"}
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
                Marriage Information
              </h5>
            </div>

            {/* Marriage type */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Marriage Type * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="marriage"
                value={formData.marriage}
                onChange={handleChange}
                className={`form-control ${error && !formData.marriage ? "is-invalid" : ""}`}
                placeholder="Enter Marriage Type"
                disabled={isSubmitting || loading}
              />
              {error && !formData.marriage && (
                <div className="invalid-feedback">{error}</div>
              )}
              <div className="form-text">
                Enter marriage type (e.g., First Marriage, Second Marriage, etc.)
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
                  {isEditMode ? "Update Marriage Type" : "Add Marriage Type"}
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

          {error && formData.marriage && (
            <div className="alert alert-danger mt-3">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddMarriage;