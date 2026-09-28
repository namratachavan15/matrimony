import React, { useEffect, useState } from "react";
import { FaHeart, FaRegStar, FaStar, FaGraduationCap, FaBriefcase, FaCheckCircle } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { shortlistService } from "../Services/shortlistService";
import { api } from "../Config/api";
import { useUserContext } from "../State/UserContext";
import { useToast } from "../Components/Toast/ToastContext";
import ProfileModal from "./ProfileModal";
import "./ShortlistedProfiles.css";

const backendURL = "http://localhost:5454/";

const ShortlistedProfiles = () => {
  const { users } = useUserContext();
  const toast = useToast();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);

  const loadShortlist = async () => {
    setLoading(true);
    try {
      const res = await shortlistService.getMyShortlist(0, 50);
      setProfiles((res.data?.content ?? []).filter(Boolean));
    } catch (e) {
      toast.error("Could not load your shortlisted profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShortlist();
    api.get("/api/likes/my-liked").then((res) => setLikedIds(new Set(res.data || []))).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (userId) => {
    try {
      await shortlistService.toggle(userId);
      setProfiles((prev) => prev.filter((p) => p.id !== userId));
      toast.info("Removed from shortlist.");
    } catch (e) {
      toast.error("Could not remove profile from shortlist.");
    }
  };

  const handleLike = async (userId) => {
    try {
      const res = await api.post("/api/likes/toggle", null, { params: { likedUserId: userId } });
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (res.data) next.add(userId);
        else next.delete(userId);
        return next;
      });
      toast.success(res.data ? "Profile liked." : "Like removed.");
    } catch (e) {
      toast.error("Could not update like.");
    }
  };

  const handleViewProfile = (userId) => {
    const full = (users || []).find((u) => u.id === userId);
    if (full) {
      setSelectedUser(full);
    } else {
      toast.info("Profile details are loading — please try again in a moment.");
    }
  };

  return (
    <div className="shortlist-page">
      <div className="shortlist-header">
        <h1>My Shortlisted Profiles</h1>
        <p>Profiles you've saved to revisit later.</p>
      </div>

      {loading ? (
        <div className="shortlist-skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shortlist-skeleton-card" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="shortlist-empty">
          <FaRegStar className="shortlist-empty-icon" />
          <h3>No shortlisted profiles yet</h3>
          <p>Tap the star icon on any profile to save it here.</p>
        </div>
      ) : (
        <div className="shortlist-grid">
          {profiles.map((p) => {
            const photoUrl = p.uprofile
              ? p.uprofile.startsWith("http")
                ? p.uprofile
                : `${backendURL}uploads/profile/${p.uprofile}`
              : "/default-user.png";
            const isLiked = likedIds.has(p.id);

            return (
              <div key={p.id} className="shortlist-card">
                <div className="shortlist-card-image">
                  <img src={photoUrl} alt={p.uname} />
                  <button
                    className="shortlist-star-btn"
                    title="Remove from shortlist"
                    onClick={() => handleRemove(p.id)}
                  >
                    <FaStar />
                  </button>
                </div>
                <div className="shortlist-card-body">
                  <h3>
                    {p.uname}
                    {Number(p.vstatus) === 1 && (
                      <span className="mini-verified-badge" title="Verified Profile">
                        <FaCheckCircle /> Verified
                      </span>
                    )}
                  </h3>
                  <div className="shortlist-meta">
                    <span>{p.age ? `${p.age} yrs` : "Age N/A"}</span>
                  </div>
                  <div className="shortlist-detail">
                    <HiLocationMarker /> <span>{p.cLocation || "Not specified"}</span>
                  </div>
                  <div className="shortlist-detail">
                    <FaGraduationCap /> <span>{p.educationDetails || "Not specified"}</span>
                  </div>
                  <div className="shortlist-detail">
                    <FaBriefcase /> <span>{p.currentWork || "Not specified"}</span>
                  </div>
                </div>
                <div className="shortlist-card-actions">
                  <button
                    className={`shortlist-like-btn ${isLiked ? "liked" : ""}`}
                    onClick={() => handleLike(p.id)}
                  >
                    <FaHeart /> {isLiked ? "Liked" : "Like"}
                  </button>
                  <button className="shortlist-view-btn" onClick={() => handleViewProfile(p.id)}>
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedUser && (
        <ProfileModal user={selectedUser} backendURL={backendURL} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default ShortlistedProfiles;
