package com.fashion.backend.service;

import com.fashion.backend.config.PayOSConfig;
import com.fashion.backend.dto.PayOSResponse;
import com.fashion.backend.entity.Order;
import com.fashion.backend.exception.BadRequestException;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.OrderRepository;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayOSService {

    private static final String PAYOS_API        = "https://api-merchant.payos.vn/v2/payment-requests";
    private static final String PAYOS_STATUS_API = "https://api-merchant.payos.vn/v2/payment-requests/";

    private final PayOSConfig     payOSConfig;
    private final OrderRepository orderRepository;
    private final RestTemplate    restTemplate;
    private final Gson            gson;

    // ─────────────────────────────────────────────────────────
    // TẠO LINK THANH TOÁN
    // ─────────────────────────────────────────────────────────
    public PayOSResponse createPaymentLink(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + orderId));

        try {
            long timestamp = System.currentTimeMillis() % 1_000_000L;
            long orderCode = orderId * 1_000_000L + timestamp;
            int  amount    = order.getTotalAmount().intValue();

            // Nội dung CK = mã đơn hàng hiển thị (vd: YRO005161) thay vì ID nội bộ
            String desc = order.getOrderCode();
            if (desc != null && desc.length() > 25) desc = desc.substring(0, 25);
            if (desc == null) desc = "DH" + orderId;

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("orderCode",   orderCode);
            body.put("amount",      amount);
            body.put("description", desc);
            body.put("returnUrl",   payOSConfig.getReturnUrl());
            body.put("cancelUrl",   payOSConfig.getCancelUrl());

            String signData = "amount=" + amount
                    + "&cancelUrl=" + payOSConfig.getCancelUrl()
                    + "&description=" + desc
                    + "&orderCode=" + orderCode
                    + "&returnUrl=" + payOSConfig.getReturnUrl();
            body.put("signature", hmacSHA256(signData, payOSConfig.getChecksumKey()));

            HttpHeaders headers = buildHeaders();
            ResponseEntity<String> response = restTemplate.exchange(
                    PAYOS_API, HttpMethod.POST,
                    new HttpEntity<>(gson.toJson(body), headers), String.class);

            JsonObject json = gson.fromJson(response.getBody(), JsonObject.class);
            String code = json.has("code") ? json.get("code").getAsString() : "";
            if (!"00".equals(code)) {
                String errDesc = json.has("desc") ? json.get("desc").getAsString() : "Unknown error";
                throw new BadRequestException("PayOS từ chối: " + errDesc);
            }

            JsonObject data = json.getAsJsonObject("data");

            // Lưu payosOrderCode vào note để webhook có thể map lại
            order.setNote((order.getNote() != null ? order.getNote() + " | " : "")
                    + "payosCode=" + orderCode);
            orderRepository.save(order);

            return PayOSResponse.builder()
                    .checkoutUrl(safeString(data, "checkoutUrl"))
                    .qrCode(safeString(data, "qrCode"))
                    .orderCode(String.valueOf(orderCode))
                    .amount(order.getTotalAmount())
                    .message("Thành công")
                    .build();

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("[PayOS] Error creating payment link for order {}: {}", orderId, e.getMessage());
            throw new BadRequestException("Lỗi PayOS: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────
    // KIỂM TRA TRẠNG THÁI — gọi thẳng PayOS API realtime
    // FIX: trước đây chỉ đọc DB → không detect được payment
    // ─────────────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> checkPaymentStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + orderId));

        // Nếu DB đã PAID thì trả luôn
        if ("PAID".equals(order.getPaymentStatus())) {
            return Map.of("isPaid", true, "paymentStatus", "PAID",
                    "orderCode", order.getOrderCode() != null ? order.getOrderCode() : "");
        }

        // Trích payosCode từ note (vd: "payosCode=26167831000123")
        Long payosOrderCode = extractPayosCode(order.getNote());
        if (payosOrderCode == null) {
            return Map.of("isPaid", false, "paymentStatus", order.getPaymentStatus(),
                    "orderCode", order.getOrderCode() != null ? order.getOrderCode() : "");
        }

        // Gọi PayOS API kiểm tra realtime
        try {
            HttpHeaders headers = buildHeaders();
            ResponseEntity<String> response = restTemplate.exchange(
                    PAYOS_STATUS_API + payosOrderCode, HttpMethod.GET,
                    new HttpEntity<>(headers), String.class);

            JsonObject json = gson.fromJson(response.getBody(), JsonObject.class);
            String code = json.has("code") ? json.get("code").getAsString() : "";

            if ("00".equals(code)) {
                JsonObject data   = json.getAsJsonObject("data");
                String    status  = data.has("status") ? data.get("status").getAsString() : "";

                if ("PAID".equals(status)) {
                    // Cập nhật DB ngay lập tức
                    order.setPaymentStatus("PAID");
                    orderRepository.save(order);
                    log.info("[PayOS] Order {} marked PAID via status poll", orderId);
                    return Map.of("isPaid", true, "paymentStatus", "PAID",
                            "orderCode", order.getOrderCode() != null ? order.getOrderCode() : "");
                }
            }
        } catch (Exception e) {
            log.warn("[PayOS] Status check failed for order {}: {}", orderId, e.getMessage());
        }

        return Map.of("isPaid", false, "paymentStatus", order.getPaymentStatus(),
                "orderCode", order.getOrderCode() != null ? order.getOrderCode() : "");
    }

    // ─────────────────────────────────────────────────────────
    // WEBHOOK TỪ PAYOS
    // FIX: parse orderId = orderCode / 1_000_000 (không dùng findById(orderCode))
    // ─────────────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> handleWebhook(String webhookBody, String signature) {
        try {
            JsonObject webhookData = gson.fromJson(webhookBody, JsonObject.class);
            JsonObject data        = webhookData.getAsJsonObject("data");

            long payosOrderCode = data.get("orderCode").getAsLong();
            // orderCode = orderId * 1_000_000 + timestamp → lấy orderId
            Long orderId = payosOrderCode / 1_000_000L;

            Order order = orderRepository.findById(orderId).orElse(null);
            if (order != null && !"PAID".equals(order.getPaymentStatus())) {
                order.setPaymentStatus("PAID");
                orderRepository.save(order);
                log.info("[PayOS] Webhook: order {} marked as PAID", orderId);
            }
            return Map.of("success", true);
        } catch (Exception e) {
            log.error("[PayOS] Webhook error: {}", e.getMessage());
            return Map.of("success", false);
        }
    }

    // ─────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────
    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-client-id", payOSConfig.getClientId());
        headers.set("x-api-key",   payOSConfig.getApiKey());
        return headers;
    }

    private String safeString(JsonObject obj, String key) {
        return obj != null && obj.has(key) && !obj.get(key).isJsonNull()
                ? obj.get(key).getAsString() : null;
    }

    /** Trích payosOrderCode từ note, ví dụ "payosCode=26167831000123" */
    private Long extractPayosCode(String note) {
        if (note == null) return null;
        for (String part : note.split("\\|")) {
            String t = part.trim();
            if (t.startsWith("payosCode=")) {
                try { return Long.parseLong(t.substring("payosCode=".length()).trim()); }
                catch (NumberFormatException ignored) {}
            }
        }
        return null;
    }

    private String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256"));
        byte[] hash = mac.doFinal(data.getBytes("UTF-8"));
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}