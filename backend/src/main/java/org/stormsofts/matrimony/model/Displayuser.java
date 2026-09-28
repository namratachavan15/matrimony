package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "displayusers")
public class Displayuser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @Column(name = "UID")
    private Integer uid;

    @Column(name = "Uname", length = 50)
    private String uname;

    @Column(name = "Umobile", length = 20)
    private String umobile;

    @Column(name = "alt_mobile", length = 20)
    private String altMobile;

    @Column(name = "whatsappno", length = 20)
    private String whatsappno;

    @Column(name = "Email", length = 50)
    private String email;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "DSID")
    private Integer dsid;

    @Column(name = "SBEID")
    private Integer sbeid;

    @Column(name = "education", length = 500)
    private String education;

    @Column(name = "SCTID")
    private Integer sctid;

    @Column(name = "birthplace", length = 30)
    private String birthplace;

    @Column(name = "DOB")
    private LocalDate dob;

    @Column(name = "height", length = 10)
    private String height;

    @Column(name = "weight")
    private Integer weight;

    @Column(name = "age")
    private Integer age;

    @Column(name = "varn", length = 20)
    private String varn;

    @Column(name = "Gender", length = 20)
    private String gender;

    @Column(name = "dob_time")
    private LocalTime dobTime;

    @Column(name = "marriage_type", length = 100)
    private String marriageType;

    @Column(name = "bloodgroup", length = 10)
    private String bloodgroup;

    @Column(name = "INID")
    private Integer inid;

    @Column(name = "fincome", length = 30)
    private String fincome;

    @Column(name = "current_work", length = 30)
    private String currentWork;

    @Column(name = "CNID")
    private Integer cnid;

    @Column(name = "CSTID")
    private Integer cstid;

    @Column(name = "CDSID")
    private Integer cdsid;

    @Column(name = "CLocation", length = 500)
    private String cLocation;

    @Column(name = "specs", length = 10)
    private String specs;

    @Column(name = "Drink", length = 10)
    private String drink;

    @Column(name = "Diet", length = 10)
    private String diet;

    @Column(name = "Smoking", length = 10)
    private String smoking;

    @Column(name = "Dieses", length = 200)
    private String dieses;

    @Column(name = "Disease_Details", length = 500)
    private String diseaseDetails;

    @Column(name = "otherinfo", length = 500)
    private String otherinfo;

    @Column(name = "Expectation", length = 500)
    private String expectation;

    @Column(name = "familydetails", length = 500)
    private String familydetails;

    @Column(name = "uprofile", length = 500)
    private String uprofile;

    @Column(name = "aadhar_photo", length = 100)
    private String aadharPhoto;

    @Column(name = "upass", length = 10)
    private String upass;

    @Column(name = "urole", length = 10)
    private String urole;

    @Column(name = "log_count")
    private Integer logCount;

    @Column(name = "log_status")
    private Integer logStatus;

    @Column(name = "viewcount")
    private Integer viewcount;

    @Column(name = "starcount")
    private Integer starcount;

    @ColumnDefault("current_timestamp()")
    @Column(name = "jdate", nullable = false)
    private Instant jdate;

    @Column(name = "vstatus")
    private Integer vstatus;

    @Column(name = "status")
    private Integer status;

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
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

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
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

    public Integer getInid() {
        return inid;
    }

    public void setInid(Integer inid) {
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

    public Integer getCnid() {
        return cnid;
    }

    public void setCnid(Integer cnid) {
        this.cnid = cnid;
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

    public String getcLocation() {
        return cLocation;
    }

    public void setcLocation(String cLocation) {
        this.cLocation = cLocation;
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

    public String getUprofile() {
        return uprofile;
    }

    public void setUprofile(String uprofile) {
        this.uprofile = uprofile;
    }

    public String getAadharPhoto() {
        return aadharPhoto;
    }

    public void setAadharPhoto(String aadharPhoto) {
        this.aadharPhoto = aadharPhoto;
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

    public Integer getStarcount() {
        return starcount;
    }

    public void setStarcount(Integer starcount) {
        this.starcount = starcount;
    }

    public Instant getJdate() {
        return jdate;
    }

    public void setJdate(Instant jdate) {
        this.jdate = jdate;
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
}