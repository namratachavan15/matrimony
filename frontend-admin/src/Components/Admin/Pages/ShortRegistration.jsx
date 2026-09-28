import { useState } from "react";
import "./ShortRegister.css"; // Optional: for extra custom styling

function ShortRegister() {
  const [form, setForm] = useState({
    uname: "",
    umobile: "",
    email: "",
    gender: "",
    dob: "",
    upass: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    await fetch("http://localhost:5454/api/admin/user/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: form.umobile })
    });

    localStorage.setItem("regData", JSON.stringify(form));
    window.location.href = "/verify-otp";
  };

  return (
    <div className="short-register-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 short-register-card">
        <h4 className="text-center mb-4 fw-bold">Register Free</h4>

        <div className="mb-3">
          <input
            className="form-control"
            name="uname"
            placeholder="Full Name"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            name="umobile"
            placeholder="Mobile Number"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <select
            className="form-select" style={{width:"100%"}}
            name="gender"
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            type="date"
            name="dob"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            name="upass"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <button
          className="btn btn-primary w-100 mt-3 p-2"
          onClick={sendOtp}
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}

export default ShortRegister;
