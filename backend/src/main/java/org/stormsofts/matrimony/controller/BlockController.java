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
import org.stormsofts.matrimony.service.BlockService;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/block")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class BlockController {

    @Autowired
    private BlockService blockService;

    // POST /api/block/{userId}
    @PostMapping("/{userId}")
    public ResponseEntity<?> block(@PathVariable Integer userId) {
        Integer currentUserId = AuthUtil.currentUserId();
        if (currentUserId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            blockService.block(currentUserId, userId);
            return ResponseEntity.ok(Map.of("blocked", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/block/{userId}
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unblock(@PathVariable Integer userId) {
        Integer currentUserId = AuthUtil.currentUserId();
        if (currentUserId == null) return ResponseEntity.status(401).body("Not authenticated.");
        blockService.unblock(currentUserId, userId);
        return ResponseEntity.ok(Map.of("blocked", false));
    }

    // GET /api/block/status/{userId}
    @GetMapping("/status/{userId}")
    public ResponseEntity<?> status(@PathVariable Integer userId) {
        Integer currentUserId = AuthUtil.currentUserId();
        if (currentUserId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(Map.of("blocked", blockService.isBlockedByMe(currentUserId, userId)));
    }

    // GET /api/block/my-ids
    @GetMapping("/my-ids")
    public ResponseEntity<?> myIds() {
        Integer currentUserId = AuthUtil.currentUserId();
        if (currentUserId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Set<Integer> ids = blockService.getBlockedUserIds(currentUserId);
        return ResponseEntity.ok(ids);
    }

    // GET /api/block/my?page=0&size=20
    @GetMapping("/my")
    public ResponseEntity<?> myBlocked(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Integer currentUserId = AuthUtil.currentUserId();
        if (currentUserId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ProfileCardDTO> result = blockService.getMyBlockedProfiles(currentUserId, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/count")
    public ResponseEntity<?> count() {
        Integer currentUserId = AuthUtil.currentUserId();
        if (currentUserId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(Map.of("count", blockService.countForUser(currentUserId)));
    }
}
