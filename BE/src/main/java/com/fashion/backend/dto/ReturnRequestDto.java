package com.fashion.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

public class ReturnRequestDto {

    @Data
    public static class CreateRequest {

        @NotNull(message = "Order ID không được để trống")
        private Long orderId;

        /** RETURN | EXCHANGE */
        @NotBlank(message = "Loại yêu cầu không được để trống")
        private String type;

        @NotBlank(message = "Lý do không được để trống")
        private String reason;

        /** Danh sách URL ảnh đã upload lên S3 (upload trước, truyền URL vào đây) */
        private List<String> imageUrls;
    }

    @Data
    public static class Response {
        private Long id;
        private Long orderId;
        private String orderCode;
        private String status;
        private String type;
        private String reason;
        private List<String> imageUrls;
        private String createdAt;
    }
}