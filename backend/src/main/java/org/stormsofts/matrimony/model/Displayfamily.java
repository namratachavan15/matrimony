package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "displayfamily")
public class Displayfamily {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @Column(name = "UID")
    private Integer uid;

    @Column(name = "FID")
    private Integer fid;

    @Column(name = "Mother", length = 50)
    private String mother;

    @Column(name = "Father", length = 50)
    private String father;

    @Column(name = "Brother", length = 50)
    private String brother;

    @Column(name = "Sister", length = 50)
    private String sister;

    @Column(name = "father_occupation", length = 100)
    private String fatherOccupation;

    @Column(name = "mother_occupation", length = 100)
    private String motherOccupation;

    @Column(name = "brother_occupation", length = 100)
    private String brotherOccupation;

    @Column(name = "Uname", length = 50)
    private String uname;

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getFid() {
        return fid;
    }

    public void setFid(Integer fid) {
        this.fid = fid;
    }

    public String getMother() {
        return mother;
    }

    public void setMother(String mother) {
        this.mother = mother;
    }

    public String getFather() {
        return father;
    }

    public void setFather(String father) {
        this.father = father;
    }

    public String getBrother() {
        return brother;
    }

    public void setBrother(String brother) {
        this.brother = brother;
    }

    public String getSister() {
        return sister;
    }

    public void setSister(String sister) {
        this.sister = sister;
    }

    public String getFatherOccupation() {
        return fatherOccupation;
    }

    public void setFatherOccupation(String fatherOccupation) {
        this.fatherOccupation = fatherOccupation;
    }

    public String getMotherOccupation() {
        return motherOccupation;
    }

    public void setMotherOccupation(String motherOccupation) {
        this.motherOccupation = motherOccupation;
    }

    public String getBrotherOccupation() {
        return brotherOccupation;
    }

    public void setBrotherOccupation(String brotherOccupation) {
        this.brotherOccupation = brotherOccupation;
    }

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }
}