package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstSubscription;
import org.stormsofts.matrimony.model.SubscriptionStatus;

import java.util.List;
import java.util.Optional;

public interface MstSubscriptionRepository extends JpaRepository<MstSubscription, Integer> {

    Optional<MstSubscription> findFirstByUserIdAndStatusOrderByEndDateDesc(Integer userId, SubscriptionStatus status);

    Page<MstSubscription> findByUserIdOrderByCreatedAtDesc(Integer userId, Pageable pageable);

    List<MstSubscription> findByStatus(SubscriptionStatus status);

    long countByStatus(SubscriptionStatus status);

    long countByPlanIdAndStatus(Integer planId, SubscriptionStatus status);
}
