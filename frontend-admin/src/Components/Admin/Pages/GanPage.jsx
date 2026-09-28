// src/Components/Gan/GanPage.jsx
import React, { useState } from "react";
import AddGan from "./AddGan";
import GanList from "./GanList";

const GanPage = () => {
  const [editingGan, setEditingGan] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-diagram-2 me-2 text-primary"></i>
                Gan Management
              </h2>
              <p className="text-muted mb-0">
                {editingGan ? 'Update gan information' : 'Manage all gans in the system'}
              </p>
            </div>
            
            {view === "list" && !editingGan && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Gan
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingGan) && (
              <div className="col-lg-4 mb-4">
                <AddGan
                  editingGan={editingGan}
                  clearEditing={() => {
                    setEditingGan(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingGan ? "col-lg-8" : "col-12"}>
              <GanList 
                onEdit={(ganObj) => {
                  setEditingGan(ganObj);
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

export default GanPage;