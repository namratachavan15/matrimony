package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.stormsofts.matrimony.model.MstMessage;

import java.time.Instant;

public interface MstMessageRepository extends JpaRepository<MstMessage, Integer> {

    Page<MstMessage> findByConversationIdOrderByCreatedAtDesc(Integer conversationId, Pageable pageable);

    long countByConversationIdAndReceiverIdAndReadFalse(Integer conversationId, Integer receiverId);

    long countByReceiverIdAndReadFalse(Integer receiverId);

    @Modifying
    @Query("update MstMessage m set m.read = true, m.readAt = :readAt " +
            "where m.conversationId = :conversationId and m.receiverId = :receiverId and m.read = false")
    void markConversationRead(@Param("conversationId") Integer conversationId,
                              @Param("receiverId") Integer receiverId,
                              @Param("readAt") Instant readAt);
}
