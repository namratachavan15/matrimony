// Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  // Main icons
  FaHome,
  FaUserPlus,
  FaUsers,
  FaBook,
  FaCog,
  FaStar,
  
  // Dropdown arrows
  FaChevronDown,
  FaChevronUp,
  
  // Master Data icons
  FaListAlt,
  FaCircle,
  FaHatCowboy,
  FaStarAndCrescent,
  FaWater,
  FaMountain,
  FaGraduationCap,
  FaRulerVertical,
  FaHeart,
  FaGlobe,
  
  // User Master icons
  FaUserCheck,
  FaUserSlash,
  FaCalendarTimes,
  FaEye,
  FaSyncAlt,
  FaUserClock,
  
  // Story/Testimonial icons
  FaBookOpen,
  FaTrophy,
  FaCommentDots,
  FaInfoCircle,
  
  // Other icons
  FaChartLine,
  FaDollarSign,
  FaShieldAlt,
  FaFlag
} from "react-icons/fa";

import "./Sidebar.css";

export default function Sidebar({ isCollapsed, isMobileOpen, closeMobile }) {
  const [openMaster, setOpenMaster] = useState(false);
  const location = useLocation();
  const [openUserMaster, setOpenUserMaster] = useState(false);
  const [openStory, setOpenStory] = useState(false);

  const isActiveLink = (path) => location.pathname === path;

  return (
    <aside
      className={`mm-sidebar 
        ${isCollapsed ? "collapsed" : ""} 
        ${isMobileOpen ? "show" : ""}`}
    >
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-image">
          <img
            src="https://i.pinimg.com/736x/b9/5e/40/b95e402a4fff281cb5df2376bbd19899.jpg"
            alt="Maratha Matrimony"
          />
          <div className="logo-glow"></div>
        </div>
        {!isCollapsed && (
          <div className="logo-text">
            <h3>Maratha Matrimony</h3>
            <p>Find Your Perfect Match</p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {!isCollapsed && <div className="nav-section-title">MAIN NAVIGATION</div>}
        
        <ul className="sidebar-menu">
          {/* Dashboard */}
          <li>
            <Link 
              to="/" 
              className={`sidebar-link ${isActiveLink('/') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Dashboard"
            >
              <div className="link-content">
                <FaHome className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Dashboard</span>}
              </div>
              {isActiveLink('/') && <div className="active-indicator"></div>}
            </Link>
          </li>

          {/* Add Users */}
          <li>
            <Link 
              to="/add-users" 
              className={`sidebar-link ${isActiveLink('/add-users') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Add Users"
            >
              <div className="link-content">
                <FaUserPlus className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Add Users</span>}
              </div>
              {isActiveLink('/add-users') && <div className="active-indicator"></div>}
            </Link>
          </li>

          {/* Add Family */}
          <li>
            <Link 
              to="/add-family" 
              className={`sidebar-link ${isActiveLink('/add-family') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Add Family"
            >
              <div className="link-content">
                <FaUsers className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Add Family</span>}
              </div>
              {isActiveLink('/add-family') && <div className="active-indicator"></div>}
            </Link>
          </li>

          {/* Add Other Info */}
          <li>
            <Link 
              to="/add-other-info" 
              className={`sidebar-link ${isActiveLink('/add-other-info') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Add Other Info"
            >
              <div className="link-content">
                <FaBook className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Add Other Info</span>}
              </div>
              {isActiveLink('/add-other-info') && <div className="active-indicator"></div>}
            </Link>
          </li>
          <li>
            <Link 
              to="/short-registration" 
              className={`sidebar-link ${isActiveLink('/short-registration') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Short Registraion"
            >
              <div className="link-content">
                <FaBook className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Short Registartion</span>}
              </div>
              {isActiveLink('/short-registration') && <div className="active-indicator"></div>}
            </Link>
          </li>

          <li>
            <Link 
              to="/biodata-user" 
              className={`sidebar-link ${isActiveLink('/biodata-user') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Biodata users"
            >
              <div className="link-content">
                <FaBook className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">BioData Users</span>}
              </div>
              {isActiveLink('/biodata-user') && <div className="active-indicator"></div>}
            </Link>
          </li>
          {/* Master Data Dropdown */}
          <li className="sidebar-dropdown">
          <button
  className={`sidebar-link dropdown-toggle ${openMaster ? 'active' : ''}`}
  onClick={() => setOpenMaster(!openMaster)}
  data-tooltip="Master Data"
>
  <div className="link-content">
    <FaListAlt className="sidebar-icon" />
    {!isCollapsed && <span className="link-text">Master Data</span>}
  </div>
</button>

            {(!isCollapsed || isMobileOpen) && openMaster && (
              <ul className="sidebar-submenu">
                <li>
                  <Link 
                    to="/add-cast" 
                    className={`submenu-link ${isActiveLink('/add-cast') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaHatCowboy className="submenu-icon" />
                    <span>Add Cast</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-subcast" 
                    className={`submenu-link ${isActiveLink('/add-subcast') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaHatCowboy className="submenu-icon" />
                    <span>Add Subcast</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-gotra" 
                    className={`submenu-link ${isActiveLink('/add-gotra') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaStarAndCrescent className="submenu-icon" />
                    <span>Add Gotra</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-nadi" 
                    className={`submenu-link ${isActiveLink('/add-nadi') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaWater className="submenu-icon" />
                    <span>Add Nadi</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-nakshtra" 
                    className={`submenu-link ${isActiveLink('/add-nakshtra') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaStar className="submenu-icon" />
                    <span>Add Nakshtra</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-rashi" 
                    className={`submenu-link ${isActiveLink('/add-rashi') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaStarAndCrescent className="submenu-icon" />
                    <span>Add Rashi</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-gan" 
                    className={`submenu-link ${isActiveLink('/add-gan') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaMountain className="submenu-icon" />
                    <span>Add Gan</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-education" 
                    className={`submenu-link ${isActiveLink('/add-education') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaGraduationCap className="submenu-icon" />
                    <span>Add Education</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-height" 
                    className={`submenu-link ${isActiveLink('/add-height') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaRulerVertical className="submenu-icon" />
                    <span>Add Height</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-marriage" 
                    className={`submenu-link ${isActiveLink('/add-marriage') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaHeart className="submenu-icon" />
                    <span>Add Marriage Type</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-country" 
                    className={`submenu-link ${isActiveLink('/add-country') ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <FaGlobe className="submenu-icon" />
                    <span>Add Country</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Extend View Count */}
          <li>
            <Link 
              to="/extend-viewcount" 
              className={`sidebar-link ${isActiveLink('/extend-viewcount') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Extend View Count"
            >
              <div className="link-content">
                <FaChartLine className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Extend View Count</span>}
              </div>
              {isActiveLink('/extend-viewcount') && <div className="active-indicator"></div>}
            </Link>
          </li>
            {/* Membership Plans */}
          <li>
            <Link 
              to="/membership-plans" 
              className={`sidebar-link ${isActiveLink('/membership-plans') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Membership Plans"
            >
              <div className="link-content">
                <FaChartLine className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Membership Plans</span>}
              </div>
              {isActiveLink('/membership-plans') && <div className="active-indicator"></div>}
            </Link>
          </li>
          {/* User Master Dropdown */}
          <li className="sidebar-dropdown">
          <button
  className={`sidebar-link dropdown-toggle ${openUserMaster ? "active" : ""}`}
  onClick={() => setOpenUserMaster(!openUserMaster)}
  data-tooltip="User Master"
>
  <div className="link-content">
    <FaCog className="sidebar-icon" />
    {!isCollapsed && <span className="link-text">User Master</span>}
  </div>
</button>

            {(!isCollapsed || isMobileOpen) && openUserMaster && (
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    to="/active-users"
                    className={`submenu-link ${isActiveLink("/active-users") ? "active" : ""}`}
                    onClick={closeMobile}
                  >
                    <FaUserCheck className="submenu-icon" />
                    <span>Active Users</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/deactive-users"
                    className={`submenu-link ${isActiveLink("/deactive-users") ? "active" : ""}`}
                    onClick={closeMobile}
                  >
                    <FaUserSlash className="submenu-icon" />
                    <span>Deactive Users</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/expire-plan-users"
                    className={`submenu-link ${isActiveLink("/expire-plan-users") ? "active" : ""}`}
                    onClick={closeMobile}
                  >
                    <FaCalendarTimes className="submenu-icon" />
                    <span>Expire Plan Users</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/profile-views"
                    className={`submenu-link ${isActiveLink("/profile-views") ? "active" : ""}`}
                    onClick={closeMobile}
                  >
                    <FaEye className="submenu-icon" />
                    <span>Profile Views</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/renew-plan-users"
                    className={`submenu-link ${isActiveLink("/renew-plan-users") ? "active" : ""}`}
                    onClick={closeMobile}
                  >
                    <FaSyncAlt className="submenu-icon" />
                    <span>Renew Plan Users</span>
                  </Link>
                </li>

                
              </ul>
            )}
          </li>

          {/* Star Rate */}
          <li>
            <Link 
              to="/star-rate" 
              className={`sidebar-link ${isActiveLink('/star-rate') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Star Rate"
            >
              <div className="link-content">
                <FaDollarSign className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Star Rate</span>}
              </div>
              {isActiveLink('/star-rate') && <div className="active-indicator"></div>}
            </Link>
          </li>

          {/* Profile Verification */}
          <li>
            <Link
              to="/verification"
              className={`sidebar-link ${isActiveLink('/verification') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Verification"
            >
              <div className="link-content">
                <FaShieldAlt className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Verification</span>}
              </div>
              {isActiveLink('/verification') && <div className="active-indicator"></div>}
            </Link>
          </li>

          {/* Reported Profiles */}
          <li>
            <Link
              to="/reports"
              className={`sidebar-link ${isActiveLink('/reports') ? 'active' : ''}`}
              onClick={closeMobile}
              data-tooltip="Reports"
            >
              <div className="link-content">
                <FaFlag className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Reported Profiles</span>}
              </div>
              {isActiveLink('/reports') && <div className="active-indicator"></div>}
            </Link>
          </li>

          {/* Story / Testimonial Dropdown */}
          <li className="sidebar-dropdown">
            <button
              className={`sidebar-link dropdown-toggle ${openStory ? "active" : ""}`}
              onClick={() => setOpenStory(!openStory)}
              data-tooltip="Story / Testimonial"
            >
              <div className="link-content">
                <FaBookOpen className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Story / Testimonial</span>}
              </div>

          
            </button>

            {(!isCollapsed || isMobileOpen) && openStory && (
              <ul className="sidebar-submenu">
                {/* Add Success Story */}
                <li>
                  <Link
                    to="/add-success-story"
                    className={`submenu-link ${isActiveLink("/add-success-story") ? "active" : ""}`}
                    onClick={closeMobile}
                  >
                    <FaTrophy className="submenu-icon" />
                    <span>Success Story</span>
                  </Link>
                </li>

                {/* Add Testimonial */}
                <li>
                  <Link
                    to="/add-testimonial"
                    className={`submenu-link ${isActiveLink("/add-testimonial") ? "active" : ""}`}
                    onClick={closeMobile}
                  >
                    <FaCommentDots className="submenu-icon" />
                    <span>Testimonial</span>
                  </Link>
                </li>

                {/* Add About */}
                <li>
                  <Link
                    to="/add-about"
                    className={`submenu-link ${isActiveLink("/add-about") ? "active" : ""}`}
                    onClick={closeMobile}
                  >
                    <FaInfoCircle className="submenu-icon" />
                    <span>About</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}