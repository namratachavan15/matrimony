package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mst_blood")
public class MstBlood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BLID", nullable = false)
    private Integer id;

    @Column(name = "Blood", nullable = false, length = 20)
    private String blood;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBlood() {
        return blood;
    }

    public void setBlood(String blood) {
        this.blood = blood;
    }
}