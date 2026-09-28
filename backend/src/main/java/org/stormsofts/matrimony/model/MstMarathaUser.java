package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "mst_maratha_users")
public class MstMarathaUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MUID", nullable = false)
    private Integer id;

    @Column(name = "MUname", nullable = false, length = 50)
    private String mUname;

    @Column(name = "MUmobile", nullable = false, length = 20)
    private String mUmobile;

    @Column(name = "Malt_mobile", nullable = false, length = 20)
    private String maltMobile;

    @Column(name = "M_whatsappno", nullable = false, length = 20)
    private String mWhatsappno;

    @Column(name = "M_address", nullable = false, length = 500)
    private String mAddress;

    @Column(name = "M_DSID", nullable = false)
    private Integer mDsid;

    @Column(name = "M_SBEID", nullable = false)
    private Integer mSbeid;

    @Column(name = "M_education", nullable = false, length = 500)
    private String mEducation;

    @Column(name = "M_SCTID", nullable = false)
    private Integer mSctid;

    @Column(name = "M_birthplace", nullable = false, length = 30)
    private String mBirthplace;

    @Column(name = "M_DOB", nullable = false)
    private LocalDate mDob;

    @Column(name = "M_height", nullable = false, length = 10)
    private String mHeight;

    @Column(name = "M_weight", nullable = false)
    private Integer mWeight;

    @Column(name = "M_age", nullable = false)
    private Integer mAge;

    @Column(name = "M_varn", nullable = false, length = 20)
    private String mVarn;

    @Column(name = "M_Gender", nullable = false, length = 20)
    private String mGender;

    @Column(name = "M_dob_time", nullable = false)
    private LocalTime mDobTime;

    @Column(name = "M_marriage_type", nullable = false, length = 100)
    private String mMarriageType;

    @Column(name = "M_bloodgroup", nullable = false, length = 10)
    private String mBloodgroup;

    @Column(name = "M_INID", nullable = false)
    private Integer mInid;

    @Column(name = "M_fincome", nullable = false, length = 30)
    private String mFincome;

    @Column(name = "M_current_work", nullable = false, length = 30)
    private String mCurrentWork;

    @Column(name = "CNID", nullable = false)
    private Integer cnid;

    @Column(name = "CSTID", nullable = false)
    private Integer cstid;

    @Column(name = "CDSID", nullable = false)
    private Integer cdsid;

    @Column(name = "CLocation", nullable = false, length = 500)
    private String cLocation;

    @Column(name = "M_specs", nullable = false, length = 10)
    private String mSpecs;

    @Column(name = "M_Drink", nullable = false, length = 10)
    private String mDrink;

    @Column(name = "M_Diet", nullable = false, length = 10)
    private String mDiet;

    @Column(name = "M_Smoking", nullable = false, length = 10)
    private String mSmoking;

    @Column(name = "M_Dieses", nullable = false, length = 200)
    private String mDieses;

    @Column(name = "M_Disease_Details", nullable = false, length = 500)
    private String mDiseaseDetails;

    @Column(name = "M_otherinfo", nullable = false, length = 500)
    private String mOtherinfo;

    @Column(name = "M_Expectation", nullable = false, length = 500)
    private String mExpectation;

    @Column(name = "M_familydetails", nullable = false, length = 500)
    private String mFamilydetails;

    @Column(name = "M_Remark", nullable = false, length = 500)
    private String mRemark;

    @Column(name = "M_uprofile", nullable = false, length = 500)
    private String mUprofile;

    @Column(name = "M_aadhar_photo", nullable = false, length = 100)
    private String mAadharPhoto;

    @Column(name = "M_upass", nullable = false, length = 10)
    private String mUpass;

    @Column(name = "M_urole", nullable = false, length = 10)
    private String mUrole;

    @Column(name = "M_log_count", nullable = false)
    private Integer mLogCount;

    @ColumnDefault("1")
    @Column(name = "M_log_status", nullable = false)
    private Integer mLogStatus;

    @ColumnDefault("0")
    @Column(name = "M_viewcount", nullable = false)
    private Integer mViewcount;

    @ColumnDefault("50")
    @Column(name = "M_Profile_viewcount", nullable = false)
    private Integer mProfileViewcount;

    @ColumnDefault("1")
    @Column(name = "M_starcount", nullable = false)
    private Integer mStarcount;

    @ColumnDefault("current_timestamp()")
    @Column(name = "M_jdate", nullable = false)
    private Instant mJdate;

    @ColumnDefault("0")
    @Column(name = "M_vstatus", nullable = false)
    private Integer mVstatus;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getmUname() {
        return mUname;
    }

    public void setmUname(String mUname) {
        this.mUname = mUname;
    }

    public String getmUmobile() {
        return mUmobile;
    }

    public void setmUmobile(String mUmobile) {
        this.mUmobile = mUmobile;
    }

    public String getMaltMobile() {
        return maltMobile;
    }

    public void setMaltMobile(String maltMobile) {
        this.maltMobile = maltMobile;
    }

    public String getmWhatsappno() {
        return mWhatsappno;
    }

    public void setmWhatsappno(String mWhatsappno) {
        this.mWhatsappno = mWhatsappno;
    }

    public String getmAddress() {
        return mAddress;
    }

    public void setmAddress(String mAddress) {
        this.mAddress = mAddress;
    }

    public Integer getmDsid() {
        return mDsid;
    }

    public void setmDsid(Integer mDsid) {
        this.mDsid = mDsid;
    }

    public Integer getmSbeid() {
        return mSbeid;
    }

    public void setmSbeid(Integer mSbeid) {
        this.mSbeid = mSbeid;
    }

    public String getmEducation() {
        return mEducation;
    }

    public void setmEducation(String mEducation) {
        this.mEducation = mEducation;
    }

    public Integer getmSctid() {
        return mSctid;
    }

    public void setmSctid(Integer mSctid) {
        this.mSctid = mSctid;
    }

    public String getmBirthplace() {
        return mBirthplace;
    }

    public void setmBirthplace(String mBirthplace) {
        this.mBirthplace = mBirthplace;
    }

    public LocalDate getmDob() {
        return mDob;
    }

    public void setmDob(LocalDate mDob) {
        this.mDob = mDob;
    }

    public String getmHeight() {
        return mHeight;
    }

    public void setmHeight(String mHeight) {
        this.mHeight = mHeight;
    }

    public Integer getmWeight() {
        return mWeight;
    }

    public void setmWeight(Integer mWeight) {
        this.mWeight = mWeight;
    }

    public Integer getmAge() {
        return mAge;
    }

    public void setmAge(Integer mAge) {
        this.mAge = mAge;
    }

    public String getmVarn() {
        return mVarn;
    }

    public void setmVarn(String mVarn) {
        this.mVarn = mVarn;
    }

    public String getmGender() {
        return mGender;
    }

    public void setmGender(String mGender) {
        this.mGender = mGender;
    }

    public LocalTime getmDobTime() {
        return mDobTime;
    }

    public void setmDobTime(LocalTime mDobTime) {
        this.mDobTime = mDobTime;
    }

    public String getmMarriageType() {
        return mMarriageType;
    }

    public void setmMarriageType(String mMarriageType) {
        this.mMarriageType = mMarriageType;
    }

    public String getmBloodgroup() {
        return mBloodgroup;
    }

    public void setmBloodgroup(String mBloodgroup) {
        this.mBloodgroup = mBloodgroup;
    }

    public Integer getmInid() {
        return mInid;
    }

    public void setmInid(Integer mInid) {
        this.mInid = mInid;
    }

    public String getmFincome() {
        return mFincome;
    }

    public void setmFincome(String mFincome) {
        this.mFincome = mFincome;
    }

    public String getmCurrentWork() {
        return mCurrentWork;
    }

    public void setmCurrentWork(String mCurrentWork) {
        this.mCurrentWork = mCurrentWork;
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

    public String getmSpecs() {
        return mSpecs;
    }

    public void setmSpecs(String mSpecs) {
        this.mSpecs = mSpecs;
    }

    public String getmDrink() {
        return mDrink;
    }

    public void setmDrink(String mDrink) {
        this.mDrink = mDrink;
    }

    public String getmDiet() {
        return mDiet;
    }

    public void setmDiet(String mDiet) {
        this.mDiet = mDiet;
    }

    public String getmSmoking() {
        return mSmoking;
    }

    public void setmSmoking(String mSmoking) {
        this.mSmoking = mSmoking;
    }

    public String getmDieses() {
        return mDieses;
    }

    public void setmDieses(String mDieses) {
        this.mDieses = mDieses;
    }

    public String getmDiseaseDetails() {
        return mDiseaseDetails;
    }

    public void setmDiseaseDetails(String mDiseaseDetails) {
        this.mDiseaseDetails = mDiseaseDetails;
    }

    public String getmOtherinfo() {
        return mOtherinfo;
    }

    public void setmOtherinfo(String mOtherinfo) {
        this.mOtherinfo = mOtherinfo;
    }

    public String getmExpectation() {
        return mExpectation;
    }

    public void setmExpectation(String mExpectation) {
        this.mExpectation = mExpectation;
    }

    public String getmFamilydetails() {
        return mFamilydetails;
    }

    public void setmFamilydetails(String mFamilydetails) {
        this.mFamilydetails = mFamilydetails;
    }

    public String getmRemark() {
        return mRemark;
    }

    public void setmRemark(String mRemark) {
        this.mRemark = mRemark;
    }

    public String getmUprofile() {
        return mUprofile;
    }

    public void setmUprofile(String mUprofile) {
        this.mUprofile = mUprofile;
    }

    public String getmAadharPhoto() {
        return mAadharPhoto;
    }

    public void setmAadharPhoto(String mAadharPhoto) {
        this.mAadharPhoto = mAadharPhoto;
    }

    public String getmUpass() {
        return mUpass;
    }

    public void setmUpass(String mUpass) {
        this.mUpass = mUpass;
    }

    public String getmUrole() {
        return mUrole;
    }

    public void setmUrole(String mUrole) {
        this.mUrole = mUrole;
    }

    public Integer getmLogCount() {
        return mLogCount;
    }

    public void setmLogCount(Integer mLogCount) {
        this.mLogCount = mLogCount;
    }

    public Integer getmLogStatus() {
        return mLogStatus;
    }

    public void setmLogStatus(Integer mLogStatus) {
        this.mLogStatus = mLogStatus;
    }

    public Integer getmViewcount() {
        return mViewcount;
    }

    public void setmViewcount(Integer mViewcount) {
        this.mViewcount = mViewcount;
    }

    public Integer getmProfileViewcount() {
        return mProfileViewcount;
    }

    public void setmProfileViewcount(Integer mProfileViewcount) {
        this.mProfileViewcount = mProfileViewcount;
    }

    public Integer getmStarcount() {
        return mStarcount;
    }

    public void setmStarcount(Integer mStarcount) {
        this.mStarcount = mStarcount;
    }

    public Instant getmJdate() {
        return mJdate;
    }

    public void setmJdate(Instant mJdate) {
        this.mJdate = mJdate;
    }

    public Integer getmVstatus() {
        return mVstatus;
    }

    public void setmVstatus(Integer mVstatus) {
        this.mVstatus = mVstatus;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}