package org.stormsofts.matrimony.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Sends and verifies registration OTPs.
 *
 * - Twilio credentials come from configuration (app.twilio.*), never from source code.
 * - Every OTP expires after 5 minutes and allows at most 5 wrong attempts.
 * - A new OTP can only be requested every 30 seconds per mobile number.
 * - For local development without Twilio, set app.otp.dev-mode=true: no SMS is
 *   sent and the OTP is written to the server log instead. It is off by default,
 *   so a production server with missing credentials fails loudly rather than
 *   quietly logging OTPs.
 *
 * OTPs are held in memory, so a backend restart invalidates pending OTPs.
 */
@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private static final long EXPIRY_SECONDS = 300;
    private static final long RESEND_COOLDOWN_SECONDS = 30;
    private static final int MAX_ATTEMPTS = 5;

    public enum VerifyResult { OK, NOT_FOUND_OR_EXPIRED, INVALID, TOO_MANY_ATTEMPTS }

    private static class OtpEntry {
        final String otp;
        final Instant expiresAt;
        final Instant sentAt;
        int attempts = 0;

        OtpEntry(String otp) {
            this.otp = otp;
            this.sentAt = Instant.now();
            this.expiresAt = this.sentAt.plusSeconds(EXPIRY_SECONDS);
        }
    }

    // mobile -> otp entry
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    @Value("${app.twilio.account-sid:}")
    private String accountSid;

    @Value("${app.twilio.auth-token:}")
    private String authToken;

    @Value("${app.twilio.from-number:}")
    private String fromNumber;

    @Value("${app.otp.dev-mode:false}")
    private boolean devMode;

    public boolean isSmsConfigured() {
        return !accountSid.isBlank() && !authToken.isBlank() && !fromNumber.isBlank();
    }

    public boolean isDevMode() {
        return devMode;
    }

    /** Seconds the caller must still wait before another OTP can be requested (0 = allowed now). */
    public long resendWaitSeconds(String mobile) {
        OtpEntry existing = otpStore.get(mobile);
        if (existing == null) return 0;
        long elapsed = Instant.now().getEpochSecond() - existing.sentAt.getEpochSecond();
        return Math.max(0, RESEND_COOLDOWN_SECONDS - elapsed);
    }

    /**
     * Sends the OTP by SMS (or logs it in dev mode). Throws IllegalStateException
     * with a readable message if the SMS can't be sent.
     */
    public void sendOtpSms(String mobile, String otp) {
        if (!isSmsConfigured()) {
            if (devMode) {
                log.warn("[DEV MODE] SMS not sent. OTP for {} is {}", mobile, otp);
                return;
            }
            throw new IllegalStateException(
                    "SMS service is not configured. Set app.twilio.account-sid, app.twilio.auth-token "
                            + "and app.twilio.from-number (or app.otp.dev-mode=true for local testing).");
        }
        try {
            Twilio.init(accountSid, authToken);
            Message.creator(
                    new PhoneNumber(mobile),
                    new PhoneNumber(fromNumber),
                    "Your OTP is: " + otp + ". It is valid for 5 minutes."
            ).create();
        } catch (Exception e) {
            log.error("Twilio failed to send OTP to {}: {}", mobile, e.getMessage());
            throw new IllegalStateException("Could not send SMS: " + e.getMessage(), e);
        }
    }

    public void saveOtp(String mobile, String otp) {
        otpStore.put(mobile, new OtpEntry(otp));
    }

    public VerifyResult verifyOtp(String mobile, String otp) {
        OtpEntry entry = otpStore.get(mobile);
        if (entry == null || Instant.now().isAfter(entry.expiresAt)) {
            otpStore.remove(mobile);
            return VerifyResult.NOT_FOUND_OR_EXPIRED;
        }
        if (entry.attempts >= MAX_ATTEMPTS) {
            otpStore.remove(mobile);
            return VerifyResult.TOO_MANY_ATTEMPTS;
        }
        if (otp == null || !entry.otp.equals(otp.trim())) {
            entry.attempts++;
            return VerifyResult.INVALID;
        }
        otpStore.remove(mobile); // single use
        return VerifyResult.OK;
    }

    public void removeOtp(String mobile) {
        otpStore.remove(mobile);
    }
}
