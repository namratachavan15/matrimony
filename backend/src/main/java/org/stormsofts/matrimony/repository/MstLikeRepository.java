package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstLike;

import java.util.List;
import java.util.Optional;

public interface MstLikeRepository extends JpaRepository<MstLike, Integer> {

    Optional<MstLike> findByUserIdAndLikedUserId(Integer userId, Integer likedUserId);

    List<MstLike> findByUserId(Integer userId);
}