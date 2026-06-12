package com.fashion.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecentOrderDto {
    private Long orderId;
    private String orderCode;      // "#ORD-8821"
    private String customerName;
    private String productSummary; // tên sp đầu tiên (+ x sp nữa)
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
}