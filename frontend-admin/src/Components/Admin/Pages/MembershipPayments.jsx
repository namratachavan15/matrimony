import React, { useEffect, useState } from "react";
import { api } from "../../Config/api";

// Admin: every membership payment made by users (who paid, which plan, amount,
// transaction id, status, validity). Data: GET /api/admin/membership/payments (ADMIN only).

const STATUSES = ["ALL", "SUCCESS", "PENDING", "FAILED"];
const BADGE = { SUCCESS: "bg-success", PENDING: "bg-warning text-dark", FAILED: "bg-danger", REFUNDED: "bg-secondary" };

const money = (n, c = "INR") =>
  `${c === "INR" ? "₹" : c + " "}${Number(n || 0).toLocaleString("en-IN")}`;
const date = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";
const dateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

const MembershipPayments = () => {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/membership/payments", {
          params: { page, size: 15, status },
        });
        if (cancelled) return;
        setRows(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
        setError("");
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.status === 403 ? "Admin access required." : "Could not load payments.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, status]);

  // search only filters the rows already loaded on this page
  const q = search.trim().toLowerCase();
  const visible = q
    ? rows.filter((r) =>
        [r.userName, r.userMobile, r.userEmail, r.planName, r.transactionId, r.orderId]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    : rows;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h4 className="mb-0">Membership Payments</h4>
          <div className="text-muted small">{totalElements} payment(s)</div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <input
            className="form-control form-control-sm"
            style={{ width: 240 }}
            placeholder="Search name, mobile, txn id…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select form-select-sm"
            style={{ width: 150 }}
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Transaction ID</th>
                <th>Valid Till</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">Loading…</td>
                </tr>
              )}
              {!loading &&
                visible.map((r) => (
                  <tr key={r.paymentId}>
                    <td className="text-nowrap">{dateTime(r.paidAt)}</td>
                    <td>
                      <strong>{r.userName}</strong>
                      <div className="text-muted small">
                        {r.userMobile || "—"}
                        {r.userEmail ? ` · ${r.userEmail}` : ""}
                      </div>
                    </td>
                    <td>{r.planName}</td>
                    <td className="fw-semibold">{money(r.amount, r.currency)}</td>
                    <td>
                      <span className={`badge ${BADGE[r.paymentStatus] || "bg-secondary"}`}>{r.paymentStatus}</span>
                    </td>
                    <td className="small text-break" style={{ maxWidth: 220 }}>
                      {r.transactionId || <span className="text-muted">{r.orderId}</span>}
                    </td>
                    <td className="text-nowrap">
                      {r.paymentStatus === "SUCCESS" ? (
                        <>
                          {date(r.endDate)}
                          {r.subscriptionStatus === "EXPIRED" && <span className="badge bg-secondary ms-1">Expired</span>}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            ← Previous
          </button>
          <span className="small text-muted">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default MembershipPayments;
