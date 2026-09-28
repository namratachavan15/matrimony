import { useState } from "react";

function VerifyOtp() {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    const user = JSON.parse(localStorage.getItem("regData"));
  
    const payload = {
      otp,
      mobile: user.umobile,
      uname: user.uname,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      upass: user.upass
    };
  
    const res = await fetch("http://localhost:5454/api/admin/user/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  
    const msg = await res.text();
    alert(msg);
  
    if (msg === "User Registered") {
      localStorage.removeItem("regData");
      window.location.href = "/";
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="card p-4 col-md-4 mx-auto">
        <h5 className="text-center">Verify OTP</h5>

        <input
          className="form-control mt-3"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="btn btn-primary w-100 mt-3" onClick={verifyOtp}>
          Verify & Register
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;
