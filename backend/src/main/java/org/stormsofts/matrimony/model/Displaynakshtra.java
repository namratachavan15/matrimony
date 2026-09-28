package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "displaynakshtra")
public class Displaynakshtra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @Column(name = "NKID")
    private Integer nkid;

    @Column(name = "Nakshtra", length = 50)
    private String nakshtra;

    public Integer getNkid() {
        return nkid;
    }

    public void setNkid(Integer nkid) {
        this.nkid = nkid;
    }

    public String getNakshtra() {
        return nakshtra;
    }

    public void setNakshtra(String nakshtra) {
        this.nakshtra = nakshtra;
    }
}