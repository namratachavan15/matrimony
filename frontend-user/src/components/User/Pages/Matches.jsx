import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaBriefcase, FaCommentDots, FaCheckCircle } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { matchService } from "../Services/matchService";
import { useUserContext } from "../State/UserContext";
import { useToast } from "../Components/Toast/ToastContext";
import ProfileModal from "./ProfileModal";
import "./Matches.css";

const backendURL = "http://localhost:5454/";

const Matches = () => {
  const { users } = useUserContext();
  const toast = useToast();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await matchService.getMy(0, 50);
        setMatches((res.data?.content ?? []).filter((m) => m.profile));
      } catch (e) {
        toast.error("Could not load your matches.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewProfile = (userId) => {
    const full = (users || []).find((u) => u.id === userId);
    if (full) setSelectedUser(full);
    else toast.info("Profile details are loading — please try again in a moment.");
  };

  // Part 5, item 16: a mutual match always satisfies the chat business rule
  // (see ChatServiceImpl#canChat on the backend), so this can go straight to
  // the conversation instead of the old "coming soon" placeholder.
  const handleContact = (userId) => {
    navigate(`/messages?with=${userId}`);
  };

  return (
    <div className="matches-page">
      <div className="matches-header">
        <h1>My Matches</h1>
        <p>Profiles where interest was mutual.</p>
      </div>

      {loading ? (
        <div className="matches-skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="matches-skeleton-card" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="matches-empty">
          <span className="matches-empty-icon">💞</span>
          <h3>No matches yet</h3>
          <p>Express interest in profiles you like — when they accept, they'll show up here.</p>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((m) => {
            const p = m.profile;
            const photoUrl = p.uprofile
              ? p.uprofile.startsWith("http")
                ? p.uprofile
                : `${backendURL}uploads/profile/${p.uprofile}`
              : "/default-user.png";

            return (
              <div key={m.matchId} className="match-card">
                <div className="match-badge">❤️ It's a Match!</div>
                <div className="match-card-image">
                  <img src={photoUrl} alt={p.uname} />
                </div>
                <div className="match-card-body">
                  <h3>
                    {p.uname}
                    {Number(p.vstatus) === 1 && (
                      <span className="mini-verified-badge" title="Verified Profile">
                        <FaCheckCircle /> Verified
                      </span>
                    )}
                  </h3>
                  <div className="match-meta">{p.age ? `${p.age} yrs` : "Age N/A"}</div>
                  <div className="match-detail">
                    <HiLocationMarker /> <span>{p.cLocation || "Not specified"}</span>
                  </div>
                  <div className="match-detail">
                    <FaGraduationCap /> <span>{p.educationDetails || "Not specified"}</span>
                  </div>
                  <div className="match-detail">
                    <FaBriefcase /> <span>{p.currentWork || "Not specified"}</span>
                  </div>
                </div>
                <div className="match-card-actions">
                  <button className="match-view-btn" onClick={() => handleViewProfile(p.id)}>
                    View Profile
                  </button>
                  <button className="match-contact-btn" onClick={() => handleContact(p.id)}>
                    <FaCommentDots /> Contact
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

export default Matches;
