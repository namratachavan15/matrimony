import { useEffect, useState } from "react";
import { useAboutContext } from "../State/AboutContext";
import { useCastContext } from "../State/CastContext";

const AddAbout = ({ onClose, editingAbout, clearEditing }) => {
  const { createAbout, updateAbout } = useAboutContext();
  const { cast, fetchCasts, loading: castLoading } = useCastContext();

  const [form, setForm] = useState({ castId: "", about: "", status: 1 });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // fetch casts on mount
  useEffect(() => {
    if (!cast || cast.length === 0) fetchCasts();
  }, [cast, fetchCasts]);

  // fill form if editing
  useEffect(() => {
    if (editingAbout) {
      setForm({
        castId: editingAbout.castId || "",
        about: editingAbout.about || "",
        status: editingAbout.status ?? 1,
      });
      setError("");
    } else {
      setForm({ castId: "", about: "", status: 1 });
    }
  }, [editingAbout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.castId) {
      setError("Please select a cast.");
      setIsSubmitting(false);
      return;
    }
    if (!form.about.trim()) {
      setError("Please enter about text.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      castId: Number(form.castId),
      about: form.about.trim(),
      status: Number(form.status),
    };

    try {
      if (editingAbout) {
        await updateAbout(editingAbout.id, payload);
        if (clearEditing) clearEditing();
      } else {
        await createAbout(payload);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        {editingAbout ? "Edit About" : "Add About"}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <label className="fw-bold">Select Cast</label>
          <select
            name="castId"
            value={form.castId}
            onChange={handleChange}
            className="form-control mb-2"
            disabled={isSubmitting || castLoading}
            required
          >
            <option value="">-- Select Cast --</option>
            {cast.map((c) => (
              <option key={c.id} value={c.id}>
                {c.cast}
              </option>
            ))}
          </select>

          <label className="fw-bold">About</label>
          <textarea
            name="about"
            className="form-control mb-2"
            rows={4}
            value={form.about}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />

          <div className="mb-2">
            <label className="me-3">
              <input
                type="radio"
                checked={form.status === 1}
                onChange={() => setForm({ ...form, status: 1 })}
              />{" "}
              Active
            </label>
            <label>
              <input
                type="radio"
                checked={form.status === 0}
                onChange={() => setForm({ ...form, status: 0 })}
              />{" "}
              Inactive
            </label>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting || castLoading}
            >
              {isSubmitting ? "Saving..." : editingAbout ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAbout;
