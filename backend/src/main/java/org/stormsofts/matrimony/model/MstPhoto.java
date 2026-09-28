package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mst_photo")
public class MstPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PHID", nullable = false)
    private Integer id;

    @Column(name = "UID", nullable = false)
    private Integer uid;

    @Column(name = "cphoto", nullable = false, length = 50)
    private String cphoto;

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

    public String getCphoto() {
        return cphoto;
    }

    public void setCphoto(String cphoto) {
        this.cphoto = cphoto;
    }
}