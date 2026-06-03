package com.fashion.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    /** Snapshot tên sản phẩm tại thời điểm đặt hàng */
    @Column(nullable = false)
    private String productName;

    /** Snapshot ảnh sản phẩm */
    @Column(length = 2000)
    private String productImage;

    /** Biến thể đã chọn */
    private String size;
    private String color;

    @Column(nullable = false)
    private Integer quantity;

    /** Giá tại thời điểm đặt hàng (snapshot) */
    @Column(nullable = false)
    private BigDecimal price;

    /** Tổng dòng = price × quantity */
    @Column(nullable = false)
    private BigDecimal lineTotal;

    @PrePersist
    public void prePersist() {
        if (this.lineTotal == null && this.price != null && this.quantity != null) {
            this.lineTotal = this.price.multiply(BigDecimal.valueOf(this.quantity));
        }
    }
}