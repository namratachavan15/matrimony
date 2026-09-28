import { api } from "../Config/api";

export const matchService = {
  getMy: (page = 0, size = 20) => api.get("/api/matches", { params: { page, size } }),

  getCount: () => api.get("/api/matches/count"),
};

export default matchService;
