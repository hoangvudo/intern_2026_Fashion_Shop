package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayOSResponse {
    private String checkoutUrl;      // URL để redirect tới trang thanh toán PayOS
    private String qrCode;           // Mã QR để quét thanh toán
    private String orderCode;        // Mã đơn hàng
    private BigDecimal amount;       // Số tiền cần thanh toán
    private String message;          // Thông báo

    // Bổ sung thông tin chi tiết
    private String accountNumber;    // Số tài khoản
    private String accountName;      // Tên chủ tài khoản
    private String description;      // Nội dung chuyển khoản
    private String bin;              // Mã ngân hàng (BIN)
}