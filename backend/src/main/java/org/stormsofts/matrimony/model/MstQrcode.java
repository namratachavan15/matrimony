package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "mst_qrcode")
public class MstQrcode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QRID", nullable = false)
    private Integer id;

    @Column(name = "QRCODE", nullable = false, length = 100)
    private String qrcode;

    @Column(name = "Amount", nullable = false)
    private Integer amount;

    @Column(name = "UPI", nullable = false, length = 200)
    private String upi;

    @ColumnDefault("1")
    @Column(name = "status", nullable = false)
    private Integer status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getQrcode() {
        return qrcode;
    }

    public void setQrcode(String qrcode) {
        this.qrcode = qrcode;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getUpi() {
        return upi;
    }

    public void setUpi(String upi) {
        this.upi = upi;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}