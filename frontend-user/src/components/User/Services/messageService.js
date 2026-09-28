import { api } from "../Config/api";

// Thin wrapper around the /api/messages/* endpoints (Part 5, item 16 - Chat).
export const messageService = {
  canChat: (userId) => api.get(`/api/messages/can-chat/${userId}`),

  getConversations: (page = 0, size = 20) =>
    api.get("/api/messages/conversations", { params: { page, size } }),

  getMessages: (conversationId, page = 0, size = 30) =>
    api.get(`/api/messages/conversations/${conversationId}`, { params: { page, size } }),

  markRead: (conversationId) =>
    api.post(`/api/messages/conversations/${conversationId}/read`),

  getOrCreateWith: (userId) => api.get(`/api/messages/with/${userId}`),

  send: (receiverId, content) =>
    api.post("/api/messages/send", { receiverId, content }),

  getUnreadCount: () => api.get("/api/messages/unread-count"),
};

export default messageService;
