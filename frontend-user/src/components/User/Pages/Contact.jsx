// // src/Pages/Contact.jsx
// import React, { useState } from "react";
// import {
//   FaMapMarkerAlt,
//   FaEnvelope,
//   FaPhoneAlt,
//   FaWhatsapp,
//   FaClock,
// } from "react-icons/fa";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     subject: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data:", formData);
//     alert("Message Sent Successfully!");
//     setFormData({
//       name: "",
//       email: "",
//       mobile: "",
//       subject: "",
//       message: "",
//     });
//   };

//   return (
//     <div className="container py-3">
//       {/* ✅ CONTACT INFO CARDS */}
//       <div className="row g-4 mb-5 text-center">
//         <div className="col-md-3">
//           <div className="card shadow border-0 h-100">
//             <div className="card-body">
//               <FaMapMarkerAlt size={30} className="mb-3 text-danger" />
//               <h5>Our Address</h5>
//               <p> Chankya Puri,
// Vishrambag,
// Sangli</p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card shadow border-0 h-100">
//             <div className="card-body">
//               <FaEnvelope size={30} className="mb-3 text-primary" />
//               <h5>Email Us</h5>
//               <p>manishakulkarani@gmail.com</p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card shadow border-0 h-100">
//             <div className="card-body">
//               <FaPhoneAlt size={30} className="mb-3 text-success" />
//               <h5>Call Us</h5>
//               <p>+91 99229 45177</p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card shadow border-0 h-100">
//             <div className="card-body">
//               <FaWhatsapp size={30} className="mb-3 text-success" />
//               <h5>WhatsApp</h5>
//               <p>+91 98765 43210</p>
//             </div>
//           </div>
//         </div>

//         <div className="col-md-12 mt-4">
//           <div className="card shadow border-0">
//             <div className="card-body text-center">
//               <FaClock size={30} className="mb-3 text-warning" />
//               <h5>Opening Hours</h5>
//               <p>Monday – Saturday : 10:00 AM – 7:00 PM</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ CONTACT FORM */}
//       <div className="row justify-content-center">
//         <div className="col-md-8">
//           <div className="card shadow border-0">
//             <div className="card-body p-4">
//               <h3 className="text-center mb-4">Contact Us</h3>

//               <form onSubmit={handleSubmit}>
//                 <div className="row mb-3">
//                   <div className="col-md-6">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Your Name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input
//                       type="email"
//                       className="form-control"
//                       placeholder="Your Email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="row mb-3">
//                   <div className="col-md-6">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Your Mobile"
//                       name="mobile"
//                       value={formData.mobile}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Subject"
//                       name="subject"
//                       value={formData.subject}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <textarea
//                     className="form-control"
//                     rows="5"
//                     placeholder="Message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="text-center">
//                   <button type="submit" className="btn btn-primary px-5">
//                     Send Message
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;

import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaClock,
  FaPaperPlane,
  FaUser,
  FaMobileAlt,
  FaCommentAlt
} from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form Data:", formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          message: "",
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Visit Our Office",
      details: ["Chankya Puri", "Vishrambag, Sangli", "Maharashtra - 416416"],
      color: "#6b1220",
      action: "Get Directions",
      link: "https://maps.google.com"
    },
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      details: ["manishakulkarani@gmail.com", "info@marathamatrimony.com"],
      color: "#0066cc",
      action: "Send Email",
      link: "mailto:manishakulkarani@gmail.com"
    },
    {
      icon: <FaPhoneAlt />,
      title: "Call Us",
      details: ["+91 99229 45177", "+91 98765 43210"],
      color: "#00a859",
      action: "Call Now",
      link: "tel:+919922945177"
    },
    {
      icon: <FaWhatsapp />,
      title: "WhatsApp",
      details: ["+91 99229 45177", "Instant Response"],
      color: "#25D366",
      action: "Message on WhatsApp",
      link: "https://wa.me/919922945177"
    },
    {
      icon: <FaClock />,
      title: "Working Hours",
      details: [
        "Monday - Saturday: 10:00 AM - 7:00 PM",
        "Sunday: Appointment Only"
      ],
      color: "#FF9800",
      action: "Book Appointment",
      link: "#appointment"
    }
  ];

  return (
    <section className="contact-section" id="contact">
      {/* Background Decoration */}
      <div className="contact-bg-pattern"></div>
      
      <div className="container">
        {/* Page Header */}
        <div className="contact-header">
          <h6 className="section-subtitle">Get In Touch</h6>
          <h1 className="section-title">
            Contact <span className="highlight">Us</span>
          </h1>
          <div className="divider"></div>
          <p className="section-description">
            Have questions or ready to begin your journey? Reach out to us. 
            We're here to help you find your perfect match with care and professionalism.
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="success-message">
            <div className="success-content">
              <FaPaperPlane className="success-icon" />
              <div>
                <h4>Message Sent Successfully!</h4>
                <p>We'll get back to you within 24 hours.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="contact-content">
          {/* Contact Information Cards */}
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div className="contact-info-card" key={index}>
                <div className="card-icon" style={{ background: `${info.color}20`, color: info.color }}>
                  {info.icon}
                </div>
                <div className="card-content">
                  <h4>{info.title}</h4>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="detail-text">{detail}</p>
                  ))}
                  {/* <a 
                    href={info.link} 
                    className="action-btn"
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: info.color }}
                  >
                    {info.action} →
                  </a> */}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form Section */}
          <div className="contact-form-wrapper">
            <div className="form-header">
              <h3>
                <FaCommentAlt className="form-icon" />
                Send Us a Message
              </h3>
              <p>Fill out the form below and we'll respond promptly</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid">
                {/* Name Field */}
                <div className="form-group">
                  <label>
                    <FaUser className="input-icon" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label>
                    <FaEnvelope className="input-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Mobile Field */}
                <div className="form-group">
                  <label>
                    <FaMobileAlt className="input-icon" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter your mobile number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Subject Field */}
                <div className="form-group">
                  <label>
                    <FaCommentAlt className="input-icon" />
                    Subject
                  </label>
                  <select
                    className="form-input"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Profile Registration">Profile Registration</option>
                    <option value="Matchmaking Service">Matchmaking Service</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Appointment">Book Appointment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message Field */}
              <div className="form-group full-width">
                <label>Your Message</label>
                <textarea
                  className="form-textarea"
                  rows="6"
                  placeholder="Tell us how we can help you..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="form-submit">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="send-icon" />
                      Send Message
                    </>
                  )}
                </button>
                <p className="form-note">
                  We respect your privacy and will never share your information.
                </p>
              </div>
            </form>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h3 className="map-title">Find Us Here</h3>
            <div className="map-container">
              {/* Replace with actual Google Maps embed */}
              <div className="map-placeholder">
                <div className="map-content">
                  <FaMapMarkerAlt className="map-pin" />
                  <h4>Our Location</h4>
                  <p>Chankya Puri, Vishrambag, Sangli, Maharashtra</p>
                  <a 
                    href="https://maps.google.com/?q=Chankya+Puri,Vishrambag,Sangli" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-map-btn"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Info */}
          <div className="response-info">
            <div className="response-card">
              <div className="response-icon">⚡</div>
              <div>
                <h4>Quick Response Time</h4>
                <p>We typically respond within 2-4 hours during business hours</p>
              </div>
            </div>
            <div className="response-card">
              <div className="response-icon">🤝</div>
              <div>
                <h4>Personalized Assistance</h4>
                <p>Every inquiry receives individual attention from our team</p>
              </div>
            </div>
            <div className="response-card">
              <div className="response-icon">🔒</div>
              <div>
                <h4>Confidential & Secure</h4>
                <p>Your information is protected with highest security standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
