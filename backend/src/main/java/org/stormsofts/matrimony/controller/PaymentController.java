package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.CreateOrderRequest;
import org.stormsofts.matrimony.model.VerifyPaymentRequest;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.MembershipPlanService;
import org.stormsofts.matrimony.service.SubscriptionService;

import java.util.Map;
import java.util.NoSuchElementException;

/**
 * The only place payment endpoints live. Every call resolves the user from
 * the JWT -- no userId, price, or payment status is ever accepted from the
 * client -- so users can only touch their own orders and history.
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowedHeaders = "*")
public class PaymentController {

    @Autowired private SubscriptionService subscriptionService;
    @Autowired private MembershipPlanService planService;

    // Step 1: create a Razorpay order using the plan's DB price.
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        if (request.getPlanId() == null) return ResponseEntity.badRequest().body("planId is required.");
        try {
            return ResponseEntity.status(201).body(subscriptionService.createOrder(userId, request.getPlanId()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // Step 2: verify the signature Razorpay Checkout returned, then activate. Idempotent.
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyPaymentRequest request) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            return ResponseEntity.ok(subscriptionService.verifyAndActivate(userId, request));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    // Records a failed/dismissed checkout so it shows as FAILED in history.
    @PostMapping("/failed")
    public ResponseEntity<?> failed(@RequestBody VerifyPaymentRequest request) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            subscriptionService.markPaymentFailed(userId, request.getRazorpayOrderId());
            return ResponseEntity.ok(Map.of("status", "FAILED"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // Own payments only; safe fields only (never the raw Razorpay signature).
    @GetMapping("/history")
    public ResponseEntity<?> paymentHistory(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "20") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, Math.min(size, 50));
        return ResponseEntity.ok(subscriptionService.getPaymentHistory(userId, pageable).map(p -> Map.of(
                "id", p.getId(),
                "transactionId", p.getRazorpayPaymentId() != null ? p.getRazorpayPaymentId() : p.getRazorpayOrderId(),
                "planId", p.getPlanId(),
                "planName", planName(p.getPlanId()),
                "amount", p.getAmount(),
                "currency", p.getCurrency(),
                "status", p.getStatus(),
                "createdAt", p.getCreatedAt()
        )));
    }

    private String planName(Integer planId) {
        try {
            return planService.getById(planId).getName();
        } catch (NoSuchElementException e) {
            return "Unknown";
        }
    }
}
