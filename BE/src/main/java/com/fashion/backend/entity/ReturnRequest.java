package com.fashion.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "return_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * PENDING   → chờ admin duyệt
     * APPROVED  → đã duyệt, chờ nhận hàng
     * REJECTED  → từ chối
     * COMPLETED → hoàn tất hoàn tiền/đổi hàng
     */
    @Column(nullable = false)
    private String status;   // PENDING | APPROVED | REJECTED | COMPLETED

    /** RETURN (hoàn tiền) | EXCHANGE (đổi hàng) */
    @Column(nullable = false)
    private String type;

    @Column(length = 1000)
    private String reason;

    /** Danh sách URL ảnh chứng minh (lưu dạng JSON string hoặc comma-separated) */
    @Column(length = 2000)
    private String imageUrls;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = "PENDING";
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}