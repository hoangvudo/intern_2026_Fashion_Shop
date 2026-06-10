package com.fashion.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FunnelStepDto {
    private String label;
    private Long count;
}