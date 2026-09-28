package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Part 5, item 15 (Contact Request). Mobile/email are never publicly
 * exposed -- a user must request contact, the receiver accepts/declines,
 * and only after ACCEPTED does {@link org.stormsofts.matrimony.service.ChatService}
 * / the privacy layer treat the pair as allowed to see each other's
 * contact details and chat.
 *
 * Mirrors {@link MstInterest} in shape (sender/receiver/status/timestamps),
 * kept as a separate table because a Contact Request is a distinct business
 * concept from Express Interest -- a pair can be matched via Interest but
 * still choose to separately request contact, and vice versa is not
 * possible by rule (chat requires one of match/accepted-interest/accepted
 * contact-request -- see ChatServiceImpl#canChat).
 */
@Getter
@Setter
@Entity
@Table(
        name = "mst_contact_request",
        uniqueConstraints = @UniqueConstraint(columnNames = {"sender_id", "receiver_id"})
)
public class MstContactRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "sender_id", nullable = false)
    private Integer senderId;

    @Column(name = "receiver_id", nullable = false)
    private Integer receiverId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ContactRequestStatus status = ContactRequestStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public ContactRequestStatus getStatus() {
        return status;
    }

    public void setStatus(ContactRequestStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
