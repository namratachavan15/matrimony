import React, { useState } from "react";
import AddMarriage from "./AddMarriage";
import MarriageList from "./MarriageList";

const MarriagePage = () => {
  const [editingMarriage, setEditingMarriage] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-hearts me-2 text-primary"></i>
                Marriage Types Management
              </h2>
              <p className="text-muted mb-0">
                {editingMarriage ? 'Update marriage type information' : 'Manage all marriage types in the system'}
              </p>
            </div>
            
            {view === "list" && !editingMarriage && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Marriage Type
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingMarriage) && (
              <div className="col-lg-4 mb-4">
                <AddMarriage
                  editingMarriage={editingMarriage}
                  clearEditing={() => {
                    setEditingMarriage(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingMarriage ? "col-lg-8" : "col-12"}>
              <MarriageList 
                onEdit={(marriageObj) => {
                  setEditingMarriage(marriageObj);
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

export default MarriagePage;