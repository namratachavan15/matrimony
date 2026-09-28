package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Part 5, item 16 (Chat). One row per pair of users who are allowed to
 * message each other (see ChatServiceImpl#canChat -- mutual match, an
 * accepted interest, or an accepted contact request). userOneId is always
 * the smaller id, mirroring {@link MstMatch}, so the pair is unique
 * regardless of who sent the first message.
 */
@Getter
@Setter
@Entity
@Table(
        name = "mst_conversation",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_one_id", "user_two_id"})
)
public class MstConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "user_one_id", nullable = false)
    private Integer userOneId;

    @Column(name = "user_two_id", nullable = false)
    private Integer userTwoId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "last_message_at", nullable = false)
    private Instant lastMessageAt = Instant.now();

    @Column(name = "last_message_preview", length = 300)
    private String lastMessagePreview;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserOneId() {
        return userOneId;
    }

    public void setUserOneId(Integer userOneId) {
        this.userOneId = userOneId;
    }

    public Integer getUserTwoId() {
        return userTwoId;
    }

    public void setUserTwoId(Integer userTwoId) {
        this.userTwoId = userTwoId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(Instant lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public String getLastMessagePreview() {
        return lastMessagePreview;
    }

    public void setLastMessagePreview(String lastMessagePreview) {
        this.lastMessagePreview = lastMessagePreview;
    }
}
