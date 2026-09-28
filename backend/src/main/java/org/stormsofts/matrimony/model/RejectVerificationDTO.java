package org.stormsofts.matrimony.model;

/** Inbound body for POST /api/admin/verification/{userId}/reject. */
public class RejectVerificationDTO {

    private String reason;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}