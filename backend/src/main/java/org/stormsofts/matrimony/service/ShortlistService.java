package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.ProfileCardDTO;

import java.util.Set;

public interface ShortlistService {

    /** Toggle shortlist state. Returns true if now shortlisted, false if removed. */
    boolean toggleShortlist(Integer userId, Integer shortlistedUserId);

    Set<Integer> getShortlistedUserIds(Integer userId);

    Page<ProfileCardDTO> getMyShortlist(Integer userId, Pageable pageable);

    long countForUser(Integer userId);
}
