import React, { useState, useEffect } from "react";
import { useEducationContext } from "../State/EducationContext";

const AddEducation = ({ editingEducation, clearEditing }) => {
  const { createEducation, updateEducation, loading } = useEducationContext();
  const [formData, setFormData] = useState({ education: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingEducation) {
      setFormData({ education: editingEducation.education || "" });
      setError("");
    } else {
      setFormData({ education: "" });
      setError("");
    }
  }, [editingEducation]);

  const handleChange = (e) => {
    setFormData({ education: e.target.value });
    setError("");
  };

  const resetForm = () => {
    setFormData({ education: "" });
    setError("");
    if (clearEditing) clearEditing();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.education.trim()) {
      setError("Enter Education name");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingEducation) {
        await updateEducation(editingEducation.id, { education: formData.education.trim() });
      } else {
        await createEducation({ education: formData.education.trim() });
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!editingEducation;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-mortarboard me-2"></i>
            {isEditMode ? "Update Education" : "Add New Education"}
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
                Education Information
              </h5>
            </div>

            {/* Education name */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Education Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className={`form-control ${error && !formData.education ? "is-invalid" : ""}`}
                placeholder="Enter Education Name"
                disabled={isSubmitting || loading}
              />
              {error && !formData.education && (
                <div className="invalid-feedback">{error}</div>
              )}
              <div className="form-text">
                Enter the education qualification (e.g., B.Tech, M.Sc, MBA, etc.)
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
                  {isEditMode ? "Update Education" : "Add Education"}
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

          {error && formData.education && (
            <div className="alert alert-danger mt-3">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddEducation;