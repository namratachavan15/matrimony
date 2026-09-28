

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileModal.css";

import { useToast } from "../Components/Toast/ToastContext";
import { interestService } from "../Services/interestService";
import { shortlistService } from "../Services/shortlistService";
import { blockService } from "../Services/blockService";
import { privacyService } from "../Services/privacyService";
import { contactService } from "../Services/contactService";
import { messageService } from "../Services/messageService";
import { useUserContext } from "../State/UserContext";
import { api } from "../Config/api";
import ReportProfileModal from "../Components/ReportProfileModal";

import {
  FaHeart,
  FaRegStar,
  FaStar,
  FaPaperPlane,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaGraduationCap,
  FaLeaf,
  FaFileAlt,
  FaHome,
  FaBuilding,
  FaStarOfLife,
  FaExclamationTriangle,
  FaPhone,
  FaMobileAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowsAlt,
  FaMinus,
  FaPlus,
  FaRedo,
  FaTimes,
  FaWeight,
  FaRing,
  FaTint,
  FaBriefcase,
  FaMoneyBillWave,
  FaIdCard,
  FaUserFriends,
  FaGlobeAsia,
  FaPrayingHands,
  FaFire,
  FaBalanceScale,
  FaMoon,
  FaScroll,
  FaEllipsisV,
  FaFlag,
  FaBan,
  FaUnlock,
  FaShieldAlt,
  FaAddressCard,
  FaCommentDots,} from "react-icons/fa";

export default function ProfileModal({
  user,
  backendURL = "http://localhost:5454/",
  onClose,
  casts = [],
  subcasts = [],
  gans = [],
  gotras = [],
  nadis = [],
  nakshtras = [],
  rashis = [],
}) {
  const toast = useToast();
  const navigate = useNavigate();
  const { currentUser } = useUserContext();

  const [activeTab, setActiveTab] = useState("personal");
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Like / Shortlist / Interest state
  const [isLiked, setIsLiked] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [interestStatus, setInterestStatus] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);

  // Contact Request / Chat state (Part 5, items 15 & 16)
  const [contactRequestStatus, setContactRequestStatus] = useState(null);
  const [contactRequestId, setContactRequestId] = useState(null);
  const [contactBusy, setContactBusy] = useState(false);
  const [canChat, setCanChat] = useState(false);

  // Report / Block (Part 6 & 7)
  const [isBlocked, setIsBlocked] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Privacy (Part 9): what this viewer is allowed to see of the profile
  // owner's contact details. Defaults closed (privacy-safe) until loaded.
  const [contactVisibility, setContactVisibility] = useState({ showMobile: false, showEmail: false });

  /*
   * Load Like / Shortlist / Interest state
   */
  useEffect(() => {
    let cancelled = false;

    const loadInteractionState = async () => {
      if (!currentUser?.id || !user?.id) return;

      try {
        const [likedRes, shortlistRes, interestRes, blockRes, contactVisRes, contactReqRes, canChatRes] =
          await Promise.allSettled([
            api.get("/api/likes/my-liked"),
            shortlistService.getMyIds(),
            interestService.getStatus(user.id),
            blockService.getStatus(user.id),
            privacyService.getContactVisibility(user.id),
            contactService.getStatus(user.id),
            messageService.canChat(user.id),
          ]);

        if (cancelled) return;

        if (likedRes.status === "fulfilled") {
          setIsLiked(
            (likedRes.value.data || []).includes(user.id)
          );
        }

        if (shortlistRes.status === "fulfilled") {
          setIsShortlisted(
            (shortlistRes.value.data || []).includes(user.id)
          );
        }

        if (
          interestRes.status === "fulfilled" &&
          interestRes.value.data
        ) {
          setInterestStatus(interestRes.value.data.status);
        } else {
          setInterestStatus(null);
        }

        if (blockRes.status === "fulfilled") {
          setIsBlocked(!!blockRes.value.data?.blocked);
        }

        if (contactVisRes.status === "fulfilled") {
          setContactVisibility({
            showMobile: !!contactVisRes.value.data?.showMobile,
            showEmail: !!contactVisRes.value.data?.showEmail,
          });
        } else {
          setContactVisibility({ showMobile: false, showEmail: false });
        }

        if (contactReqRes.status === "fulfilled" && contactReqRes.value.data) {
          setContactRequestStatus(contactReqRes.value.data.status);
          setContactRequestId(contactReqRes.value.data.requestId);
        } else {
          setContactRequestStatus(null);
          setContactRequestId(null);
        }

        if (canChatRes.status === "fulfilled") {
          setCanChat(!!canChatRes.value.data?.canChat);
        } else {
          setCanChat(false);
        }
      } catch (e) {
        // Non-fatal
      }
    };

    loadInteractionState();

    return () => {
      cancelled = true;
    };
  }, [user?.id, currentUser?.id]);

  /*
   * Like
   */
  const handleLikeToggle = async () => {
    if (!currentUser?.id) {
      toast.info("Please login to like profiles.");
      return;
    }

    try {
      const res = await api.post(
        "/api/likes/toggle",
        null,
        {
          params: {
            likedUserId: user.id,
          },
        }
      );

      setIsLiked(res.data);

      toast.success(
        res.data
          ? "Profile liked."
          : "Like removed."
      );
    } catch (e) {
      toast.error("Could not update like.");
    }
  };

  /*
   * Shortlist
   */
  const handleShortlistToggle = async () => {
    if (!currentUser?.id) {
      toast.info("Please login to shortlist profiles.");
      return;
    }

    try {
      const res = await shortlistService.toggle(user.id);

      setIsShortlisted(res.data);

      toast.success(
        res.data
          ? "Added to shortlist."
          : "Removed from shortlist."
      );
    } catch (e) {
      toast.error("Could not update shortlist.");
    }
  };

  /*
   * Express Interest
   */
  const handleExpressInterest = async () => {
    if (!currentUser?.id) {
      toast.info("Please login to express interest.");
      return;
    }

    if (currentUser.id === user.id) {
      toast.info(
        "You cannot express interest in your own profile."
      );
      return;
    }

    if (interestStatus === "PENDING") {
      toast.info(
        "Interest already sent — waiting for a response."
      );
      return;
    }

    if (interestStatus === "ACCEPTED") {
      toast.info(
        "You're already matched with this profile!"
      );
      return;
    }

    setActionBusy(true);

    try {
      await interestService.send(user.id);

      setInterestStatus("PENDING");

      toast.success(
        "Interest expressed successfully!"
      );
    } catch (error) {
      const detail = error?.response?.data;

      if (
        error?.response?.status === 409 &&
        detail?.detail
      ) {
        const status = String(
          detail.detail
        ).split(":").pop();

        setInterestStatus(status);

        toast.info(
          `Interest is already ${status.toLowerCase()}.`
        );
      } else {
        toast.error(
          "Could not send interest. Please try again."
        );
      }
    } finally {
      setActionBusy(false);
    }
  };

  /*
   * Request Contact (Part 5, item 15)
   */
  const handleRequestContact = async () => {
    if (!currentUser?.id) {
      toast.info("Please login to request contact details.");
      return;
    }
    if (currentUser.id === user.id) {
      toast.info("This is your own profile.");
      return;
    }
    if (contactRequestStatus === "PENDING") {
      toast.info("Contact request already sent — waiting for a response.");
      return;
    }
    if (contactRequestStatus === "ACCEPTED") {
      toast.info("Contact request already accepted.");
      return;
    }

    setContactBusy(true);
    try {
      const res = await contactService.send(user.id);
      setContactRequestStatus("PENDING");
      setContactRequestId(res.data?.id ?? null);
      toast.success("Contact request sent!");
    } catch (error) {
      const detail = error?.response?.data;
      if (error?.response?.status === 409 && typeof detail === "string" && detail.includes(":")) {
        const status = detail.split(":").pop();
        setContactRequestStatus(status);
        toast.info(`Contact request is already ${status.toLowerCase()}.`);
      } else {
        toast.error(typeof detail === "string" ? detail : "Could not send contact request. Please try again.");
      }
    } finally {
      setContactBusy(false);
    }
  };

  /*
   * Message (Part 5, item 16) -- only reachable once canChat is true
   * (mutual match / accepted interest / accepted contact request).
   */
  const handleMessage = () => {
    if (!canChat) {
      toast.info("You can message this profile once you've matched, or an interest / contact request is accepted.");
      return;
    }
    navigate(`/messages?with=${user.id}`);
  };

  /*
   * Block / Unblock
   */
  const handleBlockToggle = async () => {
    if (!currentUser?.id) {
      toast.info("Please login to block profiles.");
      return;
    }
    setShowMoreMenu(false);
    try {
      if (isBlocked) {
        await blockService.unblock(user.id);
        setIsBlocked(false);
        toast.info("Profile unblocked.");
      } else {
        await blockService.block(user.id);
        setIsBlocked(true);
        toast.success("Profile blocked. You won't see each other in searches or matches anymore.");
      }
    } catch (e) {
      toast.error("Could not update block status.");
    }
  };

  const handleOpenReport = () => {
    setShowMoreMenu(false);
    setShowReportModal(true);
  };

  /*
   * If no user
   */
  if (!user) {
    return null;
  }

  const other = user.other || {};

  console.log("user", user);

  /*
   * Profile photo
   */
  const photoUrl = user.uprofile
    ? user.uprofile.startsWith("http")
      ? user.uprofile
      : `${backendURL}uploads/profile/${user.uprofile}`
    : "/mnt/data/17.png";

  /*
   * Image Zoom
   */
  const openImageModal = () => {
    setShowImageModal(true);
    setZoomLevel(1);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel((prev) => prev + 0.25);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel((prev) => prev - 0.25);
    }
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  /*
   * ESC key
   */
  useEffect(() => {
    const handleEscKey = (event) => {
      if (
        event.key === "Escape" &&
        showImageModal
      ) {
        closeImageModal();
      }
    };

    if (showImageModal) {
      document.addEventListener(
        "keydown",
        handleEscKey
      );

      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscKey
      );

      document.body.style.overflow = "auto";
    };
  }, [showImageModal]);

  /*
   * Format Date
   */
  const formatDate = (d) => {
    if (!d) return "N/A";

    try {
      return new Date(d).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return d;
    }
  };

  /*
   * Caste
   */
  const getCasteName = () => {
    const ctid = user.ctid;

    if (
      !ctid ||
      !Array.isArray(casts) ||
      casts.length === 0
    ) {
      return "Not specified";
    }

    const castObj = casts.find(
      (c) =>
        String(c.id) === String(ctid)
    );

    return (
      castObj?.cast ||
      castObj?.castName ||
      castObj?.name ||
      "Not specified"
    );
  };

  /*
   * Sub Caste
   */
  const getSubcastName = () => {
    const sctid = user.sctid;

    if (
      !sctid ||
      !Array.isArray(subcasts) ||
      subcasts.length === 0
    ) {
      return "Not specified";
    }

    const sub = subcasts.find(
      (sc) =>
        String(
          sc.sctid ?? sc.id
        ) === String(sctid)
    );

    return (
      sub?.subcastName ||
      sub?.subcast ||
      sub?.name ||
      "Not specified"
    );
  };

  /*
   * Rashi
   */
  const getRashiName = () => {
    if (other.ras) return other.ras;

    const rid =
      other.rsid ??
      other.rid ??
      other.rashiId;

    if (
      !rid ||
      !Array.isArray(rashis) ||
      rashis.length === 0
    ) {
      return "N/A";
    }

    const r = rashis.find(
      (x) =>
        String(x.id) === String(rid)
    );

    return (
      r?.ras ||
      r?.name ||
      r?.rashiName ||
      "N/A"
    );
  };

  /*
   * Gotra
   */
  const getGotraName = () => {
    if (other.gotra) return other.gotra;

    const gid =
      other.gid ??
      other.gotraId;

    if (
      !gid ||
      !Array.isArray(gotras) ||
      gotras.length === 0
    ) {
      return "N/A";
    }

    const g = gotras.find(
      (x) =>
        String(x.id) === String(gid)
    );

    return (
      g?.gotra ||
      g?.gotraName ||
      "N/A"
    );
  };

  /*
   * Nakshatra
   */
  const getNakshtraName = () => {
    if (other.nakshtra) {
      return other.nakshtra;
    }

    const nkid =
      other.nkid ??
      other.nakshtraId;

    if (
      !nkid ||
      !Array.isArray(nakshtras) ||
      nakshtras.length === 0
    ) {
      return "N/A";
    }

    const n = nakshtras.find(
      (x) =>
        String(x.id) === String(nkid)
    );

    return (
      n?.nakshtra ||
      n?.nakshtraName ||
      "N/A"
    );
  };

  /*
   * Nadi
   */
  const getNadiName = () => {
    if (other.nadi) return other.nadi;

    const nid =
      other.ndid ??
      other.nid ??
      other.nadiId;

    if (
      !nid ||
      !Array.isArray(nadis) ||
      nadis.length === 0
    ) {
      return "N/A";
    }

    const n = nadis.find(
      (x) =>
        String(x.id) === String(nid)
    );

    return (
      n?.nadi ||
      n?.nadiName ||
      "N/A"
    );
  };

  /*
   * Gan
   */
  const getGanName = () => {
    if (other.gan) return other.gan;

    const ganid =
      other.gnid ??
      other.gid ??
      other.ganId;

    if (
      !ganid ||
      !Array.isArray(gans) ||
      gans.length === 0
    ) {
      return "N/A";
    }

    const g = gans.find(
      (x) =>
        String(x.id) === String(ganid)
    );

    return (
      g?.gan ||
      g?.ganName ||
      "N/A"
    );
  };

  /*
   * Contact availability
   */
  const isOwnProfile = currentUser?.id === user.id;
  // Part 9 (Privacy): mobile/whatsapp/alt-mobile are gated by the profile
  // owner's showMobile setting, email by showEmail -- always visible on your
  // own profile. Address/location aren't part of that toggle in the spec, so
  // they're left as-is.
  const contactUnlocked = isOwnProfile || contactRequestStatus === "ACCEPTED";
  const canSeeMobile = isOwnProfile || (contactVisibility.showMobile && contactUnlocked);
  const canSeeEmail = isOwnProfile || (contactVisibility.showEmail && contactUnlocked);

  const hasContactDetails =
    (canSeeMobile && (user.umobile || user.altMobile || user.whatsappno)) ||
    (canSeeEmail && user.email) ||
    user.address ||
    user.cLocation;

  /*
   * Status
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "#10b981";

      case 0:
        return "#ef4444";

      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Active";

      case 0:
        return "Inactive";

      default:
        return "Unknown";
    }
  };

  /*
   * Personal Tab
   */
  const PersonalTab = () => (
    <div className="tab-content-inner">
      <div className="cards-grid">

        {/* Personal Details */}
        <div className="info-card">
          <div className="card-header">
            <div className="card-icon">
              <FaUser />
            </div>

            <h3>Personal Details</h3>
          </div>

          <div className="card-content">
            <div className="info-grid">

              <div className="info-item">
                <label>Birth Details</label>

                <span>
                  {formatDate(user.dob)}

                  {user.dobTime &&
                    ` at ${user.dobTime}`}
                </span>
              </div>

              <div className="info-item">
                <label>Birth Place</label>

                <span>
                  {user.birthplace || "N/A"}
                </span>
              </div>

              <div className="info-item">
                <label>Weight</label>

                <span>
                  {user.weight
                    ? `${user.weight} Kg`
                    : "N/A"}
                </span>
              </div>

              <div className="info-item">
                <label>Marriage Type</label>

                <span>
                  {user.marriageType || "N/A"}
                </span>
              </div>

              <div className="info-item">
                <label>Blood Group</label>

                <span
                  className={`blood-group ${
                    user.bloodgroup
                      ? "has-value"
                      : ""
                  }`}
                >
                  {user.bloodgroup || "N/A"}
                </span>
              </div>

              <div className="info-item">
                <label>Caste</label>

                <span>
                  {getCasteName()}
                </span>
              </div>

              <div className="info-item">
                <label>Sub Caste</label>

                <span>
                  {getSubcastName()}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Education & Career */}
        <div className="info-card">
          <div className="card-header">
            <div className="card-icon">
              <FaGraduationCap />
            </div>

            <h3>Education & Career</h3>
          </div>

          <div className="card-content">
            <div className="info-grid">

              <div className="info-item">
                <label>Profession</label>

                <span>
                  {user.currentWork || "N/A"}
                </span>
              </div>

              <div className="info-item">
                <label>Work Location</label>

                <span>
                  {user.cLocation || "N/A"}
                </span>
              </div>

              <div className="info-item">
                <label>Annual Income</label>

                <span className="income-value">
                  {user.fincome || "N/A"}
                </span>
              </div>

              <div className="info-item">
                <label>Education</label>

                <span>
                  {user.educationDetails || "N/A"}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="info-card">
          <div className="card-header">
            <div className="card-icon">
              <FaLeaf />
            </div>

            <h3>Lifestyle</h3>
          </div>

          <div className="card-content">
            <div className="lifestyle-details">

              {user.diet && (
                <div className="lifestyle-item">
                  <label>Diet</label>

                  <span className="lifestyle-tag diet">
                    {user.diet}
                  </span>
                </div>
              )}

              {user.drink && (
                <div className="lifestyle-item">
                  <label>Drink</label>

                  <span className="lifestyle-tag drink">
                    {user.drink}
                  </span>
                </div>
              )}

              {user.smoking && (
                <div className="lifestyle-item">
                  <label>Smoking</label>

                  <span className="lifestyle-tag smoking">
                    {user.smoking}
                  </span>
                </div>
              )}

              {user.specs && (
                <div className="lifestyle-item">
                  <label>Spectacles</label>

                  <span className="lifestyle-tag specs">
                    {user.specs}
                  </span>
                </div>
              )}

              {!user.diet &&
                !user.drink &&
                !user.smoking &&
                !user.specs && (
                  <div className="no-lifestyle-info">
                    <span>
                      No lifestyle information available
                    </span>
                  </div>
                )}

            </div>
          </div>
        </div>

        {/* Extra Information */}
        {(user.otherinfo ||
          user.expectation ||
          user.remark) && (
          <div className="info-card">
            <div className="card-header">
              <div className="card-icon">
                <FaFileAlt />
              </div>

              <h3>Extra Information</h3>
            </div>

            <div className="card-content">
              <div className="info-grid">

                {user.otherinfo && (
                  <div className="info-item">
                    <label>Other Info</label>

                    <span>
                      {user.otherinfo}
                    </span>
                  </div>
                )}

                {user.expectation && (
                  <div className="info-item">
                    <label>Expectation</label>

                    <span>
                      {user.expectation}
                    </span>
                  </div>
                )}

                {user.remark && (
                  <div className="info-item">
                    <label>Remark</label>

                    <span>
                      {user.remark}
                    </span>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  /*
   * Family Tab
   */
  const FamilyTab = () => (
    <div className="tab-content-inner">
      <div className="cards-grid">

        {user.family ? (
          <>

            {/* Family Details */}
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon">
                  <FaHome />
                </div>

                <h3>Family Details</h3>
              </div>

              <div className="card-content">
                <div className="family-grid">

                  <div className="family-member">
                    <div className="member-role">
                      Father
                    </div>

                    <div className="member-name">
                      {user.family.father || "N/A"}
                    </div>

                    <div className="member-role">
                      Father Occupation
                    </div>

                    <div className="member-occupation">
                      {user.family.fatherOccupation ||
                        "N/A"}
                    </div>
                  </div>

                  <div className="family-member">
                    <div className="member-role">
                      Mother
                    </div>

                    <div className="member-name">
                      {user.family.mother || "N/A"}
                    </div>

                    <div className="member-role">
                      Mother Occupation
                    </div>

                    <div className="member-occupation">
                      {user.family.motherOccupation ||
                        "N/A"}
                    </div>
                  </div>

                  <div className="family-stats">

                    <div className="sibling-count">
                      <span className="count">
                        {user.family.brother || 0}
                      </span>

                      <span>
                        Brothers
                      </span>
                    </div>

                    <div className="sibling-count">
                      <span className="count">
                        {user.family.sister || 0}
                      </span>

                      <span>
                        Sisters
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* Property Details */}
            {(user.family.propertyDetails ||
              user.family.otherDetails) && (
              <div className="info-card">

                <div className="card-header">
                  <div className="card-icon">
                    <FaBuilding />
                  </div>

                  <h3>Property Details</h3>
                </div>

                <div className="card-content">
                  <div className="info-grid">

                    {user.family.propertyDetails && (
                      <div className="info-item">
                        <label>
                          Property Details
                        </label>

                        <span>
                          {user.family.propertyDetails}
                        </span>
                      </div>
                    )}

                    {user.family.otherDetails && (
                      <div className="info-item">
                        <label>
                          Other Family Details
                        </label>

                        <span>
                          {user.family.otherDetails}
                        </span>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            )}

          </>
        ) : (
          <div className="no-data-card">

            <div className="card-icon">
              <FaHome />
            </div>

            <h3>
              No Family Information Available
            </h3>

            <p>
              Family details have not been added
              to this profile.
            </p>

          </div>
        )}

      </div>
    </div>
  );

  /*
   * Astrology Tab
   */
  const AstrologyTab = () => (
    <div className="tab-content-inner">
      <div className="cards-grid">

        {user.other ? (
          <>

            {/* Astrology Details */}
            <div className="info-card astrology-card">

              <div className="card-header">
                <div className="card-icon">
                  <FaStar />
                </div>

                <h3>Astrology Details</h3>
              </div>

              <div className="card-content">
                <div className="astrology-grid">

                  <div className="astrology-item">
                    <div className="planet-icon">
                      <FaStarOfLife />
                    </div>

                    <div className="astrology-info">
                      <label>Rashi</label>

                      <span>
                        {getRashiName()}
                      </span>
                    </div>
                  </div>

                  <div className="astrology-item">
                    <div className="planet-icon">
                      <FaMoon />
                    </div>

                    <div className="astrology-info">
                      <label>Nakshatra</label>

                      <span>
                        {getNakshtraName()}
                      </span>
                    </div>
                  </div>

                  <div className="astrology-item">
                    <div className="planet-icon">
                      <FaScroll />
                    </div>

                    <div className="astrology-info">
                      <label>Gotra</label>

                      <span>
                        {getGotraName()}
                      </span>
                    </div>
                  </div>

                  <div className="astrology-item">
                    <div className="planet-icon">
                      <FaGlobeAsia />
                    </div>

                    <div className="astrology-info">
                      <label>Nadi</label>

                      <span>
                        {getNadiName()}
                      </span>
                    </div>
                  </div>

                  <div className="astrology-item">
                    <div className="planet-icon">
                      <FaBalanceScale />
                    </div>

                    <div className="astrology-info">
                      <label>Gan</label>

                      <span>
                        {getGanName()}
                      </span>
                    </div>
                  </div>

                  <div className="astrology-item">
                    <div className="planet-icon">
                      <FaFire />
                    </div>

                    <div className="astrology-info">
                      <label>Mangal</label>

                      <span
                        className={`mangal-status ${
                          other.managal
                            ? "has-value"
                            : ""
                        }`}
                      >
                        {other.managal ||
                          other.mangal ||
                          "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="astrology-item">
                    <div className="planet-icon">
                      <FaPrayingHands />
                    </div>

                    <div className="astrology-info">
                      <label>Charan</label>

                      <span>
                        {other.charan || "N/A"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Health Information */}
            {(user.dieses ||
              user.diseaseDetails) && (
              <div className="info-card">

                <div className="card-header">
                  <div className="card-icon">
                    <FaExclamationTriangle />
                  </div>

                  <h3>Health Information</h3>
                </div>

                <div className="card-content">
                  <div className="info-grid">

                    {user.dieses && (
                      <div className="info-item">
                        <label>
                          Disease
                        </label>

                        <span>
                          {user.dieses}
                        </span>
                      </div>
                    )}

                    {user.diseaseDetails && (
                      <div className="info-item">
                        <label>
                          Disease Details
                        </label>

                        <span>
                          {user.diseaseDetails}
                        </span>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            )}

          </>
        ) : (
          <div className="no-data-card">

            <div className="card-icon">
              <FaStar />
            </div>

            <h3>
              No Astrology Information Available
            </h3>

            <p>
              Astrology details have not been
              added to this profile.
            </p>

          </div>
        )}

      </div>
    </div>
  );

  /*
   * Contact Tab
   */
  const ContactTab = () => (
    <div className="tab-content-inner">
      <div className="cards-grid">

        {hasContactDetails ? (
          <div className="info-card contact-card">

            <div className="card-header">
              <div className="card-icon">
                <FaPhone />
              </div>

              <h3>Contact Details</h3>
            </div>

            {!isOwnProfile && (!canSeeMobile || !canSeeEmail) && (user.umobile || user.email) && (
              <p className="contact-privacy-note">
                <FaShieldAlt />{" "}
                {!contactUnlocked
                  ? "Contact details are hidden until they accept your Contact Request."
                  : "Some contact details are hidden by this user's privacy settings."}
                {!contactUnlocked && (
                  <button
                    className="contact-privacy-note-cta"
                    disabled={contactBusy || contactRequestStatus === "PENDING"}
                    onClick={handleRequestContact}
                  >
                    {contactRequestStatus === "PENDING" ? "Request Sent" : "Request Contact"}
                  </button>
                )}
              </p>
            )}

            <div className="card-content">
              <div className="contact-grid">

                {canSeeMobile && user.umobile && (
                  <div className="contact-item">

                    <span className="contact-icon">
                      <FaMobileAlt />
                    </span>

                    <div className="contact-info">
                      <label>Mobile</label>

                      <span>
                        {user.umobile}
                      </span>
                    </div>

                  </div>
                )}

                {canSeeMobile && user.altMobile && (
                  <div className="contact-item">

                    <span className="contact-icon">
                      <FaMobileAlt />
                    </span>

                    <div className="contact-info">
                      <label>
                        Alt. Mobile
                      </label>

                      <span>
                        {user.altMobile}
                      </span>
                    </div>

                  </div>
                )}

                {canSeeMobile && user.whatsappno && (
                  <div className="contact-item">

                    <span className="contact-icon">
                      <FaWhatsapp />
                    </span>

                    <div className="contact-info">
                      <label>WhatsApp</label>

                      <span>
                        {user.whatsappno}
                      </span>
                    </div>

                  </div>
                )}

                {canSeeEmail && user.email && (
                  <div className="contact-item">

                    <span className="contact-icon">
                      <FaEnvelope />
                    </span>

                    <div className="contact-info">
                      <label>Email</label>

                      <span>
                        {user.email}
                      </span>
                    </div>

                  </div>
                )}

                {user.address && (
                  <div className="contact-item full-width">

                    <span className="contact-icon">
                      <FaHome />
                    </span>

                    <div className="contact-info">
                      <label>Address</label>

                      <span>
                        {user.address}
                      </span>
                    </div>

                  </div>
                )}

                {user.cLocation && (
                  <div className="contact-item">

                    <span className="contact-icon">
                      <FaMapMarkerAlt />
                    </span>

                    <div className="contact-info">
                      <label>
                        Current Location
                      </label>

                      <span>
                        {user.cLocation}
                      </span>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        ) : (
          <div className="no-data-card">

            <div className="card-icon">
              <FaPhone />
            </div>

            <h3>
              No Contact Information Available
            </h3>

            <p>
              Contact details have not been
              added to this profile.
            </p>

          </div>
        )}

      </div>
    </div>
  );

  /*
   * Render active tab
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalTab />;

      case "family":
        return <FamilyTab />;

      case "astrology":
        return <AstrologyTab />;

      case "contact":
        return <ContactTab />;

      default:
        return <PersonalTab />;
    }
  };

  return (
    <>
      {/* Main Profile Modal */}
      <div
        className="profile-modal-overlay"
        onClick={onClose}
      >
        <div
          className="profile-modal-container"
          onClick={(e) =>
            e.stopPropagation()
          }
        >

          {/* Header */}
          <div className="profile-modal-header">

            <div className="header-content">

              <h2>
                Profile Details
              </h2>

              <div
                className="status-badge"
                style={{
                  backgroundColor:
                    getStatusColor(
                      user.status
                    ),
                }}
              >
                {getStatusText(
                  user.status
                )}
              </div>

            </div>

            <div className="header-right-actions">
              {currentUser?.id !== user.id && (
                <div className="more-menu-wrapper">
                  <button
                    className="more-menu-btn"
                    onClick={() => setShowMoreMenu((v) => !v)}
                    title="More options"
                  >
                    <FaEllipsisV />
                  </button>

                  {showMoreMenu && (
                    <div className="more-menu-dropdown">
                      <button className="more-menu-item" onClick={handleOpenReport}>
                        <FaFlag /> Report Profile
                      </button>
                      <button className="more-menu-item" onClick={handleBlockToggle}>
                        {isBlocked ? (
                          <>
                            <FaUnlock /> Unblock Profile
                          </>
                        ) : (
                          <>
                            <FaBan /> Block Profile
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                className="close-btn"
                onClick={onClose}
                title="Close"
              >
                <FaTimes />
              </button>
            </div>

          </div>

          {/* Main Content */}
          <div className="profile-modal-content">

            {/* Profile Header */}
            <div className="profile-header">

              {/* Avatar */}
              <div className="avatar-section">

                <div
                  className="avatar-container"
                  onClick={openImageModal}
                  style={{
                    cursor: "pointer",
                  }}
                >

                  <img
                    src={photoUrl}
                    alt={user.uname}
                    className="avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "/mnt/data/17.png";
                    }}
                  />

                  <div className="online-indicator"></div>

                  <div className="zoom-hint">
                    <FaArrowsAlt /> Click to zoom
                  </div>

                </div>

              </div>

              {/* Profile Information */}
              <div className="profile-info">

                <div className="name-section">

                  <h1>
                    {user.uname}
                  </h1>

                  {Number(user.vstatus) === 1 && (
                    <span className="verified-badge" title="Verified Profile">
                      <FaCheckCircle /> Verified
                    </span>
                  )}

                  <span className="profile-id">
                    ID: {user.id}
                  </span>

                </div>

                {/* Quick Stats */}
                <div className="quick-stats">

                  <div className="stat-item">

                    <span className="stat-value">
                      {user.age ?? "N/A"}
                    </span>

                    <span className="stat-label">
                      Years
                    </span>

                  </div>

                  <div className="stat-item">

                    <span className="stat-value">
                      {user.height || "N/A"}
                    </span>

                    <span className="stat-label">
                      Height
                    </span>

                  </div>

                  <div className="stat-item">

                    <span className="stat-value">
                      {user.fincome || "-"}
                    </span>

                    <span className="stat-label">
                      Income
                    </span>

                  </div>

                </div>

                {/* Profile Meta */}
                <div className="profile-meta">

                  <div className="meta-item">

                    <span className="meta-icon">
                      <FaCalendarAlt />
                    </span>

                    <span>
                      {formatDate(user.dob)}

                      {user.dobTime &&
                        ` | ${user.dobTime}`}
                    </span>

                  </div>

                </div>

                {/* Actions */}
                {currentUser?.id !==
                  user.id && (
                  <div className="profile-modal-actions">

                    {/* Like */}
                    <button
                      className={`pm-action-btn pm-like-btn ${
                        isLiked
                          ? "active"
                          : ""
                      }`}
                      onClick={
                        handleLikeToggle
                      }
                    >
                      <FaHeart />

                      {isLiked
                        ? "Liked"
                        : "Like"}
                    </button>

                    {/* Shortlist */}
                    <button
                      className={`pm-action-btn pm-shortlist-btn ${
                        isShortlisted
                          ? "active"
                          : ""
                      }`}
                      onClick={
                        handleShortlistToggle
                      }
                    >
                      {isShortlisted ? (
                        <FaStar />
                      ) : (
                        <FaRegStar />
                      )}

                      {isShortlisted
                        ? "Shortlisted"
                        : "Shortlist"}
                    </button>

                    {/* Express Interest */}
                    <button
                      className={`pm-action-btn pm-interest-btn status-${(
                        interestStatus ||
                        "none"
                      ).toLowerCase()}`}
                      disabled={
                        actionBusy ||
                        interestStatus ===
                          "PENDING" ||
                        interestStatus ===
                          "ACCEPTED"
                      }
                      onClick={
                        handleExpressInterest
                      }
                    >

                      {interestStatus ===
                        "PENDING" && (
                        <>
                          <FaClock />
                          Interest Sent
                        </>
                      )}

                      {interestStatus ===
                        "ACCEPTED" && (
                        <>
                          <FaCheckCircle />
                          Accepted
                        </>
                      )}

                      {interestStatus ===
                        "DECLINED" && (
                        <>
                          <FaTimesCircle />
                          Declined — Resend
                        </>
                      )}

                      {!interestStatus && (
                        <>
                          <FaPaperPlane />
                          Express Interest
                        </>
                      )}

                    </button>

                    {/* Request Contact (Part 5, item 15) */}
                    <button
                      className={`pm-action-btn pm-contact-btn status-${(
                        contactRequestStatus || "none"
                      ).toLowerCase()}`}
                      disabled={
                        contactBusy ||
                        contactRequestStatus === "PENDING" ||
                        contactRequestStatus === "ACCEPTED"
                      }
                      onClick={handleRequestContact}
                    >
                      {contactRequestStatus === "PENDING" && (
                        <>
                          <FaClock />
                          Request Sent
                        </>
                      )}

                      {contactRequestStatus === "ACCEPTED" && (
                        <>
                          <FaCheckCircle />
                          Contact Shared
                        </>
                      )}

                      {contactRequestStatus === "DECLINED" && (
                        <>
                          <FaTimesCircle />
                          Declined — Resend
                        </>
                      )}

                      {!contactRequestStatus && (
                        <>
                          <FaAddressCard />
                          Request Contact
                        </>
                      )}
                    </button>

                    {/* Message (Part 5, item 16) -- only enabled once canChat is true */}
                    <button
                      className={`pm-action-btn pm-message-btn ${canChat ? "" : "disabled-hint"}`}
                      onClick={handleMessage}
                      title={
                        canChat
                          ? "Send a message"
                          : "Available once matched, or an interest / contact request is accepted"
                      }
                    >
                      <FaCommentDots />
                      Message
                    </button>

                  </div>
                )}

              </div>

            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">

              <button
                className={`tab-btn ${
                  activeTab === "personal"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("personal")
                }
              >
                Personal
              </button>

              <button
                className={`tab-btn ${
                  activeTab === "family"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("family")
                }
              >
                Family
              </button>

              <button
                className={`tab-btn ${
                  activeTab === "astrology"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("astrology")
                }
              >
                Astrology
              </button>

              <button
                className={`tab-btn ${
                  activeTab === "contact"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("contact")
                }
              >
                Contact
              </button>

            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {renderTabContent()}
            </div>

          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {showImageModal && (
        <div
          className="image-zoom-overlay"
          onClick={closeImageModal}
        >
          <div
            className="image-zoom-container"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Zoom Header */}
            <div className="image-zoom-header">

              <h3>
                {user.uname}'s Profile Photo
              </h3>

              <div className="zoom-controls">

                <div className="zoom-buttons">

                  {/* Zoom Out */}
                  <button
                    className="zoom-btn"
                    onClick={handleZoomOut}
                    disabled={
                      zoomLevel <= 0.5
                    }
                    title="Zoom Out"
                  >
                    <FaMinus />
                  </button>

                  <span className="zoom-level">
                    {Math.round(
                      zoomLevel * 100
                    )}
                    %
                  </span>

                  {/* Zoom In */}
                  <button
                    className="zoom-btn"
                    onClick={handleZoomIn}
                    disabled={
                      zoomLevel >= 3
                    }
                    title="Zoom In"
                  >
                    <FaPlus />
                  </button>

                  {/* Reset */}
                  <button
                    className="zoom-btn reset-btn"
                    onClick={
                      handleZoomReset
                    }
                    title="Reset Zoom"
                  >
                    <FaRedo />
                  </button>

                </div>

                {/* Close */}
                <button
                  className="close-zoom-btn"
                  onClick={closeImageModal}
                  title="Close"
                >
                  <FaTimes />
                </button>

              </div>

            </div>

            {/* Zoom Content */}
            <div className="image-zoom-content">

              <div className="image-wrapper">

                <img
                  src={photoUrl}
                  alt={`${user.uname}'s Profile`}
                  style={{
                    transform: `scale(${zoomLevel})`,
                  }}
                  className="zoomed-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "/mnt/data/17.png";
                  }}
                />

              </div>

              {/* Image Info */}
              <div className="image-info">

                <p>
                  <strong>Name:</strong>{" "}
                  {user.uname}
                </p>

                {user.age && (
                  <p>
                    <strong>Age:</strong>{" "}
                    {user.age} years
                  </p>
                )}

                {user.location && (
                  <p>
                    <strong>Location:</strong>{" "}
                    {user.location}
                  </p>
                )}

                <p className="hint">
                  <FaArrowsAlt /> Use buttons to
                  zoom • Click and drag to pan •
                  ESC to close
                </p>

              </div>

            </div>

          </div>
        </div>
      )}

      {showReportModal && (
        <ReportProfileModal
          reportedUserId={user.id}
          reportedUserName={user.uname}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}
