package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MembershipPlan;

import java.util.List;

public interface MembershipPlanService {
    List<MembershipPlan> getActivePlans();
    List<MembershipPlan> getAllPlansForAdmin();
    MembershipPlan getById(Integer id);
    MembershipPlan create(MembershipPlan plan);
    MembershipPlan update(Integer id, MembershipPlan plan);
    void setActive(Integer id, boolean active);
    void delete(Integer id);

    /** Seeds FREE/SILVER/GOLD/PREMIUM once, only if no plans exist yet. */
    void ensureDefaultPlansSeeded();
}
