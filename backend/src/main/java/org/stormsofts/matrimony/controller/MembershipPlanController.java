package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MembershipPlan;
import org.stormsofts.matrimony.model.MembershipPlanDTO;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.MembershipPlanService;
import org.stormsofts.matrimony.service.SubscriptionService;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Public (authenticated) plan listing for the pricing page, plus ADMIN-only
 * plan management. Admin endpoints check AuthUtil.isAdmin() and return 403
 * for a normal USER (spec test 15).
 */
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowedHeaders = "*")
public class MembershipPlanController {

    @Autowired private MembershipPlanService planService;
    @Autowired private SubscriptionService subscriptionService;

    // ---------- User side ----------

    @GetMapping("/api/membership/plans")
    public ResponseEntity<?> getActivePlans() {
        if (AuthUtil.currentUserId() == null) return ResponseEntity.status(401).body("Not authenticated.");
        List<MembershipPlanDTO> plans = planService.getActivePlans().stream()
                .map(MembershipPlanDTO::fromEntity).toList();
        return ResponseEntity.ok(plans);
    }

    // ---------- Admin side ----------

    private ResponseEntity<?> denyIfNotAdmin() {
        if (AuthUtil.currentUserId() == null) return ResponseEntity.status(401).body("Not authenticated.");
        if (!AuthUtil.isAdmin()) return ResponseEntity.status(403).body("Admin access required.");
        return null;
    }

    @GetMapping("/api/admin/membership/plans")
    public ResponseEntity<?> adminListPlans() {
        ResponseEntity<?> denied = denyIfNotAdmin();
        if (denied != null) return denied;
        return ResponseEntity.ok(planService.getAllPlansForAdmin());
    }

    @PostMapping("/api/admin/membership/plans")
    public ResponseEntity<?> adminCreatePlan(@RequestBody MembershipPlan plan) {
        ResponseEntity<?> denied = denyIfNotAdmin();
        if (denied != null) return denied;
        String err = validate(plan);
        if (err != null) return ResponseEntity.badRequest().body(err);
        try {
            return ResponseEntity.status(201).body(planService.create(plan));
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body("A plan with this code already exists.");
        }
    }

    @PutMapping("/api/admin/membership/plans/{id}")
    public ResponseEntity<?> adminUpdatePlan(@PathVariable Integer id, @RequestBody MembershipPlan plan) {
        ResponseEntity<?> denied = denyIfNotAdmin();
        if (denied != null) return denied;
        String err = validate(plan);
        if (err != null) return ResponseEntity.badRequest().body(err);
        try {
            return ResponseEntity.ok(planService.update(id, plan));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/api/admin/membership/plans/{id}/active")
    public ResponseEntity<?> adminSetActive(@PathVariable Integer id, @RequestParam boolean active) {
        ResponseEntity<?> denied = denyIfNotAdmin();
        if (denied != null) return denied;
        try {
            planService.setActive(id, active);
            return ResponseEntity.ok(Map.of("id", id, "active", active));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/api/admin/membership/stats")
    public ResponseEntity<?> adminStats() {
        ResponseEntity<?> denied = denyIfNotAdmin();
        if (denied != null) return denied;

        Instant startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalActiveSubscriptions", subscriptionService.countActiveTotal());
        stats.put("expiredSubscriptions", subscriptionService.countExpiredTotal());
        stats.put("totalRevenue", subscriptionService.getTotalRevenue());
        stats.put("thisMonthRevenue", subscriptionService.getRevenueSince(startOfMonth));

        Map<String, Long> perPlan = new LinkedHashMap<>();
        for (MembershipPlan p : planService.getAllPlansForAdmin()) {
            perPlan.put(p.getName(), subscriptionService.countActiveByPlan(p.getId()));
        }
        stats.put("activeByPlan", perPlan);
        return ResponseEntity.ok(stats);
    }

    private String validate(MembershipPlan p) {
        if (p.getCode() == null || p.getCode().isBlank()) return "Plan code is required.";
        if (p.getName() == null || p.getName().isBlank()) return "Plan name is required.";
        if (p.getPrice() == null || p.getPrice().compareTo(BigDecimal.ZERO) < 0) return "Price must be 0 or more.";
        if (p.getDurationDays() == null || p.getDurationDays() < 0) return "Duration must be 0 or more.";
        return null;
    }
}
