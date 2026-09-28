package org.stormsofts.matrimony.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class OtpService {
    // mobile -> otp
    private Map<String, String> otpStore = new ConcurrentHashMap<>();


    // Twilio credentials
    private final String ACCOUNT_SID = "ACf77b2c940f5feff065439fb545308c69";
    private final String AUTH_TOKEN = "19e056278d187ede332d325b7c543a8f";
    private final String FROM_NUMBER = "+19203254062";

    public void sendOtpSms(String mobile, String otp) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        System.out.println("mobile no"+mobile);
        Message.creator(
                new PhoneNumber(mobile), // recipient
                new PhoneNumber(FROM_NUMBER), // sender
                "Your OTP is: " + otp
        ).create();
    }

    // Store OTP
    public void saveOtp(String mobile, String otp) {
        System.out.println("saved otp"+otp);
        otpStore.put(mobile, otp);
    }

    // Retrieve OTP
    public String getOtp(String mobile) {
        return otpStore.get(mobile);
    }

    // Remove OTP after verification
    public void removeOtp(String mobile) {
        otpStore.remove(mobile);
    }
}
