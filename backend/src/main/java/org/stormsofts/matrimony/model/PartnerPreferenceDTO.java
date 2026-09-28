package org.stormsofts.matrimony.model;

import java.util.Set;

/** Body for GET/PUT /api/partner-preferences/my. */
public class PartnerPreferenceDTO {

    private Integer ageMin;
    private Integer ageMax;
    private String heightMin;
    private String heightMax;
    private Set<Integer> educationIds;
    private String occupation;
    private Long incomeMin;
    private String preferredLocation;
    private String maritalStatus;
    private String lifestylePreferences;
    private String familyPreferences;

    public PartnerPreferenceDTO() {
    }

    public PartnerPreferenceDTO(MstPartnerPreference p) {
        this.ageMin = p.getAgeMin();
        this.ageMax = p.getAgeMax();
        this.heightMin = p.getHeightMin();
        this.heightMax = p.getHeightMax();
        this.educationIds = p.getEducationIds();
        this.occupation = p.getOccupation();
        this.incomeMin = p.getIncomeMin();
        this.preferredLocation = p.getPreferredLocation();
        this.maritalStatus = p.getMaritalStatus();
        this.lifestylePreferences = p.getLifestylePreferences();
        this.familyPreferences = p.getFamilyPreferences();
    }

    public Integer getAgeMin() {
        return ageMin;
    }

    public void setAgeMin(Integer ageMin) {
        this.ageMin = ageMin;
    }

    public Integer getAgeMax() {
        return ageMax;
    }

    public void setAgeMax(Integer ageMax) {
        this.ageMax = ageMax;
    }

    public String getHeightMin() {
        return heightMin;
    }

    public void setHeightMin(String heightMin) {
        this.heightMin = heightMin;
    }

    public String getHeightMax() {
        return heightMax;
    }

    public void setHeightMax(String heightMax) {
        this.heightMax = heightMax;
    }

    public Set<Integer> getEducationIds() {
        return educationIds;
    }

    public void setEducationIds(Set<Integer> educationIds) {
        this.educationIds = educationIds;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public Long getIncomeMin() {
        return incomeMin;
    }

    public void setIncomeMin(Long incomeMin) {
        this.incomeMin = incomeMin;
    }

    public String getPreferredLocation() {
        return preferredLocation;
    }

    public void setPreferredLocation(String preferredLocation) {
        this.preferredLocation = preferredLocation;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(String maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public String getLifestylePreferences() {
        return lifestylePreferences;
    }

    public void setLifestylePreferences(String lifestylePreferences) {
        this.lifestylePreferences = lifestylePreferences;
    }

    public String getFamilyPreferences() {
        return familyPreferences;
    }

    public void setFamilyPreferences(String familyPreferences) {
        this.familyPreferences = familyPreferences;
    }
}