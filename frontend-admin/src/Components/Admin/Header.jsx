// Header.jsx
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useUserContext } from "./State/UserContext";
import { FaBars, FaChevronDown, FaSignOutAlt, FaUser, FaCog, FaBell } from "react-icons/fa";

export default function Header({ toggleSidebar }) {
  const { currentUser, logout } = useUserContext();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const displayName = currentUser?.uname || currentUser?.name || currentUser?.umobile || "User";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="mm-header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={toggleSidebar}>
          <FaBars className="menu-icon" />
        </button>
        
        <div className="header-title">
          <h2>Maratha Matrimony Dashboard</h2>
          <div className="title-underline"></div>
        </div>
      </div>

      <div className="header-right">
        {/* Notification Bell */}
      

        {currentUser ? (
          <div className="user-menu-wrapper" ref={dropdownRef}>
            <button 
              className={`user-trigger ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="user-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{displayName}</span>
                <span className="user-role">Member</span>
              </div>
              <FaChevronDown className="user-caret" />
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="dropdown-user-info">
                    <div className="dropdown-name">{displayName}</div>
                    <div className="dropdown-email">{currentUser.email || "member@maratha.com"}</div>
                  </div>
                </div>
                
             
                
              
                
            
                
                <div className="dropdown-divider"></div>
                
                <button
                  type="button"
                  className="dropdown-item-btn logout-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="dropdown-item-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate('/login')}>
            <FaSignOutAlt className="btn-icon" />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
}