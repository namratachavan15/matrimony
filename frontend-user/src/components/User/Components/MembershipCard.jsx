import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";
import { membershipService, formatDate } from "../Services/membershipService";
import MembershipBadge from "./MembershipBadge";
import "./MembershipCard.css";

const Bar = ({ label, used, limit }) => {
  const unlimited = limit === null || limit === undefined;
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
  return (
    <div className="mc-bar">
      <div className="mc-bar-top">
        <span>{label}</span>
        <span>{unlimited ? `${used} / Unlimited` : `${used} / ${limit}`}</span>
      </div>
      <div className="mc-track"><div className="mc-fill" style={{ width: `${unlimited ? 6 : pct}%` }} /></div>
    </div>
  );
};

// Dashboard widget: every value comes from GET /api/membership/current.
const MembershipCard = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    membershipService.getCurrent()
      .then((res) => setCurrent(res.data))
      .catch(() => setFailed(true));
  }, []);

  if (failed || !current) return null;
  const plan = current.plan;
  const isFree = plan.code === "FREE";

  return (
    <div className={`membership-card ${isFree ? "is-free" : ""}`}>
      <div className="mc-main">
        <span className="mc-label">Your Membership</span>
        <h3>
          {plan.premiumBadge && <FaCrown className="mc-crown" />} {isFree ? "FREE PLAN" : plan.name.toUpperCase()}
        </h3>
        <MembershipBadge plan={plan} />
        {isFree ? (
          <p>Upgrade to unlock more features.</p>
        ) : (
          <p>
            Active until <strong>{formatDate(current.endDate)}</strong> · {current.daysRemaining} days remaining
          </p>
        )}
      </div>
      <div className="mc-usage">
        <Bar label="Interests" used={current.interestsUsedThisMonth} limit={plan.monthlyInterestLimit} />
        {plan.contactRequestAccess && (
          <Bar label="Contact Requests" used={current.contactRequestsUsedThisMonth} limit={plan.monthlyContactRequestLimit} />
        )}
      </div>
      <div className="mc-actions">
        <button className="mc-primary" onClick={() => navigate("/membership")}>
          {isFree ? "View Plans" : "Upgrade Plan"}
        </button>
        {!isFree && (
          <button className="mc-secondary" onClick={() => navigate("/membership/history")}>View Membership</button>
        )}
      </div>
    </div>
  );
};

export default MembershipCard;
