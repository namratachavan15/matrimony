package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.stormsofts.matrimony.model.MstMatch;

import java.util.Optional;

public interface MstMatchRepository extends JpaRepository<MstMatch, Integer> {

    Optional<MstMatch> findByUserOneIdAndUserTwoId(Integer userOneId, Integer userTwoId);

    @Query("select m from MstMatch m where m.userOneId = :userId or m.userTwoId = :userId order by m.createdAt desc")
    Page<MstMatch> findAllForUser(@Param("userId") Integer userId, Pageable pageable);

    @Query("select count(m) from MstMatch m where m.userOneId = :userId or m.userTwoId = :userId")
    long countForUser(@Param("userId") Integer userId);
}
