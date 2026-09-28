// src/Components/User/Pages/ProfileUpdate.jsx
import React, { useState } from "react";
import { 
  FaUser, 
  FaIdCard, 
  FaUsers, 
  FaCog, 
  FaCheck,
  FaArrowRight
} from "react-icons/fa";
import { 
  HiUser, 
  HiClipboardList, 
  HiUserGroup, 
  HiAdjustments 
} from "react-icons/hi";
import { 
  IoPerson, 
  IoDocumentText, 
  IoPeople, 
  IoSettings 
} from "react-icons/io5";
import "./ProfileUpdate.css";
import ProfileProfileTab from "./ProfileProfileTab";
import ProfileDetailTab from "./ProfileDetailTab";
import ProfileFamilyTab from "./ProfileFamilyTab";
import ProfileOtherTab from "./ProfileOtherTab";

const ProfileUpdate = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { 
      id: "profile", 
      label: "Profile", 
      icon: <FaUser className="tab-icon" />,
      description: "Basic information"
    },
    { 
      id: "detail", 
      label: "Details", 
      icon: <FaIdCard className="tab-icon" />,
      description: "Personal details"
    },
    { 
      id: "family", 
      label: "Family", 
      icon: <FaUsers className="tab-icon" />,
      description: "Family information"
    },
    { 
      id: "other", 
      label: "Others", 
      icon: <FaCog className="tab-icon" />,
      description: "Additional details"
    }
  ];

  const getTabIcon = (tabId) => {
    switch(tabId) {
      case "profile":
        return <HiUser className="tab-icon" style={{color:'white'}}/>;
      case "detail":
        return <HiClipboardList className="tab-icon"  style={{color:'white'}}/>;
      case "family":
        return <HiUserGroup className="tab-icon" style={{color:'white'}}/>;
      case "other":
        return <HiAdjustments className="tab-icon" style={{color:'white'}}/>;
      default:
        return <IoPerson className="tab-icon"  style={{color:'white'}}/>;
    }
  };

  return (
    <div className="profile-update-container">
      {/* Header with Gradient Background */}
      <div className="profile-header">
        <div className="header-content1">
          <div className="header-icon">
           
          </div>
          <h1 className="profile-title">Update Your Profile</h1>
          <p className="profile-subtitle">Complete your profile to find your perfect match</p>
        </div>
        {/* <div className="header-wave">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div> */}
      </div>

      {/* Modern Tab Navigation */}
      <div className="tab-navigation-container">
        <div className="tab-scroll-wrapper">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-icon-wrapper">
                {tab.icon}
              </div>
              <div className="tab-text-content">
                <span className="tab-label">{tab.label}</span>
                <span className="tab-description">{tab.description}</span>
              </div>
              <div className="tab-arrow">
                <FaArrowRight />
              </div>
              <div className="tab-indicator"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Animated Tab Content */}
      <div className="tab-content-wrapper">
        <div className="tab-content-card">
          <div className="tab-header">
            <div className="current-tab-icon">
              {getTabIcon(activeTab)}
            </div>
            <div>
              <h3 className="current-tab-title">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <p className="current-tab-description">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>
          
          <div className="tab-panel fade-in">
            {activeTab === "profile" && <ProfileProfileTab />}
            {activeTab === "detail" && <ProfileDetailTab />}
            {activeTab === "family" && <ProfileFamilyTab />}
            {activeTab === "other" && <ProfileOtherTab />}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-container">
        <div className="progress-steps">
          {tabs.map((tab, index) => (
            <div key={tab.id} className="step-item">
              <div 
                className={`step-dot ${activeTab === tab.id ? "active" : ""} ${
                  tabs.findIndex(t => t.id === activeTab) > index ? "completed" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tabs.findIndex(t => t.id === activeTab) > index ? (
                  <FaCheck className="step-check" />
                ) : (
                  index + 1
                )}
              </div>
              {index < tabs.length - 1 && (
                <div className="step-connector"></div>
              )}
            </div>
          ))}
        </div>
        <div className="progress-text">
          Step {tabs.findIndex(tab => tab.id === activeTab) + 1} of {tabs.length}
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;