package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.ContactRequestResponseDTO;
import org.stormsofts.matrimony.model.MstContactRequest;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.ContactRequestService;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/contact-requests")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class ContactRequestController {

    @Autowired
    private ContactRequestService contactRequestService;

    // POST /api/contact-requests/send?receiverId=10
    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestParam Integer receiverId) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            MstContactRequest request = contactRequestService.sendRequest(userId, receiverId);
            return ResponseEntity.status(201).body(request);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // GET /api/contact-requests/status?otherUserId=10
    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@RequestParam Integer otherUserId) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        ContactRequestResponseDTO dto = contactRequestService.getStatusBetween(userId, otherUserId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable Integer id) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            return ResponseEntity.ok(contactRequestService.acceptRequest(id, userId));
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
            return ResponseEntity.ok(contactRequestService.declineRequest(id, userId));
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
            return ResponseEntity.ok(contactRequestService.cancelRequest(id, userId));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // GET /api/contact-requests/received?status=PENDING&page=0&size=20
    @GetMapping("/received")
    public ResponseEntity<?> getReceived(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ContactRequestResponseDTO> result = contactRequestService.getReceived(userId, status, pageable);
        return ResponseEntity.ok(result);
    }

    // GET /api/contact-requests/sent?page=0&size=20
    @GetMapping("/sent")
    public ResponseEntity<?> getSent(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ContactRequestResponseDTO> result = contactRequestService.getSent(userId, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sent-status-map")
    public ResponseEntity<?> getSentStatusMap() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(contactRequestService.getSentStatusMap(userId));
    }

    @GetMapping("/received/pending-count")
    public ResponseEntity<?> getPendingCount() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(Map.of("count", contactRequestService.countPendingReceived(userId)));
    }
}
