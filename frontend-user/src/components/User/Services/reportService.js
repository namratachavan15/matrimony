import { api } from "../Config/api";

// Thin wrapper around the /api/reports* endpoints (Part 13: centralize API calls).
export const reportService = {
  submit: (reportedUserId, reason, description) =>
    api.post("/api/reports", { reportedUserId, reason, description }),

  // ---- Admin ----
  getReports: (status, page = 0, size = 20) =>
    api.get("/api/admin/reports", { params: { status, page, size } }),

  updateStatus: (reportId, status, adminNote) =>
    api.patch(`/api/admin/reports/${reportId}/status`, { status, adminNote }),

  getCount: (status = "PENDING") =>
    api.get("/api/admin/reports/count", { params: { status } }),
};

export default reportService;
