package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.stormsofts.matrimony.model.MstConversation;

import java.util.Optional;

public interface MstConversationRepository extends JpaRepository<MstConversation, Integer> {

    Optional<MstConversation> findByUserOneIdAndUserTwoId(Integer userOneId, Integer userTwoId);

    @Query("select c from MstConversation c where c.userOneId = :userId or c.userTwoId = :userId " +
            "order by c.lastMessageAt desc")
    Page<MstConversation> findAllForUser(@Param("userId") Integer userId, Pageable pageable);
}
