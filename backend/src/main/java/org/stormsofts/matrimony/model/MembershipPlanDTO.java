package org.stormsofts.matrimony.model;

import java.math.BigDecimal;
import java.util.List;

public class MembershipPlanDTO {
    private Integer id;
    private String code;
    private String name;
    private BigDecimal price;
    private Integer durationDays;
    private String description;
    private List<String> features;
    private boolean popular;
    private Integer displayOrder;

    private Integer dailyProfileViewLimit;
    private Integer monthlyInterestLimit;
    private Integer monthlyContactRequestLimit;
    private boolean advancedSearch;
    private boolean messagingEnabled;
    private boolean contactRequestAccess;
    private boolean profileBoost;
    private boolean priorityVisibility;
    private boolean premiumBadge;

    public static MembershipPlanDTO fromEntity(MembershipPlan p) {
        MembershipPlanDTO dto = new MembershipPlanDTO();
        dto.id = p.getId();
        dto.code = p.getCode();
        dto.name = p.getName();
        dto.price = p.getPrice();
        dto.durationDays = p.getDurationDays();
        dto.description = p.getDescription();
        dto.features = p.getFeatures() == null || p.getFeatures().isBlank()
                ? List.of()
                : List.of(p.getFeatures().split("\\s*,\\s*"));
        dto.popular = p.isPopular();
        dto.displayOrder = p.getDisplayOrder();
        dto.dailyProfileViewLimit = p.getDailyProfileViewLimit();
        dto.monthlyInterestLimit = p.getMonthlyInterestLimit();
        dto.monthlyContactRequestLimit = p.getMonthlyContactRequestLimit();
        dto.advancedSearch = p.isAdvancedSearch();
        dto.messagingEnabled = p.isMessagingEnabled();
        dto.contactRequestAccess = p.isContactRequestAccess();
        dto.profileBoost = p.isProfileBoost();
        dto.priorityVisibility = p.isPriorityVisibility();
        dto.premiumBadge = p.isPremiumBadge();
        return dto;
    }

    public Integer getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public Integer getDurationDays() { return durationDays; }
    public String getDescription() { return description; }
    public List<String> getFeatures() { return features; }
    public boolean isPopular() { return popular; }
    public Integer getDisplayOrder() { return displayOrder; }
    public Integer getDailyProfileViewLimit() { return dailyProfileViewLimit; }
    public Integer getMonthlyInterestLimit() { return monthlyInterestLimit; }
    public Integer getMonthlyContactRequestLimit() { return monthlyContactRequestLimit; }
    public boolean isAdvancedSearch() { return advancedSearch; }
    public boolean isMessagingEnabled() { return messagingEnabled; }
    public boolean isContactRequestAccess() { return contactRequestAccess; }
    public boolean isProfileBoost() { return profileBoost; }
    public boolean isPriorityVisibility() { return priorityVisibility; }
    public boolean isPremiumBadge() { return premiumBadge; }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public void setPopular(boolean popular) {
        this.popular = popular;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public void setDailyProfileViewLimit(Integer dailyProfileViewLimit) {
        this.dailyProfileViewLimit = dailyProfileViewLimit;
    }

    public void setMonthlyInterestLimit(Integer monthlyInterestLimit) {
        this.monthlyInterestLimit = monthlyInterestLimit;
    }

    public void setMonthlyContactRequestLimit(Integer monthlyContactRequestLimit) {
        this.monthlyContactRequestLimit = monthlyContactRequestLimit;
    }

    public void setAdvancedSearch(boolean advancedSearch) {
        this.advancedSearch = advancedSearch;
    }

    public void setMessagingEnabled(boolean messagingEnabled) {
        this.messagingEnabled = messagingEnabled;
    }

    public void setContactRequestAccess(boolean contactRequestAccess) {
        this.contactRequestAccess = contactRequestAccess;
    }

    public void setProfileBoost(boolean profileBoost) {
        this.profileBoost = profileBoost;
    }

    public void setPriorityVisibility(boolean priorityVisibility) {
        this.priorityVisibility = priorityVisibility;
    }

    public void setPremiumBadge(boolean premiumBadge) {
        this.premiumBadge = premiumBadge;
    }
}
