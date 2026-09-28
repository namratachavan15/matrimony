import { api } from "../Config/api";

// Thin wrapper around /api/privacy/* (Part 13: centralize API calls).
export const privacyService = {
  getMySettings: () => api.get("/api/privacy/my"),
  updateMySettings: (settings) => api.put("/api/privacy/my", settings),
  getContactVisibility: (userId) => api.get(`/api/privacy/contact-visibility/${userId}`),
};

export default privacyService;