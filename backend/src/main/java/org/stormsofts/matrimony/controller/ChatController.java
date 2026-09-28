package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.ConversationDTO;
import org.stormsofts.matrimony.model.MstMessage;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.ChatService;

import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Part 5, item 16 (Chat). Messaging is only allowed between users who are
 * already matched / have an accepted interest / have an accepted contact
 * request -- see ChatServiceImpl#canChat. Blocked users can never reach
 * each other here (canChat checks BlockService first).
 */
@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // GET /api/messages/can-chat/{userId}
    @GetMapping("/can-chat/{userId}")
    public ResponseEntity<?> canChat(@PathVariable Integer userId) {
        Integer currentUserId = AuthUtil.currentUserId();
        if (currentUserId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(Map.of("canChat", chatService.canChat(currentUserId, userId)));
    }

    // GET /api/messages/conversations?page=0&size=20
    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        Pageable pageable = PageRequest.of(page, size);
        Page<ConversationDTO> result = chatService.getMyConversations(userId, pageable);
        return ResponseEntity.ok(result);
    }

    // GET /api/messages/conversations/{conversationId}?page=0&size=30
    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<?> getMessages(
            @PathVariable Integer conversationId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "30") int size) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<MstMessage> result = chatService.getMessages(conversationId, userId, pageable);
            return ResponseEntity.ok(result);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // POST /api/messages/conversations/{conversationId}/read
    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<?> markRead(@PathVariable Integer conversationId) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            chatService.markConversationRead(conversationId, userId);
            return ResponseEntity.ok(Map.of("read", true));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // GET /api/messages/with/{userId} -> gets-or-creates the conversation with this user
    @GetMapping("/with/{userId}")
    public ResponseEntity<?> getOrCreateWith(@PathVariable Integer userId) {
        Integer currentUserId = AuthUtil.currentUserId();
        if (currentUserId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            Integer conversationId = chatService.getOrCreateConversationId(currentUserId, userId);
            return ResponseEntity.ok(Map.of("conversationId", conversationId));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    public static class SendMessageRequest {
        public Integer receiverId;
        public String content;
    }

    // POST /api/messages/send  body: { receiverId, content }
    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestBody SendMessageRequest body) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        if (body == null || body.receiverId == null) {
            return ResponseEntity.badRequest().body("receiverId is required.");
        }
        try {
            MstMessage saved = chatService.sendMessage(userId, body.receiverId, body.content);
            return ResponseEntity.status(201).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(Map.of("count", chatService.getUnreadMessageCount(userId)));
    }
}
