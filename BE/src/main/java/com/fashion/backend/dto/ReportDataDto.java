package com.fashion.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportDataDto {
    private BigDecimal totalRevenue;
    private BigDecimal revenueGrowth;
    private Long totalOrders;
    private Double orderGrowth;
    private Double conversionRate;
    private Double conversionGrowth;
    private Long newCustomers;
    private Double customerGrowth;

    private List<MonthlyRevenueDto> monthlyRevenue;
    private List<CategoryStatDto> categoryStats;
    private List<FunnelStepDto> conversionFunnel;
    private List<RecentReviewDto> recentReviews;
    private Double averageRating;
}