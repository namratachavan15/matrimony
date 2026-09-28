import { api } from "../Config/api";

export const notificationService = {
  getMy: (filter = "all", page = 0, size = 20) =>
    api.get("/api/notifications", { params: { filter, page, size } }),

  getUnreadCount: () => api.get("/api/notifications/unread-count"),

  markAsRead: (id) => api.post(`/api/notifications/${id}/read`),

  markAllAsRead: () => api.post("/api/notifications/read-all"),

  remove: (id) => api.delete(`/api/notifications/${id}`),
};

export default notificationService;
