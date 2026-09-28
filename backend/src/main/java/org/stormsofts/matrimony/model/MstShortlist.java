package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(
        name = "mst_shortlist",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "shortlisted_user_id"})
)
public class MstShortlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId; // who shortlisted

    @Column(name = "shortlisted_user_id", nullable = false)
    private Integer shortlistedUserId; // profile owner

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getShortlistedUserId() {
        return shortlistedUserId;
    }

    public void setShortlistedUserId(Integer shortlistedUserId) {
        this.shortlistedUserId = shortlistedUserId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
