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
public class ShippingFeeResponse {
    private String method;
    private BigDecimal fee;
    private String estimatedDays;
    private String description;
}