package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.*;

public interface SubscriptionService {

    /**
     * The plan currently in effect for this user -- lazily expires any
     * ACTIVE subscription whose endDate has passed, and falls back to the
     * FREE plan if the user has no active paid subscription. This is what
     * every feature-gate/limit check should call; nothing should trust a
     * cached "current plan" value.
     */
    MembershipPlan getEffectivePlan(Integer userId);

    CurrentMembershipDTO getCurrentMembership(Integer userId);

    Page<SubscriptionHistoryDTO> getHistory(Integer userId, Pageable pageable);

    /** Step 1 of the payment flow: creates a PENDING subscription + PENDING payment row, and a Razorpay order. */
    CreateOrderResponse createOrder(Integer userId, Integer planId);

    /** Step 2: verifies the Razorpay signature server-side, then activates the subscription. Idempotent. */
    CurrentMembershipDTO verifyAndActivate(Integer userId, VerifyPaymentRequest request);

    Page<MstPayment> getPaymentHistory(Integer userId, Pageable pageable);

    /** Records a failed/dismissed checkout. Never touches an already-SUCCESS payment. */
    void markPaymentFailed(Integer userId, String razorpayOrderId);

    // ---- Admin ----
    long countActiveByPlan(Integer planId);
    long countActiveTotal();
    long countExpiredTotal();
    java.math.BigDecimal getTotalRevenue();
    java.math.BigDecimal getRevenueSince(java.time.Instant since);
}
