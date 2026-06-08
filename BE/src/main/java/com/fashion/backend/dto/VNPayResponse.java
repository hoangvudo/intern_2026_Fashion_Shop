package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** Response trả về khi tạo link thanh toán VNPay */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VNPayResponse {
    private String paymentUrl;
    private String orderCode;
    private BigDecimal amount;
    private String message;
}