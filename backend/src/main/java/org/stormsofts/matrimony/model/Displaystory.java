package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "displaystory")
public class Displaystory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @Column(name = "SID")
    private Integer sid;

    @Column(name = "Bridename", length = 50)
    private String bridename;

    @Column(name = "groomname", length = 50)
    private String groomname;

    @Column(name = "simg", length = 50)
    private String simg;

    @Column(name = "status")
    private Integer status;

    public Integer getSid() {
        return sid;
    }

    public void setSid(Integer sid) {
        this.sid = sid;
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