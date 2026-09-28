import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAddressCard, FaCheck, FaTimes, FaBan, FaCheckCircle, FaCommentDots } from "react-icons/fa";
import { contactService } from "../Services/contactService";
import { useToast } from "../Components/Toast/ToastContext";
import "./ContactRequests.css";

const backendURL = "http://localhost:5454/";

const timeAgo = (iso) => {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const photoFor = (p) =>
  p?.uprofile
    ? p.uprofile.startsWith("http")
      ? p.uprofile
      : `${backendURL}uploads/profile/${p.uprofile}`
    : "/default-user.png";

const ContactRequests = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [tab, setTab] = useState("received"); // received | sent
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = async (which = tab) => {
    setLoading(true);
    try {
      const res =
        which === "received"
          ? await contactService.getReceived("ALL", 0, 50)
          : await contactService.getSent(0, 50);
      setItems(res.data?.content ?? []);
    } catch (e) {
      toast.error("Could not load contact requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleAccept = async (item) => {
    setBusyId(item.requestId);
    try {
      await contactService.accept(item.requestId);
      toast.success("Contact request accepted. You can now view their contact details and chat.");
      load(tab);
    } catch (err) {
      toast.error(err?.response?.data || "Could not accept request.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDecline = async (item) => {
    setBusyId(item.requestId);
    try {
      await contactService.decline(item.requestId);
      toast.info("Contact request declined.");
      load(tab);
    } catch (err) {
      toast.error(err?.response?.data || "Could not decline request.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (item) => {
    setBusyId(item.requestId);
    try {
      await contactService.cancel(item.requestId);
      toast.info("Contact request cancelled.");
      load(tab);
    } catch (err) {
      toast.error(err?.response?.data || "Could not cancel request.");
    } finally {
      setBusyId(null);
    }
  };

  const handleMessage = (item) => {
    navigate(`/messages?with=${item.otherUser?.id}`);
  };

  return (
    <div className="contact-requests-page">
      <div className="contact-requests-header">
        <h1>
          <FaAddressCard /> Contact Requests
        </h1>
        <p>Request contact details from a profile — once accepted, you can view their number/email and chat.</p>
      </div>

      <div className="contact-requests-tabs">
        <button className={tab === "received" ? "active" : ""} onClick={() => setTab("received")}>
          Received
        </button>
        <button className={tab === "sent" ? "active" : ""} onClick={() => setTab("sent")}>
          Sent
        </button>
      </div>

      {loading ? (
        <div className="contact-requests-skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="contact-request-skeleton-row" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="contact-requests-empty">
          <FaAddressCard className="contact-requests-empty-icon" />
          <h3>No {tab} contact requests</h3>
          <p>
            {tab === "received"
              ? "When someone requests your contact details, it'll show up here."
              : "Contact requests you send will show up here."}
          </p>
        </div>
      ) : (
        <div className="contact-requests-list">
          {items.map((item) => {
            const p = item.otherUser;
            return (
              <div key={item.requestId} className="contact-request-row">
                <img className="contact-request-avatar" src={photoFor(p)} alt={p?.uname || "User"} />
                <div className="contact-request-body">
                  <div className="contact-request-name">
                    {p?.uname || "Unknown"}
                    {Number(p?.vstatus) === 1 && (
                      <FaCheckCircle className="contact-request-verified" title="Verified Profile" />
                    )}
                  </div>
                  <div className="contact-request-meta">
                    {p?.age ? `${p.age} yrs` : ""} {p?.cLocation ? `• ${p.cLocation}` : ""}
                  </div>
                  <div className="contact-request-time">{timeAgo(item.createdAt)}</div>
                </div>

                <div className="contact-request-actions">
                  {tab === "received" && item.status === "PENDING" && (
                    <>
                      <button
                        className="cr-accept-btn"
                        disabled={busyId === item.requestId}
                        onClick={() => handleAccept(item)}
                      >
                        <FaCheck /> Accept
                      </button>
                      <button
                        className="cr-decline-btn"
                        disabled={busyId === item.requestId}
                        onClick={() => handleDecline(item)}
                      >
                        <FaTimes /> Decline
                      </button>
                    </>
                  )}

                  {tab === "sent" && item.status === "PENDING" && (
                    <button
                      className="cr-cancel-btn"
                      disabled={busyId === item.requestId}
                      onClick={() => handleCancel(item)}
                    >
                      <FaBan /> Cancel
                    </button>
                  )}

                  {item.status === "ACCEPTED" && (
                    <>
                      <span className="cr-status-pill accepted">
                        <FaCheckCircle /> Accepted
                      </span>
                      <button className="cr-message-btn" onClick={() => handleMessage(item)}>
                        <FaCommentDots /> Message
                      </button>
                    </>
                  )}

                  {item.status === "DECLINED" && <span className="cr-status-pill declined">Declined</span>}
                  {item.status === "CANCELLED" && <span className="cr-status-pill cancelled">Cancelled</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactRequests;
