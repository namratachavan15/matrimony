package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.PartnerPreferenceDTO;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.PartnerPreferenceService;

@RestController
@RequestMapping("/api/partner-preferences")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class PartnerPreferenceController {

    @Autowired
    private PartnerPreferenceService partnerPreferenceService;

    // GET /api/partner-preferences/my
    @GetMapping("/my")
    public ResponseEntity<?> myPreferences() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(partnerPreferenceService.getMyPreferences(userId));
    }

    // PUT /api/partner-preferences/my  body: PartnerPreferenceDTO
    @PutMapping("/my")
    public ResponseEntity<?> updateMyPreferences(@RequestBody PartnerPreferenceDTO body) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(partnerPreferenceService.updateMyPreferences(userId, body));
    }

    // DELETE /api/partner-preferences/my  (Reset)
    @DeleteMapping("/my")
    public ResponseEntity<?> resetMyPreferences() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        partnerPreferenceService.resetMyPreferences(userId);
        return ResponseEntity.ok().build();
    }
}