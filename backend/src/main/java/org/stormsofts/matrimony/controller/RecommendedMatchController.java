package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.RecommendedProfileDTO;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.RecommendedMatchService;

@RestController
@RequestMapping("/api/recommended-matches")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class RecommendedMatchController {

    @Autowired
    private RecommendedMatchService recommendedMatchService;

    // GET /api/recommended-matches?page=0&size=12
    @GetMapping
    public ResponseEntity<?> getRecommendations(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, size);
        Page<RecommendedProfileDTO> result = recommendedMatchService.getRecommendations(userId, pageable);
        return ResponseEntity.ok(result);
    }
}