package org.stormsofts.matrimony.model;

import java.time.Instant;

public class SubscriptionHistoryDTO {
    private Integer id;
    private String planName;
    private java.math.BigDecimal amount;
    private Instant startDate;
    private Instant endDate;
    private SubscriptionStatus status;
    private PaymentStatus paymentStatus;
    private String transactionId;
    private Instant createdAt;

    public SubscriptionHistoryDTO(Integer id, String planName, java.math.BigDecimal amount, Instant startDate,
                                  Instant endDate, SubscriptionStatus status, PaymentStatus paymentStatus,
                                  String transactionId, Instant createdAt) {
        this.id = id;
        this.planName = planName;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
        this.createdAt = createdAt;
    }

    public Integer getId() { return id; }
    public String getPlanName() { return planName; }
    public java.math.BigDecimal getAmount() { return amount; }
    public Instant getStartDate() { return startDate; }
    public Instant getEndDate() { return endDate; }
    public SubscriptionStatus getStatus() { return status; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public String getTransactionId() { return transactionId; }
    public Instant getCreatedAt() { return createdAt; }
}
