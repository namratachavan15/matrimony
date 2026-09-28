package org.stormsofts.matrimony.model;

import java.util.List;

/** Part 14 (Profile Strength). Returned by GET /api/profile-quality/strength. */
public class ProfileStrengthDTO {

    private int percentage;
    private int stars; // 0-5, derived from percentage
    private List<String> suggestions; // top few missing items, same wording as completion

    public ProfileStrengthDTO() {
    }

    public ProfileStrengthDTO(int percentage, int stars, List<String> suggestions) {
        this.percentage = percentage;
        this.stars = stars;
        this.suggestions = suggestions;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}