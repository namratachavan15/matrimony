package org.stormsofts.matrimony.model;

import java.time.Instant;

public class CurrentMembershipDTO {
    private MembershipPlanDTO plan;
    private SubscriptionStatus status;
    private Instant startDate;
    private Instant endDate;
    private long daysRemaining;

    // usage this period (for the progress bars on the dashboard)
    private int profileViewsUsedToday;
    private int interestsUsedThisMonth;
    private int contactRequestsUsedThisMonth;

    public CurrentMembershipDTO(MembershipPlanDTO plan, SubscriptionStatus status, Instant startDate,
                                Instant endDate, long daysRemaining, int profileViewsUsedToday,
                                int interestsUsedThisMonth, int contactRequestsUsedThisMonth) {
        this.plan = plan;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.daysRemaining = daysRemaining;
        this.profileViewsUsedToday = profileViewsUsedToday;
        this.interestsUsedThisMonth = interestsUsedThisMonth;
        this.contactRequestsUsedThisMonth = contactRequestsUsedThisMonth;
    }

    public MembershipPlanDTO getPlan() { return plan; }
    public SubscriptionStatus getStatus() { return status; }
    public Instant getStartDate() { return startDate; }
    public Instant getEndDate() { return endDate; }
    public long getDaysRemaining() { return daysRemaining; }
    public int getProfileViewsUsedToday() { return profileViewsUsedToday; }
    public int getInterestsUsedThisMonth() { return interestsUsedThisMonth; }
    public int getContactRequestsUsedThisMonth() { return contactRequestsUsedThisMonth; }
}
