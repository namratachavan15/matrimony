// src/Components/User/Pages/ProfileTabs/ProfileProfileTab.jsx
import React, { useState, useEffect } from "react";
import "./ProfileProfileTab.css";
import {
  FaUser,
  FaPhone,
  FaWhatsapp,
  FaHome,
  FaEnvelope,
  FaVenusMars,
  FaMapMarkerAlt,
  FaMapPin,
  FaUsers,
  FaSearch,
  FaGraduationCap,
  FaBook,
  FaWeight,
  FaRulerVertical,
  FaShieldAlt,
  FaCamera,
  FaIdCard,
  FaSave,
} from "react-icons/fa";
import { useUserContext } from "../State/UserContext";
import { useSubcastContext } from "../State/SubcastContext";
import { useEducationContext } from "../State/EducationContext";
import { useHeightContext } from "../State/HeightContext";
import { useStateContextCustom } from "../State/StateContext";
import { useDistrictContext } from "../State/DistrictContext";
import { useColorContext } from "../State/ColorContext"; // ⭐ NEW
import { api } from "../Config/api";

const ProfileProfileTab = () => {
  const backendURL = "http://localhost:5454/";

  const { currentUser, updateUser } = useUserContext();
  const { fetchSubcasts, subcasts } = useSubcastContext();
  const { fetchEducations, educations } = useEducationContext();
  const { heights, fetchHeights } = useHeightContext();
  const { states, fetchStatesByCountry } = useStateContextCustom();
  const { districts, fetchDistrictsByState } = useDistrictContext();

  // ⭐ Colors from context
  const { colors, loadingColors } = useColorContext();

  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    uname: "",
    altMobile: "",
    whatsappno: "",
    address: "",
    email: "",
    gender: "",
    stid: "",
    dsid: "",
    ctid: "",
    sctid: "",
    edid: "",
    educationDetails: "",
    weight: "",
    height: "",
    // ⭐ use colorId from colors table; keep varn for backward compatibility
    colorId: "",
    varn: "",
    otherinfo: "",
    uprofile: null,
    aadharBackPhoto: null,
    aadharFrontPhoto: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState({
    uprofile: null,
    aadharBackPhoto: null,
    aadharFrontPhoto: null,
  });

  // ---------------- LOAD DROPDOWNS ----------------
  useEffect(() => {
    fetchSubcasts();
    fetchEducations();
    fetchHeights();
    fetchStatesByCountry(1);

    const fetchCasts = async () => {
      try {
        const { data } = await api.get("/api/admin/cast");
        setCasts(data || []);
      } catch (err) {
        console.error("Error fetching cast list:", err);
      }
    };
    fetchCasts();
  }, []);

  // Helper to find colorId from varn text (for old data)
  const findColorIdFromVarn = (varnValue, colorsList) => {
    if (!varnValue || !Array.isArray(colorsList)) return "";
    const lower = String(varnValue).toLowerCase().trim();
    const found = colorsList.find((c) =>
      String(c.color || c.name || "").toLowerCase().trim() === lower
    );
    return found ? found.id : "";
  };

  // ---------------- FILL FORM FROM LOGGED-IN USER ----------------
  useEffect(() => {
    if (!currentUser) return;

    const cu = currentUser;

    // derive colorId:
    let derivedColorId = cu.colorId || "";
    if (!derivedColorId && cu.varn && colors.length > 0) {
      derivedColorId = findColorIdFromVarn(cu.varn, colors);
    }

    setFormData((prev) => ({
      ...prev,
      uname: cu.uname || "",
      altMobile: cu.umobile || "",
      whatsappno: cu.umobile || "",
      address: cu.address || "",
      email: cu.email || "",
      gender: cu.gender || "",
      stid: cu.stid || "",
      dsid: cu.dsid || "",
      ctid: cu.ctid || cu.cast?.ctid || cu.cacstid || "",
      sctid: cu.sctid || cu.subcast?.sctid || cu.subcacstid || "",
      edid: cu.edid || cu.education?.edid || cu.educationId || "",
      educationDetails: cu.educationDetails || "",
      weight: cu.weight || "",
      height: cu.height || "",
      varn: cu.varn || "",
      colorId: derivedColorId || "",
      otherinfo: cu.otherinfo || "",
      uprofile: null,
      aadharBackPhoto: null,
      aadharFrontPhoto: null,
    }));

    if (cu.stid) fetchDistrictsByState(cu.stid);

    setPreview({
      uprofile: cu.uprofile
        ? cu.uprofile.startsWith("http")
          ? cu.uprofile
          : `${backendURL}uploads/profile/${cu.uprofile}`
        : null,
      aadharBackPhoto: cu.aadharBackPhoto
        ? cu.aadharBackPhoto.startsWith("http")
          ? cu.aadharBackPhoto
          : `${backendURL}uploads/aadharBack/${cu.aadharBackPhoto}`
        : null,
      aadharFrontPhoto: cu.aadharFrontPhoto
        ? cu.aadharFrontPhoto.startsWith("http")
          ? cu.aadharFrontPhoto
          : `${backendURL}uploads/aadharFront/${cu.aadharFrontPhoto}`
        : null,
    });
  }, [currentUser, colors]); // ⭐ depend on colors too

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStateChange = (e) => {
    const stid = e.target.value;
    setFormData((prev) => ({ ...prev, stid, dsid: "" }));
    if (stid) fetchDistrictsByState(stid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);

      // If backend expects both colorId and varn, we can derive varn text here
      const selectedColorObj = colors.find(
        (c) => String(c.id) === String(formData.colorId)
      );

      const finalVarn =
        selectedColorObj?.color || selectedColorObj?.name || formData.varn;

      const updatedUser = {
        ...currentUser,
        ...formData,
        colorId: formData.colorId,
        varn: finalVarn,
        upass: currentUser.upass, // keep password
      };

      await updateUser(currentUser.id, updatedUser);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubcasts =
    formData.ctid && Array.isArray(subcasts)
      ? subcasts.filter(
          (sc) => String(sc.ctid ?? sc.cacstid) === String(formData.ctid)
        )
      : subcasts || [];

  if (!currentUser) return <p>Please login to edit your profile.</p>;

  // ---------------- RENDER ----------------
  return (
    <form onSubmit={handleSubmit} className="profile-simple-form" noValidate>
      <div className="form-header">
        <h3>
          <FaUser className="header-icon" /> Profile Information
        </h3>
      </div>

      {/* NAME + ALT MOBILE */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaUser className="field-icon" />
            Full Name *
          </label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="uname"
              className="form-control"
              value={formData.uname}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaPhone className="field-icon" />
            Alternative Mobile No
          </label>
          <div className="input-with-icon">
            <FaPhone className="input-icon" />
            <input
              type="number"
              name="altMobile"
              className="form-control"
              value={formData.altMobile}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* WHATSAPP + EMAIL */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaWhatsapp className="field-icon" />
            WhatsApp No
          </label>
          <div className="input-with-icon">
            <FaWhatsapp className="input-icon" />
            <input
              type="number"
              name="whatsappno"
              className="form-control"
              value={formData.whatsappno}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaEnvelope className="field-icon" />
            Email *
          </label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* ABOUT ME */}
      <div className="row mb-3">
        <div className="col-12">
          <label className="form-label-with-icon">
            <FaUser className="field-icon" />
            About Me
          </label>
          <textarea
            name="otherinfo"
            className="form-control"
            rows={4}
            maxLength={500}
            placeholder="Tell others a little about yourself -- this shows on your profile preview."
            value={formData.otherinfo}
            onChange={handleChange}
          />
          <div className="form-text text-end">{(formData.otherinfo || "").length}/500</div>
        </div>
      </div>

      {/* ADDRESS + GENDER */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaHome className="field-icon" />
            Address
          </label>
          <div className="input-with-icon">
            <FaHome className="input-icon" />
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaVenusMars className="field-icon" />
            Gender *
          </label>
          <div className="input-with-icon">
            <FaVenusMars className="input-icon" />
            <select
              name="gender"
              className="form-control"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* STATE / DISTRICT / CAST */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaMapMarkerAlt className="field-icon" />
            State *
          </label>
          <div className="input-with-icon">
            <FaMapMarkerAlt className="input-icon" />
            <select
              name="stid"
              className="form-control"
              value={formData.stid}
              onChange={handleStateChange}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaMapPin className="field-icon" />
            District *
          </label>
          <div className="input-with-icon">
            <FaMapPin className="input-icon" />
            <select
              name="dsid"
              className="form-control"
              value={formData.dsid}
              onChange={handleChange}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.district}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaUsers className="field-icon" />
            Cast *
          </label>
          <div className="input-with-icon">
            <FaUsers className="input-icon" />
            <select
              name="ctid"
              className="form-control"
              value={formData.ctid}
              onChange={handleChange}
            >
              <option value="">Select Cast</option>
              {casts.map((cast) => (
                <option key={cast.id ?? cast.ctid} value={cast.id ?? cast.ctid}>
                  {cast.cast ?? cast.castName ?? cast.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SUBCAST / EDUCATION / EDUCATION DETAILS */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaSearch className="field-icon" />
            SubCast *
          </label>
          <div className="input-with-icon">
            <FaSearch className="input-icon" />
            <select
              name="sctid"
              className="form-control"
              value={formData.sctid}
              onChange={handleChange}
            >
              <option value="">Select SubCast</option>
              {filteredSubcasts.map((sc, idx) => (
                <option
                  key={sc.sctid ?? sc.id ?? idx}
                  value={sc.sctid ?? sc.id}
                >
                  {sc.subcastName ?? sc.name ?? sc.subcast}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaGraduationCap className="field-icon" />
            Education *
          </label>
          <div className="input-with-icon">
            <FaGraduationCap className="input-icon" />
            <select
              name="edid"
              className="form-control"
              value={formData.edid}
              onChange={handleChange}
            >
              <option value="">Select Education</option>
              {educations.map((edu, idx) => (
                <option key={edu.edid ?? edu.id ?? idx} value={edu.edid ?? edu.id}>
                  {edu.educationName ?? edu.name ?? edu.education}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaBook className="field-icon" />
            Education Details *
          </label>
          <div className="input-with-icon">
            <FaBook className="input-icon" />
            <input
              type="text"
              name="educationDetails"
              className="form-control"
              value={formData.educationDetails}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* WEIGHT / HEIGHT / COLOR (VARN) */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaWeight className="field-icon" />
            Weight *
          </label>
          <div className="input-with-icon">
            <FaWeight className="input-icon" />
            <input
              type="text"
              name="weight"
              className="form-control"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaRulerVertical className="field-icon" />
            Height *
          </label>
          <div className="input-with-icon">
            <FaRulerVertical className="input-icon" />
            <select
              name="height"
              className="form-control"
              value={formData.height}
              onChange={handleChange}
            >
              <option value="">Select Height</option>
              {heights.map((h) => (
                <option key={h.id} value={h.height}>
                  {h.height}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ⭐ DYNAMIC COLOR (VARN) FROM ColorContext */}
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaShieldAlt className="field-icon" />
            Varn / Complexion *
          </label>
          <div className="input-with-icon">
            <FaShieldAlt className="input-icon" />
            <select
              name="colorId"
              className="form-control"
              value={formData.colorId}
              onChange={handleChange}
            >
              <option value="">
                {loadingColors ? "Loading colors..." : "Select Varn"}
              </option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.color ?? c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* PROFILE & AADHAAR PHOTOS */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaCamera className="field-icon" />
            Profile Photo
          </label>
          <input
            type="file"
            name="uprofile"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
          />
         {preview.uprofile && (
  <img src={preview.uprofile} alt="Profile" className="image-preview profile-preview"  style={{height:'60px',width:'60px'}} />
)}
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaIdCard className="field-icon" />
            Aadhaar Back Photo
          </label>
          <input
            type="file"
            name="aadharBackPhoto"
            className="form-control"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChange}
          />
        {preview.aadharBackPhoto && (
  <img src={preview.aadharBackPhoto} alt="Back" className="image-preview aadhar-preview"  style={{height:'60px',width:'60px'}} />
)}
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaIdCard className="field-icon" />
            Aadhaar Front Photo
          </label>
          <input
            type="file"
            name="aadharFrontPhoto"
            className="form-control"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChange}
          />
        {preview.aadharFrontPhoto && (
  <img
    src={preview.aadharFrontPhoto}
    alt="Front"
    className="image-preview aadhar-preview" 
    style={{height:'60px',width:'60px'}}
  />
)}
        </div>
      </div>

      {/* SUBMIT */}
      <div className="row">
        <div className="col">
          <button
            type="submit"
            className="btn  submit-btn" style={{backgroundColor:"#9c5470",color:"white"}}
            disabled={loading}
          >
            <FaSave className="btn-icon" />
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileProfileTab;
