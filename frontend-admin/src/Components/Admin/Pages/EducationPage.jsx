import React, { useState } from "react";
import AddEducation from "./AddEducation";
import EducationList from "./EducationList";

const EducationPage = () => {
  const [editingEducation, setEditingEducation] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-mortarboard me-2 text-primary"></i>
                Education Management
              </h2>
              <p className="text-muted mb-0">
                {editingEducation ? 'Update education information' : 'Manage all education qualifications in the system'}
              </p>
            </div>
            
            {view === "list" && !editingEducation && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Education
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingEducation) && (
              <div className="col-lg-4 mb-4">
                <AddEducation
                  editingEducation={editingEducation}
                  clearEditing={() => {
                    setEditingEducation(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingEducation ? "col-lg-8" : "col-12"}>
              <EducationList 
                onEdit={(educationObj) => {
                  setEditingEducation(educationObj);
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

export default EducationPage;