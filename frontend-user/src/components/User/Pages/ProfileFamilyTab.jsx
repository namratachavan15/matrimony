// src/Components/User/Pages/ProfileTabs/ProfileFamilyTab.jsx
import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaUserTie, 
  FaFemale, 
  FaUserFriends, 
  FaBriefcase, 
  FaSave,
  FaUsers
} from "react-icons/fa";
import { useUserContext } from "../State/UserContext";
import { useFamilyContext } from "../State/FamilyContext";
import './ProfileFamilyTab.css'


const ProfileFamilyTab = () => {
  const { currentUser } = useUserContext();
  const { families, fetchFamilies, updateFamily } = useFamilyContext();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    father: "",
    fatherOccupation: "",
    mother: "",
    motherOccupation: "",
    brother: "",
    brotherOccupation: "",
    sister: "",
  });

  // fetch families on mount
  useEffect(() => {
    if (currentUser) fetchFamilies();
  }, [currentUser]);

  // populate form when currentUser or families change
  useEffect(() => {
    if (!currentUser) return;
    const userFamily = families.find((f) => f.uid === currentUser.id);
    if (userFamily) {
      setFormData({
        father: userFamily.father || "",
        fatherOccupation: userFamily.fatherOccupation || "",
        mother: userFamily.mother || "",
        motherOccupation: userFamily.motherOccupation || "",
        brother: userFamily.brother || "",
        brotherOccupation: userFamily.brotherOccupation || "",
        sister: userFamily.sister || "",
      });
    } else {
      setFormData({
        father: "",
        fatherOccupation: "",
        mother: "",
        motherOccupation: "",
        brother: "",
        brotherOccupation: "",
        sister: "",
      });
    }
  }, [currentUser, families]);

  if (!currentUser) {
    return (
      <div className="profile-auth-message">
        <p>Please login to edit your family details.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userFamily = families.find((f) => f.uid === currentUser.id);
    if (!userFamily) {
      alert("Family record not found. Please contact admin to create one.");
      return;
    }
  
    try {
      setLoading(true);
      const updatedData = {
        uid: userFamily.uid, // keep the existing uid
        ...formData,         // only fields user can edit
        otherDetails: userFamily.otherDetails || "",
        propertyDetails: userFamily.propertyDetails || "",
      };
  
      await updateFamily(userFamily.id, updatedData);
      alert("Family details updated successfully");
    } catch (err) {
      console.error("Error updating family details:", err);
      alert("Failed to update family details");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="profile-simple-form" noValidate>
      <div className="form-header">
        <h3><FaUsers className="header-icon" /> Family Details</h3>
      </div>

      {/* Father Details */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaUserTie className="field-icon" />
            Father Name
          </label>
          <div className="input-with-icon">
            <FaUserTie className="input-icon" />
            <input
              type="text"
              name="father"
              className="form-control"
              value={formData.father}
              onChange={handleChange}
              placeholder="Enter father's name"
            />
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaBriefcase className="field-icon" />
            Father Occupation
          </label>
          <div className="input-with-icon">
            <FaBriefcase className="input-icon" />
            <input
              type="text"
              name="fatherOccupation"
              className="form-control"
              value={formData.fatherOccupation}
              onChange={handleChange}
              placeholder="Enter father's occupation"
            />
          </div>
        </div>
      </div>

      {/* Mother Details */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaFemale className="field-icon" />
            Mother Name
          </label>
          <div className="input-with-icon">
            <FaFemale className="input-icon" />
            <input
              type="text"
              name="mother"
              className="form-control"
              value={formData.mother}
              onChange={handleChange}
              placeholder="Enter mother's name"
            />
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label-with-icon">
            <FaBriefcase className="field-icon" />
            Mother Occupation
          </label>
          <div className="input-with-icon">
            <FaBriefcase className="input-icon" />
            <input
              type="text"
              name="motherOccupation"
              className="form-control"
              value={formData.motherOccupation}
              onChange={handleChange}
              placeholder="Enter mother's occupation"
            />
          </div>
        </div>
      </div>

      {/* Siblings Details */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaUserFriends className="field-icon" />
            Brother Name
          </label>
          <div className="input-with-icon">
            <FaUserFriends className="input-icon" />
            <input
              type="text"
              name="brother"
              className="form-control"
              value={formData.brother}
              onChange={handleChange}
              placeholder="Enter brother's name"
            />
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaBriefcase className="field-icon" />
            Brother Occupation
          </label>
          <div className="input-with-icon">
            <FaBriefcase className="input-icon" />
            <input
              type="text"
              name="brotherOccupation"
              className="form-control"
              value={formData.brotherOccupation}
              onChange={handleChange}
              placeholder="Enter brother's occupation"
            />
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label-with-icon">
            <FaUserFriends className="field-icon" />
            Sister Name
          </label>
          <div className="input-with-icon">
            <FaUserFriends className="input-icon" />
            <input
              type="text"
              name="sister"
              className="form-control"
              value={formData.sister}
              onChange={handleChange}
              placeholder="Enter sister's name"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="row">
        <div className="col">
          <button type="submit" className="btn submit-btn"  style={{backgroundColor:"#9c5470",color:"white"}} disabled={loading}>
            <FaSave className="btn-icon" />
            {loading ? "Updating..." : "Update Family Details"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileFamilyTab;