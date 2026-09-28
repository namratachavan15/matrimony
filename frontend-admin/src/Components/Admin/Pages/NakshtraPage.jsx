// src/Components/Nakshtra/NakshtraPage.jsx
import React, { useState } from "react";
import NakshtraList from "./NakshtraList";
import AddNakshtra from "./AddNakshtra";

const NakshtraPage = () => {
  const [editingNakshtra, setEditingNakshtra] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 ">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-stars me-2 text-primary"></i>
                Nakshtra Management
              </h2>
              <p className="text-muted mb-0">
                {editingNakshtra ? 'Update nakshtra information' : 'Manage all nakshtras in the system'}
              </p>
            </div>
            
            {view === "list" && !editingNakshtra && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Nakshtra
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingNakshtra) && (
              <div className="col-lg-4 mb-4">
                <AddNakshtra
                  editingNakshtra={editingNakshtra}
                  clearEditing={() => {
                    setEditingNakshtra(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingNakshtra ? "col-lg-8" : "col-12"}>
              <NakshtraList 
                onEdit={(nakshtraObj) => {
                  setEditingNakshtra(nakshtraObj);
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

export default NakshtraPage;