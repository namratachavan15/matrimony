import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import { messageService } from "../../Services/messageService";
import "./MessageBell.css";

const MessageBell = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      const res = await messageService.getUnreadCount();
      setUnreadCount(res.data?.count ?? 0);
    } catch (e) {
      // Silent -- the icon just won't show a badge if this fails.
    }
  };

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      className="message-bell-btn"
      onClick={() => navigate("/messages")}
      aria-label="Messages"
      title="Messages"
    >
      <FiMessageCircle />
      {unreadCount > 0 && (
        <span className="message-bell-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
      )}
    </button>
  );
};

export default MessageBell;
