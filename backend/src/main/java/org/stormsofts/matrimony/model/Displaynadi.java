package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "displaynadi")
public class Displaynadi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)



    @Column(name = "NDID")
    private Integer ndid;

    @Column(name = "Nadi", length = 20)
    private String nadi;

    public Integer getNdid() {
        return ndid;
    }

    public void setNdid(Integer ndid) {
        this.ndid = ndid;
    }

    public String getNadi() {
        return nadi;
    }

    public void setNadi(String nadi) {
        this.nadi = nadi;
    }
}