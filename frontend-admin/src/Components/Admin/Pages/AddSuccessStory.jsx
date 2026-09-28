import React, { useEffect, useState } from "react";
import { useStoryContext } from "../State/StoryContext";
import { useUserContext } from "../State/UserContext";

const AddSuccessStory = ({ editingStory, clearEditing }) => {
  const { createStory, updateStory } = useStoryContext();
  const { users, fetchUsers } = useUserContext();

  const [form, setForm] = useState({ bridename: "", groomname: "", marriageDate: "", feedback: "", status: 1 });
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (editingStory) {
      setForm({
        bridename: editingStory.bridename,
        groomname: editingStory.groomname,
        marriageDate: editingStory.marriageDate,
        feedback: editingStory.feedback,
        status: editingStory.status,
      });
      setPhoto(null);
    } else {
      setForm({ bridename: "", groomname: "", marriageDate: "", feedback: "", status: 1 });
      setPhoto(null);
    }
  }, [editingStory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bridename || !form.groomname) return alert("Select Bride & Groom");

    setIsSubmitting(true);
    try {
      if (editingStory) {
        await updateStory(editingStory.id, form, photo);
      } else {
        await createStory(form, photo);
      }
      clearEditing();
    } catch (err) {
      alert("Failed to save story");
    } finally {
      setIsSubmitting(false);
    }
  };

  const brides = users.filter(u => u.gender?.toLowerCase() === "female");
  const grooms = users.filter(u => u.gender?.toLowerCase() === "male");

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        {editingStory ? "Edit Success Story" : "Add Success Story"}
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <label>Bride</label>
          <select className="form-control mb-2" value={form.bridename} onChange={e => setForm({ ...form, bridename: e.target.value })} required>
            <option value="">-- Select Bride --</option>
            {brides.map(b => <option key={b.id} value={b.uname}>{b.uname}</option>)}
          </select>

          <label>Groom</label>
          <select className="form-control mb-2" value={form.groomname} onChange={e => setForm({ ...form, groomname: e.target.value })} required>
            <option value="">-- Select Groom --</option>
            {grooms.map(g => <option key={g.id} value={g.uname}>{g.uname}</option>)}
          </select>

          <label>Marriage Date</label>
          <input type="date" className="form-control mb-2" value={form.marriageDate} onChange={e => setForm({ ...form, marriageDate: e.target.value })} required />

          <label>Feedback</label>
          <textarea className="form-control mb-2" value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} required />

          <label>Photo</label>
          <input type="file" className="form-control mb-2" onChange={e => setPhoto(e.target.files[0])} />
          {editingStory?.simg && !photo && <img src={`http://localhost:5454/uploads/stories/${editingStory.simg}`} width="120" className="rounded border mb-2" />}

          <div className="mb-2">
            <label>
              <input type="radio" checked={form.status === 1} onChange={() => setForm({ ...form, status: 1 })} /> Show
            </label>
            <label className="ms-3">
              <input type="radio" checked={form.status === 0} onChange={() => setForm({ ...form, status: 0 })} /> Hide
            </label>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-success" disabled={isSubmitting}>{editingStory ? "Update" : "Save"}</button>
            <button type="button" className="btn btn-secondary" onClick={clearEditing} disabled={isSubmitting}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSuccessStory;
