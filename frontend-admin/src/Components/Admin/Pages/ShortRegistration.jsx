import React, { useState } from "react";
import "./Login.css"; // Reuses the same premium auth-card design as the Login page

function ShortRegister() {
  const [form, setForm] = useState({
    uname: "",
    umobile: "",
    email: "",
    gender: "",
    dob: "",
    upass: "",
  });

  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.uname.trim() || !form.umobile.trim() || !form.upass) {
      setError("Please enter your name, mobile number and password.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("http://localhost:5454/api/admin/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: form.umobile }),
      });
      const msg = await res.text();

      if (!res.ok) {
        // Backend returns a readable reason (invalid number, SMS not configured, wait 30s, ...).
        setError(msg || "Could not send OTP. Please try again.");
        return;
      }

      localStorage.setItem("regData", JSON.stringify(form));
      window.location.href = "/verify-otp";
    } catch (err) {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <div className="card login-card">
              {/* Header */}
              <div className="card-header login-header text-white py-4 text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="login-icon-container">
                    <i className="bi bi-person-plus login-icon"></i>
                  </div>
                </div>
                <h3 className="login-title mb-1">Create Account</h3>
                <p className="login-subtitle mb-0">Register to get started</p>
              </div>

              {/* Body */}
              <div className="card-body p-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={sendOtp}>
                  <div className="mb-4">
                    <label htmlFor="uname" className="form-label">
                      <i className="bi bi-person me-2 text-primary"></i>
                      Full Name
                    </label>
                    <div className="login-input-group input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person-badge text-muted"></i>
                      </span>
                      <input
                        type="text"
                        id="uname"
                        name="uname"
                        value={form.uname}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your full name"
                        required
                        disabled={sending}
                      />
                    </div>
                  </div>

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
                        value={form.umobile}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="10-digit mobile number"
                        required
                        disabled={sending}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-2 text-primary"></i>
                      Email
                    </label>
                    <div className="login-input-group input-group">
                      <span className="input-group-text">
                        <i className="bi bi-at text-muted"></i>
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="you@example.com"
                        disabled={sending}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6 mb-4">
                      <label htmlFor="gender" className="form-label">
                        <i className="bi bi-gender-ambiguous me-2 text-primary"></i>
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="form-select"
                        disabled={sending}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="col-6 mb-4">
                      <label htmlFor="dob" className="form-label">
                        <i className="bi bi-calendar-event me-2 text-primary"></i>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className="form-control"
                        disabled={sending}
                      />
                    </div>
                  </div>

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
                        value={form.upass}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Create a password"
                        required
                        disabled={sending}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn login-btn btn-lg w-100 py-3 fw-semibold text-white"
                    disabled={sending}
                  >
                    {sending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Send OTP
                      </>
                    )}
                  </button>
                </form>

                <div className="security-info mt-4">
                  <p className="security-info-text text-center mb-0">
                    <i className="bi bi-shield-check me-2"></i>
                    We'll text a one-time code to verify your number
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortRegister;
