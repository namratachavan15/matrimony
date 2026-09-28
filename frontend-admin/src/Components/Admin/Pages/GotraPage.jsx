// src/Components/Gotra/GotraPage.jsx
import React, { useState } from "react";
import AddGotra from "./AddGotra";
import GotraList from "./GotraList";

const GotraPage = () => {
  const [editingGotra, setEditingGotra] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-tree me-2 text-primary"></i>
                Gotra Management
              </h2>
              <p className="text-muted mb-0">
                {editingGotra ? 'Update gotra information' : 'Manage all gotras in the system'}
              </p>
            </div>
            
            {view === "list" && !editingGotra && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Gotra
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingGotra) && (
              <div className="col-lg-4 mb-4">
                <AddGotra
                  editingGotra={editingGotra}
                  clearEditing={() => {
                    setEditingGotra(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingGotra ? "col-lg-8" : "col-12"}>
              <GotraList 
                onEdit={(gotraObj) => {
                  setEditingGotra(gotraObj);
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

export default GotraPage;