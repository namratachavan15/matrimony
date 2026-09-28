package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.ConversationDTO;
import org.stormsofts.matrimony.model.MstMessage;

public interface ChatService {

    /**
     * Business rule (Part 5, item 16): two users may only message each
     * other once there is a Mutual Match, an ACCEPTED Express Interest, or
     * an ACCEPTED Contact Request between them -- and neither has blocked
     * the other.
     */
    boolean canChat(Integer userA, Integer userB);

    /** Sends a message, creating the conversation on first contact. Enforces canChat(). */
    MstMessage sendMessage(Integer senderId, Integer receiverId, String content);

    Page<ConversationDTO> getMyConversations(Integer userId, Pageable pageable);

    /** Paginated messages (newest first) for a conversation the caller is a participant of. */
    Page<MstMessage> getMessages(Integer conversationId, Integer userId, Pageable pageable);

    /** Gets (or creates, if canChat() and none exists yet) the conversation with otherUserId. */
    Integer getOrCreateConversationId(Integer userId, Integer otherUserId);

    void markConversationRead(Integer conversationId, Integer userId);

    long getUnreadMessageCount(Integer userId);
}
