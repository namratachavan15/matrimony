package org.stormsofts.matrimony.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;

/**
 * Talks to Razorpay's REST API directly (Basic Auth with key_id:key_secret)
 * instead of pulling in the official SDK, since no payment gateway existed
 * in this project yet and a new Maven dependency can't be verified to
 * resolve in this environment. This covers exactly the two calls the
 * membership flow needs: create an order, and verify a completed payment's
 * signature. The key secret never leaves the backend (see
 * CreateOrderResponse, which only ever returns the public key id).
 */
@Service
public class RazorpayService {

    @Value("${app.razorpay.key-id}")
    private String keyId;

    @Value("${app.razorpay.key-secret}")
    private String keySecret;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getKeyId() {
        return keyId;
    }

    public boolean isConfigured() {
        return keyId != null && !keyId.isBlank() && keySecret != null && !keySecret.isBlank();
    }

    /**
     * Creates a Razorpay order for the given amount (in paise -- Razorpay's
     * smallest currency unit) and returns the order id. The amount here
     * must already have been computed from the plan's DB price -- never
     * from anything the frontend sent (see SubscriptionServiceImpl).
     */
    public String createOrder(long amountInPaise, String currency, String receipt) {
        if (!isConfigured()) {
            throw new IllegalStateException(
                    "Payment gateway is not configured. Set app.razorpay.key-id / app.razorpay.key-secret.");
        }
        try {
            Map<String, Object> body = Map.of(
                    "amount", amountInPaise,
                    "currency", currency,
                    "receipt", receipt,
                    "payment_capture", 1
            );
            String json = objectMapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", basicAuthHeader())
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode node = objectMapper.readTree(response.body());
                return node.get("id").asText();
            }
            throw new IllegalStateException("Razorpay order creation failed: " + response.body());
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException("Could not reach payment gateway: " + e.getMessage(), e);
        }
    }

    /**
     * Verifies the HMAC-SHA256 signature Razorpay Checkout returns after a
     * successful payment: signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret).
     * This is the ONLY thing that is allowed to make a subscription ACTIVE --
     * a frontend "payment succeeded" claim on its own is never trusted.
     */
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        if (!isConfigured() || orderId == null || paymentId == null || signature == null) {
            return false;
        }
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computed = HexFormat.of().formatHex(hash);
            return computed.equalsIgnoreCase(signature);
        } catch (Exception e) {
            return false;
        }
    }

    private String basicAuthHeader() {
        String creds = keyId + ":" + keySecret;
        return "Basic " + Base64.getEncoder().encodeToString(creds.getBytes(StandardCharsets.UTF_8));
    }
}
