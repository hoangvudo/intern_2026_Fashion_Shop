package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private String orderCode;
    private String status;
    private String paymentMethod;
    private String paymentStatus;

    /* ── Giao hàng ─────────────────────────── */
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingMethod;
    private BigDecimal shippingFee;

    /* ── Tiền ──────────────────────────────── */
    private BigDecimal subtotal;
    private String couponCode;
    private BigDecimal discountPercent;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    /* ── Khác ──────────────────────────────── */
    private String note;
    private List<ItemDto> items;
    private LocalDateTime createdAt;
    private String estimatedDelivery;

    /* ── Hoàn tiền (nếu có) ────────────────── */
    private Boolean refundRequested;
    private String refundStatus;

    /* ── Đổi/Trả (nếu có) ──────────────────── */
    private OrderReturnResponse returnRequest;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDto {
        private Long productId;
        private String productName;
        private String productImage;
        private String size;
        private String color;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal lineTotal;
    }
}