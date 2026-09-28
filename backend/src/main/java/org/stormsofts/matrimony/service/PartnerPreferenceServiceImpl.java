package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.MstPartnerPreference;
import org.stormsofts.matrimony.model.PartnerPreferenceDTO;
import org.stormsofts.matrimony.repository.MstPartnerPreferenceRepository;

import java.time.Instant;
import java.util.HashSet;

@Service
public class PartnerPreferenceServiceImpl implements PartnerPreferenceService {

    @Autowired
    private MstPartnerPreferenceRepository repository;

    @Override
    public PartnerPreferenceDTO getMyPreferences(Integer userId) {
        return repository.findByUserId(userId)
                .map(PartnerPreferenceDTO::new)
                .orElseGet(PartnerPreferenceDTO::new); // no preferences saved yet -- empty/blank form
    }

    @Override
    @Transactional
    public PartnerPreferenceDTO updateMyPreferences(Integer userId, PartnerPreferenceDTO dto) {
        MstPartnerPreference p = repository.findByUserId(userId).orElseGet(() -> {
            MstPartnerPreference np = new MstPartnerPreference();
            np.setUserId(userId);
            return np;
        });

        p.setAgeMin(dto.getAgeMin());
        p.setAgeMax(dto.getAgeMax());
        p.setHeightMin(dto.getHeightMin());
        p.setHeightMax(dto.getHeightMax());
        p.setEducationIds(dto.getEducationIds() == null ? new HashSet<>() : new HashSet<>(dto.getEducationIds()));
        p.setOccupation(dto.getOccupation());
        p.setIncomeMin(dto.getIncomeMin());
        p.setPreferredLocation(dto.getPreferredLocation());
        p.setMaritalStatus(dto.getMaritalStatus());
        p.setLifestylePreferences(dto.getLifestylePreferences());
        p.setFamilyPreferences(dto.getFamilyPreferences());
        p.setUpdatedAt(Instant.now());

        p = repository.save(p);
        return new PartnerPreferenceDTO(p);
    }

    @Override
    @Transactional
    public void resetMyPreferences(Integer userId) {
        repository.findByUserId(userId).ifPresent(repository::delete);
    }
}