package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_state")
public class MstState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STID", nullable = false)
    private Integer id;

    @Column(name = "State", nullable = false, length = 50)
    private String state;

    @ColumnDefault("1")
    @Column(name = "CNID", nullable = false)
    private Integer cnid;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getCnid() {
        return cnid;
    }

    public void setCnid(Integer cnid) {
        this.cnid = cnid;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}