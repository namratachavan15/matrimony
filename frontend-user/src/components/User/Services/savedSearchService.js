import { api } from "../Config/api";

// Thin wrapper around /api/saved-searches/* (Part 13: centralize API calls).
export const savedSearchService = {
  getMy: () => api.get("/api/saved-searches/my"),
  create: (name, filters) => api.post("/api/saved-searches", { name, filters }),
  rename: (id, name) => api.put(`/api/saved-searches/${id}`, { name }),
  remove: (id) => api.delete(`/api/saved-searches/${id}`),
};

export default savedSearchService;