package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * A mutual match, created when one user's Express Interest is accepted by
 * the other. userOneId is always the smaller of the two ids so that a
 * (userOneId, userTwoId) pair is unique regardless of who accepted whom --
 * this prevents duplicate matches.
 */
@Getter
@Setter
@Entity
@Table(
        name = "mst_match",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_one_id", "user_two_id"})
)
public class MstMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "user_one_id", nullable = false)
    private Integer userOneId;

    @Column(name = "user_two_id", nullable = false)
    private Integer userTwoId;

    // ACTIVE by default; kept as a String so it can be extended later
    // (e.g. UNMATCHED) without a schema change.
    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
