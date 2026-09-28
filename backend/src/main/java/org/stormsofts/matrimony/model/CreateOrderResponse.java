package org.stormsofts.matrimony.model;

public class CreateOrderResponse {
    private String razorpayOrderId;
    private String razorpayKeyId;
    private long amountInPaise;
    private String currency;
    private String planName;

    public CreateOrderResponse(String razorpayOrderId, String razorpayKeyId, long amountInPaise,
                               String currency, String planName) {
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayKeyId = razorpayKeyId;
        this.amountInPaise = amountInPaise;
        this.currency = currency;
        this.planName = planName;
    }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public String getRazorpayKeyId() { return razorpayKeyId; }
    public long getAmountInPaise() { return amountInPaise; }
    public String getCurrency() { return currency; }
    public String getPlanName() { return planName; }
}
