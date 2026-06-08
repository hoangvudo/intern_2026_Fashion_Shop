package com.fashion.backend.utils;

import jakarta.servlet.http.HttpServletRequest;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@UtilityClass
public class VNPayUtil {


    public static String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : rawHmac) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            log.error("HMAC-SHA512 error", e);
            throw new RuntimeException("Cannot compute HMAC-SHA512", e);
        }
    }


    public static String buildQueryString(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        for (String field : fieldNames) {
            String value = params.get(field);
            if (value != null && !value.isEmpty()) {
                if (!sb.isEmpty()) sb.append("&");
                sb.append(URLEncoder.encode(field, StandardCharsets.US_ASCII))
                        .append("=")
                        .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
            }
        }
        return sb.toString();
    }

    /** Format datetime theo yêu cầu VNPay: yyyyMMddHHmmss */
    public static String getNow() {
        return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
    }

    /**
     * Lấy IP thực của client (xử lý proxy/load balancer).
     * VNPay yêu cầu vnp_IpAddr trong request tạo link.
     */
    public static String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // X-Forwarded-For có thể chứa nhiều IP, lấy IP đầu tiên
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    /**
     * Xác thực chữ ký HMAC từ callback VNPay.
     * Loại bỏ vnp_SecureHash khỏi params trước khi hash lại.
     */
    public static boolean verifySignature(Map<String, String> params, String hashSecret) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null) return false;

        Map<String, String> signParams = new TreeMap<>(params);
        signParams.remove("vnp_SecureHash");
        signParams.remove("vnp_SecureHashType");

        String hashData = buildQueryString(signParams);
        String computedHash = hmacSHA512(hashSecret, hashData);
        return computedHash.equalsIgnoreCase(receivedHash);
    }

    /**
     * Parse các param từ HttpServletRequest thành Map<String, String>.
     */
    public static Map<String, String> extractParams(HttpServletRequest request) {
        Map<String, String> result = new HashMap<>();
        request.getParameterMap().forEach((key, values) -> {
            if (values != null && values.length > 0) {
                result.put(key, values[0]);
            }
        });
        return result;
    }
}