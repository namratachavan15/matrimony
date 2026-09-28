package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.InterestStatus;
import org.stormsofts.matrimony.model.MstInterest;

import java.util.Optional;

public interface MstInterestRepository extends JpaRepository<MstInterest, Integer> {

    Optional<MstInterest> findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

    Page<MstInterest> findByReceiverIdOrderByCreatedAtDesc(Integer receiverId, Pageable pageable);

    Page<MstInterest> findByReceiverIdAndStatusOrderByCreatedAtDesc(Integer receiverId, InterestStatus status, Pageable pageable);

    Page<MstInterest> findBySenderIdOrderByCreatedAtDesc(Integer senderId, Pageable pageable);

    long countByReceiverIdAndStatus(Integer receiverId, InterestStatus status);

    // All non-cancelled interests the user has sent -- used to build a bulk
    // "sent status" map for profile-card grids (mirrors /api/likes/my-liked)
    // so the frontend doesn't have to fire one status call per card.
    java.util.List<MstInterest> findBySenderIdAndStatusNot(Integer senderId, InterestStatus excludedStatus);

    // Used by Recommended Matches to exclude profiles that declined (or were
    // declined by) the current user, in either direction.
    java.util.List<MstInterest> findAllBySenderIdAndStatus(Integer senderId, InterestStatus status);

    java.util.List<MstInterest> findAllByReceiverIdAndStatus(Integer receiverId, InterestStatus status);

    // Membership feature: count how many interests this user has SENT since
    // a given instant (start of the current month), to enforce the plan's
    // monthly interest limit. Cancelled ones don't count against the quota.
    long countBySenderIdAndCreatedAtAfterAndStatusNot(
            Integer senderId, java.time.Instant since, InterestStatus excludedStatus);
}