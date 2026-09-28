import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../State/UserContext";
import { 
  FaUser, 
  FaPhone, 
  FaLock, 
  FaVenusMars, 
  FaCamera, 
  FaIdCard, 
  FaCheck, 
  FaArrowRight,
  FaSignInAlt
} from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    uname: "",
    umobile: "",
    upass: "",
    gender: "",
    uprofile: null,
    aadharFrontPhoto: null,
    aadharBackPhoto: null,
    termsAccepted: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useUserContext();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userObject = {
        uname: formData.uname,
        umobile: formData.umobile,
        upass: formData.upass,
        gender: formData.gender,
        urole: "user",
      };

      const fd = new FormData();
      fd.append("user", JSON.stringify(userObject));

      if (formData.uprofile) {
        fd.append("uprofile", formData.uprofile);
      }
      if (formData.aadharFrontPhoto) {
        fd.append("aadharFrontPhoto", formData.aadharFrontPhoto);
      }
      if (formData.aadharBackPhoto) {
        fd.append("aadharBackPhoto", formData.aadharBackPhoto);
      }

      const resUser = await register(fd);
      console.log("Registered user:", resUser);
      navigate("/login");
    } catch (err) {
      console.error("Register failed", err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header flex-header">
          <div className="auth-icon">
            <FaUser />
          </div>
          <h2>Create Account</h2>
        
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">
              <FaUser className="label-icon" />
              वधू / वराचे नाव *
            </label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="uname"
                value={formData.uname}
                onChange={handleChange}
                className="form-control"
                placeholder="उदा. नम्रता चव्हाण"
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label className="form-label">
              <FaPhone className="label-icon" />
              Mobile Number *
            </label>
            <div className="input-with-icon">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                name="umobile"
                value={formData.umobile}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter 10-digit mobile number"
                minLength={10}
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">
              <FaLock className="label-icon" />
              Password *
            </label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="upass"
                value={formData.upass}
                onChange={handleChange}
                className="form-control"
                placeholder="Create a strong password"
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">
              <FaVenusMars className="label-icon" />
              Gender *
            </label>
            <div className="gender-options">
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  required
                />
                <span className="gender-label">Male</span>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  required
                />
                <span className="gender-label">Female</span>
              </label>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="form-group">
            <label className="form-label">
              <FaCamera className="label-icon" />
              Profile Photo
            </label>
            <div className="file-upload">
              <input
                type="file"
                name="uprofile"
                accept="image/*"
                onChange={handleChange}
                className="file-input"
              />
              <div className="file-upload-label">
                <FaCamera className="upload-icon" />
                <span>Choose Profile Photo</span>
              </div>
            </div>
          </div>

          {/* Aadhaar Photos */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <FaIdCard className="label-icon" />
                Aadhaar Front
              </label>
              <div className="file-upload">
                <input
                  type="file"
                  name="aadharFrontPhoto"
                  accept="image/*"
                  onChange={handleChange}
                  className="file-input"
                />
                <div className="file-upload-label">
                  <FaIdCard className="upload-icon" />
                  <span>Front Side</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaIdCard className="label-icon" />
                Aadhaar Back
              </label>
              <div className="file-upload">
                <input
                  type="file"
                  name="aadharBackPhoto"
                  accept="image/*"
                  onChange={handleChange}
                  className="file-input"
                />
                <div className="file-upload-label">
                  <FaIdCard className="upload-icon" />
                  <span>Back Side</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="form-group terms-group">
            <label className="terms-label">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
              />
              <span className="checkmark"></span>
              I accept the <a href="/terms" className="terms-link">terms and conditions</a>
            </label>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="auth-btn primary"
            disabled={loading || !formData.termsAccepted}
          >
            {loading ? (
              <span className="loading-spinner-small"></span>
            ) : (
              <FaCheck className="btn-icon" />
            )}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <button 
            className="auth-link-btn" 
            onClick={() => navigate("/login")}
          >
            <FaSignInAlt className="btn-icon" />
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;