package org.stormsofts.matrimony.model;

/**
 * Part 11 (Recommended Matches). Same safe field set as ProfileCardDTO, plus
 * a real compatibilityPercentage computed from the viewer's actual Partner
 * Preferences vs the candidate's actual profile data -- see
 * RecommendedMatchServiceImpl for the scoring. Never randomly generated.
 */
public class RecommendedProfileDTO {

    private Integer id;
    private String uname;
    private Integer age;
    private String cLocation;
    private String educationDetails;
    private String currentWork;
    private String uprofile;
    private Integer vstatus;
    private int compatibilityPercentage;

    public RecommendedProfileDTO() {
    }

    public RecommendedProfileDTO(Integer id, String uname, Integer age, String cLocation,
                                 String educationDetails, String currentWork, String uprofile,
                                 Integer vstatus, int compatibilityPercentage) {
        this.id = id;
        this.uname = uname;
        this.age = age;
        this.cLocation = cLocation;
        this.educationDetails = educationDetails;
        this.currentWork = currentWork;
        this.uprofile = uprofile;
        this.vstatus = vstatus;
        this.compatibilityPercentage = compatibilityPercentage;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getCLocation() {
        return cLocation;
    }

    public void setCLocation(String cLocation) {
        this.cLocation = cLocation;
    }

    public String getEducationDetails() {
        return educationDetails;
    }

    public void setEducationDetails(String educationDetails) {
        this.educationDetails = educationDetails;
    }

    public String getCurrentWork() {
        return currentWork;
    }

    public void setCurrentWork(String currentWork) {
        this.currentWork = currentWork;
    }

    public String getUprofile() {
        return uprofile;
    }

    public void setUprofile(String uprofile) {
        this.uprofile = uprofile;
    }

    public Integer getVstatus() {
        return vstatus;
    }

    public void setVstatus(Integer vstatus) {
        this.vstatus = vstatus;
    }

    public int getCompatibilityPercentage() {
        return compatibilityPercentage;
    }

    public void setCompatibilityPercentage(int compatibilityPercentage) {
        this.compatibilityPercentage = compatibilityPercentage;
    }
}