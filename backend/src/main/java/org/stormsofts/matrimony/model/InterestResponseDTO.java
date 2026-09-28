package org.stormsofts.matrimony.model;

import java.time.Instant;

public class InterestResponseDTO {
    private Integer interestId;
    private InterestStatus status;
    private Integer senderId;
    private Integer receiverId;
    private ProfileCardDTO otherUser; // whichever side the current viewer is NOT
    private Instant createdAt;
    private Instant updatedAt;

    public InterestResponseDTO(Integer interestId, InterestStatus status, Integer senderId, Integer receiverId,
                                ProfileCardDTO otherUser, Instant createdAt, Instant updatedAt) {
        this.interestId = interestId;
        this.status = status;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.otherUser = otherUser;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getInterestId() {
        return interestId;
    }

    public InterestStatus getStatus() {
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
