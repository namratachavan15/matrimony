package org.stormsofts.matrimony.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.MembershipPlan;
import org.stormsofts.matrimony.repository.MembershipPlanRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MembershipPlanServiceImpl implements MembershipPlanService {

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;

    @Override
    public List<MembershipPlan> getActivePlans() {
        return membershipPlanRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    @Override
    public List<MembershipPlan> getAllPlansForAdmin() {
        return membershipPlanRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public MembershipPlan getById(Integer id) {
        return membershipPlanRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Plan not found."));
    }

    @Override
    @Transactional
    public MembershipPlan create(MembershipPlan plan) {
        plan.setId(null);
        plan.setCreatedAt(Instant.now());
        plan.setUpdatedAt(Instant.now());
        return membershipPlanRepository.save(plan);
    }

    @Override
    @Transactional
    public MembershipPlan update(Integer id, MembershipPlan updated) {
        MembershipPlan existing = getById(id);
        existing.setName(updated.getName());
        existing.setPrice(updated.getPrice());
        existing.setDurationDays(updated.getDurationDays());
        existing.setDescription(updated.getDescription());
        existing.setFeatures(updated.getFeatures());
        existing.setActive(updated.isActive());
        existing.setDisplayOrder(updated.getDisplayOrder());
        existing.setPopular(updated.isPopular());
        existing.setDailyProfileViewLimit(updated.getDailyProfileViewLimit());
        existing.setMonthlyInterestLimit(updated.getMonthlyInterestLimit());
        existing.setMonthlyContactRequestLimit(updated.getMonthlyContactRequestLimit());
        existing.setAdvancedSearch(updated.isAdvancedSearch());
        existing.setMessagingEnabled(updated.isMessagingEnabled());
        existing.setContactRequestAccess(updated.isContactRequestAccess());
        existing.setProfileBoost(updated.isProfileBoost());
        existing.setPriorityVisibility(updated.isPriorityVisibility());
        existing.setPremiumBadge(updated.isPremiumBadge());
        existing.setUpdatedAt(Instant.now());
        // code is intentionally not editable -- it's the stable key other rows key off of
        return membershipPlanRepository.save(existing);
    }

    @Override
    @Transactional
    public void setActive(Integer id, boolean active) {
        MembershipPlan plan = getById(id);
        plan.setActive(active);
        plan.setUpdatedAt(Instant.now());
        membershipPlanRepository.save(plan);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!membershipPlanRepository.existsById(id)) {
            throw new NoSuchElementException("Plan not found.");
        }
        membershipPlanRepository.deleteById(id);
    }

    @Override
    @PostConstruct
    @Transactional
    public void ensureDefaultPlansSeeded() {
        if (membershipPlanRepository.count() > 0) {
            return;
        }

        MembershipPlan free = new MembershipPlan();
        free.setCode("FREE");
        free.setName("Free");
        free.setPrice(BigDecimal.ZERO);
        free.setDurationDays(36500); // effectively unlimited, never expires
        free.setDescription("Get started and explore matches.");
        free.setFeatures("Basic Profile,Limited Searches,Limited Interests");
        free.setDisplayOrder(1);
        free.setDailyProfileViewLimit(10);
        free.setMonthlyInterestLimit(5);
        free.setMonthlyContactRequestLimit(2);
        free.setAdvancedSearch(false);
        free.setMessagingEnabled(true);
        free.setContactRequestAccess(false);
        membershipPlanRepository.save(free);

        MembershipPlan silver = new MembershipPlan();
        silver.setCode("SILVER");
        silver.setName("Silver");
        silver.setPrice(new BigDecimal("999"));
        silver.setDurationDays(90);
        silver.setDescription("More reach, more conversations.");
        silver.setFeatures("Advanced Search,More Interests,More Profile Views,Messaging,Contact Requests");
        silver.setDisplayOrder(2);
        silver.setDailyProfileViewLimit(50);
        silver.setMonthlyInterestLimit(50);
        silver.setMonthlyContactRequestLimit(20);
        silver.setAdvancedSearch(true);
        silver.setContactRequestAccess(true);
        membershipPlanRepository.save(silver);

        MembershipPlan gold = new MembershipPlan();
        gold.setCode("GOLD");
        gold.setName("Gold");
        gold.setPrice(new BigDecimal("1499"));
        gold.setDurationDays(180);
        gold.setDescription("Stand out with higher visibility.");
        gold.setFeatures("All Silver Features,Higher Contact Limits,Profile Boost,Priority Recommendations");
        gold.setDisplayOrder(3);
        gold.setPopular(true);
        gold.setDailyProfileViewLimit(100);
        gold.setMonthlyInterestLimit(100);
        gold.setMonthlyContactRequestLimit(50);
        gold.setAdvancedSearch(true);
        gold.setContactRequestAccess(true);
        gold.setProfileBoost(true);
        gold.setPriorityVisibility(true);
        membershipPlanRepository.save(gold);

        MembershipPlan premium = new MembershipPlan();
        premium.setCode("PREMIUM");
        premium.setName("Premium");
        premium.setPrice(new BigDecimal("2499"));
        premium.setDurationDays(365);
        premium.setDescription("Maximum visibility and access.");
        premium.setFeatures("All Gold Features,Maximum Access,Priority Visibility,Premium Badge");
        premium.setDisplayOrder(4);
        premium.setDailyProfileViewLimit(null); // unlimited
        premium.setMonthlyInterestLimit(null);
        premium.setMonthlyContactRequestLimit(null);
        premium.setAdvancedSearch(true);
        premium.setContactRequestAccess(true);
        premium.setProfileBoost(true);
        premium.setPriorityVisibility(true);
        premium.setPremiumBadge(true);
        membershipPlanRepository.save(premium);
    }
}
