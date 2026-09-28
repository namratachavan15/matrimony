package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Membership / Subscription feature. A plan is entirely admin-configurable
 * -- name, price, duration, features and usage limits all live here so the
 * frontend never hardcodes a price or a limit (see spec rule 8/9).
 *
 * Usage limits (dailyProfileViewLimit / monthlyInterestLimit /
 * monthlyContactRequestLimit) are enforced by {@link org.stormsofts.matrimony.service.MembershipLimitService},
 * which counts actual rows in the existing Interest/ContactRequest/ProfileView
 * tables for the current period rather than a separate running counter --
 * simpler, and always consistent with the real data. A null limit means
 * unlimited.
 */
@Getter
@Setter
@Entity
@Table(name = "mst_membership_plan")
public class MembershipPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    /** Stable machine code, e.g. "FREE", "SILVER", "GOLD", "PREMIUM". Not shown to users. */
    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "name", nullable = false, length = 60)
    private String name;

    /** In rupees (e.g. 999.00). FREE plan should be 0. */
    @Column(name = "price", nullable = false)
    private java.math.BigDecimal price = java.math.BigDecimal.ZERO;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays = 0;

    @Column(name = "description", length = 500)
    private String description;

    /** Comma-separated short bullet points shown on the pricing card, e.g. "Advanced Search,Messaging,..." */
    @Column(name = "features", length = 1000)
    private String features;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "popular", nullable = false)
    private boolean popular = false;

    // ---- Usage limits (null = unlimited) ----
    @Column(name = "daily_profile_view_limit")
    private Integer dailyProfileViewLimit;

    @Column(name = "monthly_interest_limit")
    private Integer monthlyInterestLimit;

    @Column(name = "monthly_contact_request_limit")
    private Integer monthlyContactRequestLimit;

    // ---- Feature flags ----
    @Column(name = "advanced_search", nullable = false)
    private boolean advancedSearch = false;

    @Column(name = "messaging_enabled", nullable = false)
    private boolean messagingEnabled = true;

    @Column(name = "contact_request_access", nullable = false)
    private boolean contactRequestAccess = true;

    @Column(name = "profile_boost", nullable = false)
    private boolean profileBoost = false;

    @Column(name = "priority_visibility", nullable = false)
    private boolean priorityVisibility = false;

    @Column(name = "premium_badge", nullable = false)
    private boolean premiumBadge = false;

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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public boolean isPopular() {
        return popular;
    }

    public void setPopular(boolean popular) {
        this.popular = popular;
    }

    public Integer getDailyProfileViewLimit() {
        return dailyProfileViewLimit;
    }

    public void setDailyProfileViewLimit(Integer dailyProfileViewLimit) {
        this.dailyProfileViewLimit = dailyProfileViewLimit;
    }

    public Integer getMonthlyInterestLimit() {
        return monthlyInterestLimit;
    }

    public void setMonthlyInterestLimit(Integer monthlyInterestLimit) {
        this.monthlyInterestLimit = monthlyInterestLimit;
    }

    public Integer getMonthlyContactRequestLimit() {
        return monthlyContactRequestLimit;
    }

    public void setMonthlyContactRequestLimit(Integer monthlyContactRequestLimit) {
        this.monthlyContactRequestLimit = monthlyContactRequestLimit;
    }

    public boolean isAdvancedSearch() {
        return advancedSearch;
    }

    public void setAdvancedSearch(boolean advancedSearch) {
        this.advancedSearch = advancedSearch;
    }

    public boolean isMessagingEnabled() {
        return messagingEnabled;
    }

    public void setMessagingEnabled(boolean messagingEnabled) {
        this.messagingEnabled = messagingEnabled;
    }

    public boolean isContactRequestAccess() {
        return contactRequestAccess;
    }

    public void setContactRequestAccess(boolean contactRequestAccess) {
        this.contactRequestAccess = contactRequestAccess;
    }

    public boolean isProfileBoost() {
        return profileBoost;
    }

    public void setProfileBoost(boolean profileBoost) {
        this.profileBoost = profileBoost;
    }

    public boolean isPriorityVisibility() {
        return priorityVisibility;
    }

    public void setPriorityVisibility(boolean priorityVisibility) {
        this.priorityVisibility = priorityVisibility;
    }

    public boolean isPremiumBadge() {
        return premiumBadge;
    }

    public void setPremiumBadge(boolean premiumBadge) {
        this.premiumBadge = premiumBadge;
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
