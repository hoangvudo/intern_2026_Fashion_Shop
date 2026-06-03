package com.fashion.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private Long id;
    private String orderCode;
    private String status;
    private String paymentStatus;

    /* ── Giao hàng ─────────────────────────── */
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingMethod;
    private BigDecimal shippingFee;

    /* ── Thanh toán ─────────────────────────── */
    private String paymentMethod;

    /* ── Giá ────────────────────────────────── */
    private BigDecimal subtotal;
    private String couponCode;
    private BigDecimal discountPercent;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    /* ── Sản phẩm ───────────────────────────── */
    private List<ItemDto> items;

    /* ── Ghi chú & thời gian ────────────────── */
    private String note;
    private LocalDateTime createdAt;
    private String estimatedDelivery;   // chuỗi ngày dự kiến giao

    /* ─────────────────────────────────────── */
    @Data
    @Builder
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