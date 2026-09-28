// src/Components/Admin/FamilyPage.jsx
import React, { useState } from "react";
import AddFamily from "./AddFamily";
import DisplayFamily from "./DisplayFamily";

const FamilyPage = () => {
  const [editingFamily, setEditingFamily] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-house-heart me-2 text-primary"></i>
                Family Management
              </h2>
              <p className="text-muted mb-0">
                {editingFamily ? 'Update family information' : 'Manage all family records in the system'}
              </p>
            </div>
            
            {view === "list" && !editingFamily && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Family
              </button>
            )}
          </div>

          {/* Content */}
          {view === "form" || editingFamily ? (
            <div className="row">
              <div className="col-12">
                <AddFamily 
                  editingFamily={editingFamily} 
                  setEditingFamily={(family) => {
                    setEditingFamily(family);
                    if (!family) setView("list");
                  }} 
                />
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <DisplayFamily 
                  onEdit={(family) => {
                    setEditingFamily(family);
                    setView("form");
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyPage;