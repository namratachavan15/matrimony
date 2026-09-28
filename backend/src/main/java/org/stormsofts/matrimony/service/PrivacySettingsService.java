package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.ContactVisibilityDTO;
import org.stormsofts.matrimony.model.PrivacySettingsDTO;

public interface PrivacySettingsService {

    PrivacySettingsDTO getMySettings(Integer userId);

    PrivacySettingsDTO updateMySettings(Integer userId, PrivacySettingsDTO dto);

    /**
     * What a viewer may see of profileOwnerId's contact details. Always
     * showMobile=showEmail=true when viewing your own profile; otherwise the
     * owner's saved settings. Never exposes the owner's other settings.
     */
    ContactVisibilityDTO getContactVisibility(Integer profileOwnerId, Integer viewerId);
}