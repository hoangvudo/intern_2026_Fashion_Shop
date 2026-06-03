package com.fashion.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Mã đơn hàng hiển thị (vd: YRO12345) */
    @Column(unique = true, nullable = false)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    /* ── Trạng thái ─────────────────────────────────────────── */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status; // PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED

    /* ── Thông tin giao hàng ─────────────────────────────────── */
    @Column(nullable = false)
    private String shippingName;

    @Column(nullable = false)
    private String shippingPhone;

    /** Địa chỉ đầy đủ: "Số nhà, đường – Phường – Quận – Thành phố" */
    @Column(nullable = false, length = 500)
    private String shippingAddress;

    /** Phương thức vận chuyển: FAST (35k) | STANDARD (20k) */
    @Column(nullable = false)
    private String shippingMethod;  // "FAST" | "STANDARD"

    private BigDecimal shippingFee;

    /* ── Thanh toán ───────────────────────────────────────────── */
    /** Phương thức: COD | VNPAY | MOMO | BANK_TRANSFER */
    @Column(nullable = false)
    private String paymentMethod;

    /** Trạng thái thanh toán: PENDING | PAID | FAILED */
    @Column(nullable = false)
    private String paymentStatus;

    /* ── Coupon / Giảm giá ───────────────────────────────────── */
    @Column(name = "coupon_code", length = 50)
    private String couponCode;

    @Column(name = "discount_percent", precision = 10, scale = 2,
            columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private BigDecimal discountPercent;   // vd: 10.00 → 10%

    @Column(name = "discount_amount",
            columnDefinition = "DECIMAL(19,2) DEFAULT 0.00")
    private BigDecimal discountAmount;    // số tiền giảm thực tế

    /* ── Tổng tiền ───────────────────────────────────────────── */
    @Column(name = "subtotal",
            columnDefinition = "DECIMAL(19,2) DEFAULT 0.00")
    private BigDecimal subtotal;          // tổng sản phẩm trước giảm giá

    @Column(nullable = false)
    private BigDecimal totalAmount;       // = subtotal - discount + shipping

    /* ── Ghi chú ─────────────────────────────────────────────── */
    @Column(length = 1000)
    private String note;

    /* ── Thời gian ───────────────────────────────────────────── */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = OrderStatus.PENDING;
        if (this.paymentStatus == null) this.paymentStatus = "PENDING";
        // Đảm bảo các field số không null trước khi lưu
        if (this.discountPercent == null) this.discountPercent = java.math.BigDecimal.ZERO;
        if (this.discountAmount == null)  this.discountAmount  = java.math.BigDecimal.ZERO;
        if (this.subtotal == null)        this.subtotal        = java.math.BigDecimal.ZERO;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}