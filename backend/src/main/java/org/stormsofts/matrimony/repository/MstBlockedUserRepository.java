package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstBlockedUser;

import java.util.List;
import java.util.Optional;

public interface MstBlockedUserRepository extends JpaRepository<MstBlockedUser, Integer> {

    Optional<MstBlockedUser> findByBlockerIdAndBlockedUserId(Integer blockerId, Integer blockedUserId);

    boolean existsByBlockerIdAndBlockedUserId(Integer blockerId, Integer blockedUserId);

    List<MstBlockedUser> findByBlockerId(Integer blockerId);

    Page<MstBlockedUser> findByBlockerIdOrderByCreatedAtDesc(Integer blockerId, Pageable pageable);

    long countByBlockerId(Integer blockerId);
}
