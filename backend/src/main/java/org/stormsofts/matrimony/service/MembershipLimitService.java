package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.ContactRequestStatus;
import org.stormsofts.matrimony.model.InterestStatus;
import org.stormsofts.matrimony.model.MembershipPlan;
import org.stormsofts.matrimony.repository.MstContactRequestRepository;
import org.stormsofts.matrimony.repository.MstInterestRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

/**
 * The single place that enforces plan limits, so both InterestServiceImpl
 * and ContactRequestServiceImpl (and anything else added later) call the
 * same rule rather than re-implementing it. A null limit on the plan means
 * unlimited. This is deliberately backend-only enforcement (Part 11) --
 * the frontend's MembershipGuard is just a UX nicety on top of this.
 */
@Service
public class MembershipLimitService {

    @Autowired private SubscriptionService subscriptionService;
    @Autowired private MstInterestRepository interestRepository;
    @Autowired private MstContactRequestRepository contactRequestRepository;

    private Instant startOfCurrentMonth() {
        return LocalDate.now().withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
    }

    /** Throws IllegalStateException (-> 409, same as other business-rule violations in this codebase) if over quota. */
    public void assertCanSendInterest(Integer userId) {
        MembershipPlan plan = subscriptionService.getEffectivePlan(userId);
        Integer limit = plan.getMonthlyInterestLimit();
        if (limit == null) return; // unlimited

        long used = interestRepository.countBySenderIdAndCreatedAtAfterAndStatusNot(
                userId, startOfCurrentMonth(), InterestStatus.CANCELLED);
        if (used >= limit) {
            throw new IllegalStateException(
                    "Your monthly interest limit (" + limit + ") on the " + plan.getName()
                            + " plan has been reached. Upgrade your membership to send more.");
        }
    }

    public void assertCanSendContactRequest(Integer userId) {
        MembershipPlan plan = subscriptionService.getEffectivePlan(userId);
        if (!plan.isContactRequestAccess()) {
            throw new IllegalStateException(
                    "Contact requests are not available on the " + plan.getName()
                            + " plan. Upgrade your membership to unlock this feature.");
        }

        Integer limit = plan.getMonthlyContactRequestLimit();
        if (limit == null) return; // unlimited

        long used = contactRequestRepository.countBySenderIdAndCreatedAtAfterAndStatusNot(
                userId, startOfCurrentMonth(), ContactRequestStatus.CANCELLED);
        if (used >= limit) {
            throw new IllegalStateException(
                    "Your monthly contact request limit (" + limit + ") on the " + plan.getName()
                            + " plan has been reached. Upgrade your membership to send more.");
        }
    }

    public void assertCanUseAdvancedSearch(Integer userId) {
        MembershipPlan plan = subscriptionService.getEffectivePlan(userId);
        if (!plan.isAdvancedSearch()) {
            throw new IllegalStateException(
                    "Advanced search is a paid feature. Upgrade your membership to access this.");
        }
    }
}
