// src/Components/User/Pages/ProfileTabs/ProfileOtherTab.jsx
import React, { useState, useEffect } from "react";
import { 
  FaStar, 
  FaMoon, 
  FaUserFriends, 
  FaWater, 
  FaTree, 
  FaSave,
  FaInfoCircle
} from "react-icons/fa";
import { useUserContext } from "../State/UserContext";
import { useRashiContext } from "../State/RashiContext";
import { useNakshtraContext } from "../State/NakshtraContext";
import { useGanContext } from "../State/GanContext";
import { useNadiContext } from "../State/NadiContext";
import { useGotraContext } from "../State/GotraContext";
import { useOtherInfoContext } from "../State/OtherInfoContext";
import './ProfileOtherTab.css'


const ProfileOtherTab = () => {
  const { currentUser } = useUserContext();

  const { rashis, fetchRashis } = useRashiContext();
  const { nakshtras, fetchNakshtras } = useNakshtraContext();
  const { gans, fetchGans } = useGanContext();
  const { nadis, fetchNadis } = useNadiContext();
  const { gotras, fetchGotras } = useGotraContext();

  const {
    otherInfo,
    fetchOtherInfoByUserId,
    updateOtherInfo,
    loading,
    error,
  } = useOtherInfoContext();

  const charanOptions = ["1", "2", "3", "4"];

  const [formData, setFormData] = useState({
    rsid: "",
    nkid: "",
    gnid: "",
    ndid: "",
    gid: "",
    charan: "",
  });

  // Load master data + user-specific otherInfo
  useEffect(() => {
    if (!currentUser) return;

    fetchRashis();
    fetchNakshtras();
    fetchGans();
    fetchNadis();
    fetchGotras();

    (async () => {
      const data = await fetchOtherInfoByUserId(currentUser.id);
      console.log("Fetched otherInfo for user:", data);
    })();
  }, []);

  // When otherInfo is loaded, fill form
  useEffect(() => {
    if (!otherInfo) {
      setFormData({
        rsid: "",
        nkid: "",
        gnid: "",
        ndid: "",
        gid: "",
        charan: "",
      });
      return;
    }

    setFormData({
      rsid: otherInfo.rsid ? String(otherInfo.rsid) : "",
      nkid: otherInfo.nkid ? String(otherInfo.nkid) : "",
      gnid: otherInfo.gnid ? String(otherInfo.gnid) : "",
      ndid: otherInfo.ndid ? String(otherInfo.ndid) : "",
      gid: otherInfo.gid ? String(otherInfo.gid) : "",
      charan: otherInfo.charan || "",
    });
  }, [otherInfo]);

  if (!currentUser) {
    return (
      <div className="profile-auth-message">
        <p>Please login to edit your other details.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otherInfo) {
      alert("Other info record not found. Please contact admin to create one.");
      return;
    }

    const managalValue = otherInfo.managal || "N/A";

    const payload = {
      uid: otherInfo.uid,
      rsid: Number(formData.rsid),
      nkid: Number(formData.nkid),
      gnid: Number(formData.gnid),
      ndid: Number(formData.ndid),
      gid: Number(formData.gid),
      charan: formData.charan,
      managal: managalValue,
    };

    console.log("Updating otherInfo with payload:", payload);

    try {
      await updateOtherInfo(otherInfo.id, payload);
      alert("Other details updated successfully");
    } catch (err) {
      console.error("Error updating other details:", err);
      alert("Failed to update other details");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-simple-form" noValidate>
      <div className="form-header">
        <h3><FaInfoCircle className="header-icon" /> Astrological Details</h3>
      </div>

      <div className="row mb-3">
        <div className="col-md-4 mb-3">
          <label className="form-label-with-icon">
            <FaStar className="field-icon" />
            Rashi / राशि *
          </label>
          <div className="input-with-icon">
            <FaStar className="input-icon" />
            <select
              name="rsid"
              className="form-control"
              value={formData.rsid}
              onChange={handleChange}
              required
            >
              <option value="">---Select Rashi---</option>
              {rashis.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.ras}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label-with-icon">
            <FaMoon className="field-icon" />
            Nakshatra / नक्षत्र *
          </label>
          <div className="input-with-icon">
            <FaMoon className="input-icon" />
            <select
              name="nkid"
              className="form-control"
              value={formData.nkid}
              onChange={handleChange}
              required
            >
              <option value="">---Select Nakshatra---</option>
              {nakshtras.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nakshtra}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label-with-icon">
            <FaUserFriends className="field-icon" />
            Gan / गण *
          </label>
          <div className="input-with-icon">
            <FaUserFriends className="input-icon" />
            <select
              name="gnid"
              className="form-control"
              value={formData.gnid}
              onChange={handleChange}
              required
            >
              <option value="">---Select Gan---</option>
              {gans.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.gan}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4 mb-3">
          <label className="form-label-with-icon">
            <FaWater className="field-icon" />
            Nadi / नाडी *
          </label>
          <div className="input-with-icon">
            <FaWater className="input-icon" />
            <select
              name="ndid"
              className="form-control"
              value={formData.ndid}
              onChange={handleChange}
              required
            >
              <option value="">---Select Nadi---</option>
              {nadis.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nadi}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label-with-icon">
            <FaTree className="field-icon" />
            Gotra / गोत्र *
          </label>
          <div className="input-with-icon">
            <FaTree className="input-icon" />
            <select
              name="gid"
              className="form-control"
              value={formData.gid}
              onChange={handleChange}
              required
            >
              <option value="">---Select Gotra---</option>
              {gotras.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.gotra}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label-with-icon">
            <FaStar className="field-icon" />
            Charan / चरण *
          </label>
          <div className="input-with-icon">
            <FaStar className="input-icon" />
            <select
              name="charan"
              className="form-control"
              value={formData.charan}
              onChange={handleChange}
              required
            >
              <option value="">---Select Charan---</option>
              {charanOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="row">
        <div className="col">
          <button type="submit" className="btn submit-btn" style={{backgroundColor:"#9c5470",color:"white"}}disabled={loading}>
            <FaSave className="btn-icon" />
            {loading ? "Saving..." : "Update Astrological Details"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
};

export default ProfileOtherTab;