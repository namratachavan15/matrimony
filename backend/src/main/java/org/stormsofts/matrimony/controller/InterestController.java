package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.InterestResponseDTO;
import org.stormsofts.matrimony.model.MstInterest;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.InterestService;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/interests")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class InterestController {

    @Autowired
    private InterestService interestService;

    // POST /api/interests/send?receiverId=10
    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestParam Integer receiverId) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            MstInterest interest = interestService.sendInterest(userId, receiverId);
            return ResponseEntity.status(201).body(interest);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // GET /api/interests/status?otherUserId=10
    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@RequestParam Integer otherUserId) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        InterestResponseDTO dto = interestService.getStatusBetween(userId, otherUserId);
        return ResponseEntity.ok(dto); // null body -> frontend treats as "no interest yet"
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable Integer id) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            return ResponseEntity.ok(interestService.acceptInterest(id, userId));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/decline")
    public ResponseEntity<?> decline(@PathVariable Integer id) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            return ResponseEntity.ok(interestService.declineInterest(id, userId));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Integer id) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            return ResponseEntity.ok(interestService.cancelInterest(id, userId));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // GET /api/interests/received?status=PENDING&page=0&size=20
    @GetMapping("/received")
    public ResponseEntity<?> getReceived(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<InterestResponseDTO> result = interestService.getReceived(userId, status, pageable);
        return ResponseEntity.ok(result);
    }

    // GET /api/interests/sent?page=0&size=20
    @GetMapping("/sent")
    public ResponseEntity<?> getSent(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<InterestResponseDTO> result = interestService.getSent(userId, pageable);
        return ResponseEntity.ok(result);
    }

    // GET /api/interests/sent-status-map -> { "12": "PENDING", "45": "ACCEPTED", ... }
    // Bulk lookup so a profile-card grid doesn't need one /status call per card.
    @GetMapping("/sent-status-map")
    public ResponseEntity<?> getSentStatusMap() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(interestService.getSentStatusMap(userId));
    }

    @GetMapping("/received/pending-count")
    public ResponseEntity<?> getPendingCount() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(Map.of("count", interestService.countPendingReceived(userId)));
    }
}
