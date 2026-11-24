package org.stormsofts.matrimony.service;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
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

    /**
     * Runs once the app is fully started. Seeds each default plan ONLY if its
     * code is missing, so (a) first boot creates FREE/SILVER/GOLD/PREMIUM,
     * (b) FREE is always guaranteed (every user without a paid subscription
     * falls back to it), and (c) plans the admin later edits are never
     * overwritten. After this, the admin panel is the single source of truth.
     */
    @Override
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void ensureDefaultPlansSeeded() {
        seed("FREE", "Free", "0", 36500, "Get started and explore matches.",
                "Basic Profile,Limited Searches,Limited Interests", 1, false,
                10, 5, 2, false, false, false, false, false);
        seed("SILVER", "Silver", "999", 90, "More reach, more conversations.",
                "Advanced Search,More Interests,More Profile Views,Messaging,Contact Requests", 2, false,
                50, 50, 20, true, true, false, false, false);
        seed("GOLD", "Gold", "1499", 180, "Stand out with higher visibility.",
                "All Silver Features,Higher Contact Limits,Profile Boost,Priority Recommendations", 3, true,
                100, 100, 50, true, true, true, true, false);
        seed("PREMIUM", "Premium", "2499", 365, "Maximum visibility and access.",
                "All Gold Features,Maximum Access,Priority Visibility,Premium Badge", 4, false,
                null, null, null, true, true, true, true, true);
    }

    private void seed(String code, String name, String price, int days, String description, String features,
                      int order, boolean popular, Integer views, Integer interests, Integer contacts,
                      boolean advancedSearch, boolean contactAccess, boolean boost, boolean priority, boolean badge) {
        if (membershipPlanRepository.findByCode(code).isPresent()) {
            return;
        }
        MembershipPlan p = new MembershipPlan();
        p.setCode(code);
        p.setName(name);
        p.setPrice(new BigDecimal(price));
        p.setDurationDays(days);
        p.setDescription(description);
        p.setFeatures(features);
        p.setDisplayOrder(order);
        p.setPopular(popular);
        p.setDailyProfileViewLimit(views);          // null = unlimited
        p.setMonthlyInterestLimit(interests);
        p.setMonthlyContactRequestLimit(contacts);
        p.setAdvancedSearch(advancedSearch);
        p.setMessagingEnabled(true);
        p.setContactRequestAccess(contactAccess);
        p.setProfileBoost(boost);
        p.setPriorityVisibility(priority);
        p.setPremiumBadge(badge);
        membershipPlanRepository.save(p);
    }
}
