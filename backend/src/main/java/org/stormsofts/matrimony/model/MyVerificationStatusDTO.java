package org.stormsofts.matrimony.model;

import java.time.Instant;

/** What the logged-in user sees about their own verification status. */
public class MyVerificationStatusDTO {

    private Integer vstatus; // 0=PENDING, 1=VERIFIED, 2=REJECTED
    private String statusLabel;
    private String rejectionReason;
    private Instant verifiedAt;

    public MyVerificationStatusDTO() {
    }

    public MyVerificationStatusDTO(Integer vstatus, String statusLabel, String rejectionReason, Instant verifiedAt) {
        this.vstatus = vstatus;
        this.statusLabel = statusLabel;
        this.rejectionReason = rejectionReason;
        this.verifiedAt = verifiedAt;
    }

    public Integer getVstatus() {
        return vstatus;
    }

    public void setVstatus(Integer vstatus) {
        this.vstatus = vstatus;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Instant getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(Instant verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}