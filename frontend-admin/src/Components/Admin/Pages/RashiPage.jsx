// src/Components/Rashi/RashiPage.jsx
import React, { useState } from "react";
import AddRashi from "./AddRashi";
import RashiList from "./RashiList";

const RashiPage = () => {
  const [editingRashi, setEditingRashi] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-sun me-2 text-primary"></i>
                Rashi Management
              </h2>
              <p className="text-muted mb-0">
                {editingRashi ? 'Update rashi information' : 'Manage all rashis in the system'}
              </p>
            </div>
            
            {view === "list" && !editingRashi && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Rashi
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingRashi) && (
              <div className="col-lg-4 mb-4">
                <AddRashi
                  editingRashi={editingRashi}
                  clearEditing={() => {
                    setEditingRashi(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingRashi ? "col-lg-8" : "col-12"}>
              <RashiList 
                onEdit={(rashiObj) => {
                  setEditingRashi(rashiObj);
                  setView("form");
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RashiPage;