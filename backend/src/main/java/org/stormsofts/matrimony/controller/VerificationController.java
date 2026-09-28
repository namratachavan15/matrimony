package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.AdminVerificationCardDTO;
import org.stormsofts.matrimony.model.MyVerificationStatusDTO;
import org.stormsofts.matrimony.model.RejectVerificationDTO;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.VerificationService;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    // ---- User-facing ----

    // GET /api/verification/my-status
    @GetMapping("/api/verification/my-status")
    public ResponseEntity<?> myStatus() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            MyVerificationStatusDTO dto = verificationService.getMyStatus(userId);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // ---- Admin-facing ----
    // Enforced with AuthUtil.isAdmin() as defense in depth -- see the note in
    // ReportController for why SecurityConfig alone doesn't yet lock these down.

    // GET /api/admin/verification?status=0&page=0&size=20
    @GetMapping("/api/admin/verification")
    public ResponseEntity<?> list(
            @RequestParam(value = "status", required = false) Integer status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        if (!AuthUtil.isAdmin()) return ResponseEntity.status(403).body("Admin access required.");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));
        Page<AdminVerificationCardDTO> result = verificationService.getForReview(status, pageable);
        return ResponseEntity.ok(result);
    }

    // POST /api/admin/verification/{userId}/approve
    @PostMapping("/api/admin/verification/{userId}/approve")
    public ResponseEntity<?> approve(@PathVariable Integer userId) {
        System.out.println("iniside approve");
        if (!AuthUtil.isAdmin()) return ResponseEntity.status(403).body("Admin access required.");
        try {
            return ResponseEntity.ok(verificationService.approve(userId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // POST /api/admin/verification/{userId}/reject  body: { reason }
    @PostMapping("/api/admin/verification/{userId}/reject")
    public ResponseEntity<?> reject(@PathVariable Integer userId, @RequestBody(required = false) RejectVerificationDTO body) {
        if (!AuthUtil.isAdmin()) return ResponseEntity.status(403).body("Admin access required.");
        try {
            String reason = body == null ? null : body.getReason();
            return ResponseEntity.ok(verificationService.reject(userId, reason));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // GET /api/admin/verification/count?status=0
    @GetMapping("/api/admin/verification/count")
    public ResponseEntity<?> count(@RequestParam(value = "status", defaultValue = "0") int status) {
        if (!AuthUtil.isAdmin()) return ResponseEntity.status(403).body("Admin access required.");
        return ResponseEntity.ok(Map.of("count", verificationService.countByStatus(status)));
    }
}