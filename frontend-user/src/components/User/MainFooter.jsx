// import React from "react";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaYoutube,
// } from "react-icons/fa";
// import "./MainFooter.css";

// const MainFooter = () => {
//   return (
//     <footer className="footer-section">
//       <div className="container">
//         <div className="row text-white">

//           {/* ✅ ABOUT US */}
//           <div className="col-lg-3 col-md-6 mb-4">
//             <h5 className="footer-title">About Us</h5>
//             <p className="footer-text">
//               Welcome to Manisha Maratha Vadhu Var Suchak. We help you find your
//               perfect life partner with trust, reliability, and commitment.
//               Your happiness is our priority.
//             </p>
//           </div>

//           {/* ✅ ADDRESS */}
//           <div className="col-lg-2 col-md-6 mb-4">
//             <h5 className="footer-title">Address</h5>
//             <p className="footer-text">
//               Chankya Puri, <br />
//               Vishrambag, <br />
//               Sangli
//             </p>
//           </div>

//           {/* ✅ CONTACT */}
//           <div className="col-lg-3 col-md-6 mb-4">
//             <h5 className="footer-title">Contact Us</h5>
//             <p className="footer-text">
//               Phone: +91 99229 45177 <br />
//               Email: manishakulkarani@gmail.com
//             </p>
//           </div>

//           {/* ✅ OPENING HOURS */}
//           <div className="col-lg-2 col-md-6 mb-4">
//             <h5 className="footer-title">Opening Hours</h5>
//             <p className="footer-text">
//               Monday - Saturday: <br />
//               11.00 AM to 6.00 PM <br />
//               Sunday: Closed
//             </p>
//           </div>

//           {/* ✅ SOCIAL ICONS */}
//           <div className="col-lg-2 col-md-12 mb-4">
//             <h5 className="footer-title">Follow Us</h5>
//             <div className="social-icons">
//               <a href="#"><FaFacebookF /></a>
//               <a href="#"><FaTwitter /></a>
//               <a href="#"><FaInstagram /></a>
//               <a href="#"><FaYoutube /></a>
//             </div>
//           </div>

//         </div>

//         {/* ✅ BOTTOM COPYRIGHT */}
//         <div className="footer-bottom text-center mt-4 pt-3">
//           <p>
//             Copyright © 2024 Manisha Matrimonial. All Rights Reserved |
//             Design By Stormsofts Technology
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default MainFooter;


import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock
} from "react-icons/fa";
import "./MainFooter.css";

const MainFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      {/* Top Section */}
      <div className="footer-top">
        <div className="container">
          <div className="row">
            {/* Brand Column */}
            <div className="col-lg-4 col-md-6 mb-5">
              <div className="footer-brand">
                <h2 className="footer-logo">Maratha Vadhu Var Suchak</h2>
                <p className="footer-tagline">
                  Your trusted partner in finding lifelong happiness
                </p>
                <p className="footer-description">
                  We specialize in creating meaningful connections within the Maratha community. 
                  With years of experience and a commitment to excellence, we help you find your 
                  perfect match with dignity and respect.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-5">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/story">Success Stories</a></li>
                <li><a href="/testimonial">Testimonials</a></li>
                <li><a href="/maingallery">Gallery</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6 mb-5">
              <h3 className="footer-heading">Contact Info</h3>
              <ul className="footer-contact">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <div>
                    <strong>Address</strong>
                    <p>Chankya Puri, Vishrambag, Sangli, Maharashtra</p>
                  </div>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <div>
                    <strong>Phone</strong>
                    <p>+91 99229 45177</p>
                  </div>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <div>
                    <strong>Email</strong>
                    <p>manishakulkarani@gmail.com</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Opening Hours & Social */}
            <div className="col-lg-3 col-md-6 mb-5">
              <div className="footer-hours">
                <h3 className="footer-heading">
                  <FaClock className="me-2" />
                  Opening Hours
                </h3>
                <ul className="hours-list">
                  <li>
                    <span>Monday - Friday</span>
                    <span>10:00 AM - 7:00 PM</span>
                  </li>
                  <li>
                    <span>Saturday</span>
                    <span>10:00 AM - 5:00 PM</span>
                  </li>
                  <li>
                    <span>Sunday</span>
                    <span className="closed">Closed</span>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div className="footer-social mt-4">
                <h3 className="footer-heading">Follow Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon facebook">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="social-icon twitter">
                    <FaTwitter />
                  </a>
                  <a href="#" className="social-icon instagram">
                    <FaInstagram />
                  </a>
                  <a href="#" className="social-icon youtube">
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Maratha Vadhu Var Suchak. All Rights Reserved.
            </p>
            <p className="developer">
              Designed & Developed by <span>Stormsofts Technology</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;