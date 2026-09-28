package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.*;
import org.stormsofts.matrimony.repository.MembershipPlanRepository;
import org.stormsofts.matrimony.repository.MstContactRequestRepository;
import org.stormsofts.matrimony.repository.MstInterestRepository;
import org.stormsofts.matrimony.repository.MstPaymentRepository;
import org.stormsofts.matrimony.repository.MstSubscriptionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired private MstSubscriptionRepository subscriptionRepository;
    @Autowired private MstPaymentRepository paymentRepository;
    @Autowired private MembershipPlanRepository planRepository;
    @Autowired private MstInterestRepository interestRepository;
    @Autowired private MstContactRequestRepository contactRequestRepository;
    @Autowired private RazorpayService razorpayService;

    private MembershipPlan freePlan() {
        return planRepository.findByCode("FREE")
                .orElseThrow(() -> new IllegalStateException("FREE plan is not configured."));
    }

    @Override
    @Transactional
    public MembershipPlan getEffectivePlan(Integer userId) {
        Optional<MstSubscription> activeOpt =
                subscriptionRepository.findFirstByUserIdAndStatusOrderByEndDateDesc(userId, SubscriptionStatus.ACTIVE);

        if (activeOpt.isEmpty()) {
            return freePlan();
        }

        MstSubscription sub = activeOpt.get();
        if (sub.getEndDate() != null && sub.getEndDate().isBefore(Instant.now())) {
            sub.setStatus(SubscriptionStatus.EXPIRED);
            sub.setUpdatedAt(Instant.now());
            subscriptionRepository.save(sub);
            return freePlan();
        }

        return planRepository.findById(sub.getPlanId()).orElse(freePlan());
    }

    @Override
    public CurrentMembershipDTO getCurrentMembership(Integer userId) {
        MembershipPlan plan = getEffectivePlan(userId);

        Optional<MstSubscription> activeOpt =
                subscriptionRepository.findFirstByUserIdAndStatusOrderByEndDateDesc(userId, SubscriptionStatus.ACTIVE);

        Instant start = activeOpt.map(MstSubscription::getStartDate).orElse(null);
        Instant end = activeOpt.map(MstSubscription::getEndDate).orElse(null);
        long daysRemaining = -1;
        if (end != null) {
            daysRemaining = Math.max(0, ChronoUnit.DAYS.between(Instant.now(), end));
        }

        Instant startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        int interestsUsed = (int) interestRepository.countBySenderIdAndCreatedAtAfterAndStatusNot(
                userId, startOfMonth, InterestStatus.CANCELLED);
        int contactRequestsUsed = (int) contactRequestRepository.countBySenderIdAndCreatedAtAfterAndStatusNot(
                userId, startOfMonth, ContactRequestStatus.CANCELLED);

        return new CurrentMembershipDTO(
                MembershipPlanDTO.fromEntity(plan),
                activeOpt.map(MstSubscription::getStatus).orElse(SubscriptionStatus.ACTIVE),
                start, end, daysRemaining,
                0, // daily profile-view usage isn't timestamp-tracked in the existing schema yet -- see notes
                interestsUsed,
                contactRequestsUsed
        );
    }

    @Override
    public Page<SubscriptionHistoryDTO> getHistory(Integer userId, Pageable pageable) {
        return subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(s -> {
                    String planName = planRepository.findById(s.getPlanId())
                            .map(MembershipPlan::getName).orElse("Unknown");
                    BigDecimal amount = planRepository.findById(s.getPlanId())
                            .map(MembershipPlan::getPrice).orElse(BigDecimal.ZERO);
                    return new SubscriptionHistoryDTO(s.getId(), planName, amount, s.getStartDate(), s.getEndDate(),
                            s.getStatus(), s.getPaymentStatus(), s.getTransactionId(), s.getCreatedAt());
                });
    }

    @Override
    @Transactional
    public CreateOrderResponse createOrder(Integer userId, Integer planId) {
        MembershipPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new NoSuchElementException("Plan not found."));
        if (!plan.isActive()) {
            throw new IllegalStateException("This plan is not currently available.");
        }
        if (plan.getPrice() == null || plan.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("This plan does not require payment.");
        }

        // Price and amount are computed here, from the DB -- never trust a
        // price sent by the frontend (spec rule 24).
        long amountInPaise = plan.getPrice()
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        MstPayment payment = new MstPayment();
        payment.setUserId(userId);
        payment.setPlanId(planId);
        payment.setAmount(plan.getPrice());
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.PENDING);

        String receipt = "sub_" + userId + "_" + System.currentTimeMillis();
        String orderId = razorpayService.createOrder(amountInPaise, "INR", receipt);
        payment.setRazorpayOrderId(orderId);
        payment = paymentRepository.save(payment);

        MstSubscription subscription = new MstSubscription();
        subscription.setUserId(userId);
        subscription.setPlanId(planId);
        subscription.setStatus(SubscriptionStatus.PENDING);
        subscription.setPaymentStatus(PaymentStatus.PENDING);
        subscription = subscriptionRepository.save(subscription);

        payment.setSubscriptionId(subscription.getId());
        paymentRepository.save(payment);

        return new CreateOrderResponse(orderId, razorpayService.getKeyId(), amountInPaise, "INR", plan.getName());
    }

    @Override
    @Transactional
    public CurrentMembershipDTO verifyAndActivate(Integer userId, VerifyPaymentRequest request) {
        MstPayment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new NoSuchElementException("Order not found."));

        // Ownership check -- never let user A activate a subscription created for user B.
        if (!payment.getUserId().equals(userId)) {
            throw new SecurityException("This order does not belong to you.");
        }

        // Idempotent: a duplicate/retried callback for an already-verified
        // payment just returns the current state instead of double-activating.
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return getCurrentMembership(userId);
        }

        boolean valid = razorpayService.verifySignature(
                request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

        MstSubscription subscription = payment.getSubscriptionId() != null
                ? subscriptionRepository.findById(payment.getSubscriptionId()).orElse(null)
                : null;

        if (!valid) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setUpdatedAt(Instant.now());
            paymentRepository.save(payment);
            if (subscription != null) {
                subscription.setStatus(SubscriptionStatus.CANCELLED);
                subscription.setPaymentStatus(PaymentStatus.FAILED);
                subscription.setUpdatedAt(Instant.now());
                subscriptionRepository.save(subscription);
            }
            throw new IllegalStateException("Payment verification failed.");
        }

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setUpdatedAt(Instant.now());
        paymentRepository.save(payment);

        if (subscription != null) {
            MembershipPlan plan = planRepository.findById(subscription.getPlanId())
                    .orElseThrow(() -> new NoSuchElementException("Plan not found."));

            // Only one paid subscription active at a time -- a new purchase
            // supersedes whatever was active before it.
            subscriptionRepository.findFirstByUserIdAndStatusOrderByEndDateDesc(userId, SubscriptionStatus.ACTIVE)
                    .ifPresent(prev -> {
                        if (!prev.getId().equals(subscription.getId())) {
                            prev.setStatus(SubscriptionStatus.CANCELLED);
                            prev.setUpdatedAt(Instant.now());
                            subscriptionRepository.save(prev);
                        }
                    });

            Instant now = Instant.now();
            subscription.setStartDate(now);
            subscription.setEndDate(now.plus(plan.getDurationDays(), ChronoUnit.DAYS));
            subscription.setStatus(SubscriptionStatus.ACTIVE);
            subscription.setPaymentStatus(PaymentStatus.SUCCESS);
            subscription.setTransactionId(request.getRazorpayPaymentId());
            subscription.setUpdatedAt(now);
            subscriptionRepository.save(subscription);
        }

        return getCurrentMembership(userId);
    }

    @Override
    @Transactional
    public void markPaymentFailed(Integer userId, String razorpayOrderId) {
        MstPayment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found."));
        if (!payment.getUserId().equals(userId)) {
            throw new SecurityException("This order does not belong to you.");
        }
        if (payment.getStatus() != PaymentStatus.PENDING) {
            return; // SUCCESS stays SUCCESS; already FAILED is a no-op
        }
        payment.setStatus(PaymentStatus.FAILED);
        payment.setUpdatedAt(Instant.now());
        paymentRepository.save(payment);
        if (payment.getSubscriptionId() != null) {
            subscriptionRepository.findById(payment.getSubscriptionId()).ifPresent(sub -> {
                if (sub.getStatus() == SubscriptionStatus.PENDING) {
                    sub.setStatus(SubscriptionStatus.CANCELLED);
                    sub.setPaymentStatus(PaymentStatus.FAILED);
                    sub.setUpdatedAt(Instant.now());
                    subscriptionRepository.save(sub);
                }
            });
        }
    }

    @Override
    public Page<MstPayment> getPaymentHistory(Integer userId, Pageable pageable) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Override
    public long countActiveByPlan(Integer planId) {
        return subscriptionRepository.countByPlanIdAndStatus(planId, SubscriptionStatus.ACTIVE);
    }

    @Override
    public long countActiveTotal() {
        return subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);
    }

    @Override
    public long countExpiredTotal() {
        return subscriptionRepository.countByStatus(SubscriptionStatus.EXPIRED);
    }

    @Override
    public BigDecimal getTotalRevenue() {
        return paymentRepository.sumAmountByStatus(PaymentStatus.SUCCESS);
    }

    @Override
    public BigDecimal getRevenueSince(Instant since) {
        return paymentRepository.sumAmountByStatusSince(PaymentStatus.SUCCESS, since);
    }
}
