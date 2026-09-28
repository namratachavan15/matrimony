package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_height_between")
public class MstHeightBetween {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HID", nullable = false)
    private Integer id;

    @Column(name = "height_between", nullable = false, length = 50)
    private String heightBetween;

    @Column(name = "sheight", nullable = false)
    private Float sheight;

    @Column(name = "lheight", nullable = false)
    private Float lheight;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getHeightBetween() {
        return heightBetween;
    }

    public void setHeightBetween(String heightBetween) {
        this.heightBetween = heightBetween;
    }

    public Float getSheight() {
        return sheight;
    }

    public void setSheight(Float sheight) {
        this.sheight = sheight;
    }

    public Float getLheight() {
        return lheight;
    }

    public void setLheight(Float lheight) {
        this.lheight = lheight;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}