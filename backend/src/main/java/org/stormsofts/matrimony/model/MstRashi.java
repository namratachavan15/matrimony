package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mst_rashi")
public class MstRashi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RSID", nullable = false)
    private Integer id;

    @Column(name = "Ras", nullable = false, length = 50)
    private String ras;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRas() {
        return ras;
    }

    public void setRas(String ras) {
        this.ras = ras;
    }
}