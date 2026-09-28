// src/Components/Admin/CastPage.jsx
import React, { useState } from "react";
import AddCast from "./AddCast";
import CastList from "./CastList";

const CastPage = () => {
  const [editingCast, setEditingCast] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-people me-2 text-primary"></i>
                Cast Management
              </h2>
              <p className="text-muted mb-0">
                {editingCast ? 'Update cast information' : 'Manage all casts in the system'}
              </p>
            </div>
            
            {view === "list" && !editingCast && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Cast
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingCast) && (
              <div className="col-lg-4 mb-4">
                <AddCast
                  editingCast={editingCast}
                  clearEditing={() => {
                    setEditingCast(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingCast ? "col-lg-8" : "col-12"}>
              <CastList 
                onEdit={(castObj) => {
                  setEditingCast(castObj);
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

export default CastPage;