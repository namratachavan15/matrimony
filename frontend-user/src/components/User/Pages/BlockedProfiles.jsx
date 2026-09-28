import React, { useEffect, useState } from "react";
import { FaBan, FaUnlock } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { FaGraduationCap, FaBriefcase } from "react-icons/fa";
import { blockService } from "../Services/blockService";
import { useToast } from "../Components/Toast/ToastContext";
import "./BlockedProfiles.css";

const backendURL = "http://localhost:5454/";

const BlockedProfiles = () => {
  const toast = useToast();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBlocked = async () => {
    setLoading(true);
    try {
      const res = await blockService.getMyBlocked(0, 50);
      setProfiles((res.data?.content ?? []).filter(Boolean));
    } catch (e) {
      toast.error("Could not load your blocked profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnblock = async (userId) => {
    try {
      await blockService.unblock(userId);
      setProfiles((prev) => prev.filter((p) => p.id !== userId));
      toast.info("Profile unblocked.");
    } catch (e) {
      toast.error("Could not unblock this profile.");
    }
  };

  return (
    <div className="blocked-page">
      <div className="blocked-header">
        <h1>Blocked Profiles</h1>
        <p>Profiles you've blocked won't see you in search or contact you.</p>
      </div>

      {loading ? (
        <div className="blocked-skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="blocked-skeleton-card" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="blocked-empty">
          <FaBan className="blocked-empty-icon" />
          <h3>No blocked profiles</h3>
          <p>Profiles you block from a profile card's "More" menu will appear here.</p>
        </div>
      ) : (
        <div className="blocked-grid">
          {profiles.map((p) => {
            const photoUrl = p.uprofile
              ? p.uprofile.startsWith("http")
                ? p.uprofile
                : `${backendURL}uploads/profile/${p.uprofile}`
              : "/default-user.png";

            return (
              <div key={p.id} className="blocked-card">
                <div className="blocked-card-image">
                  <img src={photoUrl} alt={p.uname} />
                </div>
                <div className="blocked-card-body">
                  <h3>{p.uname}</h3>
                  <div className="blocked-meta">
                    <span>{p.age ? `${p.age} yrs` : "Age N/A"}</span>
                  </div>
                  <div className="blocked-detail">
                    <HiLocationMarker /> <span>{p.cLocation || "Not specified"}</span>
                  </div>
                  <div className="blocked-detail">
                    <FaGraduationCap /> <span>{p.educationDetails || "Not specified"}</span>
                  </div>
                  <div className="blocked-detail">
                    <FaBriefcase /> <span>{p.currentWork || "Not specified"}</span>
                  </div>
                </div>
                <div className="blocked-card-actions">
                  <button className="blocked-unblock-btn" onClick={() => handleUnblock(p.id)}>
                    <FaUnlock /> Unblock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlockedProfiles;
