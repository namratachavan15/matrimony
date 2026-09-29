import React, { useEffect, useState } from "react";
import "./Login.css"; // Reuses the same premium auth-card design as the Login page

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("regData") || "null");
    if (user?.umobile) setMobile(user.umobile);
  }, []);

  const verifyOtp = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("regData") || "null");
    if (!user) {
      setMessage({ type: "danger", text: "Registration details not found. Please start again." });
      return;
    }
    if (!otp.trim()) {
      setMessage({ type: "danger", text: "Please enter the OTP." });
      return;
    }

    const payload = {
      otp,
      mobile: user.umobile,
      uname: user.uname,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      upass: user.upass,
    };

    setBusy(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("http://localhost:5454/api/admin/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const msg = await res.text();

      if (msg === "User Registered") {
        localStorage.removeItem("regData");
        setMessage({ type: "success", text: "Registration successful! Redirecting..." });
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } else {
        setMessage({ type: "danger", text: msg || "Could not verify the OTP." });
      }
    } catch (err) {
      setMessage({ type: "danger", text: "Could not reach the server. Please try again." });
    } finally {
      setBusy(false);
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
                    <i className="bi bi-shield-lock login-icon"></i>
                  </div>
                </div>
                <h3 className="login-title mb-1">Verify OTP</h3>
                <p className="login-subtitle mb-0">
                  {mobile ? `Code sent to ${mobile}` : "Enter the code we sent you"}
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-5">
                {message.text && (
                  <div className={`alert alert-${message.type} d-flex align-items-center`} role="alert">
                    <i
                      className={`bi ${
                        message.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"
                      } me-2`}
                    ></i>
                    <div>{message.text}</div>
                  </div>
                )}

                <form onSubmit={verifyOtp}>
                  <div className="mb-4">
                    <label htmlFor="otp" className="form-label">
                      <i className="bi bi-key me-2 text-primary"></i>
                      One-Time Password
                    </label>
                    <div className="login-input-group input-group">
                      <span className="input-group-text">
                        <i className="bi bi-shield-check text-muted"></i>
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="form-control text-center"
                        style={{ letterSpacing: "0.4em", fontWeight: 600 }}
                        placeholder="------"
                        required
                        disabled={busy}
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn login-btn btn-lg w-100 py-3 fw-semibold text-white"
                    disabled={busy}
                  >
                    {busy ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-2"></i>
                        Verify &amp; Register
                      </>
                    )}
                  </button>
                </form>

                <div className="security-info mt-4">
                  <p className="security-info-text text-center mb-0">
                    <i className="bi bi-clock-history me-2"></i>
                    The code expires in 5 minutes
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

export default VerifyOtp;
