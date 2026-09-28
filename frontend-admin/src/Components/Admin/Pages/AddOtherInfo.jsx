// src/Components/Admin/AddOtherInfo.jsx
import React, { useState, useEffect } from "react";
import { useUserContext } from "../State/UserContext";
import { useRashiContext } from "../State/RashiContext";
import { useNakshtraContext } from "../State/NakshtraContext";
import { useGanContext } from "../State/GanContext";
import { useNadiContext } from "../State/NadiContext";
import { useGotraContext } from "../State/GotraContext";
import { useOtherInfoContext } from "../State/OtherInfoContext";

const AddOtherInfo = ({ editingOtherInfo, setEditingOtherInfo }) => {
  const { users } = useUserContext();
  const { rashis, fetchRashis } = useRashiContext();
  const { nakshtras, fetchNakshtras } = useNakshtraContext();
  const { gans, fetchGans } = useGanContext();
  const { nadis, fetchNadis } = useNadiContext();
  const { gotras, fetchGotras } = useGotraContext();
  const {
    createOtherInfo,
    updateOtherInfo,
    loading,
    error,
  } = useOtherInfoContext();

  const mangalOptions = ["Yes", "No", "Nirdosh", "Doesn't matter"];
  const charanOptions = ["1", "2", "3", "4"];

  const initialFormData = {
    uid: "",
    rsid: "",
    nkid: "",
    gnid: "",
    ndid: "",
    gid: "",
    charan: "",
    managal: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRashis();
    fetchNakshtras();
    fetchGans();
    fetchNadis();
    fetchGotras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // populate form in edit mode
  useEffect(() => {
    if (editingOtherInfo) {
      setFormData({
        ...initialFormData,
        ...editingOtherInfo,
      });
      setErrors({});
    } else {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [editingOtherInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear field-specific error
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validate all fields
  const validate = () => {
    const newErrors = {};

    if (!formData.uid) {
      newErrors.uid = "User is required";
    }
    if (!formData.rsid) {
      newErrors.rsid = "Rashi is required";
    }
    if (!formData.nkid) {
      newErrors.nkid = "Nakshtra is required";
    }
    if (!formData.gnid) {
      newErrors.gnid = "Gan is required";
    }
    if (!formData.ndid) {
      newErrors.ndid = "Nadi is required";
    }
    if (!formData.gid) {
      newErrors.gid = "Gotra is required";
    }
    if (!formData.managal) {
      newErrors.managal = "Mangal is required";
    }
    if (!formData.charan) {
      newErrors.charan = "Charan is required";
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

    const payload = {
      ...formData,
      uid: Number(formData.uid),
      rsid: Number(formData.rsid),
      nkid: Number(formData.nkid),
      gnid: Number(formData.gnid),
      ndid: Number(formData.ndid),
      gid: Number(formData.gid),
    };

    try {
      if (editingOtherInfo) {
        await updateOtherInfo(editingOtherInfo.id, payload);
        setEditingOtherInfo(null);
      } else {
        await createOtherInfo(payload);
      }
      setFormData(initialFormData);
      setErrors({});
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingOtherInfo && setEditingOtherInfo(null);
  };

  return (
    <div className="card shadow-lg border-0">
      <div className="card-header bg-gradient-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-stars me-2"></i>
            {editingOtherInfo ? "Update Astrological Information" : "Add Astrological Information"}
          </h4>
          {editingOtherInfo && (
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={() => setEditingOtherInfo(null)}
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
                disabled={isSubmitting || editingOtherInfo}
              >
                <option value="">--- Select User ---</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.uname} (ID: {u.id}) - {u.umobile}
                  </option>
                ))}
              </select>
              {errors.uid && (
                <div className="invalid-feedback">{errors.uid}</div>
              )}
            </div>
          </div>

          {/* Astrological Information */}
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="text-primary mb-3 border-bottom pb-2">
                <i className="bi bi-moon-stars me-2"></i>
                Astrological Details
              </h5>
            </div>

            {/* Rashi */}
            <div className="col-md-6 col-lg-4 mb-3">
              <label className="form-label fw-semibold">
                Rashi * <span className="text-danger">*</span>
              </label>
              <select
                name="rsid"
                className={`form-control ${errors.rsid ? "is-invalid" : ""}`}
                value={formData.rsid}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">--- Select Rashi ---</option>
                {rashis.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.ras}
                  </option>
                ))}
              </select>
              {errors.rsid && (
                <div className="invalid-feedback">{errors.rsid}</div>
              )}
            </div>

            {/* Nakshtra */}
            <div className="col-md-6 col-lg-4 mb-3">
              <label className="form-label fw-semibold">
                Nakshtra * <span className="text-danger">*</span>
              </label>
              <select
                name="nkid"
                className={`form-control ${errors.nkid ? "is-invalid" : ""}`}
                value={formData.nkid}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">--- Select Nakshtra ---</option>
                {nakshtras.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nakshtra}
                  </option>
                ))}
              </select>
              {errors.nkid && (
                <div className="invalid-feedback">{errors.nkid}</div>
              )}
            </div>

            {/* Gan */}
            <div className="col-md-6 col-lg-4 mb-3">
              <label className="form-label fw-semibold">
                Gan * <span className="text-danger">*</span>
              </label>
              <select
                name="gnid"
                className={`form-control ${errors.gnid ? "is-invalid" : ""}`}
                value={formData.gnid}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">--- Select Gan ---</option>
                {gans.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.gan}
                  </option>
                ))}
              </select>
              {errors.gnid && (
                <div className="invalid-feedback">{errors.gnid}</div>
              )}
            </div>

            {/* Nadi */}
            <div className="col-md-6 col-lg-4 mb-3">
              <label className="form-label fw-semibold">
                Nadi * <span className="text-danger">*</span>
              </label>
              <select
                name="ndid"
                className={`form-control ${errors.ndid ? "is-invalid" : ""}`}
                value={formData.ndid}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">--- Select Nadi ---</option>
                {nadis.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nadi}
                  </option>
                ))}
              </select>
              {errors.ndid && (
                <div className="invalid-feedback">{errors.ndid}</div>
              )}
            </div>

            {/* Gotra */}
            <div className="col-md-6 col-lg-4 mb-3">
              <label className="form-label fw-semibold">
                Gotra * <span className="text-danger">*</span>
              </label>
              <select
                name="gid"
                className={`form-control ${errors.gid ? "is-invalid" : ""}`}
                value={formData.gid}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">--- Select Gotra ---</option>
                {gotras.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.gotra}
                  </option>
                ))}
              </select>
              {errors.gid && (
                <div className="invalid-feedback">{errors.gid}</div>
              )}
            </div>

            {/* Charan */}
            <div className="col-md-6 col-lg-4 mb-3">
              <label className="form-label fw-semibold">
                Charan * <span className="text-danger">*</span>
              </label>
              <select
                name="charan"
                className={`form-control ${errors.charan ? "is-invalid" : ""}`}
                value={formData.charan}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">--- Select Charan ---</option>
                {charanOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.charan && (
                <div className="invalid-feedback">{errors.charan}</div>
              )}
            </div>

            {/* Mangal */}
            <div className="col-md-6 col-lg-4 mb-3">
              <label className="form-label fw-semibold">
                Mangal * <span className="text-danger">*</span>
              </label>
              <select
                name="managal"
                className={`form-control ${errors.managal ? "is-invalid" : ""}`}
                value={formData.managal}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">--- Select Mangal ---</option>
                {mangalOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {errors.managal && (
                <div className="invalid-feedback">{errors.managal}</div>
              )}
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
                  {editingOtherInfo ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <i className={`bi ${editingOtherInfo ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                  {editingOtherInfo ? "Update Information" : "Add Information"}
                </>
              )}
            </button>
            
            {editingOtherInfo && (
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

          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddOtherInfo;