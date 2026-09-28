import React, { useState } from "react";
import { useAboutContext } from "../State/AboutContext";
import AddAbout from "./AddAbout";
import AboutList from "./AboutList"; // import the new AboutList

const AboutPage = () => {
  const { abouts } = useAboutContext();
  const [showAdd, setShowAdd] = useState(false);
  const [editingAbout, setEditingAbout] = useState(null);

  const handleEdit = (about) => {
    setEditingAbout(about);
    setShowAdd(true);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex mb-3">
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          Add About
        </button>
      </div>

      {showAdd && (
        <AddAbout
          onClose={() => {
            setShowAdd(false);
            setEditingAbout(null);
          }}
          editingAbout={editingAbout}
          clearEditing={() => setEditingAbout(null)}
        />
      )}

      {/* Only render AboutList now */}
      <AboutList onEdit={handleEdit} />
    </div>
  );
};

export default AboutPage;
