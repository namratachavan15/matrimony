package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.MstMatch;

public interface MatchService {

    /**
     * Ensures a match exists between the two users (order doesn't matter).
     * Idempotent -- calling this twice for the same pair never creates a
     * duplicate row.
     */
    MatchResult createMatchIfAbsent(Integer userAId, Integer userBId);

    Page<MstMatch> getMyMatches(Integer userId, Pageable pageable);

    long countForUser(Integer userId);

    class MatchResult {
        private final MstMatch match;
        private final boolean newlyCreated;

        public MatchResult(MstMatch match, boolean newlyCreated) {
            this.match = match;
            this.newlyCreated = newlyCreated;
        }

        public MstMatch getMatch() {
            return match;
        }

        public boolean isNewlyCreated() {
            return newlyCreated;
        }
    }
}
