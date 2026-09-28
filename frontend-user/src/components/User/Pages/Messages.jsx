import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaPaperPlane, FaCheckCircle, FaComments, FaArrowLeft } from "react-icons/fa";
import { messageService } from "../Services/messageService";
import { useUserContext } from "../State/UserContext";
import { useToast } from "../Components/Toast/ToastContext";
import ProfileModal from "./ProfileModal";
import "./Messages.css";

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

const messageTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Messages = () => {
  const { currentUser, users } = useUserContext();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null); // ConversationDTO
  const [thread, setThread] = useState([]); // messages, oldest first
  const [loadingThread, setLoadingThread] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const threadEndRef = useRef(null);
  const pollRef = useRef(null);

  const loadConversations = async () => {
    try {
      const res = await messageService.getConversations(0, 50);
      setConversations(res.data?.content ?? []);
      return res.data?.content ?? [];
    } catch (e) {
      toast.error("Could not load your messages.");
      return [];
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deep-link: /messages?with=<userId> opens (or creates, if allowed) that conversation.
  useEffect(() => {
    const withId = searchParams.get("with");
    if (!withId) return;

    const openWith = async () => {
      try {
        const res = await messageService.getOrCreateWith(withId);
        const conversationId = res.data?.conversationId;
        const list = await loadConversations();
        const found = list.find((c) => c.conversationId === conversationId);
        if (found) {
          openConversation(found);
        } else {
          // Freshly created conversation not yet in the list snapshot -- build a
          // minimal placeholder from what we know so the thread still opens.
          openConversation({
            conversationId,
            otherUser: null,
            lastMessagePreview: null,
            lastMessageAt: null,
            unreadCount: 0,
          });
        }
      } catch (e) {
        const msg =
          e?.response?.data ||
          "You can only message profiles you've matched with, or whose interest / contact request was accepted.";
        toast.info(typeof msg === "string" ? msg : "You can't message this profile yet.");
      } finally {
        setSearchParams({}, { replace: true });
      }
    };
    openWith();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadThread = async (conversationId) => {
    setLoadingThread(true);
    try {
      const res = await messageService.getMessages(conversationId, 0, 50);
      const items = (res.data?.content ?? []).slice().reverse(); // API returns newest-first; show oldest-first
      setThread(items);
      await messageService.markRead(conversationId);
      setConversations((prev) =>
        prev.map((c) => (c.conversationId === conversationId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (e) {
      toast.error("Could not load this conversation.");
    } finally {
      setLoadingThread(false);
    }
  };

  const openConversation = (conv) => {
    setActiveConversation(conv);
    setShowMobileList(false);
    loadThread(conv.conversationId);
  };

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  // Light polling for new messages while a conversation is open.
  useEffect(() => {
    if (!activeConversation) return;
    pollRef.current = setInterval(() => {
      loadThread(activeConversation.conversationId);
    }, 8000);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeConversation?.otherUser) return;
    setSending(true);
    try {
      await messageService.send(activeConversation.otherUser.id, draft.trim());
      setDraft("");
      await loadThread(activeConversation.conversationId);
      loadConversations();
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === "string" ? msg : "Could not send message.");
    } finally {
      setSending(false);
    }
  };

  const handleViewProfile = (userId) => {
    if (!userId) return;
    const full = (users || []).find((u) => u.id === userId);
    if (full) setSelectedProfile(full);
    else toast.info("Profile details are loading — please try again in a moment.");
  };

  const photoFor = (p) =>
    p?.uprofile
      ? p.uprofile.startsWith("http")
        ? p.uprofile
        : `${backendURL}uploads/profile/${p.uprofile}`
      : "/default-user.png";

  return (
    <div className="messages-page">
      <div className={`messages-list-panel ${showMobileList ? "" : "mobile-hidden"}`}>
        <div className="messages-list-header">
          <h1>
            <FaComments /> Messages
          </h1>
        </div>

        {loadingList ? (
          <div className="messages-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="messages-skeleton-row" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="messages-empty">
            <FaComments className="messages-empty-icon" />
            <h3>No conversations yet</h3>
            <p>Chat unlocks once you're matched, or an interest / contact request has been accepted.</p>
          </div>
        ) : (
          <div className="conversation-list">
            {conversations.map((c) => {
              const p = c.otherUser;
              return (
                <div
                  key={c.conversationId}
                  className={`conversation-row ${
                    activeConversation?.conversationId === c.conversationId ? "active" : ""
                  } ${c.unreadCount > 0 ? "unread" : ""}`}
                  onClick={() => openConversation(c)}
                >
                  <img className="conversation-avatar" src={photoFor(p)} alt={p?.uname || "User"} />
                  <div className="conversation-row-body">
                    <div className="conversation-row-top">
                      <span className="conversation-name">
                        {p?.uname || "Unknown"}
                        {Number(p?.vstatus) === 1 && (
                          <FaCheckCircle className="conversation-verified" title="Verified Profile" />
                        )}
                      </span>
                      <span className="conversation-time">{timeAgo(c.lastMessageAt)}</span>
                    </div>
                    <div className="conversation-row-bottom">
                      <span className="conversation-preview">{c.lastMessagePreview || "Say hello 👋"}</span>
                      {c.unreadCount > 0 && <span className="conversation-unread-badge">{c.unreadCount}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={`messages-thread-panel ${showMobileList ? "mobile-hidden" : ""}`}>
        {!activeConversation ? (
          <div className="messages-thread-placeholder">
            <FaComments className="messages-empty-icon" />
            <p>Select a conversation to start chatting.</p>
          </div>
        ) : (
          <>
            <div className="messages-thread-header">
              <button className="thread-back-btn" onClick={() => setShowMobileList(true)}>
                <FaArrowLeft />
              </button>
              {activeConversation.otherUser && (
                <>
                  <img
                    className="conversation-avatar"
                    src={photoFor(activeConversation.otherUser)}
                    alt={activeConversation.otherUser.uname}
                  />
                  <div
                    className="thread-header-name"
                    onClick={() => handleViewProfile(activeConversation.otherUser.id)}
                    role="button"
                  >
                    {activeConversation.otherUser.uname}
                    {Number(activeConversation.otherUser.vstatus) === 1 && (
                      <FaCheckCircle className="conversation-verified" title="Verified Profile" />
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="messages-thread-body">
              {loadingThread ? (
                <div className="messages-thread-loading">Loading messages…</div>
              ) : thread.length === 0 ? (
                <div className="messages-thread-empty">No messages yet. Say hello 👋</div>
              ) : (
                thread.map((m) => (
                  <div
                    key={m.id}
                    className={`message-bubble ${m.senderId === currentUser?.id ? "sent" : "received"}`}
                  >
                    <div className="message-bubble-content">{m.content}</div>
                    <div className="message-bubble-time">{messageTime(m.createdAt)}</div>
                  </div>
                ))
              )}
              <div ref={threadEndRef} />
            </div>

            <form className="messages-input-row" onSubmit={handleSend}>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message…"
                maxLength={2000}
                disabled={sending}
              />
              <button type="submit" disabled={sending || !draft.trim()} className="messages-send-btn">
                <FaPaperPlane />
              </button>
            </form>
          </>
        )}
      </div>

      {selectedProfile && (
        <ProfileModal user={selectedProfile} backendURL={backendURL} onClose={() => setSelectedProfile(null)} />
      )}
    </div>
  );
};

export default Messages;
