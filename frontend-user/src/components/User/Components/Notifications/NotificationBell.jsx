import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { notificationService } from "../../Services/notificationService";
import "./NotificationBell.css";

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

const NotificationBell = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recent, setRecent] = useState([]);
  const wrapperRef = useRef(null);

  const loadUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data?.count ?? 0);
    } catch (e) {
      // Silent -- the bell just won't show a badge if this fails.
    }
  };

  const loadRecent = async () => {
    try {
      const res = await notificationService.getMy("all", 0, 6);
      setRecent(res.data?.content ?? []);
    } catch (e) {
      setRecent([]);
    }
  };

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) loadRecent();
  };

  const handleItemClick = async (n) => {
    try {
      if (!n.read) await notificationService.markAsRead(n.id);
    } catch (e) {
      // ignore
    }
    setOpen(false);
    navigate("/notifications");
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate("/notifications");
  };

  return (
    <div className="notification-bell-wrapper" ref={wrapperRef}>
      <button className="notification-bell-btn" onClick={handleToggle} aria-label="Notifications">
        <FiBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <span>Notifications</span>
          </div>
          <div className="notification-dropdown-list">
            {recent.length === 0 ? (
              <div className="notification-empty">No notifications yet.</div>
            ) : (
              recent.map((n) => (
                <div
                  key={n.id}
                  className={`notification-dropdown-item ${!n.read ? "unread" : ""}`}
                  onClick={() => handleItemClick(n)}
                >
                  <div className="notification-dropdown-title">{n.title}</div>
                  <div className="notification-dropdown-message">{n.message}</div>
                  <div className="notification-dropdown-time">{timeAgo(n.createdAt)}</div>
                </div>
              ))
            )}
          </div>
          <button className="notification-view-all" onClick={handleViewAll}>
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
