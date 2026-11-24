package org.stormsofts.matrimony.model;

import java.math.BigDecimal;
import java.time.Instant;

/** One row of the admin "Membership Payments" table: who paid, for which plan, how much, and the result. */
public class AdminPaymentRowDTO {
    private Integer paymentId;
    private Integer userId;
    private String userName;
    private String userMobile;
    private String userEmail;
    private String planName;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus paymentStatus;
    private String transactionId;
    private String orderId;
    private SubscriptionStatus subscriptionStatus;
    private Instant startDate;
    private Instant endDate;
    private Instant paidAt;

    public AdminPaymentRowDTO(Integer paymentId, Integer userId, String userName, String userMobile, String userEmail,
                              String planName, BigDecimal amount, String currency, PaymentStatus paymentStatus,
                              String transactionId, String orderId, SubscriptionStatus subscriptionStatus,
                              Instant startDate, Instant endDate, Instant paidAt) {
        this.paymentId = paymentId;
        this.userId = userId;
        this.userName = userName;
        this.userMobile = userMobile;
        this.userEmail = userEmail;
        this.planName = planName;
        this.amount = amount;
        this.currency = currency;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
        this.orderId = orderId;
        this.subscriptionStatus = subscriptionStatus;
        this.startDate = startDate;
        this.endDate = endDate;
        this.paidAt = paidAt;
    }

    public Integer getPaymentId() { return paymentId; }
    public Integer getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getUserMobile() { return userMobile; }
    public String getUserEmail() { return userEmail; }
    public String getPlanName() { return planName; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public String getTransactionId() { return transactionId; }
    public String getOrderId() { return orderId; }
    public SubscriptionStatus getSubscriptionStatus() { return subscriptionStatus; }
    public Instant getStartDate() { return startDate; }
    public Instant getEndDate() { return endDate; }
    public Instant getPaidAt() { return paidAt; }
}
