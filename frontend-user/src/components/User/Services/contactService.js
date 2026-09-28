import { api } from "../Config/api";

// Thin wrapper around the /api/contact-requests/* endpoints so components
// never call axios directly for this feature (Part 13: centralize API calls).
export const contactService = {
  send: (receiverId) =>
    api.post("/api/contact-requests/send", null, { params: { receiverId } }),

  getStatus: (otherUserId) =>
    api.get("/api/contact-requests/status", { params: { otherUserId } }),

  accept: (requestId) => api.post(`/api/contact-requests/${requestId}/accept`),

  decline: (requestId) => api.post(`/api/contact-requests/${requestId}/decline`),

  cancel: (requestId) => api.post(`/api/contact-requests/${requestId}/cancel`),

  getReceived: (status = "ALL", page = 0, size = 20) =>
    api.get("/api/contact-requests/received", { params: { status, page, size } }),

  getSent: (page = 0, size = 20) =>
    api.get("/api/contact-requests/sent", { params: { page, size } }),

  getPendingCount: () => api.get("/api/contact-requests/received/pending-count"),

  getSentStatusMap: () => api.get("/api/contact-requests/sent-status-map"),
};

export default contactService;
