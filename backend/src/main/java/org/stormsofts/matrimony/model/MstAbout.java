package org.stormsofts.matrimony.model;



import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_about")
public class MstAbout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ABID", nullable = false)
    private Integer id;

    @Column(name = "ABOUT", nullable = false, length = 1000)
    private String about;

    @Column(name = "CASTID", nullable = false)
    private Integer castId; // only store castId

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public Integer getCastId() {
        return castId;
    }

    public void setCastId(Integer castId) {
        this.castId = castId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
