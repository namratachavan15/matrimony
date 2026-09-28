package org.stormsofts.matrimony.model;

import java.time.Instant;

/**
 * A conversation row for the "/messages" conversation list -- who the other
 * participant is, the last message preview, and how many of this viewer's
 * messages in it are unread. Never includes raw contact details.
 */
public class ConversationDTO {
    private Integer conversationId;
    private ProfileCardDTO otherUser;
    private String lastMessagePreview;
    private Instant lastMessageAt;
    private long unreadCount;

    public ConversationDTO(Integer conversationId, ProfileCardDTO otherUser, String lastMessagePreview,
                           Instant lastMessageAt, long unreadCount) {
        this.conversationId = conversationId;
        this.otherUser = otherUser;
        this.lastMessagePreview = lastMessagePreview;
        this.lastMessageAt = lastMessageAt;
        this.unreadCount = unreadCount;
    }

    public Integer getConversationId() {
        return conversationId;
    }

    public ProfileCardDTO getOtherUser() {
        return otherUser;
    }

    public String getLastMessagePreview() {
        return lastMessagePreview;
    }

    public Instant getLastMessageAt() {
        return lastMessageAt;
    }

    public long getUnreadCount() {
        return unreadCount;
    }
}
