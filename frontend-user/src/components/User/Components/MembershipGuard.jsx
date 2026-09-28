import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import "./MembershipGuard.css";

/**
 * Wrap any premium-only UI in this. `allowed` should come from the current
 * membership (e.g. current.plan.advancedSearch). This is a convenience/UX
 * layer only -- the backend (MembershipLimitService) is the real gate, so
 * this component never needs to be "trusted" for security.
 *
 * <MembershipGuard allowed={current?.plan?.advancedSearch}>
 *   <AdvancedSearchPanel />
 * </MembershipGuard>
 */
const MembershipGuard = ({ allowed, featureName = "this feature", children }) => {
  const navigate = useNavigate();

  if (allowed) return children;

  return (
    <div className="membership-guard">
      <FaLock className="membership-guard-icon" />
      <p>Upgrade your membership to access {featureName}.</p>
      <button onClick={() => navigate("/membership")}>View Plans</button>
    </div>
  );
};

export default MembershipGuard;
