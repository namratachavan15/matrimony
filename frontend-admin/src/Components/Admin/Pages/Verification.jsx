import React, { useEffect, useState } from "react";
import { api } from "../../Config/api";

const backendURL = "http://localhost:5454/";

const Verification = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [rejectModalUser, setRejectModalUser] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/verification/pending", {
        params: { page: 0, size: 50 },
      });
      setPending(res.data?.content ?? []);
    } catch (err) {
      console.error("Error loading pending verifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (userId) => {
    setBusyId(userId);
    try {
      await api.post(`/api/admin/verification/${userId}/approve`);
      setPending((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error approving profile:", err);
      alert("Could not approve this profile. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const openRejectModal = (user) => {
    setRejectModalUser(user);
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!rejectModalUser) return;
    if (!rejectReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }
    setBusyId(rejectModalUser.id);
    try {
      await api.post(`/api/admin/verification/${rejectModalUser.id}/reject`, null, {
        params: { reason: rejectReason.trim() },
      });
      setPending((prev) => prev.filter((u) => u.id !== rejectModalUser.id));
      setRejectModalUser(null);
    } catch (err) {
      console.error("Error rejecting profile:", err);
      alert("Could not reject this profile. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const photoUrl = (folder, filename) =>
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
              <p className="text-muted mb-0">Review pending profiles and approve or reject with a reason.</p>
            </div>
            <div className="text-muted">
              <i className="bi bi-hourglass-split me-1"></i>
              {pending.length} pending
            </div>
          </div>

          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white py-3">
              <h4 className="mb-0">
                <i className="bi bi-shield-check me-2"></i>
                Pending Verification Requests
              </h4>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading pending profiles...</p>
              </div>
            ) : pending.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-check2-circle display-4 d-block mb-3 text-success"></i>
                <p className="text-muted mb-0">No profiles waiting for verification.</p>
              </div>
            ) : (
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "70px" }}>ID</th>
                        <th style={{ width: "70px" }}>Photo</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Aadhaar Front</th>
                        <th>Aadhaar Back</th>
                        <th style={{ width: "220px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map((u) => (
                        <tr key={u.id}>
                          <td><span className="badge bg-primary">#{u.id}</span></td>
                          <td>
                            {u.uprofile ? (
                              <img
                                src={photoUrl("profile", u.uprofile)}
                                alt={u.uname}
                                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", cursor: "pointer" }}
                                onClick={() => setPreviewImage(photoUrl("profile", u.uprofile))}
                              />
                            ) : (
                              <div className="bg-secondary rounded-circle" style={{ width: 40, height: 40 }} />
                            )}
                          </td>
                          <td>{u.uname}</td>
                          <td>{u.umobile}</td>
                          <td>
                            {u.aadharFrontPhoto ? (
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setPreviewImage(photoUrl("aadharFront", u.aadharFrontPhoto))}
                              >
                                <i className="bi bi-image me-1" /> View
                              </button>
                            ) : (
                              <span className="text-muted small">Not uploaded</span>
                            )}
                          </td>
                          <td>
                            {u.aadharBackPhoto ? (
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setPreviewImage(photoUrl("aadharBack", u.aadharBackPhoto))}
                              >
                                <i className="bi bi-image me-1" /> View
                              </button>
                            ) : (
                              <span className="text-muted small">Not uploaded</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                disabled={busyId === u.id}
                                onClick={() => handleApprove(u.id)}
                              >
                                <i className="bi bi-check-lg me-1" /> Approve
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                disabled={busyId === u.id}
                                onClick={() => openRejectModal(u)}
                              >
                                <i className="bi bi-x-lg me-1" /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image preview modal */}
      {previewImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.75)", zIndex: 1080 }}
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 8 }} />
        </div>
      )}

      {/* Reject reason modal */}
      {rejectModalUser && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1090 }}
          onClick={() => setRejectModalUser(null)}
        >
          <div
            className="bg-white rounded-3 p-4"
            style={{ width: "90%", maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3">
              <i className="bi bi-x-circle text-danger me-2" />
              Reject {rejectModalUser.uname}'s Profile
            </h5>
            <label className="form-label small fw-semibold">Rejection reason</label>
            <textarea
              className="form-control mb-3"
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Aadhaar photo unclear, name mismatch..."
            />
            <div className="d-flex gap-2">
              <button className="btn btn-secondary flex-fill" onClick={() => setRejectModalUser(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger flex-fill"
                disabled={busyId === rejectModalUser.id}
                onClick={handleReject}
              >
                {busyId === rejectModalUser.id ? "Rejecting..." : "Reject Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;
