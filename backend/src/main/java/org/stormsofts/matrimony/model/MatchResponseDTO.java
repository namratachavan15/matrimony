package org.stormsofts.matrimony.model;

import java.time.Instant;

public class MatchResponseDTO {
    private Integer matchId;
    private ProfileCardDTO profile;
    private Instant matchedAt;

    public MatchResponseDTO(Integer matchId, ProfileCardDTO profile, Instant matchedAt) {
        this.matchId = matchId;
        this.profile = profile;
        this.matchedAt = matchedAt;
    }

    public Integer getMatchId() {
        return matchId;
    }

    public ProfileCardDTO getProfile() {
        return profile;
    }

    public Instant getMatchedAt() {
        return matchedAt;
    }
}
