package org.stormsofts.matrimony.model;

import java.time.Instant;

public class ContactRequestResponseDTO {
    private Integer requestId;
    private ContactRequestStatus status;
    private Integer senderId;
    private Integer receiverId;
    private ProfileCardDTO otherUser; // whichever side the current viewer is NOT
    private Instant createdAt;
    private Instant updatedAt;

    public ContactRequestResponseDTO(Integer requestId, ContactRequestStatus status, Integer senderId,
                                     Integer receiverId, ProfileCardDTO otherUser,
                                     Instant createdAt, Instant updatedAt) {
        this.requestId = requestId;
        this.status = status;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.otherUser = otherUser;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getRequestId() {
        return requestId;
    }

    public ContactRequestStatus getStatus() {
        return status;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public ProfileCardDTO getOtherUser() {
        return otherUser;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
