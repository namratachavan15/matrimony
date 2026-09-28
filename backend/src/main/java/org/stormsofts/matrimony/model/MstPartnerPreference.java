package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * Part 10 (Partner Preferences). One row per user. educationIds is stored as
 * a separate collection table (mst_partner_pref_education) via
 * @ElementCollection rather than a new join entity, since it's just a set of
 * acceptable education ids with no extra attributes of its own.
 *
 * Field choices worth noting for whoever builds Recommended Matches next:
 * height on MstUser is a free-text String (e.g. 5'6"), not numeric, so
 * heightMin/heightMax here are also left as String -- exact/algorithmic
 * height-range matching will need a normalization step first. maritalStatus
 * here is meant to match MstUser.marriageType.
 */
@Getter
@Setter
@Entity
@Table(name = "mst_partner_preference", uniqueConstraints = @UniqueConstraint(columnNames = "user_id"))
public class MstPartnerPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "age_min")
    private Integer ageMin;

    @Column(name = "age_max")
    private Integer ageMax;

    @Column(name = "height_min", length = 10)
    private String heightMin;

    @Column(name = "height_max", length = 10)
    private String heightMax;

    @ElementCollection
    @CollectionTable(name = "mst_partner_pref_education", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "education_id")
    private Set<Integer> educationIds = new HashSet<>();

    @Column(name = "occupation", length = 200)
    private String occupation;

    @Column(name = "income_min")
    private Long incomeMin;

    @Column(name = "preferred_location", length = 200)
    private String preferredLocation;

    @Column(name = "marital_status", length = 50)
    private String maritalStatus;

    @Column(name = "lifestyle_preferences", length = 500)
    private String lifestylePreferences;

    @Column(name = "family_preferences", length = 500)
    private String familyPreferences;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}