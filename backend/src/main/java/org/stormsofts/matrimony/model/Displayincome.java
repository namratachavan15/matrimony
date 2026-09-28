package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "displayincome")
public class Displayincome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @Column(name = "INID")
    private Integer inid;

    @Column(name = "Income", length = 20)
    private String income;

    public Integer getInid() {
        return inid;
    }

    public void setInid(Integer inid) {
        this.inid = inid;
    }

    public String getIncome() {
        return income;
    }

    public void setIncome(String income) {
        this.income = income;
    }
}