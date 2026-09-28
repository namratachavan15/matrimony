// src/Components/User/Pages/ProfilePreview.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePreview.css";
import { useUserContext } from "../State/UserContext";
import { useRashiContext } from "../State/RashiContext";
import { useNakshtraContext } from "../State/NakshtraContext";
import { useGanContext } from "../State/GanContext";
import { useNadiContext } from "../State/NadiContext";
import { useGotraContext } from "../State/GotraContext";
import { useOtherInfoContext } from "../State/OtherInfoContext";
import { useFamilyContext } from "../State/FamilyContext";
import { profileQualityService } from "../Services/profileQualityService";

import {
  FiUser,
  FiCalendar,
  FiMapPin,
  FiBookOpen,
  FiBriefcase,
  FiHeart,
  FiUsers,
  FiStar,
  FiPhone,
  FiMail,
  FiHome,
  FiDollarSign,
  FiMaximize,
  FiActivity,
  FiDroplet,
  FiCoffee,
  FiEye,
  FiCompass,
  FiMoon,
  FiSun,
  FiMessageCircle,
  FiShield,
  FiCheckCircle,
  FiInfo,
  FiClock,
} from "react-icons/fi";

const Icon = ({ name, className = "", size = 18 }) => {
  const icons = {
    user: FiUser,
    calendar: FiCalendar,
    location: FiMapPin,
    education: FiBookOpen,
    work: FiBriefcase,
    heart: FiHeart,
    family: FiUsers,
    siblings: FiUsers,
    users: FiUsers,

    star: FiStar,
    phone: FiPhone,
    mail: FiMail,
    home: FiHome,
    property: FiHome,

    rupee: FiDollarSign,
    height: FiMaximize,
    weight: FiActivity,
    blood: FiDroplet,

    diet: FiCoffee,
    drink: FiCoffee,
    smoke: FiActivity,
    glasses: FiEye,

    father: FiUser,
    mother: FiUser,

    aries: FiSun,
    gemini: FiSun,
    cancer: FiSun,
    leo: FiSun,
    virgo: FiSun,
    libra: FiSun,
    scorpio: FiSun,
    sagittarius: FiSun,
    capricorn: FiSun,
    aquarius: FiSun,
    pisces: FiSun,
    taurus: FiSun,

    zodiac: FiSun,
    rashi: FiSun,
    nakshtra: FiStar,
    gotra: FiUsers,
    nadi: FiActivity,
    gan: FiMoon,
    mangal: FiHeart,
    charan: FiCompass,

    whatsapp: FiMessageCircle,
    shield: FiShield,
    verified: FiCheckCircle,
    check: FiCheckCircle,
    warning: FiInfo,
    info: FiInfo,
    clock: FiClock,
  };

  const IconComponent = icons[name] || FiInfo;

  return (
    <IconComponent
      size={size}
      strokeWidth={1.8}
      className={`professional-icon ${className}`}
      aria-hidden="true"
    />
  );
};

const ProfilePreview = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const tabContentRef = useRef(null);

  // Master contexts
  const { rashis, fetchRashis } = useRashiContext();
  const { nakshtras, fetchNakshtras } = useNakshtraContext();
  const { gans, fetchGans } = useGanContext();
  const { nadis, fetchNadis } = useNadiContext();
  const { gotras, fetchGotras } = useGotraContext();

  const backendURL = "http://localhost:5454/";

  // User-specific contexts
  const { otherInfo, fetchOtherInfoByUserId } = useOtherInfoContext();
  const { families, fetchFamilies } = useFamilyContext();

  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [strength, setStrength] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Add smooth scroll effect when switching tabs
  useEffect(() => {
    if (tabContentRef.current) {
      tabContentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Load master + user-specific data
  useEffect(() => {
    const loadAllData = async () => {
      if (!currentUser) return;
      try {
        await Promise.all([
          fetchRashis(),
          fetchNakshtras(),
          fetchGans(),
          fetchNadis(),
          fetchGotras(),
          fetchOtherInfoByUserId(currentUser.id),
          fetchFamilies()
        ]);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    };
    loadAllData();
  }, [currentUser]);

  // Map profile after all data is loaded
  useEffect(() => {
    if (!currentUser || !otherInfo || !families) return;

    setLoading(true);

    try {
      const userFamily = families.find((f) => f.uid === currentUser.id) || {};

      const astro = {
        ras: rashis.find((r) => r.id === otherInfo.rsid)?.ras || null,
        nakshtra: nakshtras.find((n) => n.id === otherInfo.nkid)?.nakshtra || null,
        gotra: gotras.find((g) => g.id === otherInfo.gid)?.gotra || null,
        nadi: nadis.find((n) => n.id === otherInfo.ndid)?.nadi || null,
        gan: gans.find((g) => g.id === otherInfo.gnid)?.gan || null,
        mangal: otherInfo.mangal || otherInfo.managal || null,
        charan: otherInfo.charan || null,
      };

      const mapped = {
        id: currentUser.id ?? currentUser.uid ?? "N/A",
        uname: currentUser.uname || currentUser.name || "N/A",
        age: currentUser.age,
        height: currentUser.height,
        status: currentUser.status,
        vstatus: currentUser.vstatus,
        verificationRejectionReason: currentUser.verificationRejectionReason,
        uprofile: currentUser.uprofile
          ? currentUser.uprofile.startsWith("http")
            ? currentUser.uprofile
            : `${backendURL}uploads/profile/${currentUser.uprofile}`
          : null,
        dob: currentUser.dob,
        dobTime: currentUser.dobTime,
        birthplace: currentUser.birthplace,
        weight: currentUser.weight,
        bloodgroup: currentUser.bloodgroup,
        marriageType: currentUser.marriageType,
        caste: currentUser.ctName || currentUser.caste,
        subcaste: currentUser.sctName || currentUser.subcaste,
        education: currentUser.education || currentUser.educationDetails,
        educationDetails: currentUser.educationDetails,
        profession: currentUser.currentWork || currentUser.profession,
        currentWork: currentUser.currentWork,
        fincome: currentUser.fincome,
        income: currentUser.fincome || currentUser.income,
        cLocation: currentUser.cLocation,
        location: currentUser.cLocation || currentUser.address,
        diet: currentUser.diet,
        drink: currentUser.drink,
        smoking: currentUser.smoking,
        specs: currentUser.specs,
        umobile: currentUser.umobile,
        altMobile: currentUser.altMobile,
        whatsappno: currentUser.whatsappno,
        email: currentUser.email,
        address: currentUser.address,
        family: {
          father: userFamily.father,
          fatherOccupation: userFamily.fatherOccupation,
          mother: userFamily.mother,
          motherOccupation: userFamily.motherOccupation,
          brother: userFamily.brother,
          sister: userFamily.sister,
          propertyDetails: userFamily.propertyDetails,
          otherDetails: userFamily.otherDetails,
        },
        other: astro,
        otherinfo: currentUser.otherinfo,
        expectation: currentUser.expectation,
        remark: currentUser.remark,
      };

      setProfile(mapped);
    } catch (e) {
      console.error("Error mapping profile:", e);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [currentUser, otherInfo, families, rashis, nakshtras, gans, nadis, gotras]);

  // Profile Completion & Strength (Part 13 & 14) -- real data from the backend,
  // not hardcoded. Reloads whenever the mapped profile changes (e.g. after
  // saving an edit) so the percentage stays accurate.
  useEffect(() => {
    if (!currentUser?.id) return;
    const loadQuality = async () => {
      try {
        const [compRes, strRes] = await Promise.allSettled([
          profileQualityService.getCompletion(),
          profileQualityService.getStrength(),
        ]);
        if (compRes.status === "fulfilled") setCompletion(compRes.value.data);
        if (strRes.status === "fulfilled") setStrength(strRes.value.data);
      } catch (e) {
        console.error("Error loading profile quality:", e);
      }
    };
    loadQuality();
  }, [currentUser?.id, profile]);

  const handleBack = () => navigate(-1);
  const handleContact = () => alert("Contact details will be shared with you shortly!");
  const handleExpressInterest = () => alert("Interest expressed successfully!");
  const handleShortlist = () => alert("Added to shortlist!");

  // Image zoom functions
  const openImageModal = () => {
    if (profile?.uprofile) {
      setShowImageModal(true);
      setZoomLevel(1);
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(prev => prev + 0.25);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(prev => prev - 0.25);
    }
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeImageModal();
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [showImageModal]);

  if (loading) {
    return (
      <div className="profile-preview-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-preview-error">
        <h2>Profile Not Found</h2>
        <p>Unable to load profile information. Please try again.</p>
        <button onClick={handleBack} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="profile-preview-new">
      {/* Header */}
      <header className="preview-header-new">
        <div className="header-content">
          <button onClick={handleBack} className="back-btn-new">
            <span className="arrow">←</span> Back
          </button>
          <div className="header-title">
            <h1>Profile Preview</h1>
            <div className="profile-id-new">
              <span className="id-label">Profile ID:</span>
              <span className="id-value">{profile.id}</span>
            </div>
          </div>
          <div className={`status-indicator ${profile.status === 1 ? 'active' : 'inactive'}`}>
            {profile.status === 1 ? 'Active' : 'Inactive'}
          </div>
        </div>
      </header>

      {/* Verification status banner (Part 8) */}
      {Number(profile.vstatus) === 1 && (
        <div className="verification-banner verification-verified">
          <FiCheckCircle /> Your profile is <strong>Verified</strong>.
        </div>
      )}
      {Number(profile.vstatus) === 2 && (
        <div className="verification-banner verification-rejected">
          <FiInfo /> Verification was rejected
          {profile.verificationRejectionReason ? `: ${profile.verificationRejectionReason}` : "."} Please update your
          documents and they'll be reviewed again.
        </div>
      )}
      {(profile.vstatus === undefined || profile.vstatus === null || Number(profile.vstatus) === 0) && (
        <div className="verification-banner verification-pending">
          <FiClock /> Your profile verification is pending review by our team.
        </div>
      )}

      {/* Profile Completion & Strength (Part 13 & 14) */}
      {(completion || strength) && (
        <div className="quality-section">
          {completion && (
            <div className="quality-card">
              <div className="quality-card-header">
                <span>Profile Completion</span>
                <span className="quality-percent">{completion.percentage}%</span>
              </div>
              <div className="quality-progress-track">
                <div
                  className="quality-progress-fill"
                  style={{ width: `${completion.percentage}%` }}
                />
              </div>
              {completion.missingFields?.length > 0 && (
                <ul className="quality-missing-list">
                  {completion.missingFields.slice(0, 4).map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              )}
              {completion.percentage < 100 && (
                <button className="quality-complete-btn" onClick={() => navigate("/profile-update")}>
                  Complete Profile
                </button>
              )}
            </div>
          )}

          {strength && (
            <div className="quality-card">
              <div className="quality-card-header">
                <span>Profile Strength</span>
                <span className="quality-stars">
                  {"★".repeat(strength.stars)}
                  {"☆".repeat(5 - strength.stars)}
                </span>
              </div>
              {strength.suggestions?.length > 0 && (
                <ul className="quality-missing-list">
                  {strength.suggestions.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      <div className="preview-layout">
        {/* Profile Header Section */}
        <div className="profile-header-section">
          <div className="profile-image-container" onClick={openImageModal}>
            <img
              src={
                profile.uprofile
                  ? profile.uprofile.startsWith("http")
                    ? profile.uprofile
                    : `${backendURL}uploads/profile/${profile.uprofile}`
                  : "/default-avatar.png"
              }
              alt={profile.uname}
              className="profile-image-main"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="image-overlay">
              <span className="zoom-text">Click to view larger</span>
            </div>
          </div>
          
          <div className="profile-header-info">
            <div className="name-section">
              <h2>{profile.uname}</h2>
              {Number(profile.vstatus) === 1 && (
                <span className="verified-badge" title="Verified Profile">
                  <FiCheckCircle /> Verified
                </span>
              )}
              <div className="age-tag">{profile.age} Years</div>
            </div>
            
            <div className="quick-details">
              <div className="detail-chip">
                <Icon name="height" />
                <span>{profile.height || "N/A"}</span>
              </div>
              <div className="detail-chip">
                <Icon name="work" />
                <span>{profile.profession || "N/A"}</span>
              </div>
              <div className="detail-chip">
                <Icon name="location" />
                <span>{profile.location || "N/A"}</span>
              </div>
              <div className="detail-chip">
                <Icon name="rupee" />
                <span>{profile.income || "N/A"}</span>
              </div>
            </div>
            
            {/* <div className="action-buttons-new">
              <button className="action-btn primary-btn" onClick={handleExpressInterest}>
                <Icon name="heart" /> Express Interest
              </button>
              <button className="action-btn secondary-btn" onClick={handleContact}>
                <Icon name="phone" /> Contact
              </button>
              <button className="action-btn outline-btn" onClick={handleShortlist}>
                <Icon name="star" /> Shortlist
              </button>
            </div> */}
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="content-tabs">
          <div className="tab-nav">
            {["overview", "personal", "family", "astrology", "contact"].map((tab) => (
              <button
                key={tab}
                className={`tab-nav-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-content-new" ref={tabContentRef}>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="overview-tab">
                <div className="about-section">
                  <h3><Icon name="user" /> About Me</h3>
                  <p>{profile.otherinfo || "No information provided yet."}</p>
                </div>

                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-card-header">
                      <Icon name="education" />
                      <h4>Education & Career</h4>
                    </div>
                    <div className="info-list">
                      <div className="info-item-new">
                        <span className="info-label-new">Education</span>
                        <span className="info-value-new">{profile.education || "N/A"}</span>
                      </div>
                      <div className="info-item-new">
                        <span className="info-label-new">Profession</span>
                        <span className="info-value-new">{profile.profession || "N/A"}</span>
                      </div>
                      <div className="info-item-new">
                        <span className="info-label-new">Annual Income</span>
                        <span className="info-value-new income-value">{profile.income || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-card-header">
                      <Icon name="heart" />
                      <h4>Lifestyle</h4>
                    </div>
                    <div className="lifestyle-grid-new">
                      {profile.diet && (
                        <div className="lifestyle-item-new">
                          <Icon name="diet" />
                          <div>
                            <div className="lifestyle-label-new">Diet</div>
                            <div className={`lifestyle-value-new ${profile.diet.toLowerCase()}`}>
                              {profile.diet}
                            </div>
                          </div>
                        </div>
                      )}
                      {profile.drink && (
                        <div className="lifestyle-item-new">
                          <Icon name="drink" />
                          <div>
                            <div className="lifestyle-label-new">Drink</div>
                            <div className={`lifestyle-value-new ${profile.drink.toLowerCase()}`}>
                              {profile.drink}
                            </div>
                          </div>
                        </div>
                      )}
                      {profile.smoking && (
                        <div className="lifestyle-item-new">
                          <Icon name="smoke" />
                          <div>
                            <div className="lifestyle-label-new">Smoking</div>
                            <div className={`lifestyle-value-new ${profile.smoking.toLowerCase()}`}>
                              {profile.smoking}
                            </div>
                          </div>
                        </div>
                      )}
                      {profile.specs && (
                        <div className="lifestyle-item-new">
                          <Icon name="glasses" />
                          <div>
                            <div className="lifestyle-label-new">Spectacles</div>
                            <div className={`lifestyle-value-new ${profile.specs.toLowerCase()}`}>
                              {profile.specs}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-card-header">
                      <Icon name="star" />
                      <h4>Astrological Details</h4>
                    </div>
                    <div className="astro-grid-new">
                      <div className="astro-item-new">
                        <Icon name="aries" />
                        <div>
                          <div className="astro-label">Rashi</div>
                          <div className="astro-value">{profile.other?.ras || "N/A"}</div>
                        </div>
                      </div>
                      <div className="astro-item-new">
                        <Icon name="star" />
                        <div>
                          <div className="astro-label">Nakshatra</div>
                          <div className="astro-value">{profile.other?.nakshtra || "N/A"}</div>
                        </div>
                      </div>
                      <div className="astro-item-new">
                        <Icon name="family" />
                        <div>
                          <div className="astro-label">Gotra</div>
                          <div className="astro-value">{profile.other?.gotra || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Tab */}
            {activeTab === "personal" && (
              <div className="personal-tab">
                <div className="personal-grid">
                  <div className="personal-card">
                    <h3><Icon name="calendar" /> Personal Details</h3>
                    <div className="personal-details">
                      <DetailRow icon="calendar" label="Date of Birth" value={profile.dob} />
                      <DetailRow icon="location" label="Birth Place" value={profile.birthplace} />
                      <DetailRow icon="weight" label="Weight" value={profile.weight} />
                      <DetailRow icon="blood" label="Blood Group" value={profile.bloodgroup} />
                      <DetailRow icon="heart" label="Marital Status" value={profile.marriageType} />
                      <DetailRow icon="user" label="Caste" value={profile.caste} />
                      <DetailRow icon="user" label="Subcaste" value={profile.subcaste} />
                    </div>
                  </div>

                  <div className="personal-card">
                    <h3><Icon name="education" /> Education & Career</h3>
                    <div className="personal-details">
                      <DetailRow icon="education" label="Education" value={profile.education} />
                      <DetailRow icon="work" label="Profession" value={profile.currentWork} />
                      <DetailRow icon="rupee" label="Annual Income" value={profile.income} />
                      <DetailRow icon="work" label="Education Details" value={profile.educationDetails} />
                    </div>
                  </div>

                  <div className="personal-card full-width">
                    <h3><Icon name="heart" /> Expectations</h3>
                    <div className="expectations-content">
                      {profile.expectation || "No expectations specified yet."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Family Tab */}
           {/* Family Tab - COMPACT DESIGN */}
{activeTab === "family" && (
  <div className="family-tab-compact">
    {/* Family Overview Card */}
    <div className="family-overview-card">
      <h3 className="family-section-title">
        <Icon name="family" /> Family Information
      </h3>
      
      <div className="family-stats-grid">
        <div className="family-stat">
          <div className="stat-icon">
            <Icon name="father" />
          </div>
          <div className="stat-content">
            <div className="stat-label" >Father</div>
            <div className="stat-value">{profile.family?.father || "Not specified"}</div>
            {profile.family?.fatherOccupation && (
              <div className="stat-subtext">{profile.family.fatherOccupation}</div>
            )}
          </div>
        </div>
        
        <div className="family-stat">
          <div className="stat-icon">
            <Icon name="mother" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Mother</div>
            <div className="stat-value">{profile.family?.mother || "Not specified"}</div>
            {profile.family?.motherOccupation && (
              <div className="stat-subtext">{profile.family.motherOccupation}</div>
            )}
          </div>
        </div>
        
        <div className="family-stat">
          <div className="stat-icon">
            <Icon name="siblings" />
          </div>
          <div className="stat-content">
            <div className="stat-label">Siblings</div>
            <div className="siblings-count-compact">
              <div className="sibling-item">
                <span className="sibling-count">{profile.family?.brother || 0}</span>
                <span className="sibling-type">Brothers</span>
              </div>
              <div className="sibling-item">
                <span className="sibling-count">{profile.family?.sister || 0}</span>
                <span className="sibling-type">Sisters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Property Details - Only if exists */}
    {(profile.family?.propertyDetails || profile.family?.otherDetails) && (
      <div className="property-details-card">
        <h4 className="property-title">
          <Icon name="property" /> Additional Family Details
        </h4>
        <div className="property-content-compact">
          {profile.family.propertyDetails && (
            <div className="property-item">
              <div className="property-label">Property Details:</div>
              <div className="property-text">{profile.family.propertyDetails}</div>
            </div>
          )}
          {profile.family.otherDetails && (
            <div className="property-item">
              <div className="property-label">Other Information:</div>
              <div className="property-text">{profile.family.otherDetails}</div>
            </div>
          )}
        </div>
      </div>
    )}
    
    {/* Family Structure Visualization */}
    <div className="family-tree-card">
      <h4 className="tree-title">Family Structure</h4>
      <div className="family-tree">
        <div className="tree-row">
          <div className="tree-node parent">
            <Icon name="father" />
            <div className="node-name">{profile.family?.father || "Father"}</div>
          </div>
          <div className="tree-connector"></div>
          <div className="tree-node parent">
            <Icon name="mother" />
            <div className="node-name">{profile.family?.mother || "Mother"}</div>
          </div>
        </div>
        <div className="tree-vertical-connector"></div>
        <div className="tree-row">
          <div className="tree-node main">
            <Icon name="user" />
            <div className="node-name">{profile.uname}</div>
            <div className="node-relation">You</div>
          </div>
        </div>
        {(profile.family?.brother > 0 || profile.family?.sister > 0) && (
          <>
            <div className="tree-vertical-connector"></div>
            <div className="tree-row siblings-row">
              {profile.family?.brother > 0 && (
                <div className="tree-node sibling">
                  <Icon name="user" />
                  <div className="sibling-info">
                    <div className="node-count">{profile.family.brother}</div>
                    <div className="node-type">Brother{profile.family.brother > 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}
              {profile.family?.sister > 0 && (
                <div className="tree-node sibling">
                  <Icon name="user" />
                  <div className="sibling-info">
                    <div className="node-count">{profile.family.sister}</div>
                    <div className="node-type">Sister{profile.family.sister > 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}

            {/* Astrology Tab */}
            {activeTab === "astrology" && (
              <div className="astrology-tab">
                <div className="astrology-grid-new">
                  <AstroCard label="Rashi" value={profile.other?.ras} icon="aries" />
                  <AstroCard label="Nakshatra" value={profile.other?.nakshtra} icon="star" />
                  <AstroCard label="Gotra" value={profile.other?.gotra} icon="family" />
                  <AstroCard label="Nadi" value={profile.other?.nadi} icon="heart" />
                  <AstroCard label="Gan" value={profile.other?.gan} icon="user" />
                  <AstroCard 
                    label="Mangal" 
                    value={profile.other?.mangal} 
                    icon="heart"
                    isMangal={true}
                  />
                  <AstroCard label="Charan" value={profile.other?.charan} icon="work" />
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="contact-tab">
                <div className="contact-grid-new">
                  {profile.umobile && (
                    <ContactCard 
                      icon="phone" 
                      label="Mobile Number" 
                      value={profile.umobile}
                      subtitle="Primary Contact"
                    />
                  )}
                  {profile.altMobile && (
                    <ContactCard 
                      icon="phone" 
                      label="Alternate Mobile" 
                      value={profile.altMobile}
                      subtitle="Secondary Contact"
                    />
                  )}
                  {profile.whatsappno && (
                    <ContactCard 
                      icon="phone" 
                      label="WhatsApp" 
                      value={profile.whatsappno}
                      subtitle="Available for chat"
                    />
                  )}
                  {profile.email && (
                    <ContactCard 
                      icon="mail" 
                      label="Email" 
                      value={profile.email}
                      subtitle="Email communication"
                    />
                  )}
                  {profile.address && (
                    <ContactCard 
                      icon="home" 
                      label="Address" 
                      value={profile.address}
                      subtitle="Permanent Address"
                      fullWidth={true}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && profile.uprofile && (
        <div className="image-modal-overlay-new" onClick={closeImageModal}>
          <div className="image-modal-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>{profile.uname}'s Profile Photo</h3>
              <button className="close-btn-new" onClick={closeImageModal}>×</button>
            </div>
            <div className="modal-body-new">
              <div className="image-container-new">
                <img
                  src={
                    profile.uprofile.startsWith("http")
                      ? profile.uprofile
                      : `${backendURL}uploads/profile/${profile.uprofile}`
                  }
                  alt={`${profile.uname}'s Profile`}
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="modal-image"
                />
              </div>
              <div className="zoom-controls-new">
                <button onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>-</button>
                <span>{Math.round(zoomLevel * 100)}%</span>
                <button onClick={handleZoomIn} disabled={zoomLevel >= 3}>+</button>
                <button onClick={handleZoomReset}>Reset</button>
              </div>
              <div className="image-info-new">
                <p><strong>Name:</strong> {profile.uname}</p>
                {profile.age && <p><strong>Age:</strong> {profile.age}</p>}
                {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const DetailRow = ({ icon, label, value }) => (
  <div className="detail-row">
    <div className="detail-label">
      <Icon name={icon} />
      <span>{label}</span>
    </div>
    <div className="detail-value">{value || "N/A"}</div>
  </div>
);

const FamilyMember = ({ role, name, occupation, icon }) => (
  <div className="family-member-new">
    <Icon name={icon} />
    <div className="member-info-new">
      <div className="member-role-new">{role}</div>
      <div className="member-name-new">{name || "N/A"}</div>
      <div className="member-occupation">{occupation || "N/A"}</div>
    </div>
  </div>
);

const AstroCard = ({ label, value, icon, isMangal = false }) => (
  <div className="astro-card-new">
    <Icon name={icon} />
    <div className="astro-info-new">
      <div className="astro-label-new">{label}</div>
      <div className={`astro-value-new ${isMangal ? (value === 'Yes' ? 'mangal-yes' : 'mangal-no') : ''}`}>
        {value || "N/A"}
      </div>
    </div>
  </div>
);

const ContactCard = ({ icon, label, value, subtitle, fullWidth = false }) => (
  <div className={`contact-card-new ${fullWidth ? 'full-width' : ''}`}>
    <Icon name={icon} />
    <div className="contact-details-new">
      <div className="contact-label">{label}</div>
      <div className="contact-value">{value}</div>
      <div className="contact-subtitle">{subtitle}</div>
    </div>
  </div>
);

export default ProfilePreview;