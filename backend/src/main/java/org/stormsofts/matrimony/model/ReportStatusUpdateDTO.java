package org.stormsofts.matrimony.model;

/** Inbound body for PATCH /api/admin/reports/{id}/status. */
public class ReportStatusUpdateDTO {

    private ReportStatus status;
    private String adminNote;

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public String getAdminNote() {
        return adminNote;
    }

    public void setAdminNote(String adminNote) {
        this.adminNote = adminNote;
    }
}
