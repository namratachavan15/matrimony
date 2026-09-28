package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.ProfileCardDTO;

import java.util.Set;

public interface BlockService {

    /**
     * Blocks blockedUserId on behalf of blockerId. Idempotent: blocking an
     * already-blocked user is a no-op and does not throw.
     */
    void block(Integer blockerId, Integer blockedUserId);

    void unblock(Integer blockerId, Integer blockedUserId);

    boolean isBlockedByMe(Integer blockerId, Integer otherUserId);

    /**
     * True if either user has blocked the other. This is the check every
     * other feature (search, recommendations, interests, shortlist, contact
     * requests, chat) should use before allowing an interaction between two
     * users.
     */
    boolean isBlockedEitherWay(Integer userA, Integer userB);

    /** All user ids blockerId has blocked -- for excluding them from listings. */
    Set<Integer> getBlockedUserIds(Integer blockerId);

    Page<ProfileCardDTO> getMyBlockedProfiles(Integer blockerId, Pageable pageable);

    long countForUser(Integer blockerId);
}
