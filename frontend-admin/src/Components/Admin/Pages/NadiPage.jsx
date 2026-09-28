// src/Components/Nadi/NadiPage.jsx
import React, { useState } from "react";
import AddNadi from "./AddNadi";
import NadiList from "./NadiList";

const NadiPage = () => {
  const [editingNadi, setEditingNadi] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-droplet me-2 text-primary"></i>
                Nadi Management
              </h2>
              <p className="text-muted mb-0">
                {editingNadi ? 'Update nadi information' : 'Manage all nadis in the system'}
              </p>
            </div>
            
            {view === "list" && !editingNadi && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Nadi
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingNadi) && (
              <div className="col-lg-4 mb-4">
                <AddNadi
                  editingNadi={editingNadi}
                  clearEditing={() => {
                    setEditingNadi(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingNadi ? "col-lg-8" : "col-12"}>
              <NadiList 
                onEdit={(nadiObj) => {
                  setEditingNadi(nadiObj);
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

export default NadiPage;