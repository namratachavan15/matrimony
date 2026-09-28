package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Part 7 (Block Profile). A one-directional "blocker blocks blockedUser"
 * record. Blocking is always checked both ways (A blocked B OR B blocked A)
 * wherever it matters -- see BlockService#isBlockedEitherWay -- so that a
 * blocked user cannot simply re-approach the person who blocked them.
 */
@Getter
@Setter
@Entity
@Table(
        name = "mst_blocked_user",
        uniqueConstraints = @UniqueConstraint(columnNames = {"blocker_id", "blocked_user_id"})
)
public class MstBlockedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "blocker_id", nullable = false)
    private Integer blockerId; // who performed the block

    @Column(name = "blocked_user_id", nullable = false)
    private Integer blockedUserId; // who got blocked

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getBlockerId() {
        return blockerId;
    }

    public void setBlockerId(Integer blockerId) {
        this.blockerId = blockerId;
    }

    public Integer getBlockedUserId() {
        return blockedUserId;
    }

    public void setBlockedUserId(Integer blockedUserId) {
        this.blockedUserId = blockedUserId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
