import React from "react";

// Shows a plan badge. Driven entirely by the backend's current-membership
// response, so an expired plan (backend falls back to FREE) never shows a
// misleading badge.
const MembershipBadge = ({ plan }) => {
  if (!plan || plan.code === "FREE") return null;
  return (
    <span className={`mem-badge mem-badge-${plan.code.toLowerCase()}`}>
      {plan.name} Member
    </span>
  );
};

export default MembershipBadge;
