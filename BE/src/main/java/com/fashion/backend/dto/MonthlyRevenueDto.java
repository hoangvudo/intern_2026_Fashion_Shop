package com.fashion.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueDto {
    private String month; // e.g., "T1", "T2"
    private BigDecimal actual;
    private BigDecimal target;
}