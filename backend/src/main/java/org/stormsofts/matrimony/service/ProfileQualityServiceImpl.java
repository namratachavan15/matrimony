package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.*;
import org.stormsofts.matrimony.repository.FamilyRepository;
import org.stormsofts.matrimony.repository.MstPartnerPreferenceRepository;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Backs both Part 13 (Profile Completion) and Part 14 (Profile Strength).
 * Both are derived from the same real-data checklist below rather than any
 * hardcoded/fake percentage, per the spec. Each checklist item is a plain
 * "is this real field non-empty" check -- add to CHECKLIST if a future
 * field should count toward completion.
 */
@Service
public class ProfileQualityServiceImpl implements ProfileQualityService {

    @Autowired
    private MstUserRepository userRepository;

    @Autowired
    private FamilyRepository familyRepository;

    @Autowired
    private MstPartnerPreferenceRepository partnerPreferenceRepository;

    private boolean has(String s) {
        return s != null && !s.trim().isEmpty();
    }

    /** Ordered so "add profile photo" style items surface first as suggestions. */
    private Map<String, Boolean> checklist(MstUser u) {
        Map<String, Boolean> c = new LinkedHashMap<>();
        c.put("Add a profile photo", has(u.getUprofile()));
        c.put("Complete your basic details (age, gender, height)",
                u.getAge() != null && has(u.getGender()) && has(u.getHeight()));
        c.put("Complete your education details", has(u.getEducationDetails()));
        c.put("Add your occupation", has(u.getCurrentWork()));
        c.put("Add your location", has(u.getCLocation()));
        c.put("Write a short 'About Me'", has(u.getOtherinfo()));
        c.put("Add family details", !familyRepository.findByUid(u.getId()).isEmpty());
        c.put("Add partner preferences", partnerPreferenceRepository.findByUserId(u.getId()).isPresent());
        c.put("Add a contact number", has(u.getUmobile()));
        c.put("Upload ID verification documents", has(u.getAadharFrontPhoto()) && has(u.getAadharBackPhoto()));
        return c;
    }

    private MstUser loadUser(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found."));
    }

    @Override
    public ProfileCompletionDTO getCompletion(Integer userId) {
        MstUser u = loadUser(userId);
        Map<String, Boolean> checklist = checklist(u);

        long done = checklist.values().stream().filter(Boolean::booleanValue).count();
        int percentage = (int) Math.round((done * 100.0) / checklist.size());

        List<String> missing = new ArrayList<>();
        checklist.forEach((label, isDone) -> {
            if (!isDone) missing.add(label);
        });

        return new ProfileCompletionDTO(percentage, missing);
    }

    @Override
    public ProfileStrengthDTO getStrength(Integer userId) {
        MstUser u = loadUser(userId);
        Map<String, Boolean> checklist = checklist(u);

        long done = checklist.values().stream().filter(Boolean::booleanValue).count();
        int percentage = (int) Math.round((done * 100.0) / checklist.size());
        int stars = (int) Math.round(percentage / 20.0); // 0-5 stars

        List<String> suggestions = new ArrayList<>();
        for (Map.Entry<String, Boolean> e : checklist.entrySet()) {
            if (suggestions.size() >= 3) break;
            if (!e.getValue()) suggestions.add(e.getKey());
        }

        return new ProfileStrengthDTO(percentage, stars, suggestions);
    }
}