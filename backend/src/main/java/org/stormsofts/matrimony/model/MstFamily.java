package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mst_family")
public class MstFamily {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FID", nullable = false)
    private Integer id;

    @Column(name = "UID", nullable = false)
    private Integer uid;

    @Column(name = "Mother", nullable = false, length = 50)
    private String mother;

    @Column(name = "Father", nullable = false, length = 50)
    private String father;

    @Column(name = "Brother", nullable = false, length = 50)
    private String brother;

    @Column(name = "Sister", nullable = false, length = 50)
    private String sister;

    @Column(name = "father_occupation", nullable = false, length = 100)
    private String fatherOccupation;

    @Column(name = "mother_occupation", nullable = false, length = 100)
    private String motherOccupation;

    @Column(name = "brother_occupation", nullable = false, length = 100)
    private String brotherOccupation;

    @Column(name = "property_details", nullable = false, length = 100)
    private String propertyDetails;

    @Column(name = "other_details", nullable = false, length = 100)
    private String otherDetails;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
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

    public String getPropertyDetails() {
        return propertyDetails;
    }

    public void setPropertyDetails(String propertyDetails) {
        this.propertyDetails = propertyDetails;
    }

    public String getOtherDetails() {
        return otherDetails;
    }

    public void setOtherDetails(String otherDetails) {
        this.otherDetails = otherDetails;
    }
}