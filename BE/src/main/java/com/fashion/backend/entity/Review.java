package com.fashion.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reviews",
        indexes = {
                @Index(name = "idx_review_product", columnList = "product_id"),
                @Index(name = "idx_review_user",    columnList = "user_id")
        }
)
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Liên kết đơn hàng – nullable để không break nếu chưa có Order module
    @Column(name = "order_id")
    private Long orderId;

    @Column(nullable = false)
    private Integer rating;          // 1 – 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    // Ảnh đính kèm lưu dạng JSON array URL, ví dụ: ["url1","url2"]
    @ElementCollection
    @CollectionTable(name = "review_images",
            joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_url", length = 1000)
    private List<String> imageUrls = new ArrayList<>();

    private Boolean isVisible = true; // true = hiển thị, false = ẩn bởi admin

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}