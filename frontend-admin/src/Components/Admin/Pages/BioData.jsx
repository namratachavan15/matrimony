import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../Config/api";
import "./Biodata.css";
import { useUserContext } from "../State/UserContext";
import { useSubcastContext } from './../State/SubcastContext';
import { useFamilyContext } from "../State/FamilyContext";
import { useRashiContext } from "../State/RashiContext";
import { useNakshtraContext } from "../State/NakshtraContext";
import { useOtherInfoContext } from "../State/OtherInfoContext";
import { 
  FaDownload,
  FaUser, 
  FaBirthdayCake, 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaBriefcase,
  FaHome,
  FaUsers,
  FaStar,
  FaHeart,
  FaPhone,
  FaEnvelope,
  FaVenusMars,
  FaTint,
  FaRulerVertical,
  FaWeight,
  FaChild,
  FaBuilding,
  FaTree,
  FaSmokingBan,
  FaWineGlassAlt,
  FaUtensils
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Biodata = () => {
  const { id } = useParams();
  const { fetchUserById } = useUserContext();
  const [user, setUser] = useState(null);
  const [otherInfo, setOtherInfo] = useState();
  const [castMap, setCastMap] = useState({});
  const { subcasts, fetchSubcasts } = useSubcastContext();
  const { families, fetchFamilies } = useFamilyContext();
  const { rashis, fetchRashis } = useRashiContext();
  const { nakshtras, fetchNakshtras } = useNakshtraContext();
  const { getOtherInfoByUserId } = useOtherInfoContext();

  const userFamily = families.find((f) => f.uid === Number(id));

  const downloadPDF = () => {
    const input = document.getElementById("biodata-pdf");
    
    html2canvas(input, { 
      scale: 2, 
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${user?.uname || "biodata"}_${new Date().getTime()}.pdf`);
    });
  };

  const loadData = async () => {
    const other = await getOtherInfoByUserId(id);
    setOtherInfo(other);
  };

  useEffect(() => {
    if (!id) return;
    const loadUser = async () => {
      const data = await fetchUserById(id);
      setUser(data);
    };
    loadUser();
  }, [id, fetchUserById]);

  const rashiMap = useMemo(() => {
    const map = {};
    rashis.forEach(r => (map[r.id] = r.ras));
    return map;
  }, [rashis]);

  const nakshtraMap = useMemo(() => {
    const map = {};
    nakshtras.forEach(n => (map[n.id] = n.nakshtra));
    return map;
  }, [nakshtras]);

  useEffect(() => {
    const loadCasts = async () => {
      try {
        const { data } = await api.get("/api/admin/cast");
        const map = {};
        (data || []).forEach((c) => {
          map[c.id] = c.cast;
        });
        setCastMap(map);
      } catch (err) {
        console.error("Error fetching cast list for subcast table:", err);
      }
    };
    loadCasts();
    fetchSubcasts();
    fetchRashis();
    fetchNakshtras();
    fetchFamilies();
    loadData();
  }, []);

  const subCastMap = useMemo(() => {
    const map = {};
    subcasts.forEach(sc => {
      map[sc.id] = sc.name || sc.subcast || sc.sctid;
    });
    return map;
  }, [subcasts]);

  if (!user) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading Biodata...</p>
    </div>
  );

  return (
    <div className="biodata-wrapper">
      {/* Download Button */}
    

      <div className="biodata-container" id="biodata-pdf">
        {/* Header */}
        <header className="biodata-header">
          <div className="header-top">
            <div className="header-logo">
              <img src="/assets/images/logo.png" alt="Maratha Vadhu-Var Mandal" />
              <div className="header-title">
                <h1>Maratha Vadhu-Var Mandal</h1>
                <p>Connecting Hearts Since 2010</p>
              </div>
            </div>
            <div className="header-contact">
              <div className="contact-info">
                <FaPhone />
                <span>+91 99229 45177</span>
              </div>
              <div className="contact-info">
                <FaUser />
                <span>Sou. Manisha Kulkarni</span>
              </div>
            </div>
          </div>
          <div className="header-mantra">
            <h2>॥ श्री गणेशाय नमः ॥</h2>
          </div>
        </header>

        {/* Profile Hero Section */}
        <section className="profile-hero">
          <div className="profile-image-container">
            <div className="image-wrapper">
              <img
                src={
                  user?.uprofile
                    ? `http://localhost:5454/uploads/profile/${user.uprofile}`
                    : "/no-photo.png"
                }
                alt={user.uname}
                className="main-profile-photo"
              />
              <div className="profile-label">
                {user.gender === 'Male' ? 'GROOM' : 'BRIDE'}
              </div>
            </div>
          </div>
          
          <div className="profile-hero-content">
            <div className="profile-id-tag">
              <span className="profile-id">Profile ID: {user.id}</span>
            </div>
            <h1 className="profile-name">{user.uname}</h1>
            
            <div className="profile-highlights">
              <div className="highlight-item">
                <FaVenusMars className="highlight-icon" />
                <div>
                  <span className="highlight-label">Gender</span>
                  <span className="highlight-value">{user.gender}</span>
                </div>
              </div>
              <div className="highlight-item">
                <FaBirthdayCake className="highlight-icon" />
                <div>
                  <span className="highlight-label">Age</span>
                  <span className="highlight-value">{user.age} Years</span>
                </div>
              </div>
              <div className="highlight-item">
                <FaTint className="highlight-icon" />
                <div>
                  <span className="highlight-label">Blood Group</span>
                  <span className="highlight-value">{user.bloodgroup}</span>
                </div>
              </div>
              <div className="highlight-item">
                <FaRulerVertical className="highlight-icon" />
                <div>
                  <span className="highlight-label">Height</span>
                  <span className="highlight-value">{user.height}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="biodata-main">
          {/* Personal Details Section */}
          <section className="section-card">
            <div className="section-header">
              <FaUser className="section-icon" />
              <h3>Personal Details</h3>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Date of Birth</span>
                <span className="detail-value">{user.dob}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Birth Time</span>
                <span className="detail-value">{user.dobTime || "Not specified"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Birth Place</span>
                <span className="detail-value">{user.birthplace}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Weight</span>
                <span className="detail-value">{user.weight} Kg</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Education</span>
                <span className="detail-value">{user.educationDetails}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cast</span>
                <span className="detail-value">{castMap[user.ctid] || user.ctid}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sub-Cast</span>
                <span className="detail-value">{subCastMap[user.sctid] || user.sctid}</span>
              </div>
            </div>
          </section>

          {/* Professional Details */}
          <section className="section-card">
            <div className="section-header">
              <FaBriefcase className="section-icon" />
              <h3>Professional Details</h3>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Current Work</span>
                <span className="detail-value">{user.currentWork}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Work Location</span>
                <span className="detail-value">{user.cLocation}</span>
              </div>
            </div>
          </section>

          {/* Family Details */}
          <section className="section-card">
            <div className="section-header">
              <FaHome className="section-icon" />
              <h3>Family Details</h3>
            </div>
            <div className="family-grid">
              <div className="family-member">
                <FaUser className="member-icon" />
                <div>
                  <span className="member-relation">Father</span>
                  <span className="member-name">{userFamily?.father || "N/A"}</span>
                  <span className="member-occupation">{userFamily?.fatherOccupation || ""}</span>
                </div>
              </div>
              <div className="family-member">
                <FaUser className="member-icon" />
                <div>
                  <span className="member-relation">Mother</span>
                  <span className="member-name">{userFamily?.mother || "N/A"}</span>
                  <span className="member-occupation">{userFamily?.motherOccupation || ""}</span>
                </div>
              </div>
              <div className="family-member">
                <FaChild className="member-icon" />
                <div>
                  <span className="member-relation">Brother(s)</span>
                  <span className="member-name">{userFamily?.brother || "N/A"}</span>
                  <span className="member-occupation">{userFamily?.brotherOccupation || ""}</span>
                </div>
              </div>
              <div className="family-member">
                <FaChild className="member-icon" />
                <div>
                  <span className="member-relation">Sister(s)</span>
                  <span className="member-name">{userFamily?.sister || "N/A"}</span>
                </div>
              </div>
            </div>
            {userFamily?.propertyDetails && (
              <div className="family-extra">
                <span className="extra-label">Property Details:</span>
                <p>{userFamily.propertyDetails}</p>
              </div>
            )}
          </section>

          {/* Astrological & Lifestyle Details */}
          <div className="two-column-section">
            {/* Astrological Details */}
            <section className="section-card half-card">
              <div className="section-header">
                <FaStar className="section-icon" />
                <h3>Astrological Details</h3>
              </div>
              <div className="details-list">
                <div className="list-item">
                  <span className="list-label">Rashi</span>
                  <span className="list-value">{rashiMap[otherInfo?.rsid] || "N/A"}</span>
                </div>
                <div className="list-item">
                  <span className="list-label">Nakshatra</span>
                  <span className="list-value">{nakshtraMap[otherInfo?.nkid] || "N/A"}</span>
                </div>
                <div className="list-item">
                  <span className="list-label">Gotra</span>
                  <span className="list-value">{user.expectation || "N/A"}</span>
                </div>
                <div className="list-item">
                  <span className="list-label">Manglik</span>
                  <span className="list-value">
                    <span className={`manglik-status ${user.specs === "Yes" ? 'yes' : 'no'}`}>
                      {user.specs === "Yes" ? "Yes" : "No"}
                    </span>
                  </span>
                </div>
              </div>
            </section>

            {/* Lifestyle Details */}
            <section className="section-card half-card">
              <div className="section-header">
                <FaHeart className="section-icon" />
                <h3>Lifestyle</h3>
              </div>
              <div className="lifestyle-grid">
                <div className="lifestyle-item">
                  <FaUtensils className="lifestyle-icon" />
                  <span className="lifestyle-label">Diet</span>
                  <span className="lifestyle-value">{user.diet || "Not specified"}</span>
                </div>
                <div className="lifestyle-item">
                  <FaWineGlassAlt className="lifestyle-icon" />
                  <span className="lifestyle-label">Drinking</span>
                  <span className="lifestyle-value">{user.drink || "Not specified"}</span>
                </div>
                <div className="lifestyle-item">
                  <FaSmokingBan className="lifestyle-icon" />
                  <span className="lifestyle-label">Smoking</span>
                  <span className="lifestyle-value">{user.smoking || "Not specified"}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Additional Information */}
          {user.otherinfo && (
            <section className="section-card">
              <div className="section-header">
                <h3>Additional Information</h3>
              </div>
              <div className="additional-content">
                <p>{user.otherinfo}</p>
              </div>
            </section>
          )}

          {/* Expectations */}
          {user.expectation && (
            <section className="section-card expectation-section">
              <div className="section-header">
                <h3>Partner Expectations</h3>
              </div>
              <div className="expectation-content">
                <p>{user.expectation}</p>
              </div>
            </section>
          )}
            <div className="download-btn-container">
        <button className="download-pdf-btn" onClick={downloadPDF}>
          <FaDownload /> Download PDF
        </button>
      </div>
        </main>

        {/* Footer */}
        <footer className="biodata-footer">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/assets/images/logo.png" alt="Logo" />
              <div className="footer-text">
                <h4>Maratha Vadhu-Var Mandal</h4>
                <p>Registered Matrimonial Service</p>
              </div>
            </div>
            <div className="footer-contact">
              <p><FaPhone /> +91 99229 45177</p>
              <p>Email: contact@marathamandal.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>This biodata is confidential and generated for matrimonial purposes only.</p>
            <p className="confidential-tag">CONFIDENTIAL</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Biodata;