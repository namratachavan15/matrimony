package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstShortlist;

import java.util.List;
import java.util.Optional;

public interface MstShortlistRepository extends JpaRepository<MstShortlist, Integer> {

    Optional<MstShortlist> findByUserIdAndShortlistedUserId(Integer userId, Integer shortlistedUserId);

    List<MstShortlist> findByUserId(Integer userId);

    Page<MstShortlist> findByUserIdOrderByCreatedAtDesc(Integer userId, Pageable pageable);

    long countByUserId(Integer userId);
}
