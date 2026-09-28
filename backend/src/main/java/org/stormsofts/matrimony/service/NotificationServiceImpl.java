package org.stormsofts.matrimony.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.MstNotification;
import org.stormsofts.matrimony.model.NotificationType;
import org.stormsofts.matrimony.repository.MstNotificationRepository;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    @Autowired
    private MstNotificationRepository notificationRepository;

    @Override
    public void notify(Integer recipientId, NotificationType type, String title, String message,
                        Integer relatedUserId, Integer relatedEntityId) {
        try {
            if (recipientId == null) return;
            MstNotification n = new MstNotification();
            n.setRecipientId(recipientId);
            n.setType(type);
            n.setTitle(title);
            n.setMessage(message);
            n.setRelatedUserId(relatedUserId);
            n.setRelatedEntityId(relatedEntityId);
            n.setRead(false);
            notificationRepository.save(n);
        } catch (Exception e) {
            // Notifications are best-effort side-effects; never let a failure
            // here break the primary action (like/interest/match/etc).
            log.error("Failed to create notification for recipient {}: {}", recipientId, e.getMessage());
        }
    }

    @Override
    public Page<MstNotification> getMyNotifications(Integer userId, boolean unreadOnly, Pageable pageable) {
        if (unreadOnly) {
            return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId, pageable);
        }
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Override
    public long getUnreadCount(Integer userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Override
    public void markAsRead(Integer notificationId, Integer userId) {
        notificationRepository.findByIdAndRecipientId(notificationId, userId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Override
    @Transactional
    public void markAllAsRead(Integer userId) {
        notificationRepository.markAllAsRead(userId);
    }

    @Override
    public void delete(Integer notificationId, Integer userId) {
        notificationRepository.findByIdAndRecipientId(notificationId, userId)
                .ifPresent(notificationRepository::delete);
    }
}
