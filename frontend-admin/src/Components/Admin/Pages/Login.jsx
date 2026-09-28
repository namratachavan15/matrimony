// src/Components/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../State/UserContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ umobile: "", upass: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useUserContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ ...formData, urole: "admin" });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Pattern */}
      <div className="login-background"></div>
      
      {/* Animated Background Elements */}
      {/* <div className="login-background-elements">
        <div className="login-circle-1"></div>
        <div className="login-circle-2"></div>
      </div> */}

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <div className="card login-card">
              {/* Card Header with Gradient */}
              <div className="card-header login-header text-white py-4 text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="login-icon-container">
                    <i className="bi bi-shield-lock login-icon"></i>
                  </div>
                </div>
                <h3 className="login-title mb-1">Admin Portal</h3>
                <p className="login-subtitle mb-0">Secure Access to Dashboard</p>
              </div>

              {/* Card Body */}
              <div className="card-body p-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Mobile Number Field */}
                  <div className="mb-4">
                    <label htmlFor="umobile" className="form-label">
                      <i className="bi bi-phone me-2 text-primary"></i>
                      Mobile Number
                    </label>
                    <div className="login-input-group input-group">
                      <span className="input-group-text">
                        <i className="bi bi-telephone text-muted"></i>
                      </span>
                      <input
                        type="text"
                        id="umobile"
                        name="umobile"
                        value={formData.umobile}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your mobile number"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label htmlFor="upass" className="form-label">
                      <i className="bi bi-key me-2 text-primary"></i>
                      Password
                    </label>
                    <div className="login-input-group input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        id="upass"
                        name="upass"
                        value={formData.upass}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                      />
                      <label className="form-check-label text-muted small" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <a href="#forgot" className="text-decoration-none small text-primary">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn login-btn btn-lg w-100 py-3 fw-semibold text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Security Information */}
                <div className="security-info mt-4">
                  <p className="security-info-text text-center mb-0">
                    <i className="bi bi-shield-check me-2"></i>
                    Enterprise-grade security & encryption
                  </p>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;