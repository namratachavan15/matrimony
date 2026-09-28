import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlay, FaEdit, FaTrash, FaCheck, FaTimes, FaBookmark } from "react-icons/fa";
import { savedSearchService } from "../Services/savedSearchService";
import { useFilterContext } from "../State/FilterContext";
import { useToast } from "../Components/Toast/ToastContext";
import "./SavedSearches.css";

const FILTER_LABELS = {
  fromBirthYear: "From Year",
  toBirthYear: "To Year",
  income: "Income",
  education: "Education",
  height: "Height",
  cast: "Cast",
  subcast: "Subcast",
  disease: "Disease",
  marriageType: "Marital Status",
  workCountry: "Work Country",
};

const SavedSearches = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { applyFilters } = useFilterContext();

  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await savedSearchService.getMy();
      setSearches(res.data || []);
    } catch (e) {
      toast.error("Could not load your saved searches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summarize = (filters) => {
    if (!filters) return "No filters";
    const parts = Object.entries(filters)
      .filter(([, v]) => v !== "" && v !== null && v !== undefined)
      .map(([k, v]) => `${FILTER_LABELS[k] || k}: ${v}`);
    return parts.length ? parts.join(" · ") : "No filters";
  };

  const handleRun = (search) => {
    applyFilters(search.filters || {});
    navigate("/dashboard");
  };

  const startEdit = (search) => {
    setEditingId(search.id);
    setEditName(search.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      toast.info("Name can't be empty.");
      return;
    }
    setBusyId(id);
    try {
      const res = await savedSearchService.rename(id, editName.trim());
      setSearches((prev) => prev.map((s) => (s.id === id ? res.data : s)));
      toast.success("Search renamed.");
      cancelEdit();
    } catch (e) {
      toast.error("Could not rename this search.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await savedSearchService.remove(id);
      setSearches((prev) => prev.filter((s) => s.id !== id));
      toast.info("Saved search deleted.");
    } catch (e) {
      toast.error("Could not delete this search.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="ss-page">
      <div className="ss-header">
        <FaBookmark className="ss-header-icon" />
        <div>
          <h1>My Saved Searches</h1>
          <p>Save a filter combination once, run it anytime from here.</p>
        </div>
      </div>

      {loading ? (
        <div className="ss-skeleton" />
      ) : searches.length === 0 ? (
        <div className="ss-empty">
          <FaSearch className="ss-empty-icon" />
          <h3>No saved searches yet</h3>
          <p>Open Filters on the Browse page and click "Save Search" to create one.</p>
        </div>
      ) : (
        <div className="ss-list">
          {searches.map((s) => (
            <div className="ss-card" key={s.id}>
              <div className="ss-card-main">
                {editingId === s.id ? (
                  <input
                    className="ss-edit-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={100}
                    autoFocus
                  />
                ) : (
                  <h3>{s.name}</h3>
                )}
                <p className="ss-summary">{summarize(s.filters)}</p>
              </div>

              <div className="ss-card-actions">
                {editingId === s.id ? (
                  <>
                    <button className="ss-icon-btn ss-confirm" disabled={busyId === s.id} onClick={() => saveEdit(s.id)} title="Save name">
                      <FaCheck />
                    </button>
                    <button className="ss-icon-btn" disabled={busyId === s.id} onClick={cancelEdit} title="Cancel">
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="ss-icon-btn ss-run" onClick={() => handleRun(s)} title="Run Search">
                      <FaPlay />
                    </button>
                    <button className="ss-icon-btn" onClick={() => startEdit(s)} title="Rename">
                      <FaEdit />
                    </button>
                    <button
                      className="ss-icon-btn ss-danger"
                      disabled={busyId === s.id}
                      onClick={() => handleDelete(s.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSearches;
