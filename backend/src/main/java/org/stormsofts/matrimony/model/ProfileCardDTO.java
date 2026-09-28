package org.stormsofts.matrimony.model;

/**
 * Minimal, safe-to-expose representation of a user profile used for
 * profile cards across Interests / Shortlist / Matches / Notifications /
 * Block.
 *
 * IMPORTANT: This intentionally does NOT include mobile, email, address,
 * Aadhaar photos or any other sensitive/private field. Contact details are
 * only ever released through the (separate) Contact Request flow.
 *
 * vstatus is safe/intended to be public (0=PENDING, 1=VERIFIED, 2=REJECTED)
 * -- it's what powers the "Verified Profile" badge on any card built from
 * this DTO. See VerificationService for the constants.
 */
public class ProfileCardDTO {

    private Integer id;
    private String uname;
    private Integer age;
    private String cLocation;
    private String educationDetails;
    private String currentWork;
    private String uprofile;
    private Integer vstatus;

    public ProfileCardDTO() {
    }

    public ProfileCardDTO(Integer id, String uname, Integer age, String cLocation,
                          String educationDetails, String currentWork, String uprofile,
                          Integer vstatus) {
        this.id = id;
        this.uname = uname;
        this.age = age;
        this.cLocation = cLocation;
        this.educationDetails = educationDetails;
        this.currentWork = currentWork;
        this.uprofile = uprofile;
        this.vstatus = vstatus;
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
}