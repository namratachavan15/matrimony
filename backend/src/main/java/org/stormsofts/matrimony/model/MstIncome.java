package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "mst_income")
public class MstIncome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "INID", nullable = false)
    private Integer id;

    @Column(name = "Income", nullable = false, length = 20)
    private String income;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIncome() {
        return income;
    }

    public void setIncome(String income) {
        this.income = income;
    }
}