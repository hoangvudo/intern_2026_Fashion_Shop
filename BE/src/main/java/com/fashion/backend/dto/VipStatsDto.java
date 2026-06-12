package com.fashion.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VipStatsDto {
    private BigDecimal totalCustomerRevenue;
    private BigDecimal totalVipRevenue;
    private BigDecimal revenueGrowthPercent;
    private Long newVipMembersThisMonth;
    private Long diamondCount;
    private Long platinumCount;
    private Long goldCount;
    private Long silverCount;
}