import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaCrown } from "react-icons/fa";
import { membershipService, formatMoney, durationLabel, limitLabel } from "../Services/membershipService";
import { useUserContext } from "../State/UserContext";
import "../Pages/Membership.css";
import "./LandingPlans.css";

// Public "Membership Plans" section for the landing page.
// Plans come from the admin panel (GET /api/membership/plans, public, active plans only).
// Buying happens on /membership (login required); payments then show up in the admin panel.
const LandingPlans = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    membershipService
      .getPlans()
      .then((res) => setPlans(res.data || []))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  // Clicking any plan: visitors go to Login (then straight to the payment page);
  // already-logged-in users go directly to the payment page.
  const handleChoose = (plan) => {
    if (currentUser) {
      navigate(plan.price > 0 ? "/membership" : "/dashboard");
    } else {
      navigate("/login", { state: { from: plan.price > 0 ? "/membership" : "/" } });
    }
  };

  return (
    <div className="landing-plans">
      <div className="container">
        <div className="landing-plans-head">
          <span className="section-subtitle">Membership</span>
          <h2 className="section-title">Choose the Plan That Fits You</h2>
          <p className="landing-plans-sub">
            Start free, upgrade anytime. Click a plan, log in, and pay securely online &mdash; your membership activates instantly.
          </p>
        </div>

        {loading && <div className="landing-plans-state">Loading plans…</div>}
        {!loading && failed && (
          <div className="landing-plans-state">Plans are unavailable right now. Please try again later.</div>
        )}

        <div className="pricing-cards landing-plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card landing-plan-card ${plan.popular ? "popular" : ""}`}
              onClick={() => handleChoose(plan)}
            >
              {plan.popular && <div className="popular-badge">⭐ Most Popular</div>}
              <h3>
                {plan.premiumBadge && <FaCrown className="crown-icon" />} {plan.name}
              </h3>
              <div className="price">
                {plan.price > 0 ? formatMoney(plan.price) : "Free"}
                {plan.price > 0 && <span className="duration"> / {durationLabel(plan.durationDays)}</span>}
              </div>
              {plan.description && <p className="landing-plan-desc">{plan.description}</p>}
              <ul className="feature-list">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <FaCheck className="check" /> {f}
                  </li>
                ))}
                <li>
                  <FaCheck className="check" /> Interests: {limitLabel(plan.monthlyInterestLimit)}/month
                </li>
                {plan.contactRequestAccess && (
                  <li>
                    <FaCheck className="check" /> Contact requests: {limitLabel(plan.monthlyContactRequestLimit)}/month
                  </li>
                )}
              </ul>
              <button className="btn-upgrade" onClick={(e) => { e.stopPropagation(); handleChoose(plan); }}>
                {plan.price > 0 ? "Choose Plan" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPlans;
