import React, { useEffect, useState } from "react";
import { api } from "../../Config/api";

// Admin: manage membership plans + see subscription/revenue stats.
// Everything comes from /api/admin/membership/* (ADMIN role is enforced on the
// backend -- a normal USER token gets 403). No payment secrets are handled here.

const EMPTY = {
  id: null, code: "", name: "", price: 0, durationDays: 30, description: "", features: "",
  active: true, displayOrder: 1, popular: false,
  dailyProfileViewLimit: "", monthlyInterestLimit: "", monthlyContactRequestLimit: "",
  advancedSearch: false, messagingEnabled: true, contactRequestAccess: true,
  profileBoost: false, priorityVisibility: false, premiumBadge: false,
};

const FLAGS = [
  ["advancedSearch", "Advanced Search"], ["messagingEnabled", "Messaging"],
  ["contactRequestAccess", "Contact Requests"], ["profileBoost", "Profile Boost"],
  ["priorityVisibility", "Priority Visibility"], ["premiumBadge", "Premium Badge"],
  ["popular", "Show 'Most Popular'"], ["active", "Active (purchasable)"],
];

const LIMITS = [
  ["dailyProfileViewLimit", "Profile views / day"],
  ["monthlyInterestLimit", "Interests / month"],
  ["monthlyContactRequestLimit", "Contact requests / month"],
];

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const limit = (n) => (n === null || n === undefined ? "Unlimited" : n);

const MembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState(null); // null = modal closed
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [p, s] = await Promise.all([
        api.get("/api/admin/membership/plans"),
        api.get("/api/admin/membership/stats"),
      ]);
      setPlans(p.data);
      setStats(s.data);
      setError("");
    } catch (e) {
      setError(e?.response?.status === 403 ? "Admin access required." : "Could not load membership data.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (plan) =>
    setForm({
      ...EMPTY,
      ...plan,
      dailyProfileViewLimit: plan.dailyProfileViewLimit ?? "",
      monthlyInterestLimit: plan.monthlyInterestLimit ?? "",
      monthlyContactRequestLimit: plan.monthlyContactRequestLimit ?? "",
      features: plan.features || "",
      description: plan.description || "",
    });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const numOrNull = (v) => (v === "" || v === null ? null : Number(v));

  const save = async () => {
    setSaving(true);
    setError("");
    const body = {
      ...form,
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      displayOrder: Number(form.displayOrder),
      dailyProfileViewLimit: numOrNull(form.dailyProfileViewLimit),
      monthlyInterestLimit: numOrNull(form.monthlyInterestLimit),
      monthlyContactRequestLimit: numOrNull(form.monthlyContactRequestLimit),
    };
    try {
      if (form.id) await api.put(`/api/admin/membership/plans/${form.id}`, body);
      else await api.post("/api/admin/membership/plans", body);
      setForm(null);
      load();
    } catch (e) {
      setError(typeof e?.response?.data === "string" ? e.response.data : "Could not save plan.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (plan) => {
    try {
      await api.put(`/api/admin/membership/plans/${plan.id}/active`, null, {
        params: { active: !plan.active },
      });
      load();
    } catch (e) {
      setError("Could not update plan status.");
    }
  };

  const statCard = (label, value) => (
    <div className="col-6 col-md-3 mb-3" key={label}>
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <div className="text-muted small">{label}</div>
          <div className="fs-4 fw-bold" style={{ color: "#4a0e17" }}>{value}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h4 className="mb-0">Membership Plans</h4>
        <button
          className="btn btn-sm text-white"
          style={{ background: "#4a0e17" }}
          onClick={() => setForm({ ...EMPTY })}
        >
          + New Plan
        </button>
      </div>

      {error && !form && <div className="alert alert-danger py-2">{error}</div>}

      {stats && (
        <div className="row">
          {statCard("Active Subscriptions", stats.totalActiveSubscriptions)}
          {statCard("Expired Subscriptions", stats.expiredSubscriptions)}
          {statCard("Total Revenue", money(stats.totalRevenue))}
          {statCard("This Month Revenue", money(stats.thisMonthRevenue))}
          {Object.entries(stats.activeByPlan || {}).map(([name, n]) => statCard(`Active ${name}`, n))}
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Order</th>
                <th>Plan</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Interests/mo</th>
                <th>Contacts/mo</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id}>
                  <td>{p.displayOrder}</td>
                  <td>
                    <strong>{p.name}</strong> <span className="text-muted small">({p.code})</span>
                  </td>
                  <td>{money(p.price)}</td>
                  <td>{p.durationDays >= 36500 ? "Forever" : `${p.durationDays} days`}</td>
                  <td>{limit(p.monthlyInterestLimit)}</td>
                  <td>{p.contactRequestAccess ? limit(p.monthlyContactRequestLimit) : "—"}</td>
                  <td>
                    <span className={`badge ${p.active ? "bg-success" : "bg-secondary"}`}>
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEdit(p)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-dark" onClick={() => toggleActive(p)}>
                      {p.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">No plans yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {form && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{form.id ? "Edit Plan" : "New Plan"}</h5>
                <button className="btn-close" onClick={() => setForm(null)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Code</label>
                    <input
                      className="form-control"
                      value={form.code}
                      disabled={!!form.id}
                      onChange={(e) => set("code", e.target.value.toUpperCase())}
                      placeholder="GOLD"
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">Name</label>
                    <input className="form-control" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Price (₹)</label>
                    <input type="number" min="0" className="form-control" value={form.price} onChange={(e) => set("price", e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Duration (days)</label>
                    <input type="number" min="0" className="form-control" value={form.durationDays} onChange={(e) => set("durationDays", e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Display order</label>
                    <input type="number" className="form-control" value={form.displayOrder} onChange={(e) => set("displayOrder", e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <input className="form-control" value={form.description} onChange={(e) => set("description", e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Feature bullets (comma separated)</label>
                    <textarea className="form-control" rows="2" value={form.features} onChange={(e) => set("features", e.target.value)} />
                  </div>

                  {LIMITS.map(([k, l]) => (
                    <div className="col-md-4" key={k}>
                      <label className="form-label">{l}</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="Empty = unlimited"
                        value={form[k]}
                        onChange={(e) => set(k, e.target.value)}
                      />
                    </div>
                  ))}

                  {FLAGS.map(([k, l]) => (
                    <div className="col-6 col-md-3" key={k}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`flag-${k}`}
                          checked={!!form[k]}
                          onChange={(e) => set(k, e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor={`flag-${k}`}>{l}</label>
                      </div>
                    </div>
                  ))}
                </div>
                {error && <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setForm(null)}>Cancel</button>
                <button className="btn text-white" style={{ background: "#4a0e17" }} disabled={saving} onClick={save}>
                  {saving ? "Saving…" : "Save Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPlans;
