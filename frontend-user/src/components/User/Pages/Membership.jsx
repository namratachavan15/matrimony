import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaTimes,
  FaCrown,
  FaArrowRight,
} from "react-icons/fa";
import { membershipService, loadRazorpayScript } from "../Services/membershipService";
import { useUserContext } from "../State/UserContext";
import { useToast } from "../Components/Toast/ToastContext";
import "./Membership.css";

const Membership = () => {
  const { currentUser } = useUserContext();
  const toast = useToast();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payingPlanId, setPayingPlanId] = useState(null);
  // { type: "success" | "failed", plan, amount, validUntil, txnId }
  const [result, setResult] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [plansRes, currentRes] = await Promise.all([
        membershipService.getPlans(),
        membershipService.getCurrent(),
      ]);
      setPlans(plansRes.data || []);
      setCurrent(currentRes.data || null);
    } catch (err) {
      toast.error("Could not load membership plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPlanCode = current?.plan?.code;

  const handleUpgrade = async (plan) => {
    if (plan.price <= 0 || plan.code === currentPlanCode) return;

    setPayingPlanId(plan.id);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) {
        toast.error("Could not load the payment gateway. Check your connection and try again.");
        setPayingPlanId(null);
        return;
      }

      const orderRes = await membershipService.createOrder(plan.id);
      const order = orderRes.data;

      let completed = false; // set once Razorpay reports success, so a later "dismiss" isn't treated as a failure

      const razorpay = new window.Razorpay({
        key: order.razorpayKeyId,
        amount: order.amountInPaise,
        currency: order.currency,
        name: "Maratha Matrimony",
        description: `${order.planName} Membership`,
        order_id: order.razorpayOrderId,
        theme: { color: "#4a0e17" },
        handler: async (response) => {
          completed = true;
          try {
            // The backend re-verifies the signature -- the frontend
            // "success" callback alone never activates anything.
            const verifyRes = await membershipService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setCurrent(verifyRes.data);
            setResult({
              type: "success",
              plan,
              amount: plan.price,
              validUntil: verifyRes.data?.endDate,
              txnId: response.razorpay_payment_id,
            });
          } catch (err) {
            setResult({ type: "failed", plan });
          } finally {
            setPayingPlanId(null);
          }
        },
        modal: {
          ondismiss: () => {
            setPayingPlanId(null);
            if (!completed) {
              membershipService.markFailed(order.razorpayOrderId).catch(() => {});
              toast.info("Payment cancelled.");
            }
          },
        },
      });

      razorpay.on("payment.failed", () => {
        completed = true;
        membershipService.markFailed(order.razorpayOrderId).catch(() => {});
        setPayingPlanId(null);
        setResult({ type: "failed", plan });
      });

      razorpay.open();
    } catch (err) {
      setPayingPlanId(null);
      toast.error(err?.response?.data || "Could not start payment. Please try again.");
    }
  };

  const featureRows = useMemo(() => {
    if (!plans.length) return [];
    return [
      { label: "Profile Views", get: (p) => (p.dailyProfileViewLimit ? `${p.dailyProfileViewLimit}/day` : "Unlimited") },
      { label: "Interests", get: (p) => (p.monthlyInterestLimit ? `${p.monthlyInterestLimit}/month` : "Unlimited") },
      { label: "Contact Requests", get: (p) => (p.contactRequestAccess ? (p.monthlyContactRequestLimit ? `${p.monthlyContactRequestLimit}/month` : "Unlimited") : "—") },
      { label: "Advanced Search", get: (p) => p.advancedSearch },
      { label: "Messaging", get: (p) => p.messagingEnabled },
      { label: "Profile Boost", get: (p) => p.profileBoost },
      { label: "Priority Visibility", get: (p) => p.priorityVisibility },
      { label: "Premium Badge", get: (p) => p.premiumBadge },
    ];
  }, [plans]);

  if (loading) {
    return (
      <div className="membership-page">
        <div className="membership-loading">Loading membership plans…</div>
      </div>
    );
  }

  return (
    <div className="membership-page">
      <div className="membership-header">
        <h1>Choose Your Membership</h1>
        <p>Unlock more possibilities and connect with the right matches.</p>
      </div>

      {current && (
        <div className="current-membership-card">
          <div>
            <span className="current-membership-label">Your Membership</span>
            <h2>
              {current.plan.premiumBadge && <FaCrown className="crown-icon" />} {current.plan.name}
            </h2>
            {current.endDate ? (
              <p>
                Active until <strong>{new Date(current.endDate).toLocaleDateString()}</strong> ·{" "}
                {current.daysRemaining} days remaining
              </p>
            ) : (
              <p>Upgrade to unlock more features.</p>
            )}
          </div>
          <div className="current-membership-usage">
            <UsageBar
              label="Interests"
              used={current.interestsUsedThisMonth}
              limit={current.plan.monthlyInterestLimit}
            />
            <UsageBar
              label="Contact Requests"
              used={current.contactRequestsUsedThisMonth}
              limit={current.plan.monthlyContactRequestLimit}
            />
          </div>
          <button className="btn-view-history" onClick={() => navigate("/membership/history")}>
            View History <FaArrowRight />
          </button>
        </div>
      )}

      <div className="pricing-cards">
        {plans.map((plan) => {
          const isCurrent = plan.code === currentPlanCode;
          return (
            <div key={plan.id} className={`pricing-card ${plan.popular ? "popular" : ""} ${isCurrent ? "is-current" : ""}`}>
              {plan.popular && <div className="popular-badge">⭐ Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="price">
                ₹{plan.price}
                {plan.durationDays > 0 && plan.durationDays < 3650 && (
                  <span className="duration"> / {Math.round(plan.durationDays / 30)} Months</span>
                )}
              </div>
              <ul className="feature-list">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <FaCheck className="check" /> {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <button className="btn-current" disabled>
                  Current Plan
                </button>
              ) : plan.price <= 0 ? (
                <button className="btn-upgrade" disabled>
                  Free Plan
                </button>
              ) : (
                <button
                  className="btn-upgrade"
                  disabled={payingPlanId === plan.id}
                  onClick={() => handleUpgrade(plan)}
                >
                  {payingPlanId === plan.id ? "Processing…" : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {result && (
        <div className="pay-result-overlay" onClick={() => setResult(null)}>
          <div className="pay-result-modal" onClick={(e) => e.stopPropagation()}>
            {result.type === "success" ? (
              <>
                <div className="pay-result-icon success">🎉</div>
                <h2>Membership Activated!</h2>
                <div className="pay-result-rows">
                  <div><span>Plan</span><strong>{result.plan.name}</strong></div>
                  <div><span>Amount</span><strong>₹{Number(result.amount).toLocaleString("en-IN")}</strong></div>
                  <div><span>Valid Until</span><strong>{result.validUntil ? new Date(result.validUntil).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</strong></div>
                  <div><span>Transaction ID</span><strong className="txn">{result.txnId}</strong></div>
                </div>
                <div className="pay-result-actions">
                  <button className="btn-upgrade" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
                  <button className="btn-view-history" onClick={() => navigate("/membership/history")}>View Membership</button>
                </div>
              </>
            ) : (
              <>
                <div className="pay-result-icon failed">⚠️</div>
                <h2>Payment Failed</h2>
                <p>Your payment could not be completed. No membership was activated.</p>
                <div className="pay-result-actions">
                  <button className="btn-upgrade" onClick={() => { const pl = result.plan; setResult(null); handleUpgrade(pl); }}>Try Again</button>
                  <button className="btn-view-history" onClick={() => setResult(null)}>Back to Plans</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="comparison-section">
        <h2>Compare Plans</h2>
        <div className="comparison-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                {plans.map((p) => (
                  <th key={p.id}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureRows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {plans.map((p) => {
                    const value = row.get(p);
                    return (
                      <td key={p.id}>
                        {typeof value === "boolean" ? (
                          value ? <FaCheck className="check" /> : <FaTimes className="cross" />
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UsageBar = ({ label, used, limit }) => {
  const isUnlimited = limit === null || limit === undefined;
  const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
  return (
    <div className="usage-bar-row">
      <div className="usage-bar-label">
        <span>{label}</span>
        <span>{isUnlimited ? `${used} / Unlimited` : `${used} / ${limit}`}</span>
      </div>
      <div className="usage-bar-track">
        <div className="usage-bar-fill" style={{ width: isUnlimited ? "8%" : `${pct}%` }} />
      </div>
    </div>
  );
};

export default Membership;
