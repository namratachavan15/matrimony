import { api } from "../Config/api";

// Thin wrapper around the /api/block/* endpoints (Part 13: centralize API calls).
export const blockService = {
  block: (userId) => api.post(`/api/block/${userId}`),

  unblock: (userId) => api.delete(`/api/block/${userId}`),

  getStatus: (userId) => api.get(`/api/block/status/${userId}`),

  getMyBlockedIds: () => api.get("/api/block/my-ids"),

  getMyBlocked: (page = 0, size = 20) =>
    api.get("/api/block/my", { params: { page, size } }),

  getCount: () => api.get("/api/block/count"),
};

export default blockService;
