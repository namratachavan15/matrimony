package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MembershipPlan;

import java.util.List;
import java.util.Optional;

public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, Integer> {
    List<MembershipPlan> findByActiveTrueOrderByDisplayOrderAsc();
    List<MembershipPlan> findAllByOrderByDisplayOrderAsc();
    Optional<MembershipPlan> findByCode(String code);
}
