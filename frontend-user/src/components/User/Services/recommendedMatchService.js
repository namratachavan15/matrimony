import { api } from "../Config/api";

// Thin wrapper around /api/recommended-matches (Part 13: centralize API calls).
export const recommendedMatchService = {
  getRecommendations: (page = 0, size = 12) =>
    api.get("/api/recommended-matches", { params: { page, size } }),
};

export default recommendedMatchService;