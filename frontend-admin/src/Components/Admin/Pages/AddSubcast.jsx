// src/Components/Subcast/AddSubcast.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../Config/api";
import { useSubcastContext } from "../State/SubcastContext";

const AddSubcast = ({ editingSubcast, clearEditing }) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    subcast: "",
    ctid: "",   // cast id
  });

  const [castOptions, setCastOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createSubcast, updateSubcast, loading } = useSubcastContext();

  // Load cast dropdown
  useEffect(() => {
    const loadCasts = async () => {
      try {
        const { data } = await api.get("/api/admin/cast");
        setCastOptions(data || []);
      } catch (err) {
        console.error("Error fetching cast list for subcast form:", err);
      }
    };
    loadCasts();
  }, []);

  // when editingSubcast changes, fill the form
  useEffect(() => {
    if (editingSubcast) {
      setFormData({
        subcast: editingSubcast.subcast || "",
        ctid: editingSubcast.ctid || "",
      });
      setError("");
    } else {
      setFormData({ subcast: "", ctid: "" });
    }
  }, [editingSubcast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const resetForm = () => {
    setFormData({ subcast: "", ctid: "" });
    setError("");
    if (clearEditing) clearEditing();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.subcast.trim()) {
      setError("Please enter Subcast Name.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.ctid) {
      setError("Please select Cast.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      subcast: formData.subcast.trim(),
      ctid: Number(formData.ctid),
    };

    try {
      if (editingSubcast) {
        await updateSubcast(editingSubcast.id, payload);
      } else {
        await createSubcast(payload);
      }
      resetForm();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (editingSubcast ? "Failed to update subcast." : "Failed to add subcast.");
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!editingSubcast;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-diagram-3 me-2"></i>
            {isEditMode ? "Update Subcast" : "Add New Subcast"}
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
                <i className="bi bi-tags me-2"></i>
                Subcast Information
              </h5>
            </div>

            {/* Cast dropdown */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Cast * <span className="text-danger">*</span>
              </label>
              <select
                name="ctid"
                className={`form-control ${error && !formData.ctid ? "is-invalid" : ""}`}
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
              {error && !formData.ctid && (
                <div className="invalid-feedback">{error}</div>
              )}
            </div>

            {/* Subcast name */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Subcast Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${
                  error && !formData.subcast ? "is-invalid" : ""
                }`}
                name="subcast"
                value={formData.subcast}
                onChange={handleChange}
                placeholder="Enter Subcast Name"
                required
                disabled={isSubmitting || loading}
              />
              {error && !formData.subcast && (
                <div className="invalid-feedback">{error}</div>
              )}
              <div className="form-text">
                Enter the subcast name for the selected cast
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
                  {isEditMode ? "Update Subcast" : "Add Subcast"}
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

          {error && formData.ctid && formData.subcast && (
            <div className="alert alert-danger mt-3">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddSubcast;