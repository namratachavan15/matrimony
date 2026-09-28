package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.*;
import org.stormsofts.matrimony.repository.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Part 11 (Recommended Matches). Builds the candidate pool server-side (not
 * randomly, not hardcoded) and scores each candidate against the viewer's
 * actual saved Partner Preferences. Age range (if set) is treated as a hard
 * filter -- candidates outside it are excluded entirely, per the spec's
 * "exclude profiles that do not satisfy important preferences". Every other
 * preference field is scored (soft match) rather than excluding, since
 * education/occupation/location/marital-status are usually "nice to have"
 * rather than deal-breakers.
 */
@Service
public class RecommendedMatchServiceImpl implements RecommendedMatchService {

    @Autowired
    private MstUserRepository userRepository;

    @Autowired
    private MstPartnerPreferenceRepository partnerPreferenceRepository;

    @Autowired
    private MstBlockedUserRepository blockedUserRepository;

    @Autowired
    private MstInterestRepository interestRepository;

    @Autowired
    private MstMatchRepository matchRepository;

    @Override
    public Page<RecommendedProfileDTO> getRecommendations(Integer userId, Pageable pageable) {
        MstUser me = userRepository.findById(userId).orElseThrow();
        MstPartnerPreference prefs = partnerPreferenceRepository.findByUserId(userId).orElse(null);

        Set<Integer> excludedIds = buildExclusionSet(userId);

        String myGender = me.getGender() == null ? null : me.getGender().trim().toLowerCase();

        List<RecommendedProfileDTO> scored = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .filter(u -> !excludedIds.contains(u.getId()))
                .filter(u -> myGender == null || u.getGender() == null
                        || !u.getGender().trim().equalsIgnoreCase(myGender)) // opposite gender only
                .map(u -> scoreCandidate(u, prefs))
                .filter(Objects::nonNull) // null = excluded by a hard filter (age range)
                .sorted(Comparator.comparingInt(RecommendedProfileDTO::getCompatibilityPercentage).reversed())
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        if (start >= scored.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, scored.size());
        }
        int end = Math.min(start + pageable.getPageSize(), scored.size());
        return new PageImpl<>(scored.subList(start, end), pageable, scored.size());
    }

    /** Users to never recommend: blocked (either direction), declined interests (either direction), already matched. */
    private Set<Integer> buildExclusionSet(Integer userId) {
        Set<Integer> excluded = new HashSet<>();

        blockedUserRepository.findByBlockerId(userId).forEach(b -> excluded.add(b.getBlockedUserId()));
        blockedUserRepository.findAll().stream()
                .filter(b -> b.getBlockedUserId().equals(userId))
                .forEach(b -> excluded.add(b.getBlockerId()));

        interestRepository.findAllBySenderIdAndStatus(userId, InterestStatus.DECLINED)
                .forEach(i -> excluded.add(i.getReceiverId()));
        interestRepository.findAllByReceiverIdAndStatus(userId, InterestStatus.DECLINED)
                .forEach(i -> excluded.add(i.getSenderId()));

        matchRepository.findAllForUser(userId, org.springframework.data.domain.Pageable.unpaged())
                .forEach(m -> excluded.add(
                        m.getUserOneId().equals(userId) ? m.getUserTwoId() : m.getUserOneId()));

        return excluded;
    }

    /** Returns null if the candidate fails a hard filter (age range) and should be excluded entirely. */
    private RecommendedProfileDTO scoreCandidate(MstUser u, MstPartnerPreference prefs) {
        if (prefs != null && (prefs.getAgeMin() != null || prefs.getAgeMax() != null)) {
            if (u.getAge() == null) return null;
            if (prefs.getAgeMin() != null && u.getAge() < prefs.getAgeMin()) return null;
            if (prefs.getAgeMax() != null && u.getAge() > prefs.getAgeMax()) return null;
        }

        int total = 0;
        int met = 0;

        if (prefs != null) {
            if (prefs.getEducationIds() != null && !prefs.getEducationIds().isEmpty()) {
                total++;
                if (u.getEdid() != null && prefs.getEducationIds().contains(u.getEdid())) met++;
            }
            if (has(prefs.getOccupation())) {
                total++;
                if (has(u.getCurrentWork()) && u.getCurrentWork().toLowerCase().contains(prefs.getOccupation().toLowerCase())) {
                    met++;
                }
            }
            if (has(prefs.getPreferredLocation())) {
                total++;
                if (has(u.getCLocation()) && u.getCLocation().toLowerCase().contains(prefs.getPreferredLocation().toLowerCase())) {
                    met++;
                }
            }
            if (has(prefs.getMaritalStatus())) {
                total++;
                if (has(u.getMarriageType()) && u.getMarriageType().equalsIgnoreCase(prefs.getMaritalStatus())) {
                    met++;
                }
            }
        }

        int percentage = total == 0 ? 100 : (int) Math.round((met * 100.0) / total);

        return new RecommendedProfileDTO(
                u.getId(), u.getUname(), u.getAge(), u.getCLocation(),
                u.getEducationDetails(), u.getCurrentWork(), u.getUprofile(),
                u.getVstatus(), percentage
        );
    }

    private boolean has(String s) {
        return s != null && !s.trim().isEmpty();
    }
}