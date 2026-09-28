package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_profile_view")
public class MstProfileView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PVID", nullable = false)
    private Integer id;

    @Column(name = "UID", nullable = false)
    private Integer uid;

    @Column(name = "PRID", nullable = false)
    private Integer prid;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getPrid() {
        return prid;
    }

    public void setPrid(Integer prid) {
        this.prid = prid;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}