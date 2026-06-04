package com.fashion.backend.service;

import com.fashion.backend.config.VNPayConfig;
import com.fashion.backend.dto.VNPayResponse;
import com.fashion.backend.entity.Order;
import com.fashion.backend.exception.BadRequestException;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.OrderRepository;
import com.fashion.backend.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class VNPayService {

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;

    // ─── IP whitelist callback VNPay sandbox & production ───
    private static final Set<String> VNPAY_IP_WHITELIST = Set.of(
            "113.160.92.202",
            "113.160.90.202",
            "210.211.113.13",
            "203.171.17.146",
            "203.171.17.147",
            "203.171.17.148",
            "203.171.17.149",
            "203.171.17.150",
            "127.0.0.1"   // local dev
    );

    /* ════════════════════════════════════════════════════════
     * Tạo link thanh toán VNPay
     * ════════════════════════════════════════════════════════ */
    public VNPayResponse createPaymentUrl(Long orderId, HttpServletRequest request) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + orderId));

        if (!"VNPAY".equals(order.getPaymentMethod())) {
            throw new BadRequestException("Đơn hàng này không sử dụng phương thức VNPay");
        }
        if ("PAID".equals(order.getPaymentStatus())) {
            throw new BadRequestException("Đơn hàng đã được thanh toán");
        }

       String clientIp = VNPayUtil.getClientIp(request);

        // VNPay yêu cầu amount * 100 (đơn vị: đồng × 100)
        long amount = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version",    vnPayConfig.getVersion());
        params.put("vnp_Command",    vnPayConfig.getCommand());
        params.put("vnp_TmnCode",    vnPayConfig.getTmnCode());
        params.put("vnp_Amount",     String.valueOf(amount));
        params.put("vnp_CurrCode",   vnPayConfig.getCurrencyCode());
        params.put("vnp_TxnRef",     order.getOrderCode());          // mã đơn hàng, unique
        params.put("vnp_OrderInfo",  "Thanh toan don hang " + order.getOrderCode());
        params.put("vnp_OrderType",  "other");
        params.put("vnp_Locale",     vnPayConfig.getLocale());
        params.put("vnp_ReturnUrl",  vnPayConfig.getReturnUrl());
       params.put("vnp_IpAddr",     clientIp);
        params.put("vnp_CreateDate", VNPayUtil.getNow());
        params.put("vnp_ExpireDate", getExpireDate());

        String queryString = VNPayUtil.buildQueryString(params);
        String secureHash   = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), queryString);
        String paymentUrl   = vnPayConfig.getPaymentUrl() + "?" + queryString + "&vnp_SecureHash=" + secureHash;

        log.info("[VNPay] Payment URL created for order {} | amount={}", order.getOrderCode(), amount);

        return VNPayResponse.builder()
                .paymentUrl(paymentUrl)
                .orderCode(order.getOrderCode())
                .amount(order.getTotalAmount())
                .message("Tạo link thanh toán thành công")
                .build();
    }

    /* ════════════════════════════════════════════════════════
     * Xử lý IPN (Instant Payment Notification) từ VNPay
     * Idempotent: gọi nhiều lần với cùng txnRef → an toàn
     * ════════════════════════════════════════════════════════ */
    @Transactional
    public Map<String, String> handleIpn(HttpServletRequest request) {

        // 1. Validate IP whitelist
        String clientIp = VNPayUtil.getClientIp(request);
       if (!VNPAY_IP_WHITELIST.contains(clientIp)) {
           log.warn("[VNPay IPN] Rejected IP: {}", clientIp);
           return Map.of("RspCode", "99", "Message", "Invalid IP");
       }

        // 2. Parse params
        Map<String, String> params = VNPayUtil.extractParams(request);

        // 3. Xác thực chữ ký HMAC
        if (!VNPayUtil.verifySignature(params, vnPayConfig.getHashSecret())) {
            log.warn("[VNPay IPN] Invalid signature for params: {}", params);
            return Map.of("RspCode", "97", "Message", "Invalid signature");
        }

        // 4. Tìm đơn hàng theo txnRef (= orderCode)
        String txnRef = params.get("vnp_TxnRef");
        Order order = orderRepository.findByOrderCode(txnRef).orElse(null);
        if (order == null) {
            log.warn("[VNPay IPN] Order not found: {}", txnRef);
            return Map.of("RspCode", "01", "Message", "Order not found");
        }

        // 5. Idempotent: nếu đã PAID rồi → trả success luôn
        if ("PAID".equals(order.getPaymentStatus())) {
            log.info("[VNPay IPN] Already processed: {}", txnRef);
            return Map.of("RspCode", "00", "Message", "Already processed");
        }

        // 6. Kiểm tra số tiền
        long expectedAmount = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();
        long receivedAmount = Long.parseLong(params.getOrDefault("vnp_Amount", "0"));
        if (expectedAmount != receivedAmount) {
            log.warn("[VNPay IPN] Amount mismatch: expected={} received={}", expectedAmount, receivedAmount);
            return Map.of("RspCode", "04", "Message", "Invalid amount");
        }

        // 7. Cập nhật trạng thái
        String responseCode = params.get("vnp_ResponseCode");
        if ("00".equals(responseCode)) {
            order.setPaymentStatus("PAID");
            log.info("[VNPay IPN] Payment SUCCESS: {} | txn={}", txnRef, params.get("vnp_TransactionNo"));
        } else {
            order.setPaymentStatus("FAILED");
            log.warn("[VNPay IPN] Payment FAILED: {} | code={}", txnRef, responseCode);
        }
        orderRepository.save(order);

        return Map.of("RspCode", "00", "Message", "Confirmed");
    }

    /* ════════════════════════════════════════════════════════
     * Return URL (redirect sau khi user thanh toán xong)
     * Không cập nhật DB ở đây — đã xử lý qua IPN
     * ════════════════════════════════════════════════════════ */
    public Map<String, Object> handleReturn(HttpServletRequest request) {
        Map<String, String> params = VNPayUtil.extractParams(request);
        boolean validSignature = VNPayUtil.verifySignature(params, vnPayConfig.getHashSecret());
        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");

        boolean success = validSignature && "00".equals(responseCode);
        log.info("[VNPay Return] txnRef={} | success={} | code={}", txnRef, success, responseCode);

        return Map.of(
                "success",       success,
                "orderCode",     txnRef != null ? txnRef : "",
                "responseCode",  responseCode != null ? responseCode : "",
                "message",       success ? "Thanh toán thành công" : "Thanh toán thất bại hoặc bị huỷ"
        );
    }

    /* ─── Helper ─────────────────────────────────────────── */
    private String getExpireDate() {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        cal.add(Calendar.MINUTE, 15);
        return new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(cal.getTime());
    }
}