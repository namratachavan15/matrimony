package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.ProfileCardDTO;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.ShortlistService;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/shortlist")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class ShortlistController {

    @Autowired
    private ShortlistService shortlistService;

    // POST /api/shortlist/toggle?userId=10
    @PostMapping("/toggle")
    public ResponseEntity<?> toggle(@RequestParam Integer userId) {
        Integer currentUserId = AuthUtil.currentUserId();
        if (currentUserId == null) return ResponseEntity.status(401).body("Not authenticated.");
        if (currentUserId.equals(userId)) {
            return ResponseEntity.badRequest().body("You cannot shortlist your own profile.");
        }
        boolean nowShortlisted = shortlistService.toggleShortlist(currentUserId, userId);
        return ResponseEntity.ok(nowShortlisted);
    }

    // GET /api/shortlist/my-ids  -> Set<Integer> (mirrors /api/likes/my-liked)
    @GetMapping("/my-ids")
    public ResponseEntity<?> getMyShortlistedIds() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Set<Integer> ids = shortlistService.getShortlistedUserIds(userId);
        return ResponseEntity.ok(ids);
    }

    // GET /api/shortlist/my?page=0&size=20
    @GetMapping("/my")
    public ResponseEntity<?> getMyShortlist(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ProfileCardDTO> result = shortlistService.getMyShortlist(userId, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCount() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(Map.of("count", shortlistService.countForUser(userId)));
    }
}
