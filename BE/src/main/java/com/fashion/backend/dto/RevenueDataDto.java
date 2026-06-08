// BE/src/main/java/com/fashion/backend/dto/RevenueDataDto.java
package com.fashion.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RevenueDataDto {
    private String date;          // "2026-05-01"
    private BigDecimal revenue;
    private BigDecimal profit;
}