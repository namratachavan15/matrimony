import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../State/UserContext";
import { FaUser, FaLock, FaArrowRight, FaUserPlus } from "react-icons/fa";


const Login = () => {
  const [formData, setFormData] = useState({ umobile: "", upass: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useUserContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ ...formData, urole: "user" });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
        err?.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header flex-header">
          <div className="auth-icon">
            <FaUser />
          </div>
          <h2>Welcome Back</h2>
        
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <FaUser className="label-icon" />
              Mobile Number
            </label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="umobile"
                value={formData.umobile}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your mobile number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaLock className="label-icon" />
              Password
            </label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="upass"
                value={formData.upass}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-btn primary"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner-small"></span>
            ) : (
              <FaArrowRight className="btn-icon" />
            )}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <button 
            className="auth-link-btn" 
            onClick={goToRegister}
          >
            <FaUserPlus className="btn-icon" />
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;