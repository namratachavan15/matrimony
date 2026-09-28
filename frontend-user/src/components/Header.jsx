import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./User/State/UserContext";
import FilterModal from "./User/Pages/FilterModal";
import { useFilterContext } from "./User/State/FilterContext";
import NotificationBell from "./User/Components/Notifications/NotificationBell";
import MessageBell from "./User/Components/Messages/MessageBell";

import {
  FiHeart,
  FiGrid,
  FiImage,
  FiUser,
  FiSliders,
  FiLock,
  FiLogOut,
  FiChevronDown,
  FiX,
  FiEye,
  FiStar,
  FiShield,
  FiSlash,
  FiSearch,
  FiMessageCircle,
  FiPhoneCall,
} from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();

  const { currentUser, logout } = useUserContext();
  const { applyFilters } = useFilterContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsOpen(false);
    navigate("/login");
  };

  const handleChangePassword = () => {
    setIsUserMenuOpen(false);
    setIsOpen(false);
    navigate("/change-password");
  };

  const handleNavigation = (path) => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
    navigate(path);
  };

  const handleFilterApply = (filters) => {
    applyFilters(filters);
    setIsFilterOpen(false);
  };

  const displayName =
    currentUser?.uname ||
    currentUser?.name ||
    currentUser?.username ||
    "User";

  // Short name for compact button (first word only)
  const shortName = displayName.split(" ")[0];

  // Initials for avatar (e.g. "Rahul Patil" -> "RP")
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <>
      <header className="main-header">
        <div className="header-container">

          {/* Brand */}
          <div
            className="brand"
            onClick={() => handleNavigation("/")}
            role="button"
            tabIndex={0}
          >
            <div className="brand-logo">
              <FiHeart className="logo-icon" />
            </div>

            <div className="brand-text">
              <span className="brand-title">Maratha</span>
              <span className="brand-subtitle">Matrimony</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={`nav-menu ${isOpen ? "mobile-open" : ""}`}>

            {/* Mobile Close */}
            <button
              className="mobile-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <FiX />
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/")}
            >
              <FiGrid className="nav-icon" />
              <span>Dashboard</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/gallery")}
            >
              <FiImage className="nav-icon" />
              <span>Gallery</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/profile-preview")}
            >
              <FiEye className="nav-icon" />
              <span>Profile Preview</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/shortlisted-profiles")}
            >
              <FiStar className="nav-icon" />
              <span>Shortlisted</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/matches")}
            >
              <FiHeart className="nav-icon" />
              <span>My Matches</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/recommended-matches")}
            >
              <FiStar className="nav-icon" />
              <span>Recommended</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/messages")}
            >
              <FiMessageCircle className="nav-icon" />
              <span>Messages</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/profile-update")}
            >
              <FiUser className="nav-icon" />
              <span>Update Profile</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/partner-preferences")}
            >
              <FiHeart className="nav-icon" />
              <span>Partner Preferences</span>
            </button>

            <button
              className="filter-button"
              onClick={() => {
                setIsFilterOpen(true);
                setIsOpen(false);
              }}
            >
              <FiSliders className="filter-icon" />
              <span>Filters</span>
            </button>
          </nav>

          {/* Right Side */}
          <div className="header-right">

            {/* Messages */}
            <MessageBell />

            {/* Notifications */}
            <NotificationBell />

            {/* User Menu */}
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className={`user-button ${
                  isUserMenuOpen ? "user-button-active" : ""
                }`}
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                                <div className="user-avatar">
                  {initials || <FiUser />}
                </div>

                <div className="user-info">
                  <span className="user-name">{shortName}</span>
                 
                </div>

                <FiChevronDown
                  className={`user-caret ${
                    isUserMenuOpen ? "rotate-caret" : ""
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/contact-requests");
                    }}
                  >
                    <span className="dropdown-icon">
                      <FiPhoneCall />
                    </span>
                    <span className="dropdown-text">
                      Contact Requests
                    </span>
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/membership");
                    }}
                  >
                    <span className="dropdown-icon">
                      <FiStar />
                    </span>
                    <span className="dropdown-text">
                      Membership
                    </span>
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/privacy-settings");
                    }}
                  >
                    <span className="dropdown-icon">
                      <FiShield />
                    </span>
                    <span className="dropdown-text">
                      Privacy Settings
                    </span>
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/blocked-profiles");
                    }}
                  >
                    <span className="dropdown-icon">
                      <FiSlash />
                    </span>
                    <span className="dropdown-text">
                      Blocked Profiles
                    </span>
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/saved-searches");
                    }}
                  >
                    <span className="dropdown-icon">
                      <FiSearch />
                    </span>
                    <span className="dropdown-text">
                      Saved Searches
                    </span>
                  </button>

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item"
                    onClick={handleChangePassword}
                  >
                    <span className="dropdown-icon">
                      <FiLock />
                    </span>
                    <span className="dropdown-text">
                      Change Password
                    </span>
                  </button>

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon">
                      <FiLogOut />
                    </span>
                    <span className="dropdown-text">
                      Logout
                    </span>
                  </button>

                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Filter Modal */}
      {isFilterOpen && (
  <FilterModal
    isOpen={isFilterOpen}
    onClose={() => setIsFilterOpen(false)}
    onApply={handleFilterApply}
  />
)}
    </>
  );
};

export default Header;
