package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.MstNotification;
import org.stormsofts.matrimony.model.NotificationType;

public interface NotificationService {

    /**
     * Create and persist a notification for recipientId. Fire-and-forget:
     * never throws out to the caller's main flow (e.g. a like/interest action
     * should still succeed even if a notification insert somehow fails).
     */
    void notify(Integer recipientId, NotificationType type, String title, String message,
                Integer relatedUserId, Integer relatedEntityId);

    Page<MstNotification> getMyNotifications(Integer userId, boolean unreadOnly, Pageable pageable);

    long getUnreadCount(Integer userId);

    void markAsRead(Integer notificationId, Integer userId);

    void markAllAsRead(Integer userId);

    void delete(Integer notificationId, Integer userId);
}
