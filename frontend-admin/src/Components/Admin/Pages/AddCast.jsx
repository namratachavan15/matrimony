// src/Components/Admin/AddCast.jsx
import React, { useEffect, useState } from "react";
import { useCastContext } from "../State/CastContext";

const AddCast = ({ editingCast, clearEditing }) => {
  const [formData, setFormData] = useState({ cast: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createCast, updateCast, loading } = useCastContext();

  // Fill form when editing
  useEffect(() => {
    if (editingCast) {
      setFormData({ cast: editingCast.cast || "" });
      setErrors({});
    } else {
      setFormData({ cast: "" });
      setErrors({});
    }
  }, [editingCast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
  };

  const resetForm = () => {
    setFormData({ cast: "" });
    setErrors({});
    if (clearEditing) clearEditing();
  };

  // ✅ Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.cast.trim()) {
      newErrors.cast = "Please enter Cast Name.";
    } else if (formData.cast.length < 2) {
      newErrors.cast = "Cast Name must be at least 2 characters.";
    }
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

    try {
      if (editingCast) {
        await updateCast(editingCast.id, { cast: formData.cast });
      } else {
        await createCast(formData);
      }
      resetForm();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (editingCast ? "Failed to update cast." : "Failed to add cast.");
      setErrors({ cast: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!editingCast;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-people me-2"></i>
            {isEditMode ? "Update Cast" : "Add New Cast"}
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
                <i className="bi bi-tag me-2"></i>
                Cast Information
              </h5>
            </div>
            
            <div className="col-md-12">
              <label className="form-label fw-semibold">
                Cast Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="cast"
                className={`form-control ${errors.cast ? "is-invalid" : ""}`}
                value={formData.cast}
                onChange={handleChange}
                placeholder="Enter Cast Name"
                disabled={isSubmitting || loading}
              />
              {errors.cast && (
                <div className="invalid-feedback">{errors.cast}</div>
              )}
              <div className="form-text">
                Enter the cast name (minimum 2 characters)
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
                  {isEditMode ? "Update Cast" : "Add Cast"}
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

export default AddCast;