package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_subeducation")
public class MstSubeducation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SBEID", nullable = false)
    private Integer id;

    @Column(name = "subeducation", nullable = false, length = 50)
    private String subeducation;

    @Column(name = "EDID", nullable = false)
    private Integer edid;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSubeducation() {
        return subeducation;
    }

    public void setSubeducation(String subeducation) {
        this.subeducation = subeducation;
    }

    public Integer getEdid() {
        return edid;
    }

    public void setEdid(Integer edid) {
        this.edid = edid;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}