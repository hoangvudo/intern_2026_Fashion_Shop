package com.fashion.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatDto {
    private String name;
    private Double percentage;
}