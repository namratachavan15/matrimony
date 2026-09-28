package org.stormsofts.matrimony.model;

import lombok.Data;

@Data
public class OtpRequest {
    private String otp;       // OTP entered by user
    private MstUser user;     // User info from registration form

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public MstUser getUser() {
        return user;
    }

    public void setUser(MstUser user) {
        this.user = user;
    }
}
