package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "displayother")
public class Displayother {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @Column(name = "OID")
    private Integer oid;

    @Column(name = "UID")
    private Integer uid;

    @Column(name = "navras_naav", length = 50)
    private String navrasNaav;

    @Column(name = "kuldaiwat", length = 50)
    private String kuldaiwat;

    @Column(name = "charan", length = 50)
    private String charan;

    @Column(name = "managal", length = 50)
    private String managal;

    @Column(name = "Nakshtra", length = 50)
    private String nakshtra;

    @Column(name = "Nadi", length = 20)
    private String nadi;

    @Column(name = "Gan", length = 50)
    private String gan;

    @Column(name = "Gotra", length = 20)
    private String gotra;

    @Column(name = "Ras", length = 50)
    private String ras;

    @Column(name = "Uname", length = 50)
    private String uname;

    public Integer getOid() {
        return oid;
    }

    public void setOid(Integer oid) {
        this.oid = oid;
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public String getNavrasNaav() {
        return navrasNaav;
    }

    public void setNavrasNaav(String navrasNaav) {
        this.navrasNaav = navrasNaav;
    }

    public String getKuldaiwat() {
        return kuldaiwat;
    }

    public void setKuldaiwat(String kuldaiwat) {
        this.kuldaiwat = kuldaiwat;
    }

    public String getCharan() {
        return charan;
    }

    public void setCharan(String charan) {
        this.charan = charan;
    }

    public String getManagal() {
        return managal;
    }

    public void setManagal(String managal) {
        this.managal = managal;
    }

    public String getNakshtra() {
        return nakshtra;
    }

    public void setNakshtra(String nakshtra) {
        this.nakshtra = nakshtra;
    }

    public String getNadi() {
        return nadi;
    }

    public void setNadi(String nadi) {
        this.nadi = nadi;
    }

    public String getGan() {
        return gan;
    }

    public void setGan(String gan) {
        this.gan = gan;
    }

    public String getGotra() {
        return gotra;
    }

    public void setGotra(String gotra) {
        this.gotra = gotra;
    }

    public String getRas() {
        return ras;
    }

    public void setRas(String ras) {
        this.ras = ras;
    }

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }
}