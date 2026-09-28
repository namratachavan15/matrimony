import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { membershipService } from "../Services/membershipService";
import { useToast } from "../Components/Toast/ToastContext";
import "./MembershipHistory.css";

const statusClass = (status) => `status-pill status-${(status || "").toLowerCase()}`;

const MembershipHistory = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  // /payment-history opens the payments tab directly; /membership/history opens subscriptions
  const [tab, setTab] = useState(location.pathname === "/payment-history" ? "payments" : "subscriptions");
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [subRes, payRes] = await Promise.all([
        membershipService.getSubscriptionHistory(0, 50),
        membershipService.getPaymentHistory(0, 50),
      ]);
      setSubscriptions(subRes.data?.content || []);
      setPayments(payRes.data?.content || []);
    } catch (err) {
      toast.error("Could not load your history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="membership-history-page">
      <button className="back-link" onClick={() => navigate("/membership")}>
        <FaArrowLeft /> Back to Membership
      </button>

      <h1>Membership &amp; Payment History</h1>

      <div className="history-tabs">
        <button className={tab === "subscriptions" ? "active" : ""} onClick={() => setTab("subscriptions")}>
          Subscriptions
        </button>
        <button className={tab === "payments" ? "active" : ""} onClick={() => setTab("payments")}>
          Payments
        </button>
      </div>

      {loading ? (
        <div className="history-loading">Loading…</div>
      ) : tab === "subscriptions" ? (
        subscriptions.length === 0 ? (
          <div className="history-empty">No subscriptions yet.</div>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.planName}</td>
                    <td>₹{s.amount}</td>
                    <td>{s.startDate ? new Date(s.startDate).toLocaleDateString() : "—"}</td>
                    <td>{s.endDate ? new Date(s.endDate).toLocaleDateString() : "—"}</td>
                    <td><span className={statusClass(s.paymentStatus)}>{s.paymentStatus}</span></td>
                    <td><span className={statusClass(s.status)}>{s.status}</span></td>
                    <td className="mono">{s.transactionId || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : payments.length === 0 ? (
        <div className="history-empty">No payments yet.</div>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="mono">{p.transactionId}</td>
                  <td>{p.planName}</td>
                  <td>₹{p.amount}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                  <td><span className={statusClass(p.status)}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembershipHistory;
