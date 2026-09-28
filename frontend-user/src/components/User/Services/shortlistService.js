import { api } from "../Config/api";

export const shortlistService = {
  toggle: (userId) => api.post("/api/shortlist/toggle", null, { params: { userId } }),

  getMyIds: () => api.get("/api/shortlist/my-ids"),

  getMyShortlist: (page = 0, size = 20) =>
    api.get("/api/shortlist/my", { params: { page, size } }),

  getCount: () => api.get("/api/shortlist/count"),
};

export default shortlistService;
