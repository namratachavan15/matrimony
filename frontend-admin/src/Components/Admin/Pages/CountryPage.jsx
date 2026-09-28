import React, { useState } from "react";
import AddCountry from "./AddCountry";
import CountryList from "./CountryList";

const CountryPage = () => {
  const [editingCountry, setEditingCountry] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-globe-americas me-2 text-primary"></i>
                Country Management
              </h2>
              <p className="text-muted mb-0">
                {editingCountry ? 'Update country information' : 'Manage all countries in the system'}
              </p>
            </div>
            
            {view === "list" && !editingCountry && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Country
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: form - show when in form view or editing */}
            {(view === "form" || editingCountry) && (
              <div className="col-lg-4 mb-4">
                <AddCountry
                  editingCountry={editingCountry}
                  clearEditing={() => {
                    setEditingCountry(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: table - always show but adjust width */}
            <div className={view === "form" || editingCountry ? "col-lg-8" : "col-12"}>
              <CountryList 
                onEdit={(countryObj) => {
                  setEditingCountry(countryObj);
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

export default CountryPage;