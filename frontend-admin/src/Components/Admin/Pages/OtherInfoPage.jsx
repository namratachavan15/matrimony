// src/Components/Admin/OtherInfoPage.jsx
import React, { useState } from "react";
import AddOtherInfo from "./AddOtherInfo";
import DisplayOtherInfo from "./DisplayOtherInfo";

const OtherInfoPage = () => {
  const [editingOtherInfo, setEditingOtherInfo] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-stars me-2 text-primary"></i>
                Astrological Information
              </h2>
              <p className="text-muted mb-0">
                {editingOtherInfo ? 'Update astrological information' : 'Manage all astrological records in the system'}
              </p>
            </div>
            
            {view === "list" && !editingOtherInfo && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Information
              </button>
            )}
          </div>

          {/* Content */}
          {view === "form" || editingOtherInfo ? (
            <div className="row">
              <div className="col-12">
                <AddOtherInfo 
                  editingOtherInfo={editingOtherInfo} 
                  setEditingOtherInfo={(info) => {
                    setEditingOtherInfo(info);
                    if (!info) setView("list");
                  }} 
                />
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <DisplayOtherInfo 
                  onEdit={(info) => {
                    setEditingOtherInfo(info);
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

export default OtherInfoPage;