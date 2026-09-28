package org.stormsofts.matrimony.model;

import java.time.Instant;

/** Admin-facing view of a report -- includes readable names, never raw sensitive data. */
public class ReportResponseDTO {

    private Integer id;
    private Integer reporterId;
    private String reporterName;
    private Integer reportedUserId;
    private String reportedUserName;
    private ReportReason reason;
    private String description;
    private ReportStatus status;
    private String adminNote;
    private Instant createdAt;

    public ReportResponseDTO() {
    }

    public ReportResponseDTO(Integer id, Integer reporterId, String reporterName,
                              Integer reportedUserId, String reportedUserName,
                              ReportReason reason, String description, ReportStatus status,
                              String adminNote, Instant createdAt) {
        this.id = id;
        this.reporterId = reporterId;
        this.reporterName = reporterName;
        this.reportedUserId = reportedUserId;
        this.reportedUserName = reportedUserName;
        this.reason = reason;
        this.description = description;
        this.status = status;
        this.adminNote = adminNote;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getReporterId() {
        return reporterId;
    }

    public void setReporterId(Integer reporterId) {
        this.reporterId = reporterId;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public Integer getReportedUserId() {
        return reportedUserId;
    }

    public void setReportedUserId(Integer reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public String getReportedUserName() {
        return reportedUserName;
    }

    public void setReportedUserName(String reportedUserName) {
        this.reportedUserName = reportedUserName;
    }

    public ReportReason getReason() {
        return reason;
    }

    public void setReason(ReportReason reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
