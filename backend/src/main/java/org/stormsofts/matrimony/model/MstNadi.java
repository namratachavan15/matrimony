package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mst_nadi")
public class MstNadi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NDID", nullable = false)
    private Integer id;

    @Column(name = "Nadi", nullable = false, length = 20)
    private String nadi;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNadi() {
        return nadi;
    }

    public void setNadi(String nadi) {
        this.nadi = nadi;
    }
}