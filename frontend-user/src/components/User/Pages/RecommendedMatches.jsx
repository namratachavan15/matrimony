import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaRegStar, FaStar, FaGraduationCap, FaBriefcase, FaCheckCircle } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { recommendedMatchService } from "../Services/recommendedMatchService";
import { shortlistService } from "../Services/shortlistService";
import { interestService } from "../Services/interestService";
import { api } from "../Config/api";
import { useUserContext } from "../State/UserContext";
import { useToast } from "../Components/Toast/ToastContext";
import ProfileModal from "./ProfileModal";
import "./RecommendedMatches.css";

const backendURL = "http://localhost:5454/";

// Part 11 (Recommended Matches). The list + compatibility % come entirely
// from the backend (RecommendedMatchServiceImpl) -- this page only renders
// what it's given and wires up the same Like/Shortlist/Express Interest
// actions already used elsewhere (AllUsers.jsx, ShortlistedProfiles.jsx).
const RecommendedMatches = () => {
  const { currentUser, users } = useUserContext();
  const toast = useToast();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [likedIds, setLikedIds] = useState(new Set());
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [interestStatusMap, setInterestStatusMap] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadRecommendations = async (p) => {
    setLoading(true);
    try {
      const res = await recommendedMatchService.getRecommendations(p, 12);
      setProfiles(res.data?.content ?? []);
      setTotalPages(res.data?.totalPages ?? 1);
    } catch (e) {
      toast.error("Could not load recommended matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [likedRes, shortlistRes, interestRes] = await Promise.allSettled([
          api.get("/api/likes/my-liked"),
          shortlistService.getMyIds(),
          interestService.getSentStatusMap(),
        ]);
        if (likedRes.status === "fulfilled") setLikedIds(new Set(likedRes.value.data || []));
        if (shortlistRes.status === "fulfilled") setShortlistedIds(new Set(shortlistRes.value.data || []));
        if (interestRes.status === "fulfilled") setInterestStatusMap(interestRes.value.data || {});
      } catch (e) {
        // non-fatal -- buttons just fall back to their default state
      }
    };
    loadMeta();
  }, [profiles]);

  const handleLike = async (userId) => {
    if (!currentUser?.id) return toast.info("Please login to like profiles.");
    setBusyId(userId);
    try {
      const res = await api.post("/api/likes/toggle", null, { params: { likedUserId: userId } });
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (res.data) next.add(userId);
        else next.delete(userId);
        return next;
      });
    } catch (e) {
      toast.error("Could not update like.");
    } finally {
      setBusyId(null);
    }
  };

  const handleShortlist = async (userId) => {
    if (!currentUser?.id) return toast.info("Please login to shortlist profiles.");
    setBusyId(userId);
    try {
      const res = await shortlistService.toggle(userId);
      setShortlistedIds((prev) => {
        const next = new Set(prev);
        if (res.data) next.add(userId);
        else next.delete(userId);
        return next;
      });
      toast.success(res.data ? "Added to shortlist." : "Removed from shortlist.");
    } catch (e) {
      toast.error("Could not update shortlist.");
    } finally {
      setBusyId(null);
    }
  };

  const handleExpressInterest = async (userId) => {
    if (!currentUser?.id) return toast.info("Please login to express interest.");
    setBusyId(userId);
    try {
      await interestService.send(userId);
      setInterestStatusMap((prev) => ({ ...prev, [userId]: "PENDING" }));
      toast.success("Interest sent.");
    } catch (e) {
      const status = e?.response?.status;
      toast.error(status === 409 ? "You've already sent interest to this profile." : "Could not send interest.");
    } finally {
      setBusyId(null);
    }
  };

  const openProfile = (userId) => {
    const full = (users || []).find((u) => u.id === userId);
    if (full) setSelectedUser(full);
    else toast.info("Profile details are loading -- please try again in a moment.");
  };

  const interestLabel = (status) => {
    if (status === "PENDING") return "Interest Sent";
    if (status === "ACCEPTED") return "Accepted";
    if (status === "DECLINED") return "Declined";
    return "Express Interest";
  };

  return (
    <div className="rm-page">
      <div className="rm-header">
        <FaHeart className="rm-header-icon" />
        <div>
          <h1>Recommended Matches</h1>
          <p>Based on your Partner Preferences and profile -- real compatibility, not random.</p>
        </div>
      </div>

      {loading ? (
        <div className="rm-skeleton-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rm-skeleton-card" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="rm-empty">
          <FaHeart className="rm-empty-icon" />
          <h3>No recommendations right now</h3>
          <p>
            Try setting your <a href="/partner-preferences">Partner Preferences</a>, or check back later as more
            profiles join.
          </p>
        </div>
      ) : (
        <>
          <div className="rm-grid">
            {profiles.map((p) => {
              const photoUrl = p.uprofile
                ? p.uprofile.startsWith("http")
                  ? p.uprofile
                  : `${backendURL}uploads/profile/${p.uprofile}`
                : "/default-user.png";
              const liked = likedIds.has(p.id);
              const shortlisted = shortlistedIds.has(p.id);
              const interestStatus = interestStatusMap[p.id];
              const busy = busyId === p.id;

              return (
                <div key={p.id} className="rm-card">
                  <div className="rm-compat-badge">{p.compatibilityPercentage}% Match</div>
                  <div className="rm-card-image" onClick={() => openProfile(p.id)}>
                    <img src={photoUrl} alt={p.uname} />
                  </div>
                  <div className="rm-card-body">
                    <h3>
                      {p.uname}
                      {Number(p.vstatus) === 1 && (
                        <span className="mini-verified-badge" title="Verified Profile">
                          <FaCheckCircle /> Verified
                        </span>
                      )}
                    </h3>
                    <div className="rm-meta">{p.age ? `${p.age} yrs` : "Age N/A"}</div>
                    <div className="rm-detail">
                      <HiLocationMarker /> <span>{p.cLocation || "Not specified"}</span>
                    </div>
                    <div className="rm-detail">
                      <FaGraduationCap /> <span>{p.educationDetails || "Not specified"}</span>
                    </div>
                    <div className="rm-detail">
                      <FaBriefcase /> <span>{p.currentWork || "Not specified"}</span>
                    </div>
                  </div>
                  <div className="rm-card-actions">
                    <button className="rm-icon-btn" disabled={busy} onClick={() => handleLike(p.id)} title="Like">
                      {liked ? <FaHeart className="rm-liked" /> : <FaRegHeart />}
                    </button>
                    <button className="rm-icon-btn" disabled={busy} onClick={() => handleShortlist(p.id)} title="Shortlist">
                      {shortlisted ? <FaStar className="rm-shortlisted" /> : <FaRegStar />}
                    </button>
                    <button
                      className={`rm-interest-btn ${interestStatus ? "rm-interest-" + interestStatus.toLowerCase() : ""}`}
                      disabled={busy || !!interestStatus}
                      onClick={() => handleExpressInterest(p.id)}
                    >
                      {interestLabel(interestStatus)}
                    </button>
                    <button className="rm-view-btn" onClick={() => openProfile(p.id)}>
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="rm-pagination">
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedUser && <ProfileModal user={selectedUser} backendURL={backendURL} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default RecommendedMatches;
