package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "displayrashi")
public class Displayrashi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @Column(name = "RSID")
    private Integer rsid;

    @Column(name = "Ras", length = 50)
    private String ras;

    public Integer getRsid() {
        return rsid;
    }

    public void setRsid(Integer rsid) {
        this.rsid = rsid;
    }

    public String getRas() {
        return ras;
    }

    public void setRas(String ras) {
        this.ras = ras;
    }
}