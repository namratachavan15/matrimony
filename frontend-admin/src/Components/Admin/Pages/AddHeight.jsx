import React, { useEffect, useState } from "react";
import { useHeightContext } from "../State/HeightContext";

const AddHeight = ({ editingHeight, clearEditing }) => {
  const { createHeight, updateHeight, loading } = useHeightContext();
  const [formData, setFormData] = useState({ height: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingHeight) {
      setFormData({ height: editingHeight.height || "" });
      setError("");
    } else {
      setFormData({ height: "" });
      setError("");
    }
  }, [editingHeight]);

  const handleChange = (e) => {
    setFormData({ height: e.target.value });
    setError("");
  };

  const resetForm = () => {
    setFormData({ height: "" });
    setError("");
    if (clearEditing) clearEditing();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.height.trim()) {
      setError("Enter height value");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingHeight) {
        await updateHeight(editingHeight.id, { height: formData.height.trim() });
      } else {
        await createHeight({ height: formData.height.trim() });
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!editingHeight;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-rulers me-2"></i>
            {isEditMode ? "Update Height" : "Add New Height"}
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
                Height Information
              </h5>
            </div>

            {/* Height value */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Height * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className={`form-control ${error && !formData.height ? "is-invalid" : ""}`}
                placeholder="Enter Height"
                disabled={isSubmitting || loading}
              />
              {error && !formData.height && (
                <div className="invalid-feedback">{error}</div>
              )}
              <div className="form-text">
                Enter height value (e.g., 5'6\", 5'8\", 170 cm, 175 cm, etc.)
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
                  {isEditMode ? "Update Height" : "Add Height"}
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

          {error && formData.height && (
            <div className="alert alert-danger mt-3">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddHeight;