// BE/src/main/java/com/fashion/backend/dto/DashboardStatsDto.java
package com.fashion.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private BigDecimal revenueGrowthPercent;   // % so tháng trước
    private Long newOrdersToday;
    private Long pendingOrders;
    private Long newCustomersThisMonth;
    private Long totalCustomers;
    private Long lowStockCount;                // sản phẩm < 5 cái
}