import React, { useEffect, useState } from "react";
import { api } from "../../Config/api";

const backendURL = "http://localhost:5454/";

const VerificationPage = () => {
  const [pageData, setPageData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const load = async (p = page) => {
  setLoading(true);

  try {
    const res = await api.get("/api/admin/verification", {
      params: {
        status: 0,
        page: p,
        size: 10
      }
    });

    setPageData(res.data);
  } catch (err) {
    console.error("Error loading pending verifications:", err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleApprove = async (userId) => {
    setBusyId(userId);
    try {
      await api.post(`/api/admin/verification/${userId}/approve`);
      setPageData((prev) => ({
        ...prev,
        content: prev.content.filter((u) => u.id !== userId),
        totalElements: Math.max(0, prev.totalElements - 1),
      }));
    } catch (err) {
      console.error("Error approving profile:", err);
      alert("Could not approve this profile. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

const handleReject = async (userId) => {
  if (!rejectReason.trim()) {
    alert("Please enter a rejection reason.");
    return;
  }

  setBusyId(userId);

  try {
    await api.post(
      `/api/admin/verification/${userId}/reject`,
      {
        reason: rejectReason.trim()
      }
    );

    setPageData((prev) => ({
      ...prev,
      content: prev.content.filter((u) => u.id !== userId),
      totalElements: Math.max(0, prev.totalElements - 1),
    }));

    setRejectingId(null);
    setRejectReason("");
  } catch (err) {
    console.error("Error rejecting profile:", err);
    alert("Could not reject this profile. Please try again.");
  } finally {
    setBusyId(null);
  }
};

  const docUrl = (folder, filename) =>
    filename ? `${backendURL}uploads/${folder}/${filename}` : null;

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-patch-check-fill me-2 text-success"></i>
                Profile Verification
              </h2>
              <p className="text-muted mb-0">Review pending profiles and approve or reject verification.</p>
            </div>
            <div className="text-muted">
              <i className="bi bi-hourglass-split me-1"></i>
              {pageData.totalElements} pending
            </div>
          </div>

          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white py-3">
              <h4 className="mb-0">
                <i className="bi bi-shield-check me-2"></i>
                Pending Verification
              </h4>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading pending profiles...</p>
              </div>
            ) : pageData.content.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-check2-circle display-4 d-block mb-3 text-success"></i>
                <p className="text-muted mb-0">No profiles waiting for verification. All caught up!</p>
              </div>
            ) : (
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "80px" }}>ID</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Documents</th>
                        <th style={{ width: "320px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.content.map((u) => (
                        <tr key={u.id}>
                          <td><span className="badge bg-primary" style={{ color: "white" }}>#{u.id}</span></td>
                          <td className="fw-semibold">{u.uname}</td>
                          <td>
                            <i className="bi bi-telephone text-muted me-2"></i>
                            {u.umobile}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {docUrl("aadharFront", u.aadharFrontPhoto) ? (
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => setPreviewUrl(docUrl("aadharFront", u.aadharFrontPhoto))}
                                >
                                  <i className="bi bi-image me-1"></i> Aadhaar Front
                                </button>
                              ) : (
                                <span className="text-muted small">No front photo</span>
                              )}
                              {docUrl("aadharBack", u.aadharBackPhoto) ? (
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => setPreviewUrl(docUrl("aadharBack", u.aadharBackPhoto))}
                                >
                                  <i className="bi bi-image me-1"></i> Aadhaar Back
                                </button>
                              ) : (
                                <span className="text-muted small">No back photo</span>
                              )}
                            </div>
                          </td>
                          <td>
                            {rejectingId === u.id ? (
                              <div className="d-flex flex-column gap-2">
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Rejection reason..."
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                />
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-danger btn-sm"
                                    disabled={busyId === u.id}
                                    onClick={() => handleReject(u.id)}
                                  >
                                    Confirm Reject
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => { setRejectingId(null); setRejectReason(""); }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-success btn-sm"
                                  disabled={busyId === u.id}
                                  onClick={() => handleApprove(u.id)}
                                >
                                  <i className="bi bi-check-lg me-1"></i> Approve
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  disabled={busyId === u.id}
                                  onClick={() => setRejectingId(u.id)}
                                >
                                  <i className="bi bi-x-lg me-1"></i> Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
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

      {previewUrl && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setPreviewUrl(null)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Document Preview</h5>
                <button className="btn-close" onClick={() => setPreviewUrl(null)}></button>
              </div>
              <div className="modal-body text-center">
                <img src={previewUrl} alt="Document" style={{ maxWidth: "100%", borderRadius: "8px" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
