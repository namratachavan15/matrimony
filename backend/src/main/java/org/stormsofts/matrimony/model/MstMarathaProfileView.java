package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_maratha_profile_view")
public class MstMarathaProfileView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PVID", nullable = false)
    private Integer id;

    @Column(name = "MUID", nullable = false)
    private Integer muid;

    @Column(name = "MPRID", nullable = false)
    private Integer mprid;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMuid() {
        return muid;
    }

    public void setMuid(Integer muid) {
        this.muid = muid;
    }

    public Integer getMprid() {
        return mprid;
    }

    public void setMprid(Integer mprid) {
        this.mprid = mprid;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}