package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.ContactVisibilityDTO;
import org.stormsofts.matrimony.model.PrivacySettingsDTO;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.PrivacySettingsService;

@RestController
@RequestMapping("/api/privacy")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class PrivacySettingsController {

    @Autowired
    private PrivacySettingsService privacySettingsService;

    // GET /api/privacy/my
    @GetMapping("/my")
    public ResponseEntity<?> mysettings() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(privacySettingsService.getMySettings(userId));
    }

    // PUT /api/privacy/my  body: PrivacySettingsDTO
    @PutMapping("/my")
    public ResponseEntity<?> updateMySettings(@RequestBody PrivacySettingsDTO body) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(privacySettingsService.updateMySettings(userId, body));
    }

    // GET /api/privacy/contact-visibility/{userId}
    // Used when viewing someone else's profile, to decide whether to render
    // their mobile/email in the Contact tab. Never returns the owner's other
    // settings (visibility tier etc.) -- only the two booleans the viewer needs.
    @GetMapping("/contact-visibility/{userId}")
    public ResponseEntity<?> contactVisibility(@PathVariable Integer userId) {
        Integer viewerId = AuthUtil.currentUserId();
        if (viewerId == null) return ResponseEntity.status(401).body("Not authenticated.");
        ContactVisibilityDTO dto = privacySettingsService.getContactVisibility(userId, viewerId);
        return ResponseEntity.ok(dto);
    }
}