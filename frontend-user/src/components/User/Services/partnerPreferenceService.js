import { api } from "../Config/api";

// Thin wrapper around /api/partner-preferences/* (Part 13: centralize API calls).
export const partnerPreferenceService = {
  getMy: () => api.get("/api/partner-preferences/my"),
  update: (prefs) => api.put("/api/partner-preferences/my", prefs),
  reset: () => api.delete("/api/partner-preferences/my"),
};

export default partnerPreferenceService;