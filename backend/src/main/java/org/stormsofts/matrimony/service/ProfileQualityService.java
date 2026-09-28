package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.ProfileCompletionDTO;
import org.stormsofts.matrimony.model.ProfileStrengthDTO;

public interface ProfileQualityService {

    ProfileCompletionDTO getCompletion(Integer userId);

    ProfileStrengthDTO getStrength(Integer userId);
}