package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_story")
public class MstStory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SID", nullable = false)
    private Integer id;

    @Column(name = "bridename", nullable = false)
    private String bridename;

    @Column(name = "groomname", nullable = false)
    private String groomname;

    @Column(name = "marriage_date", nullable = false)
    private String marriageDate;

    @Column(name = "feedback", nullable = false, length = 1200)
    private String feedback;

    @Column(name = "simg", nullable = false)
    private String simg;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBridename() {
        return bridename;
    }

    public void setBridename(String bridename) {
        this.bridename = bridename;
    }

    public String getGroomname() {
        return groomname;
    }

    public void setGroomname(String groomname) {
        this.groomname = groomname;
    }

    public String getMarriageDate() {
        return marriageDate;
    }

    public void setMarriageDate(String marriageDate) {
        this.marriageDate = marriageDate;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getSimg() {
        return simg;
    }

    public void setSimg(String simg) {
        this.simg = simg;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}