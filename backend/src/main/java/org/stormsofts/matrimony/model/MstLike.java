package org.stormsofts.matrimony.model;



import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(
        name = "mst_likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "liked_user_id"})
)
public class MstLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer userId;        // who likes
    private Integer likedUserId;   // profile owner

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

    public Integer getLikedUserId() {
        return likedUserId;
    }

    public void setLikedUserId(Integer likedUserId) {
        this.likedUserId = likedUserId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
