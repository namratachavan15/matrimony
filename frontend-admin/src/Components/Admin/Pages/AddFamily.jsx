// src/Components/Admin/AddFamily.jsx
import React, { useState, useEffect } from "react";
import { useUserContext } from "../State/UserContext";
import { useFamilyContext } from "../State/FamilyContext";

const AddFamily = ({ editingFamily, setEditingFamily }) => {
  const { users } = useUserContext();
  const { createFamily, updateFamily } = useFamilyContext();

  const initialFormData = {
    uid: "",
    father: "",
    fatherOccupation: "",
    mother: "",
    motherOccupation: "",
    brother: "",
    brotherOccupation: "",
    sister: "",
    propertyDetails: "",
    otherDetails: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // when editingFamily changes, populate or reset form
  useEffect(() => {
    if (editingFamily) {
      setFormData({
        ...initialFormData,
        ...editingFamily,
      });
      setErrors({});
    } else {
      setFormData(initialFormData);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingFamily]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear error for this field on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validation for all fields
  const validate = () => {
    const newErrors = {};

    if (!formData.uid) {
      newErrors.uid = "User is required";
    }

    if (!formData.father.trim()) {
      newErrors.father = "Father name is required";
    }

    if (!formData.fatherOccupation.trim()) {
      newErrors.fatherOccupation = "Father occupation is required";
    }

    if (!formData.mother.trim()) {
      newErrors.mother = "Mother name is required";
    }

    if (!formData.motherOccupation.trim()) {
      newErrors.motherOccupation = "Mother occupation is required";
    }

    if (!formData.brother.trim()) {
      newErrors.brother = "Brother name is required";
    }

    if (!formData.brotherOccupation.trim()) {
      newErrors.brotherOccupation = "Brother occupation is required";
    }

    if (!formData.sister.trim()) {
      newErrors.sister = "Sister name is required";
    }

    if (!formData.propertyDetails.trim()) {
      newErrors.propertyDetails = "Property details are required";
    }

    if (!formData.otherDetails.trim()) {
      newErrors.otherDetails = "Other details are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validate();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingFamily) {
        // update mode
        await updateFamily(editingFamily.id, formData);
      } else {
        // create mode
        await createFamily(formData);
      }

      setFormData(initialFormData);
      setErrors({});
      setEditingFamily && setEditingFamily(null);
    } catch (error) {
      console.error("Error saving family:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingFamily && setEditingFamily(null);
  };

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-house-heart me-2"></i>
            {editingFamily ? "Update Family Information" : "Add New Family"}
          </h4>
          {editingFamily && (
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={() => setEditingFamily(null)}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to List
            </button>
          )}
        </div>
      </div>

      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          {/* User Selection */}
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="text-primary mb-3 border-bottom pb-2">
                <i className="bi bi-person-badge me-2"></i>
                User Information
              </h5>
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Select User * <span className="text-danger">*</span>
              </label>
              <select
                name="uid"
                className={`form-control ${errors.uid ? "is-invalid" : ""}`}
                value={formData.uid}
                onChange={handleChange}
                required
                disabled={isSubmitting || editingFamily}
              >
                <option value="">--- Select User ---</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.uname} (ID: {user.id}) - {user.umobile}
                  </option>
                ))}
              </select>
              {errors.uid && (
                <div className="invalid-feedback">{errors.uid}</div>
              )}
            </div>
          </div>

          {/* Father & Mother Information */}
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="text-primary mb-3 border-bottom pb-2">
                <i className="bi bi-people-fill me-2"></i>
                Parents Information
              </h5>
            </div>

            {/* Father Name */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">
                Father Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="father"
                className={`form-control ${errors.father ? "is-invalid" : ""}`}
                placeholder="Enter Father Name"
                value={formData.father}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.father && (
                <div className="invalid-feedback">{errors.father}</div>
              )}
            </div>

            {/* Father Occupation */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">
                Father Occupation * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="fatherOccupation"
                className={`form-control ${
                  errors.fatherOccupation ? "is-invalid" : ""
                }`}
                placeholder="Enter Occupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.fatherOccupation && (
                <div className="invalid-feedback">
                  {errors.fatherOccupation}
                </div>
              )}
            </div>

            {/* Mother Name */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">
                Mother Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="mother"
                className={`form-control ${errors.mother ? "is-invalid" : ""}`}
                placeholder="Enter Mother Name"
                value={formData.mother}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.mother && (
                <div className="invalid-feedback">{errors.mother}</div>
              )}
            </div>

            {/* Mother Occupation */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">
                Mother Occupation * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="motherOccupation"
                className={`form-control ${
                  errors.motherOccupation ? "is-invalid" : ""
                }`}
                placeholder="Enter Occupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.motherOccupation && (
                <div className="invalid-feedback">
                  {errors.motherOccupation}
                </div>
              )}
            </div>
          </div>

          {/* Siblings Information */}
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="text-primary mb-3 border-bottom pb-2">
                <i className="bi bi-person-arms-up me-2"></i>
                Siblings Information
              </h5>
            </div>

            {/* Brother Name */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">
                Brother Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="brother"
                className={`form-control ${
                  errors.brother ? "is-invalid" : ""
                }`}
                placeholder="Enter Brother Name"
                value={formData.brother}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.brother && (
                <div className="invalid-feedback">{errors.brother}</div>
              )}
            </div>

            {/* Brother Occupation */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">
                Brother Occupation * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="brotherOccupation"
                className={`form-control ${
                  errors.brotherOccupation ? "is-invalid" : ""
                }`}
                placeholder="Enter Occupation"
                value={formData.brotherOccupation}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.brotherOccupation && (
                <div className="invalid-feedback">
                  {errors.brotherOccupation}
                </div>
              )}
            </div>

            {/* Sister Name */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold">
                Sister Name * <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="sister"
                className={`form-control ${
                  errors.sister ? "is-invalid" : ""
                }`}
                placeholder="Enter Sister Name"
                value={formData.sister}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.sister && (
                <div className="invalid-feedback">{errors.sister}</div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="text-primary mb-3 border-bottom pb-2">
                <i className="bi bi-file-text me-2"></i>
                Additional Information
              </h5>
            </div>

            {/* Property Details */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Property Details * <span className="text-danger">*</span>
              </label>
              <textarea
                name="propertyDetails"
                className={`form-control ${
                  errors.propertyDetails ? "is-invalid" : ""
                }`}
                rows="4"
                placeholder="Enter property details, assets, land information..."
                value={formData.propertyDetails}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.propertyDetails && (
                <div className="invalid-feedback">
                  {errors.propertyDetails}
                </div>
              )}
            </div>

            {/* Other Details */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Other Details * <span className="text-danger">*</span>
              </label>
              <textarea
                name="otherDetails"
                className={`form-control ${
                  errors.otherDetails ? "is-invalid" : ""
                }`}
                rows="4"
                placeholder="Enter any other family details, background information..."
                value={formData.otherDetails}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              {errors.otherDetails && (
                <div className="invalid-feedback">
                  {errors.otherDetails}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 pt-3 border-top">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {editingFamily ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <i className={`bi ${editingFamily ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                  {editingFamily ? "Update Family" : "Add Family"}
                </>
              )}
            </button>
            
            {editingFamily && (
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamily;