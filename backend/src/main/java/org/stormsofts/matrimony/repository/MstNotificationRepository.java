package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.stormsofts.matrimony.model.MstNotification;

import java.util.Optional;

public interface MstNotificationRepository extends JpaRepository<MstNotification, Integer> {

    Page<MstNotification> findByRecipientIdOrderByCreatedAtDesc(Integer recipientId, Pageable pageable);

    Page<MstNotification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Integer recipientId, Pageable pageable);

    long countByRecipientIdAndIsReadFalse(Integer recipientId);

    Optional<MstNotification> findByIdAndRecipientId(Integer id, Integer recipientId);

    @Modifying
    @Query("update MstNotification n set n.isRead = true where n.recipientId = :recipientId and n.isRead = false")
    void markAllAsRead(@Param("recipientId") Integer recipientId);
}
