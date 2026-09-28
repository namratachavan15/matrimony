package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_age_between")
public class MstAgeBetween {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AGID", nullable = false)
    private Integer id;

    @Column(name = "age_between", nullable = false, length = 50)
    private String ageBetween;

    @Column(name = "sage", nullable = false)
    private Integer sage;

    @Column(name = "lage", nullable = false)
    private Integer lage;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAgeBetween() {
        return ageBetween;
    }

    public void setAgeBetween(String ageBetween) {
        this.ageBetween = ageBetween;
    }

    public Integer getSage() {
        return sage;
    }

    public void setSage(Integer sage) {
        this.sage = sage;
    }

    public Integer getLage() {
        return lage;
    }

    public void setLage(Integer lage) {
        this.lage = lage;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}