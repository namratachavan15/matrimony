import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiCheck, FiTrash2, FiCheckCircle, FiMessageCircle } from "react-icons/fi";
import { notificationService } from "../Services/notificationService";
import { interestService } from "../Services/interestService";
import { contactService } from "../Services/contactService";
import { useUserContext } from "../State/UserContext";
import { useToast } from "../Components/Toast/ToastContext";
import ProfileModal from "./ProfileModal";
import "./Notifications.css";

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

const Notifications = () => {
  const { users } = useUserContext();
  const toast = useToast();
  const navigate = useNavigate();

  const [tab, setTab] = useState("all"); // all | unread
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const load = async (filter = tab) => {
    setLoading(true);
    try {
      const res = await notificationService.getMy(filter, 0, 50);
      setNotifications(res.data?.content ?? []);
    } catch (e) {
      toast.error("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read.");
    } catch (e) {
      toast.error("Could not mark notifications as read.");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.remove(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e2) {
      toast.error("Could not delete notification.");
    }
  };

  const handleOpen = async (n) => {
    if (!n.read) {
      try {
        await notificationService.markAsRead(n.id);
        setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      } catch (e) {
        // ignore
      }
    }
    if (n.relatedUserId) {
      const full = (users || []).find((u) => u.id === n.relatedUserId);
      if (full) setSelectedUser(full);
    }
  };

  const handleAccept = async (n, e) => {
    e.stopPropagation();
    try {
      await interestService.accept(n.relatedEntityId);
      toast.success("Interest accepted!");
      load(tab);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not accept interest.");
    }
  };

  const handleDecline = async (n, e) => {
    e.stopPropagation();
    try {
      await interestService.decline(n.relatedEntityId);
      toast.info("Interest declined.");
      load(tab);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not decline interest.");
    }
  };

  // Part 5, item 15: same accept/decline pattern as Express Interest above.
  const handleAcceptContact = async (n, e) => {
    e.stopPropagation();
    try {
      await contactService.accept(n.relatedEntityId);
      toast.success("Contact request accepted! They can now see your details and message you.");
      load(tab);
    } catch (err) {
      toast.error(err?.response?.data || "Could not accept contact request.");
    }
  };

  const handleDeclineContact = async (n, e) => {
    e.stopPropagation();
    try {
      await contactService.decline(n.relatedEntityId);
      toast.info("Contact request declined.");
      load(tab);
    } catch (err) {
      toast.error(err?.response?.data || "Could not decline contact request.");
    }
  };

  // Part 5, item 16: jump straight into the conversation from a notification
  // that implies chat is now unlocked (match / accepted interest / accepted
  // contact request).
  const handleGoToMessage = async (n, e) => {
    e.stopPropagation();
    if (!n.read) {
      try {
        await notificationService.markAsRead(n.id);
        setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      } catch (err) {
        // ignore
      }
    }
    if (n.relatedUserId) navigate(`/messages?with=${n.relatedUserId}`);
  };

  const iconFor = (type) => {
    switch (type) {
      case "MUTUAL_MATCH": return "❤️";
      case "INTEREST_RECEIVED": return "💍";
      case "INTEREST_ACCEPTED": return "✅";
      case "INTEREST_DECLINED": return "✖️";
      case "PROFILE_LIKED": return "💗";
      case "PROFILE_VIEWED": return "👀";
      case "CONTACT_REQUEST_RECEIVED": return "📇";
      case "CONTACT_REQUEST_ACCEPTED": return "🤝";
      case "PROFILE_VERIFIED": return "🛡️";
      case "PROFILE_REJECTED": return "⚠️";
      default: return "🔔";
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1><FiBell /> Notifications</h1>
        <button className="mark-all-btn" onClick={handleMarkAllRead}>
          <FiCheckCircle /> Mark all as read
        </button>
      </div>

      <div className="notifications-tabs">
        <button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>All</button>
        <button className={tab === "unread" ? "active" : ""} onClick={() => setTab("unread")}>Unread</button>
      </div>

      {loading ? (
        <div className="notifications-skeleton">
          {[1, 2, 3, 4].map((i) => <div key={i} className="notification-skeleton-row" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <FiBell className="notifications-empty-icon" />
          <h3>No notifications</h3>
          <p>You're all caught up.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-row ${!n.read ? "unread" : ""}`}
              onClick={() => handleOpen(n)}
            >
              <div className="notification-row-icon">{iconFor(n.type)}</div>
              <div className="notification-row-body">
                <div className="notification-row-title">{n.title}</div>
                <div className="notification-row-message">{n.message}</div>
                <div className="notification-row-time">{timeAgo(n.createdAt)}</div>

                {n.type === "INTEREST_RECEIVED" && (
                  <div className="notification-row-actions">
                    <button className="accept-btn" onClick={(e) => handleAccept(n, e)}>
                      <FiCheck /> Accept
                    </button>
                    <button className="decline-btn" onClick={(e) => handleDecline(n, e)}>
                      Decline
                    </button>
                  </div>
                )}

                {n.type === "CONTACT_REQUEST_RECEIVED" && (
                  <div className="notification-row-actions">
                    <button className="accept-btn" onClick={(e) => handleAcceptContact(n, e)}>
                      <FiCheck /> Accept
                    </button>
                    <button className="decline-btn" onClick={(e) => handleDeclineContact(n, e)}>
                      Decline
                    </button>
                  </div>
                )}

                {(n.type === "MUTUAL_MATCH" || n.type === "CONTACT_REQUEST_ACCEPTED") && (
                  <div className="notification-row-actions">
                    <button className="accept-btn" onClick={(e) => handleGoToMessage(n, e)}>
                      <FiMessageCircle /> Message
                    </button>
                  </div>
                )}
              </div>
              <button className="notification-delete-btn" onClick={(e) => handleDelete(n.id, e)} title="Delete">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <ProfileModal user={selectedUser} backendURL={backendURL} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default Notifications;
