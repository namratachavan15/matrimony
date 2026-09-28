package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "mst_maratha_success_story_data")
public class MstMarathaSuccessStoryDatum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MSSID", nullable = false)
    private Integer id;

    @Column(name = "G_MUID", nullable = false)
    private Integer gMuid;

    @Column(name = "B_MUID", nullable = false)
    private Integer bMuid;

    @Column(name = "marriage_date", nullable = false)
    private LocalDate marriageDate;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getgMuid() {
        return gMuid;
    }

    public void setgMuid(Integer gMuid) {
        this.gMuid = gMuid;
    }

    public Integer getbMuid() {
        return bMuid;
    }

    public void setbMuid(Integer bMuid) {
        this.bMuid = bMuid;
    }

    public LocalDate getMarriageDate() {
        return marriageDate;
    }

    public void setMarriageDate(LocalDate marriageDate) {
        this.marriageDate = marriageDate;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}