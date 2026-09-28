import React, { useState } from "react";
import AddTestimonial from "./AddTestimonial";
import TestimonialList from "./TestimonialList";

const TestimonialPage = () => {
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState("list");

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-chat-left-quote-fill me-2 text-primary"></i>
                Testimonial Management
              </h2>
              <p className="text-muted mb-0">
                {editing ? "Update testimonial" : "Manage all testimonials"}
              </p>
            </div>

            {view==="list" && !editing && (
              <button className="btn btn-primary" onClick={()=>setView("form")}>
                <i className="bi bi-plus-circle me-2"></i>Add New
              </button>
            )}
          </div>

          <div className="row">
            {(view==="form" || editing) && (
              <div className="col-lg-4 mb-4">
                <AddTestimonial editing={editing} clearEditing={()=>{
                  setEditing(null); setView("list");
                }} />
              </div>
            )}
            <div className={(view==="form"||editing)?"col-lg-8":"col-12"}>
              <TestimonialList onEdit={(t)=>{setEditing(t); setView("form");}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;
