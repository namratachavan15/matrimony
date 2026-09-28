import { api } from "../Config/api";

// Thin wrapper around /api/profile-quality/* (Part 13 & 14).
export const profileQualityService = {
  getCompletion: () => api.get("/api/profile-quality/completion"),
  getStrength: () => api.get("/api/profile-quality/strength"),
};

export default profileQualityService;