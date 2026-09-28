package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.SubscriptionService;

/**
 * Read-only membership endpoints for the logged-in user. The user always
 * comes from the JWT (AuthUtil) -- a userId is never accepted from the
 * request, so a user can only ever see their own membership and history.
 * (Payment endpoints live in PaymentController.)
 */
@RestController
@RequestMapping("/api/membership")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowedHeaders = "*")
public class SubscriptionController {

    @Autowired private SubscriptionService subscriptionService;

    @GetMapping("/current")
    public ResponseEntity<?> current() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(subscriptionService.getCurrentMembership(userId));
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "20") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, Math.min(size, 50));
        return ResponseEntity.ok(subscriptionService.getHistory(userId, pageable));
    }
}
