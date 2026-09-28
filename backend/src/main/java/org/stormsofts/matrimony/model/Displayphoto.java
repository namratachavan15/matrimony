package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "displayphoto")
public class Displayphoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PHID")
    private Integer phid;

    @Column(name = "cphoto", length = 50)
    private String cphoto;



    @Column(name = "UID")
    private Integer uid;

    @Column(name = "Uname", length = 50)
    private String uname;

    @Column(name = "Umobile", length = 20)
    private String umobile;

    public Integer getPhid() {
        return phid;
    }

    public void setPhid(Integer phid) {
        this.phid = phid;
    }

    public String getCphoto() {
        return cphoto;
    }

    public void setCphoto(String cphoto) {
        this.cphoto = cphoto;
    }

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
}