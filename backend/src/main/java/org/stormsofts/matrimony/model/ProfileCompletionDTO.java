package org.stormsofts.matrimony.model;

import java.util.List;

/** Part 13 (Profile Completion). Returned by GET /api/profile-quality/completion. */
public class ProfileCompletionDTO {

    private int percentage;
    private List<String> missingFields; // e.g. "Add profile photo", "Complete education"

    public ProfileCompletionDTO() {
    }

    public ProfileCompletionDTO(int percentage, List<String> missingFields) {
        this.percentage = percentage;
        this.missingFields = missingFields;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public List<String> getMissingFields() {
        return missingFields;
    }

    public void setMissingFields(List<String> missingFields) {
        this.missingFields = missingFields;
    }
}