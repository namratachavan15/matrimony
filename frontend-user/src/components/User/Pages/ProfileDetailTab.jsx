// src/Components/User/Pages/ProfileTabs/ProfileDetailTab.jsx
import React, { useState, useEffect } from "react";
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaHeart, 
  FaTint, 
  FaMoneyBillAlt,
  FaBriefcase,
  FaHome,
  FaEye,
  FaUtensils,
  FaWineGlassAlt,
  FaSmoking,
  FaStethoscope,
  FaFileMedical,
  FaUserFriends,
  FaStar,
  FaInfoCircle,
  FaSave
} from "react-icons/fa";
import { useUserContext } from "../State/UserContext";
import { useMarriageContext } from "../State/MarriageContext";
import './ProfileDetailTab.css'
import { useBloodContext } from "../State/BloodContext";

const ProfileDetailTab = () => {
  const { currentUser, updateUser } = useUserContext();
  const { marriages, fetchMarriages } = useMarriageContext();
  const { bloods, loadingBloods, bloodError } = useBloodContext();


  useEffect(() => {
    fetchMarriages();
  }, []);

  console.log("current user", currentUser);
  
  const initialFormData = {
    birthplace: "",
    dob: "",
    dobTime: "",
    marriageType: "",
    bloodgroup: "",
    fincome: "",
    currentWork: "",
    address: "",
    specs: "",
    diet: "",
    drink: "",
    smoking: "",
    dieses: "",
    diseaseDetails: "",
    familydetails: "",
    expectation: "",
    otherinfo: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  // fill from currentUser
  useEffect(() => {
    if (!currentUser) return;
    const cu = currentUser;
  
    setFormData((prev) => ({
      ...prev,
      birthplace: cu.birthplace || "",
      dob: cu.dob ? String(cu.dob) : "",
      dobTime: cu.dobTime ? String(cu.dobTime).slice(0, 5) : "",
      marriageType: cu.marriageType || "",
      bloodgroup: cu.bloodgroup || "",
      fincome: cu.fincome || "",
      currentWork: cu.currentWork || "",
      address: cu.address || "",
      specs: cu.specs || "",
      diet: cu.diet || "",
      drink: cu.drink || "",
      smoking: cu.smoking || "",
      dieses: cu.dieses || "",
      diseaseDetails: cu.diseaseDetails || "",
      familydetails: cu.familydetails || "",
      expectation: cu.expectation || "",
      otherinfo: cu.otherinfo || "",
    }));
  }, [currentUser]);
  
  if (!currentUser) {
    return (
      <div className="profile-auth-message">
        <p>Please login to edit your details.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      const payload = {
        ...currentUser,
        birthplace: formData.birthplace,
        dob: formData.dob || null,
        dobTime: formData.dobTime || null,
        marriageType: formData.marriageType,
        bloodgroup: formData.bloodgroup,
        fincome: formData.fincome,
        currentWork: formData.currentWork,
        address: formData.address,
        specs: formData.specs,
        diet: formData.diet,
        drink: formData.drink,
        smoking: formData.smoking,
        dieses: formData.dieses,
        diseaseDetails: formData.diseaseDetails,
        familydetails: formData.familydetails,
        expectation: formData.expectation,
        otherinfo: formData.otherinfo,
        upass: currentUser.upass,
      };

      await updateUser(currentUser.id, payload);
      alert("Details updated successfully");
    } catch (err) {
      console.error("Error updating detail info:", err);
      alert("Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-simple-form" noValidate>
      <div className="form-header">
        <h3><FaInfoCircle className="header-icon" /> Personal Details</h3>
      </div>

      {/* BIRTH DETAILS */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaMapMarkerAlt className="field-icon" />
            Birth Place *
          </label>
          <div className="input-with-icon">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              name="birthplace"
              className="form-control"
              value={formData.birthplace}
              onChange={handleChange}
              required
              placeholder="Enter birth place"
            />
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaCalendarAlt className="field-icon" />
            Date of Birth *
          </label>
          <div className="input-with-icon">
            <FaCalendarAlt className="input-icon" />
            <input
              type="date"
              name="dob"
              className="form-control"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaClock className="field-icon" />
            Birth Time
          </label>
          <div className="input-with-icon">
            <FaClock className="input-icon" />
            <input
              type="time"
              name="dobTime"
              className="form-control"
              value={formData.dobTime}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* MARRIAGE TYPE + BLOOD GROUP */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaHeart className="field-icon" />
            Marriage Type *
          </label>
          <div className="input-with-icon">
            <FaHeart className="input-icon" />
            <select
              name="marriageType"
              className="form-control"
              value={formData.marriageType}
              onChange={handleChange}
              required
            >
              <option value="">Select Marriage Type</option>
              {marriages.map((m) => (
                <option key={m.id} value={m.marriage}>
                  {m.marriage}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaTint className="field-icon" />
            Blood Group *
          </label>
          <div className="input-with-icon">
            <FaTint className="input-icon" />
            <select
              name="bloodgroup"
              className="form-control"
              value={formData.bloodgroup}
              onChange={handleChange}
              required
            >
             {!loadingBloods && !bloodError && bloods.map((b) => (
      <option key={b.id} value={b.blood}>
        {b.blood}
      </option>
    ))}
            </select>
          </div>
        </div>
      </div>

      {/* INCOME + WORK */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaMoneyBillAlt className="field-icon" />
            Income Range *
          </label>
          <div className="input-with-icon">
            <FaMoneyBillAlt className="input-icon" />
            <select
              name="fincome"
              className="form-control"
              value={formData.fincome}
              onChange={handleChange}
              required
            >
              <option value="">Select Income</option>
              <option value="0-1L">Below 1 Lakh</option>
              <option value="1-3L">1-3 Lakh</option>
              <option value="3-5L">3-5 Lakh</option>
              <option value="5L+">5 Lakh +</option>
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaBriefcase className="field-icon" />
            Current Work *
          </label>
          <div className="input-with-icon">
            <FaBriefcase className="input-icon" />
            <input
              type="text"
              name="currentWork"
              className="form-control"
              value={formData.currentWork}
              onChange={handleChange}
              required
              placeholder="Enter current occupation"
            />
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaHome className="field-icon" />
            Address *
          </label>
          <div className="input-with-icon">
            <FaHome className="input-icon" />
            <textarea
              name="address"
              className="form-control"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter current address"
            />
          </div>
        </div>
      </div>

      {/* LIFESTYLE: SPECS / DIET / DRINK / SMOKING */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label-with-icon">
            <FaEye className="field-icon" />
            Specs *
          </label>
          <div className="input-with-icon">
            <FaEye className="input-icon" />
            <select name="specs" className="form-control" value={formData.specs} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <label className="form-label-with-icon">
            <FaUtensils className="field-icon" />
            Diet *
          </label>
          <div className="input-with-icon">
            <FaUtensils className="input-icon" />
            <select name="diet" className="form-control" value={formData.diet} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <label className="form-label-with-icon">
            <FaWineGlassAlt className="field-icon" />
            Drink *
          </label>
          <div className="input-with-icon">
            <FaWineGlassAlt className="input-icon" />
            <select name="drink" className="form-control" value={formData.drink} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <label className="form-label-with-icon">
            <FaSmoking className="field-icon" />
            Smoking *
          </label>
          <div className="input-with-icon">
            <FaSmoking className="input-icon" />
            <select name="smoking" className="form-control" value={formData.smoking} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* DISEASE DETAILS */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaStethoscope className="field-icon" />
            Any Disease? *
          </label>
          <div className="input-with-icon">
            <FaStethoscope className="input-icon" />
            <select
              name="dieses"
              className="form-control"
              value={formData.dieses || "No"}
              onChange={handleChange}
              required
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaFileMedical className="field-icon" />
            Disease Details
          </label>
          <div className="input-with-icon">
            <FaFileMedical className="input-icon" />
            <textarea
              name="diseaseDetails"
              className="form-control"
              rows="2"
              value={formData.diseaseDetails}
              onChange={handleChange}
              placeholder="If yes, please describe"
            />
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaUserFriends className="field-icon" />
            Property / Family Details
          </label>
          <div className="input-with-icon">
            <FaUserFriends className="input-icon" />
            <textarea
              name="familydetails"
              className="form-control"
              rows="2"
              value={formData.familydetails}
              onChange={handleChange}
              placeholder="Enter property or family related details"
            />
          </div>
        </div>
      </div>

      {/* EXPECTATION & OTHER DETAILS */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaStar className="field-icon" />
            Expectation
          </label>
          <div className="input-with-icon">
            <FaStar className="input-icon" />
            <textarea
              name="expectation"
              className="form-control"
              rows="3"
              value={formData.expectation}
              onChange={handleChange}
              placeholder="Partner / family expectations"
            />
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaInfoCircle className="field-icon" />
            Other Details
          </label>
          <div className="input-with-icon">
            <FaInfoCircle className="input-icon" />
            <textarea
              name="otherinfo"
              className="form-control"
              rows="3"
              value={formData.otherinfo}
              onChange={handleChange}
              placeholder="Any other important details"
            />

          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="row">
        <div className="col">
          <button type="submit" className="btn submit-btn" style={{backgroundColor:"#9c5470",color:"white"}} disabled={loading}>
            <FaSave className="btn-icon" />
            {loading ? "Updating..." : "Update Details"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileDetailTab;