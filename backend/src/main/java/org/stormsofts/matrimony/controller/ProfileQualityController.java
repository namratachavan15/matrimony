package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.ProfileQualityService;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/profile-quality")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class ProfileQualityController {

    @Autowired
    private ProfileQualityService profileQualityService;

    // GET /api/profile-quality/completion
    @GetMapping("/completion")
    public ResponseEntity<?> completion() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            return ResponseEntity.ok(profileQualityService.getCompletion(userId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // GET /api/profile-quality/strength
    @GetMapping("/strength")
    public ResponseEntity<?> strength() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            return ResponseEntity.ok(profileQualityService.getStrength(userId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}