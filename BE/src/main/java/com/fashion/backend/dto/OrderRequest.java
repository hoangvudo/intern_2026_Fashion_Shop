package com.fashion.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {

    /* ── Thông tin giao hàng ────────────────────────── */
    @NotBlank(message = "Họ tên không được để trống")
    private String shippingName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)[0-9]{8,10}$", message = "Số điện thoại không hợp lệ")
    private String shippingPhone;

    @NotBlank(message = "Thành phố không được để trống")
    private String city;

    @NotBlank(message = "Quận/Huyện không được để trống")
    private String district;

    @NotBlank(message = "Phường/Xã không được để trống")
    private String ward;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    private String streetAddress;

    /* ── Vận chuyển & Thanh toán ────────────────────── */
    @NotBlank
    private String shippingMethod;  // "FAST" | "STANDARD"

    @NotBlank
    private String paymentMethod;   // "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER"

    /* ── Coupon (tuỳ chọn) ──────────────────────────── */
    private String couponCode;

    /* ── Ghi chú (tuỳ chọn) ─────────────────────────── */
    private String note;

    /* ── Danh sách sản phẩm ─────────────────────────── */
    @NotEmpty(message = "Đơn hàng phải có ít nhất 1 sản phẩm")
    @Valid
    private List<OrderItemRequest> items;

    /* ─────────────────────────────────────────────────── */
    @Data
    public static class OrderItemRequest {

        private Long productId;        // null nếu là sản phẩm custom/không có DB

        @NotBlank(message = "Tên sản phẩm không được để trống")
        private String productName;

        private String productImage;

        private String size;
        private String color;

        @NotNull
        @Min(value = 1, message = "Số lượng tối thiểu là 1")
        private Integer quantity;

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
        private BigDecimal price;
    }
}