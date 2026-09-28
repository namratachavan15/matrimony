import React, { useState } from "react";
import AddSuccessStory from "./AddSuccessStory";
import SuccessStoryList from "./SuccessStoryList";

const SuccessStoryPage = () => {
  const [editingStory, setEditingStory] = useState(null);
  const [view, setView] = useState("list"); // "list" or "form"

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-heart-fill me-2 text-danger"></i>
                Success Story Management
              </h2>
              <p className="text-muted mb-0">
                {editingStory
                  ? "Update success story"
                  : "Manage all success stories"}
              </p>
            </div>

            {view === "list" && !editingStory && (
              <button
                className="btn btn-primary flex-shrink-0"
                onClick={() => setView("form")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Story
              </button>
            )}
          </div>

          {/* Content */}
          <div className="row">
            {/* Left: Form */}
            {(view === "form" || editingStory) && (
              <div className="col-lg-4 mb-4">
                <AddSuccessStory
                  editingStory={editingStory}
                  clearEditing={() => {
                    setEditingStory(null);
                    setView("list");
                  }}
                />
              </div>
            )}

            {/* Right: List */}
            <div className={view === "form" || editingStory ? "col-lg-8" : "col-12"}>
              <SuccessStoryList
                onEdit={(story) => {
                  setEditingStory(story);
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

export default SuccessStoryPage;
