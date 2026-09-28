// // src/Pages/About.jsx
// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const About = () => {
//   return (
//     <div className="container py-3">
//       <div className="row align-items-center">
        
//         {/* ✅ LEFT COLUMN IMAGE */}
//         <div className="col-md-6 mb-4 mb-md-0">
//           <img
//             src="/Images/aboutimage.jpg"
//             alt="Matrimony"
//             className="img-fluid rounded shadow"
//             style={{height:'600px'}}
//           />
//         </div>

//         {/* ✅ RIGHT COLUMN (TEXT + IMAGE) */}
//         <div className="col-md-6">
          
//           {/* ✅ TOP HALF - MARATHI TEXT */}
//           <div className="mb-4">
//             <h3 className="mb-3">आमच्याबद्दल</h3>
//             <p style={{ textAlign: "justify", fontSize: "16px" }}>
//               आमची मॅट्रीमनी वेबसाइट ही विश्वासार्ह, सुरक्षित आणि आधुनिक सुविधा
//               देणारी विवाह जुळवणी सेवा आहे. योग्य जोडीदार शोधण्यासाठी आम्ही
//               प्रामाणिक आणि प्रमाणित प्रोफाइल्स उपलब्ध करून देतो. आपल्या संस्कृती,
//               परंपरा आणि कुटुंब मूल्ये यांचा सन्मान राखून योग्य नातेसंबंध घडवणे हेच
//               आमचे प्रमुख उद्दिष्ट आहे.
//             </p>

//             <p style={{ textAlign: "justify", fontSize: "16px" }}>
//               हजारो यशस्वी विवाह घडवणारी आमची सेवा आज अनेक कुटुंबांचा विश्वास
//               संपादन करत आहे. सोप्या नोंदणी प्रक्रियेतून योग्य जीवनसाथी
//               मिळवण्यासाठी आमचा प्लॅटफॉर्म आजच वापरायला सुरुवात करा.
//             </p>
//           </div>

//           {/* ✅ BOTTOM HALF - IMAGE */}
//           <div>
//             <img
//               src="Images/about2.jpg"
//               alt="Happy Couple"
//               className="img-fluid rounded shadow"
//               style={{height:'300px'}}
//             />
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;

import React from "react";
import { FaHeart, FaUsers, FaShieldAlt, FaHandshake, FaAward, FaStar } from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <section className="about-section" id="about">
      {/* Background Decoration */}
      <div className="about-bg-pattern"></div>
      
      <div className="container">
        {/* Page Header */}
        <div className="about-header">
          <h6 className="section-subtitle">Our Story</h6>
          <h1 className="section-title">
            About <span className="highlight">Maratha Vadhu Var Suchak</span>
          </h1>
          <div className="divider"></div>
          <p className="section-description">
            A trusted name in matrimonial services, dedicated to creating meaningful connections 
            within the Maratha community with integrity and cultural sensitivity.
          </p>
        </div>

        {/* Main Content */}
        <div className="about-content">
          <div className="row align-items-center">
            {/* Left Column - Image with Badge */}
            <div className="col-lg-6">
              <div className="about-image-wrapper">
                <div className="main-image-container">
                  <img
                    src="/Images/aboutimage.jpg"
                    alt="Maratha Matrimonial Service"
                    className="main-image"
                  />
                  <div className="image-badge">
                    <div className="badge-content">
                      <span className="years">10+</span>
                      <span className="text">Years of Excellence</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats Bar */}
                <div className="stats-bar">
                  <div className="stat-item">
                    <h3>1000+</h3>
                    <p>Happy Couples</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>98%</h3>
                    <p>Success Rate</p>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <h3>5000+</h3>
                    <p>Profiles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="col-lg-6">
              <div className="about-text-content">
                {/* About Us Section */}
                <div className="language-section english">
                  <div className="language-header">
                    <h3 className="language-title">
                      <FaHeart className="title-icon" />
                      About Us
                    </h3>
                  </div>
                  
                  <div className="content-box">
                    <p className="content-text">
                      Our matrimonial website is a reliable, secure, and modern matchmaking 
                      service. We provide genuine and verified profiles to help you find your 
                      perfect life partner. Our primary goal is to build meaningful relationships 
                      while honoring your culture, traditions, and family values.
                    </p>
                    
                    <p className="content-text">
                      With thousands of successful marriages facilitated, our service has earned 
                      the trust of numerous families. Start using our platform today for a 
                      simple registration process that leads you to your ideal life partner.
                    </p>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <FaShieldAlt />
                    </div>
                    <h4>Verified Profiles</h4>
                    <p>100% authentic and verified profiles</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">
                      <FaHandshake />
                    </div>
                    <h4>Personalized Service</h4>
                    <p>Customized matchmaking for each family</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">
                      <FaUsers />
                    </div>
                    <h4>Community Focus</h4>
                    <p>Specialized for Maratha community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision Section */}
          <div className="mission-section">
            <div className="row">
              <div className="col-lg-6">
                <div className="mission-card">
                  <div className="card-header">
                    <FaStar className="card-icon" />
                    <h3>Our Mission</h3>
                  </div>
                  <p>
                    To provide a trusted platform that connects eligible Maratha individuals 
                    with their perfect life partners while preserving cultural values and 
                    ensuring family compatibility.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="mission-card">
                  <div className="card-header">
                    <FaAward className="card-icon" />
                    <h3>Our Vision</h3>
                  </div>
                  <p>
                    To become the most preferred matrimonial service in the Maratha community 
                    by delivering exceptional matchmaking experiences with integrity and 
                    professionalism.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section (Optional) */}
          <div className="team-section">
            <h3 className="team-title">Why Choose Us</h3>
            <div className="row">
              <div className="col-md-4">
                <div className="team-card">
                  <div className="team-icon">🤝</div>
                  <h4>Trust & Reliability</h4>
                  <p>Decades of trusted service with proven results</p>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="team-card">
                  <div className="team-icon">🎯</div>
                  <h4>Targeted Matching</h4>
                  <p>Advanced algorithms for compatible matches</p>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="team-card">
                  <div className="team-icon">🛡️</div>
                  <h4>Privacy First</h4>
                  <p>Your data security is our top priority</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;