package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.LikeService;

import java.util.Set;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class LikeController {

    @Autowired
    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    // POST /api/likes/toggle?likedUserId=10
    // The acting user is now taken from the authenticated JWT, never from a
    // client-supplied userId, to prevent one user from liking/unliking on
    // behalf of another (IDOR).
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(@RequestParam Integer likedUserId) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body("Not authenticated.");
        }
        if (userId.equals(likedUserId)) {
            return ResponseEntity.badRequest().body("You cannot like your own profile.");
        }
        boolean nowLiked = likeService.toggleLike(userId, likedUserId);
        return ResponseEntity.ok(nowLiked);
    }

    // GET /api/likes/my-liked
    @GetMapping("/my-liked")
    public ResponseEntity<?> getMyLiked() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body("Not authenticated.");
        }
        Set<Integer> likedIds = likeService.getLikedUserIds(userId);
        return ResponseEntity.ok(likedIds);
    }
}
