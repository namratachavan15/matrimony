package org.stormsofts.matrimony.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "mst_users")
public class MstUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UID", nullable = false)
    private Integer id;

    @Column(name = "Uname", nullable = false, length = 50)
    private String uname;

    @Column(name = "Umobile", nullable = false, length = 20)
    private String umobile;

    @Column(name = "alt_mobile", nullable = false, length = 20)
    private String altMobile;

    @Column(name = "whatsappno", nullable = false, length = 20)
    private String whatsappno;

    @Column(name = "Email", nullable = false, length = 50)
    private String email;

    @Column(name = "address", nullable = false, length = 500)
    private String address;

    @Column(name = "CNID", nullable = true)
    private Integer cnid;

    @Column(name = "STID", nullable = true)
    private Integer stid;

    @Column(name = "DSID", nullable = true)
    private Integer dsid;

    @Column(name = "SBEID", nullable = true)
    @ColumnDefault("0")
    private Integer sbeid;


    @Column(name = "EDID", nullable = true)
    private Integer edid;

    @Column(name = "education_details", nullable = false, length = 500)
    private String educationDetails;

    @Column(name = "CTID", nullable = true)
    private Integer ctid;

    @Column(name = "SCTID", nullable = true)
    private Integer sctid;

    @Column(name = "birthplace", nullable = false, length = 30)
    private String birthplace;

    @Column(name = "DOB", nullable = true)  // allow null
    private LocalDate dob;

    @Column(name = "height", nullable = false, length = 10)
    private String height;

    @Column(name = "weight", nullable = false)
    private Integer weight;

    @Column(name = "age", nullable = true)
    private Integer age;

    @Column(name = "varn", nullable = false, length = 20)
    private String varn;

    @Column(name = "Gender", nullable = false, length = 20)
    private String gender;

    @Column(name = "dob_time", nullable = true)
    private LocalTime dobTime;

    @Column(name = "marriage_type", nullable = false, length = 100)
    private String marriageType;

    @Column(name = "bloodgroup", nullable = false, length = 10)
    private String bloodgroup;

    @Column(name = "INID", nullable = false, length = 100)
    private String inid;

    @Column(name = "fincome", nullable = false, length = 30)
    private String fincome;

    @Column(name = "current_work", nullable = false, length = 30)
    private String currentWork;

    @Column(name = "CSTID", nullable = false)
    @ColumnDefault("0")
    private Integer cstid = 0;

    @Column(name = "CDSID", nullable = false)
    @ColumnDefault("0")
    private Integer cdsid = 0;

    @Column(name = "CLocation", nullable = false, length = 500)
    @JsonProperty("cLocation")  // <-- add this
    private String CLocation;

    @Column(name = "specs", nullable = false, length = 100)
    private String specs;

    @Column(name = "Drink", nullable = false, length = 100)
    private String drink;

    @Column(name = "Diet", nullable = false, length = 100)
    private String diet;

    @Column(name = "Smoking", nullable = false, length = 100)
    private String smoking;

    @Column(name = "Dieses", nullable = false, length = 200)
    private String dieses;

    @Column(name = "Disease_Details", nullable = false, length = 500)
    private String diseaseDetails;

    @Column(name = "otherinfo", nullable = true, length = 500)
    private String otherinfo;

    @Column(name = "Expectation", nullable = true, length = 500)
    private String expectation;

    @Column(name = "familydetails", nullable = true, length = 500)
    private String familydetails;

    @Column(name = "Remark", nullable = true, length = 500)
    private String remark;

    @Column(name = "uprofile", nullable = true, length = 500)
    private String uprofile;



    @Column(name = "aadhar_back_photo", nullable = true, length = 100)
    private String aadharBackPhoto;

    @Column(name = "aadhar_front_photo", nullable = true, length = 100)
    private String aadharFrontPhoto;
// For storing file bytes directly
//@Column(name = "aadhar_back_photo", nullable = true, columnDefinition = "LONGBLOB")
//private byte[] aadharBackPhoto;
//
//    @Column(name = "uprofile", nullable = true, columnDefinition = "LONGBLOB")
//    private byte[] uprofile;


    @Column(name = "upass", nullable = false, length = 100)
    private String upass;


    @Column(name = "urole", nullable = false, length = 10)
    private String urole;

    @Column(name = "log_count", nullable = false)
    @ColumnDefault("0")
    private Integer logCount = 0;



    @ColumnDefault("1")
    @Column(name = "log_status", nullable = false)
    private Integer logStatus = 1;


    @ColumnDefault("0")
    @Column(name = "viewcount", nullable = false)
    private Integer viewcount = 0;

    @ColumnDefault("50")
    @Column(name = "Profile_viewcount", nullable = false)
    private Integer profileViewcount = 50;


    @ColumnDefault("1")
    @Column(name = "starcount", nullable = false)
    private Integer starcount=1;


    @Column(name = "jdate", nullable = false, updatable = false)
    private LocalDateTime jdate;

    @PrePersist
    protected void onCreate() {
        this.jdate = LocalDateTime.now();
    }

    @Column(name = "extend_date", nullable = false)
    private String extendDate="N/A";;

    @ColumnDefault("0")
    @Column(name = "vstatus", nullable =false)
    private Integer vstatus=0;

    // Profile Verification (Part 8): vstatus above already existed as a dormant
    // column (0 = pending by default) -- reused rather than adding a parallel
    // status field. 0 = PENDING, 1 = VERIFIED, 2 = REJECTED (see
    // VerificationService for the constants). This note is the only new
    // column: the reason an admin gave when rejecting, shown back to the user.
    @Column(name = "verification_rejection_reason", nullable = true, length = 500)
    private String verificationRejectionReason;

    @Column(name = "verified_at", nullable = true)
    private java.time.Instant verifiedAt;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status=1;

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

    public String getAltMobile() {
        return altMobile;
    }

    public void setAltMobile(String altMobile) {
        this.altMobile = altMobile;
    }

    public String getWhatsappno() {
        return whatsappno;
    }

    public void setWhatsappno(String whatsappno) {
        this.whatsappno = whatsappno;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getCnid() {
        return cnid;
    }

    public void setCnid(Integer cnid) {
        this.cnid = cnid;
    }

    public Integer getStid() {
        return stid;
    }

    public void setStid(Integer stid) {
        this.stid = stid;
    }

    public Integer getDsid() {
        return dsid;
    }

    public void setDsid(Integer dsid) {
        this.dsid = dsid;
    }

    public Integer getSbeid() {
        return sbeid;
    }

    public void setSbeid(Integer sbeid) {
        this.sbeid = sbeid;
    }

    public Integer getEdid() {
        return edid;
    }

    public void setEdid(Integer edid) {
        this.edid = edid;
    }

    public String getEducationDetails() {
        return educationDetails;
    }

    public void setEducationDetails(String educationDetails) {
        this.educationDetails = educationDetails;
    }

    public Integer getCtid() {
        return ctid;
    }

    public void setCtid(Integer ctid) {
        this.ctid = ctid;
    }

    public Integer getSctid() {
        return sctid;
    }

    public void setSctid(Integer sctid) {
        this.sctid = sctid;
    }

    public String getBirthplace() {
        return birthplace;
    }

    public void setBirthplace(String birthplace) {
        this.birthplace = birthplace;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getVarn() {
        return varn;
    }

    public void setVarn(String varn) {
        this.varn = varn;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalTime getDobTime() {
        return dobTime;
    }

    public void setDobTime(LocalTime dobTime) {
        this.dobTime = dobTime;
    }

    public String getMarriageType() {
        return marriageType;
    }

    public void setMarriageType(String marriageType) {
        this.marriageType = marriageType;
    }

    public String getBloodgroup() {
        return bloodgroup;
    }

    public void setBloodgroup(String bloodgroup) {
        this.bloodgroup = bloodgroup;
    }

    public String getInid() {
        return inid;
    }

    public void setInid(String inid) {
        this.inid = inid;
    }

    public String getFincome() {
        return fincome;
    }

    public void setFincome(String fincome) {
        this.fincome = fincome;
    }

    public String getCurrentWork() {
        return currentWork;
    }

    public void setCurrentWork(String currentWork) {
        this.currentWork = currentWork;
    }

    public Integer getCstid() {
        return cstid;
    }

    public void setCstid(Integer cstid) {
        this.cstid = cstid;
    }

    public Integer getCdsid() {
        return cdsid;
    }

    public void setCdsid(Integer cdsid) {
        this.cdsid = cdsid;
    }

    public String getCLocation() {
        return CLocation;
    }

    public void setCLocation(String cLocation) {
        this.CLocation = cLocation;
    }

    public String getSpecs() {
        return specs;
    }

    public void setSpecs(String specs) {
        this.specs = specs;
    }

    public String getDrink() {
        return drink;
    }

    public void setDrink(String drink) {
        this.drink = drink;
    }

    public String getDiet() {
        return diet;
    }

    public void setDiet(String diet) {
        this.diet = diet;
    }

    public String getSmoking() {
        return smoking;
    }

    public void setSmoking(String smoking) {
        this.smoking = smoking;
    }

    public String getDieses() {
        return dieses;
    }

    public void setDieses(String dieses) {
        this.dieses = dieses;
    }

    public String getDiseaseDetails() {
        return diseaseDetails;
    }

    public void setDiseaseDetails(String diseaseDetails) {
        this.diseaseDetails = diseaseDetails;
    }

    public String getOtherinfo() {
        return otherinfo;
    }

    public void setOtherinfo(String otherinfo) {
        this.otherinfo = otherinfo;
    }

    public String getExpectation() {
        return expectation;
    }

    public void setExpectation(String expectation) {
        this.expectation = expectation;
    }

    public String getFamilydetails() {
        return familydetails;
    }

    public void setFamilydetails(String familydetails) {
        this.familydetails = familydetails;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getUprofile() {
        return uprofile;
    }

    public void setUprofile(String uprofile) {
        this.uprofile = uprofile;
    }

    public String getAadharBackPhoto() {
        return aadharBackPhoto;
    }

    public void setAadharBackPhoto(String aadharBackPhoto) {
        this.aadharBackPhoto = aadharBackPhoto;
    }

    public String getAadharFrontPhoto() {
        return aadharFrontPhoto;
    }

    public void setAadharFrontPhoto(String aadharFrontPhoto) {
        this.aadharFrontPhoto = aadharFrontPhoto;
    }

    public String getUpass() {
        return upass;
    }

    public void setUpass(String upass) {
        this.upass = upass;
    }

    public String getUrole() {
        return urole;
    }

    public void setUrole(String urole) {
        this.urole = urole;
    }

    public Integer getLogCount() {
        return logCount;
    }

    public void setLogCount(Integer logCount) {
        this.logCount = logCount;
    }

    public Integer getLogStatus() {
        return logStatus;
    }

    public void setLogStatus(Integer logStatus) {
        this.logStatus = logStatus;
    }

    public Integer getViewcount() {
        return viewcount;
    }

    public void setViewcount(Integer viewcount) {
        this.viewcount = viewcount;
    }

    public Integer getProfileViewcount() {
        return profileViewcount;
    }

    public void setProfileViewcount(Integer profileViewcount) {
        this.profileViewcount = profileViewcount;
    }

    public Integer getStarcount() {
        return starcount;
    }

    public void setStarcount(Integer starcount) {
        this.starcount = starcount;
    }

    public LocalDateTime getJdate() {
        return jdate;
    }

    public void setJdate(LocalDateTime jdate) {
        this.jdate = jdate;
    }

    public String getExtendDate() {
        return extendDate;
    }

    public void setExtendDate(String extendDate) {
        this.extendDate = extendDate;
    }

    public Integer getVstatus() {
        return vstatus;
    }

    public void setVstatus(Integer vstatus) {
        this.vstatus = vstatus;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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