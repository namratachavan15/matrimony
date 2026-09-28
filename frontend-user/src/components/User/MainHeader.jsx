// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./MainHeader.css";

// const MainHeader = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeSection, setActiveSection] = useState("home");

//   const collapseRef = useRef(null); // reference to collapse menu

//   const handleNavClick = (path, sectionId) => {
//     navigate(path);

//     // scroll to section if exists
//     setTimeout(() => {
//       const el = document.getElementById(sectionId);
//       if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//       setActiveSection(sectionId);
//     }, 300);

//     // collapse the navbar on mobile after click
//     if (collapseRef.current) {
//       const bsCollapse = new window.bootstrap.Collapse(collapseRef.current, {
//         toggle: false,
//       });
//       bsCollapse.hide();
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const sections = document.querySelectorAll(".page-section");
//       let current = activeSection;
//       let closestDistance = Number.MAX_VALUE;

//       sections.forEach((section) => {
//         const rect = section.getBoundingClientRect();
//         const distance = Math.abs(rect.top - 80); // header height
//         if (distance < closestDistance) {
//           closestDistance = distance;
//           current = section.id;
//         }
//       });

//       setActiveSection(current);
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav className="navbar navbar-expand-lg shadow-sm sticky-top custom-navbar">
//       <div className="container">
//         {/* Logo */}
//         <Link className="navbar-brand fw-bold" to="/">
//           Maratha-Vadhu-Var Suchak
//         </Link>

//         {/* Toggler */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#mainNavbar"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Menu */}
//         <div
//           className="collapse navbar-collapse"
//           id="mainNavbar"
//           ref={collapseRef}
//         >
//           <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
//             {[
//               { name: "Home", path: "/", id: "home" },
//               { name: "About", path: "/about", id: "about" },
//               { name: "Story", path: "/story", id: "story" },
//               { name: "Testimonial", path: "/testimonial", id: "testimonial" },
//               { name: "Gallery", path: "/maingallery", id: "gallery" },
//               { name: "Contact", path: "/contact", id: "contact" },
//             ].map((item) => (
//               <li className="nav-item" key={item.id}>
//                 <button
//                   className={`nav-link btn ${
//                     activeSection === item.id ? "active-link" : ""
//                   }`}
//                   onClick={() => handleNavClick(item.path, item.id)}
//                 >
//                   {item.name}
//                 </button>
//               </li>
//             ))}
//           </ul>

//           <Link to="/login" className="btn btn-danger px-4">
//             Login
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default MainHeader;


// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./MainHeader.css";

// const MainHeader = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeSection, setActiveSection] = useState("home");

//   const collapseRef = useRef(null); // reference to collapse menu

//   const handleNavClick = (path, sectionId) => {
//     navigate(path);
  
//     setTimeout(() => {
//       const el = document.getElementById(sectionId);
//       if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//       setActiveSection(sectionId);
//     }, 300);
  
//     // ✅ FORCE CLOSE NAVBAR BY CLICKING TOGGLER (SAFE METHOD)
//     if (window.innerWidth < 992) {
//       const toggler = document.querySelector(".navbar-toggler");
//       if (toggler) {
//         toggler.click(); // ✅ THIS WORKS 100% LIKE YOUR Header.jsx STATE
//       }
//     }
//   };
  
  
//     useEffect(() => {
//     const handleScroll = () => {
//       const sections = document.querySelectorAll(".page-section");
//       let current = activeSection;
//       let closestDistance = Number.MAX_VALUE;

//       sections.forEach((section) => {
//         const rect = section.getBoundingClientRect();
//         const distance = Math.abs(rect.top - 80); // header height
//         if (distance < closestDistance) {
//           closestDistance = distance;
//           current = section.id;
//         }
//       });

//       setActiveSection(current);
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
  

//   return (
//     <nav className="navbar navbar-expand-lg shadow-sm sticky-top custom-navbar">
//       <div className="container">
//         {/* Logo */}
//         <Link className="navbar-brand fw-bold" to="/">
//           Maratha-Vadhu-Var Suchak
//         </Link>

//         {/* Toggler */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#mainNavbar"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Menu */}
//         <div
//           className="collapse navbar-collapse"
//           id="mainNavbar"
//           ref={collapseRef}
//         >
//           <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
//             {[
//               { name: "Home", path: "/", id: "home" },
//               { name: "About", path: "/about", id: "about" },
//               { name: "Story", path: "/story", id: "story" },
//               { name: "Testimonial", path: "/testimonial", id: "testimonial" },
//               { name: "Gallery", path: "/maingallery", id: "gallery" },
//               { name: "Contact", path: "/contact", id: "contact" },
//             ].map((item) => (
//               <li className="nav-item" key={item.id}>
//                 <button
//                   className={`nav-link btn ${
//                     activeSection === item.id ? "active-link" : ""
//                   }`}
//                   onClick={() => handleNavClick(item.path, item.id)}
//                 >
//                   {item.name}
//                 </button>
//               </li>
//             ))}
//           </ul>

//           <button
//   className="btn px-4"
//   onClick={() => handleNavClick("/login", "home")}
//   style={{color:'white'}}
// >
//   Login
// </button>

//         </div>
//       </div>
//     </nav>
//   );
// };

// export default MainHeader;



import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainHeader.css";

const MainHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".page-section");
      let current = sections[0]?.id || "home"; // fallback
  
      const headerOffset = 90; // height of navbar
  
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // If top of section is within headerOffset, mark it active
        if (rect.top <= headerOffset && rect.bottom > headerOffset) {
          current = section.id;
        }
      });
  
      setActiveSection(current);
    };
  
    window.addEventListener("scroll", handleScroll);
    handleScroll();
  
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  
  
  

  const handleNavClick = (path, sectionId) => {
    navigate(path);
    setMobileMenuOpen(false);
    
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }, 100);
  };

  const menuItems = [
    { name: "Home", path: "/", id: "home" },
    { name: "About", path: "/about", id: "about" },
    { name: "Story", path: "/story", id: "story" },
    { name: "Testimonials", path: "/testimonial", id: "testimonial" },
    { name: "Gallery", path: "/maingallery", id: "gallery" },
    { name: "Contact", path: "/contact", id: "contact" },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          {/* Logo with gradient */}
          <Link className="navbar-brand" to="/">
            <div className="logo-container">
              <span className="logo-main">Maratha</span>
              <span className="logo-sub">Vadhu Var Suchak</span>
            </div>
          </Link>

          {/* Toggler button -- same explicit-span hamburger pattern as
              the logged-in Header.jsx, so visibility never depends on
              Bootstrap's own .navbar-toggler-icon background-image. */}
          <button
            className="mh-toggler-btn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            <span className={mobileMenuOpen ? "open" : ""}></span>
            <span className={mobileMenuOpen ? "open" : ""}></span>
            <span className={mobileMenuOpen ? "open" : ""}></span>
          </button>

          {/* Menu */}
          <div className={`navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>

            {/* Mobile close button inside the drawer */}
            <button
              className="mh-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>

            <ul className="navbar-nav mx-auto">
              {menuItems.map((item) => (
                <li className="nav-item" key={item.id}>
                  <button
                    className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path, item.id)}
                  >
                    {item.name}
                    {activeSection === item.id && (
                      <span className="active-indicator"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Login button */}
            <div className="header-actions">
              <button
                className="btn-login"
                onClick={() => handleNavClick("/login", "home")}
              >
                <span className="login-icon">👤</span>
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainHeader;