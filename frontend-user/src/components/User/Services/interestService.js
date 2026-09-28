import { api } from "../Config/api";

// Thin wrapper around the /api/interests/* endpoints so components never
// call axios directly for this feature (Part 13: centralize API calls).
export const interestService = {
  send: (receiverId) => api.post("/api/interests/send", null, { params: { receiverId } }),

  getStatus: (otherUserId) =>
    api.get("/api/interests/status", { params: { otherUserId } }),

  accept: (interestId) => api.post(`/api/interests/${interestId}/accept`),

  decline: (interestId) => api.post(`/api/interests/${interestId}/decline`),

  cancel: (interestId) => api.post(`/api/interests/${interestId}/cancel`),

  getReceived: (status = "ALL", page = 0, size = 20) =>
    api.get("/api/interests/received", { params: { status, page, size } }),

  getSent: (page = 0, size = 20) =>
    api.get("/api/interests/sent", { params: { page, size } }),

  getPendingCount: () => api.get("/api/interests/received/pending-count"),

  getSentStatusMap: () => api.get("/api/interests/sent-status-map"),
};

export default interestService;
