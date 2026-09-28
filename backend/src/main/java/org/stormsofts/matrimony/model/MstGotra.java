package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mst_gotra")
public class MstGotra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "GID", nullable = false)
    private Integer id;

    @Column(name = "Gotra", nullable = false, length = 20)
    private String gotra;

    @Column(name = "CTID", nullable = false)
    private Integer ctid;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getGotra() {
        return gotra;
    }

    public void setGotra(String gotra) {
        this.gotra = gotra;
    }

    public Integer getCtid() {
        return ctid;
    }

    public void setCtid(Integer ctid) {
        this.ctid = ctid;
    }
}