import React, { useEffect, useState } from "react";
import { api } from "../../Config/api";
import { useUserContext } from "../State/UserContext";

const STATUS_OPTIONS = ["PENDING", "REVIEWED", "RESOLVED", "REJECTED"];
const STATUS_COLORS = {
  PENDING: "warning",
  REVIEWED: "info",
  RESOLVED: "success",
  REJECTED: "secondary",
};

const REASON_LABELS = {
  FAKE_PROFILE: "Fake profile",
  WRONG_INFORMATION: "Wrong information",
  ALREADY_MARRIED: "Already married",
  INAPPROPRIATE_CONTENT: "Inappropriate content",
  HARASSMENT: "Harassment",
  SUSPICIOUS_ACTIVITY: "Suspicious activity",
  OTHER: "Other",
};

const ReportsPage = () => {
  const { users } = useUserContext();
  const [pageData, setPageData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const userById = (id) => (users || []).find((u) => u.id === id);

  const load = async (p = page, status = statusFilter) => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/reports", {
        params: { page: p, size: 10, ...(status ? { status } : {}) },
      });
      setPageData(res.data);
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const handleStatusChange = async (reportId, newStatus) => {
    setBusyId(reportId);
    try {
      const res = await api.post(`/api/admin/reports/${reportId}/status`, null, { params: { status: newStatus } });
      setPageData((prev) => ({
        ...prev,
        content: prev.content.map((r) => (r.id === reportId ? res.data : r)),
      }));
    } catch (err) {
      console.error("Error updating report status:", err);
      alert("Could not update report status. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-flag-fill me-2 text-danger"></i>
                Reported Profiles
              </h2>
              <p className="text-muted mb-0">Review reports submitted by users and take action.</p>
            </div>
            <div className="text-muted">{pageData.totalElements} reports</div>
          </div>

          <div className="card shadow-lg border-0">
            <div className="card-header bg-danger text-white py-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h4 className="mb-0">
                  <i className="bi bi-flag me-2"></i>
                  Reports
                </h4>
                <select
                  className="form-select form-select-sm w-auto"
                  value={statusFilter}
                  onChange={(e) => { setPage(0); setStatusFilter(e.target.value); }}
                >
                  <option value="">All statuses</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading reports...</p>
              </div>
            ) : pageData.content.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-shield-check display-4 d-block mb-3 text-success"></i>
                <p className="text-muted mb-0">No reports found.</p>
              </div>
            ) : (
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "70px" }}>ID</th>
                        <th>Reported Profile</th>
                        <th>Reported By</th>
                        <th>Reason</th>
                        <th>Description</th>
                        <th style={{ width: "160px" }}>Status</th>
                        <th style={{ width: "160px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.content.map((r) => {
                        const reported = userById(r.reportedUserId);
                        const reporter = userById(r.reporterId);
                        return (
                          <tr key={r.id}>
                            <td><span className="badge bg-primary" style={{ color: "white" }}>#{r.id}</span></td>
                            <td>
                              <div className="fw-semibold">{reported ? reported.uname : `User #${r.reportedUserId}`}</div>
                              {reported && <div className="text-muted small">{reported.umobile}</div>}
                            </td>
                            <td>
                              <div>{reporter ? reporter.uname : `User #${r.reporterId}`}</div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {REASON_LABELS[r.reason] || r.reason}
                              </span>
                            </td>
                            <td className="text-muted small" style={{ maxWidth: "220px" }}>
                              {r.description || "—"}
                            </td>
                            <td>
                              <span className={`badge bg-${STATUS_COLORS[r.status] || "secondary"}`} style={{ color: "white" }}>
                                {r.status}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={r.status}
                                disabled={busyId === r.id}
                                onChange={(e) => handleStatusChange(r.id, e.target.value)}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loading && pageData.totalPages > 1 && (
              <div className="card-footer bg-white d-flex justify-content-between align-items-center flex-wrap">
                <div className="text-muted small">
                  Page {pageData.number + 1} of {pageData.totalPages}
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    <i className="bi bi-chevron-left"></i> Prev
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page + 1 >= pageData.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
