package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "displaygan")
public class Displaygan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @Column(name = "GNID")
    private Integer gnid;

    @Column(name = "Gan", length = 50)
    private String gan;

    public Integer getGnid() {
        return gnid;
    }

    public void setGnid(Integer gnid) {
        this.gnid = gnid;
    }

    public String getGan() {
        return gan;
    }

    public void setGan(String gan) {
        this.gan = gan;
    }
}