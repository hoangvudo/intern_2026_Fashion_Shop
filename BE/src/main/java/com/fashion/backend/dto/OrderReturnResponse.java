package com.fashion.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderReturnResponse {

    private Long id;
    private String returnCode;

    private Long orderId;
    private String orderCode;

    private String type;       // CANCEL | RETURN | EXCHANGE
    private String status;     // PENDING | APPROVED | REJECTED | COMPLETED

    private String reason;
    private String description;
    private String adminNote;

    private String exchangeSize;
    private String exchangeColor;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}