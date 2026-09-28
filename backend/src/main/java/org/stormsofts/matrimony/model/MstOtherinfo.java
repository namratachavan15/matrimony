package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_otherinfo")
public class MstOtherinfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OID", nullable = false)
    private Integer id;

    @Column(name = "UID", nullable = false)
    private Integer uid;
//
//    @Column(name = "navras_naav", nullable = false, length = 50)
//    private String navrasNaav;

    @Column(name = "RSID", nullable = false)
    private Integer rsid;

    @Column(name = "NKID", nullable = false)
    private Integer nkid;

    @Column(name = "GNID", nullable = false)
    private Integer gnid;

    @Column(name = "NDID", nullable = false)
    private Integer ndid;

    @Column(name = "GID", nullable = false)
    private Integer gid;
//
//    @Column(name = "kuldaiwat", nullable = false, length = 50)
//    private String kuldaiwat;

    @Column(name = "charan", nullable = false, length = 50)
    private String charan;

    @Column(name = "managal", nullable = false, length = 50)
    private String managal;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status=1;

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

    public Integer getRsid() {
        return rsid;
    }

    public void setRsid(Integer rsid) {
        this.rsid = rsid;
    }

    public Integer getNkid() {
        return nkid;
    }

    public void setNkid(Integer nkid) {
        this.nkid = nkid;
    }

    public Integer getGnid() {
        return gnid;
    }

    public void setGnid(Integer gnid) {
        this.gnid = gnid;
    }

    public Integer getNdid() {
        return ndid;
    }

    public void setNdid(Integer ndid) {
        this.ndid = ndid;
    }

    public Integer getGid() {
        return gid;
    }

    public void setGid(Integer gid) {
        this.gid = gid;
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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}