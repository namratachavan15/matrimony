// src/Components/Subcast/SubcastPage.jsx
import React, { useState } from "react";
import AddSubcast from "./AddSubcast";
import SubcastList from "./SubcastList";

const SubcastPage = () => {
  const [editingSubcast, setEditingSubcast] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-diagram-3 me-2 text-primary"></i>
                Subcast Management
              </h2>
              <p className="text-muted mb-0">
                {editingSubcast ? 'Update subcast information' : 'Manage all subcasts in the system'}
              </p>
            </div>
            
            {view === "list" && !editingSubcast && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Subcast
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingSubcast) && (
              <div className="col-lg-4 mb-4">
                <AddSubcast
                  editingSubcast={editingSubcast}
                  clearEditing={() => {
                    setEditingSubcast(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingSubcast ? "col-lg-8" : "col-12"}>
              <SubcastList 
                onEdit={(subcastObj) => {
                  setEditingSubcast(subcastObj);
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

export default SubcastPage;