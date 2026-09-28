import { api } from "../Config/api";

// Thin wrapper around /api/verification/* (Part 13: centralize API calls).
export const verificationService = {
  getMyStatus: () => api.get("/api/verification/my-status"),
};

export default verificationService;