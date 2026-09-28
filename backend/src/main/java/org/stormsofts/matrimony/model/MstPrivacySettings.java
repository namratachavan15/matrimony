package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Part 9 (Profile Privacy). One row per user. Defaults are privacy-safe:
 * REGISTERED visibility (not EVERYONE) and contact details hidden, matching
 * the spec's "default should be privacy-safe" requirement -- see
 * PrivacySettingsService#getOrCreateDefault for where new rows get these
 * defaults on first read.
 */
@Getter
@Setter
@Entity
@Table(name = "mst_privacy_settings", uniqueConstraints = @UniqueConstraint(columnNames = "user_id"))
public class MstPrivacySettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "profile_visibility", nullable = false, length = 20)
    private ProfileVisibility profileVisibility = ProfileVisibility.REGISTERED;

    @Column(name = "show_mobile", nullable = false)
    private boolean showMobile = false;

    @Column(name = "show_email", nullable = false)
    private boolean showEmail = false;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

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

    public ProfileVisibility getProfileVisibility() {
        return profileVisibility;
    }

    public void setProfileVisibility(ProfileVisibility profileVisibility) {
        this.profileVisibility = profileVisibility;
    }

    public boolean isShowMobile() {
        return showMobile;
    }

    public void setShowMobile(boolean showMobile) {
        this.showMobile = showMobile;
    }

    public boolean isShowEmail() {
        return showEmail;
    }

    public void setShowEmail(boolean showEmail) {
        this.showEmail = showEmail;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}