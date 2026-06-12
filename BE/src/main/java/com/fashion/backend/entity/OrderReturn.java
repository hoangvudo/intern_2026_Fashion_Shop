package com.fashion.backend.entity;



import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_returns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * RT-000001
     */
    @Column(unique = true, nullable = false, length = 20)
    private String returnCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /**
     * CANCEL
     * RETURN
     * EXCHANGE
     */
    @Column(nullable = false, length = 20)
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderReturnStatus status;

    /**
     * Lý do khách hàng chọn
     */
    @Column(nullable = false, length = 1000)
    private String reason;

    /**
     * Mô tả chi tiết của khách
     */
    @Column(length = 2000)
    private String description;

    /**
     * Ghi chú từ Admin
     */
    @Column(length = 1000)
    private String adminNote;

    @Column(length = 2000)
    private String imageUrls;

    /**
     * Size/Màu hiện tại khách đang có
     */
    @Column(length = 100)
    private String currentSize;

    @Column(length = 100)
    private String currentColor;

    /**
     * Size/Màu khách muốn đổi
     */
    @Column(length = 100)
    private String exchangeSize;

    @Column(length = 100)
    private String exchangeColor;

    /**
     * Tiền hoàn cho khách
     */
    @Column(precision = 12, scale = 2)
    private BigDecimal refundAmount;

    /**
     * Thời điểm xử lý
     */
    private LocalDateTime approvedAt;

    private LocalDateTime rejectedAt;

    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {

        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = OrderReturnStatus.PENDING;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}