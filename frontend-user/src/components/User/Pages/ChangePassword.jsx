// src/Components/User/Pages/ChangePassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";
import { useUserContext } from "../State/UserContext";


const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { changePassword } = useUserContext(); // 👈 get from context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error || success) {
      setError("");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setIsLoading(false);
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from old password.");
      setIsLoading(false);
      return;
    }

    try {
      // 🔥 Call context API
      const msg = await changePassword({ oldPassword, newPassword });

      setSuccess(msg || "Password changed successfully!");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Change password error", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="change-password-page">
      <div className="cp-container">
        <div className="cp-header">
          <div className="cp-icon">
            <span className="cp-icon-symbol">🔒</span>
            <div className="cp-icon-glow"></div>
          </div>
          <h1 className="cp-title">Change Password</h1>
          <p className="cp-subtitle">Secure your account with a new password</p>
        </div>

        <div className="cp-card">
          {error && (
            <div className="cp-alert cp-alert-error">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">{error}</span>
            </div>
          )}

          {success && (
            <div className="cp-alert cp-alert-success">
              <span className="alert-icon">✅</span>
              <span className="alert-text">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="cp-form">
            <div className="form-group">
              <label htmlFor="oldPassword" className="form-label">
                Current Password
              </label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="form-input"
                required
              />
              <div className="input-underline"></div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="form-input"
                required
              />
              <div className="input-underline"></div>
              <div className="password-hint">
                Must be at least 6 characters long
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="form-input"
                required
              />
              <div className="input-underline"></div>
            </div>

            <div className="cp-actions">
              <button
                type="button"
                className="cp-btn cp-btn-secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cp-btn cp-btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
