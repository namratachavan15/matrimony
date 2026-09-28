import React, { useState } from "react";
import AddHeight from "./AddHeight";
import HeightList from "./HeightList";

const HeightPage = () => {
  const [editingHeight, setEditingHeight] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-rulers me-2 text-primary"></i>
                Height Management
              </h2>
              <p className="text-muted mb-0">
                {editingHeight ? 'Update height information' : 'Manage all height values in the system'}
              </p>
            </div>
            
            {view === "list" && !editingHeight && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Height
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingHeight) && (
              <div className="col-lg-4 mb-4">
                <AddHeight
                  editingHeight={editingHeight}
                  clearEditing={() => {
                    setEditingHeight(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingHeight ? "col-lg-8" : "col-12"}>
              <HeightList 
                onEdit={(heightObj) => {
                  setEditingHeight(heightObj);
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

export default HeightPage;