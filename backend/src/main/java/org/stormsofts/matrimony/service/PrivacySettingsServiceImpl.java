package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.*;
import org.stormsofts.matrimony.repository.MstPrivacySettingsRepository;

import java.time.Instant;

@Service
public class PrivacySettingsServiceImpl implements PrivacySettingsService {

    @Autowired
    private MstPrivacySettingsRepository repository;

    @Override
    @Transactional
    public PrivacySettingsDTO getMySettings(Integer userId) {
        MstPrivacySettings s = getOrCreateDefault(userId);
        return toDTO(s);
    }

    @Override
    @Transactional
    public PrivacySettingsDTO updateMySettings(Integer userId, PrivacySettingsDTO dto) {
        MstPrivacySettings s = getOrCreateDefault(userId);
        if (dto.getProfileVisibility() != null) {
            s.setProfileVisibility(dto.getProfileVisibility());
        }
        s.setShowMobile(dto.isShowMobile());
        s.setShowEmail(dto.isShowEmail());
        s.setUpdatedAt(Instant.now());
        s = repository.save(s);
        return toDTO(s);
    }

    @Override
    public ContactVisibilityDTO getContactVisibility(Integer profileOwnerId, Integer viewerId) {
        if (profileOwnerId != null && profileOwnerId.equals(viewerId)) {
            return new ContactVisibilityDTO(true, true); // always see your own
        }
        return repository.findByUserId(profileOwnerId)
                .map(s -> new ContactVisibilityDTO(s.isShowMobile(), s.isShowEmail()))
                // No row yet = still on the privacy-safe default = hidden.
                .orElseGet(() -> new ContactVisibilityDTO(false, false));
    }

    /** Privacy-safe defaults (Part 9): REGISTERED visibility, contact details hidden. */
    private MstPrivacySettings getOrCreateDefault(Integer userId) {
        return repository.findByUserId(userId).orElseGet(() -> {
            MstPrivacySettings s = new MstPrivacySettings();
            s.setUserId(userId);
            s.setProfileVisibility(ProfileVisibility.REGISTERED);
            s.setShowMobile(false);
            s.setShowEmail(false);
            return repository.save(s);
        });
    }

    private PrivacySettingsDTO toDTO(MstPrivacySettings s) {
        return new PrivacySettingsDTO(s.getProfileVisibility(), s.isShowMobile(), s.isShowEmail());
    }
}