package com.fashion.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AdminOrderDto {
    private Long id;
    private String orderCode;
    private String status;
    private String paymentStatus;
    private String paymentMethod;

    private String customerName;
    private String customerEmail;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingMethod;

    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String couponCode;
    private String note;

    private List<ItemDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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