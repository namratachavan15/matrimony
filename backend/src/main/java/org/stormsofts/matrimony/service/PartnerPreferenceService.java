package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.PartnerPreferenceDTO;

public interface PartnerPreferenceService {

    PartnerPreferenceDTO getMyPreferences(Integer userId);

    PartnerPreferenceDTO updateMyPreferences(Integer userId, PartnerPreferenceDTO dto);

    void resetMyPreferences(Integer userId);
}