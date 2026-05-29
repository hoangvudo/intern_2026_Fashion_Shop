package com.fashion.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private BigDecimal revenueGrowthPercent;
    private Long newOrdersToday;
    private Long pendingOrders;
    private Long newCustomersThisMonth;
    private Long totalCustomers;
    private Long lowStockCount;
    private Long totalProducts;
    private BigDecimal inventoryValue;
    private Long totalProductViews;
}