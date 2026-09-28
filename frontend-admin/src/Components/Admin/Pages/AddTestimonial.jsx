import React, { useState, useEffect } from "react";
import { useTestimonialContext } from "../State/TestimonialContext";

const AddTestimonial = ({ editing, clearEditing }) => {
  const { createTestimonial, updateTestimonial } = useTestimonialContext();

  const [form, setForm] = useState({ name:"", testimonial:"", status:1 });
  const [photo, setPhoto] = useState(null);

  useEffect(()=>{
    if(editing){
      setForm({
        name: editing.name,
        testimonial: editing.testimonial,
        status: editing.status
      });
    }
  }, [editing]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!form.name || !form.testimonial){
      alert("Enter name and feedback");
      return;
    }

    if(editing){
      await updateTestimonial(editing.id, form, photo);
    } else {
      if(!photo){ alert("Please select a photo"); return; }
      await createTestimonial(form, photo);
    }

    clearEditing();
    setForm({ name:"", testimonial:"", status:1 });
    setPhoto(null);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        {editing ? "Edit Testimonial" : "Add Testimonial"}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>

          <label className="fw-bold">Name</label>
          <input type="text" className="form-control mb-2"
                 value={form.name}
                 onChange={e=>setForm({...form,name:e.target.value})}
                 required />

          <label className="fw-bold">Feedback</label>
          <textarea className="form-control mb-2"
                    value={form.testimonial}
                    onChange={e=>setForm({...form,testimonial:e.target.value})}
                    required />

          <label className="fw-bold">Upload Photo</label>
          <input type="file" className="form-control mb-2"
                 onChange={e=>setPhoto(e.target.files[0])} />

          {editing?.simg && !photo && (
            <div className="mb-2">
              <label className="fw-bold">Current Photo</label><br/>
              <img src={`http://localhost:5454/uploads/testimonials/${editing.simg}`}
                   width="120" className="rounded border" />
            </div>
          )}

          <div className="mb-2">
            <label className="me-3 fw-bold">
              <input type="radio" checked={form.status===1}
                     onChange={()=>setForm({...form,status:1})}/> Show
            </label>
            <label className="fw-bold">
              <input type="radio" checked={form.status===0}
                     onChange={()=>setForm({...form,status:0})}/> Hide
            </label>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-success">{editing?"Update":"Save"}</button>
            <button type="button" className="btn btn-secondary" onClick={clearEditing}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddTestimonial;
