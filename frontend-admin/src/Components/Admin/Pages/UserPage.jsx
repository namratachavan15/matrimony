// src/Component/Admin/UserPage.jsx - Matching Dark Blue Sidebar Theme
import React, { useState } from "react";
import AddUser from "./AddUser";
import DisplayUser from "./DisplayUser";

const UserPage = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  // Sidebar matching colors - Dark Blue/Navy Theme (from your image)
  const theme = {
    primary: '#5b1730',       // Dark navy blue (matches sidebar background)
    primaryDark: '#421021',    // Darker navy for hover
    primaryLight: '#7b2946',   // Lighter navy for accents
    secondary: '#c9a227',      // Soft blue accent
    bgLight: '#fbf8f3',        // Light gray-blue background
    border: '#eadfd4',         // Soft border color
    textDark: '#2f2426',       // Dark text
    textMuted: '#766a6d',      // Muted text
    sidebarBg: '#1e2a3a'       // Sidebar background color
  };

  return (
    <div className="container-fluid py-4 px-4 user-management-premium" style={{ background: theme.bgLight, minHeight: '100vh' }}>
      <div className="row">
        <div className="col-12">
          {/* Header with blue theme matching sidebar */}
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom" style={{ borderBottomColor: theme.border }}>
            <div>
              <h2 className="h4 mb-1 fw-semibold" style={{ color: theme.textDark }}>
                <i className="bi bi-people-fill me-2" style={{ color: theme.primary }}></i>
                User Management
              </h2>
              <p className="mb-0" style={{ color: theme.textMuted, fontSize: '0.875rem' }}>
                {editingUser ? '✏️ Update user information' : '📋 Manage all users in the system'}
              </p>
            </div>
            
            {view === "list" && !editingUser && (
              <button
                className="btn px-4 py-2 fw-semibold shadow-sm"
                style={{
                  background: theme.primary,
                  border: 'none',
                  color: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.primaryDark}
                onMouseLeave={(e) => e.currentTarget.style.background = theme.primary}
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New User
              </button>
            )}
          </div>

          {/* Content Card */}
          <div 
            className="rounded-3 shadow-sm overflow-hidden"
            style={{
              background: 'white',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div className="p-3 p-md-4">
              {view === "form" || editingUser ? (
                <AddUser 
                  editingUser={editingUser} 
                  setEditingUser={(user) => {
                    setEditingUser(user);
                    if (!user) setView("list");
                  }} 
                  theme={theme}
                />
              ) : (
                <DisplayUser 
                  onEdit={(user) => {
                    setEditingUser(user);
                    setView("form");
                  }} 
                  theme={theme}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;