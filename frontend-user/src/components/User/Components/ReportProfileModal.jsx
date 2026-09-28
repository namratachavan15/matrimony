import React, { useState } from "react";
import { FaFlag, FaTimes } from "react-icons/fa";
import { reportService } from "../Services/reportService";
import { useToast } from "./Toast/ToastContext";
import "./ReportProfileModal.css";

const REASONS = [
  { value: "FAKE_PROFILE", label: "Fake profile" },
  { value: "WRONG_INFORMATION", label: "Wrong information" },
  { value: "ALREADY_MARRIED", label: "Already married" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate content" },
  { value: "HARASSMENT", label: "Harassment" },
  { value: "SUSPICIOUS_ACTIVITY", label: "Suspicious activity" },
  { value: "OTHER", label: "Other" },
];

// Report-reason picker used from ProfileModal's "More" menu. Deliberately no
// window.confirm/alert -- submission result is surfaced via toast, same as
// every other interaction in this app.
export default function ReportProfileModal({ reportedUserId, reportedUserName, onClose }) {
  const toast = useToast();
  const [reason, setReason] = useState("FAKE_PROFILE");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await reportService.submit(reportedUserId, reason, description.trim() || null);
      toast.success("Report submitted. Our team will review it shortly.");
      onClose();
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) {
        toast.info("You already have a pending report against this profile.");
        onClose();
      } else {
        toast.error("Could not submit report. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-modal-header">
          <h3>
            <FaFlag /> Report {reportedUserName || "Profile"}
          </h3>
          <button className="report-modal-close" onClick={onClose} title="Close">
            <FaTimes />
          </button>
        </div>

        <div className="report-modal-body">
          <label className="report-field-label">Reason</label>
          <div className="report-reason-list">
            {REASONS.map((r) => (
              <label key={r.value} className={`report-reason-option ${reason === r.value ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="report-reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                />
                {r.label}
              </label>
            ))}
          </div>

          <label className="report-field-label" htmlFor="report-description">
            Additional details (optional)
          </label>
          <textarea
            id="report-description"
            className="report-description-input"
            rows={3}
            maxLength={1000}
            placeholder="Tell us more about the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="report-modal-footer">
          <button className="report-cancel-btn" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="report-submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
