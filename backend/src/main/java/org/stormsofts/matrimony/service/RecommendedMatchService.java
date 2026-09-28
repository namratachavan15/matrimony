package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.RecommendedProfileDTO;

public interface RecommendedMatchService {

    Page<RecommendedProfileDTO> getRecommendations(Integer userId, Pageable pageable);
}