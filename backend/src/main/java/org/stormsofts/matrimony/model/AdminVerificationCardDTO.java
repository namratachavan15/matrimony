package org.stormsofts.matrimony.model;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Admin-only view of a profile pending/reviewed for verification. This is
 * the ONE place Aadhaar image filenames are allowed to leave the backend --
 * every other endpoint in the app must keep using ProfileCardDTO (or
 * similarly scrubbed data), never the raw MstUser entity, for exactly this
 * reason. The controller that returns this enforces AuthUtil.isAdmin().
 */
public class AdminVerificationCardDTO {

    private Integer id;
    private String uname;
    private String umobile;
    private String email;
    private Integer age;
    private String gender;
    private LocalDate dob;
    private String cLocation;
    private String educationDetails;
    private String uprofile;
    private String aadharFrontPhoto;
    private String aadharBackPhoto;
    private Integer vstatus;
    private String verificationRejectionReason;
    private Instant verifiedAt;

    public AdminVerificationCardDTO() {
    }

    public AdminVerificationCardDTO(MstUser u) {
        this.id = u.getId();
        this.uname = u.getUname();
        this.umobile = u.getUmobile();
        this.email = u.getEmail();
        this.age = u.getAge();
        this.gender = u.getGender();
        this.dob = u.getDob();
        this.cLocation = u.getCLocation();
        this.educationDetails = u.getEducationDetails();
        this.uprofile = u.getUprofile();
        this.aadharFrontPhoto = u.getAadharFrontPhoto();
        this.aadharBackPhoto = u.getAadharBackPhoto();
        this.vstatus = u.getVstatus();
        this.verificationRejectionReason = u.getVerificationRejectionReason();
        this.verifiedAt = u.getVerifiedAt();
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

    public String getUmobile() {
        return umobile;
    }

    public void setUmobile(String umobile) {
        this.umobile = umobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
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

    public String getUprofile() {
        return uprofile;
    }

    public void setUprofile(String uprofile) {
        this.uprofile = uprofile;
    }

    public String getAadharFrontPhoto() {
        return aadharFrontPhoto;
    }

    public void setAadharFrontPhoto(String aadharFrontPhoto) {
        this.aadharFrontPhoto = aadharFrontPhoto;
    }

    public String getAadharBackPhoto() {
        return aadharBackPhoto;
    }

    public void setAadharBackPhoto(String aadharBackPhoto) {
        this.aadharBackPhoto = aadharBackPhoto;
    }

    public Integer getVstatus() {
        return vstatus;
    }

    public void setVstatus(Integer vstatus) {
        this.vstatus = vstatus;
    }

    public String getVerificationRejectionReason() {
        return verificationRejectionReason;
    }

    public void setVerificationRejectionReason(String verificationRejectionReason) {
        this.verificationRejectionReason = verificationRejectionReason;
    }

    public Instant getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(Instant verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}