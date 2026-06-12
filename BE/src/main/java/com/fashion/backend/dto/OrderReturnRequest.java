package com.fashion.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderReturnRequest {

    @NotNull(message = "orderId không được để trống")
    private Long orderId;

    /**
     * Loại yêu cầu: CANCEL | RETURN | EXCHANGE
     */
    @NotBlank(message = "type không được để trống")
    private String type;

    /**
     * Lý do chọn từ danh sách gợi ý
     * Ví dụ: "Đặt nhầm sản phẩm", "Muốn đổi size", "Sản phẩm bị lỗi"
     */
    @NotBlank(message = "reason không được để trống")
    private String reason;

    /** Mô tả thêm (không bắt buộc) */
    private String description;

    /** Chỉ dùng cho EXCHANGE */
    private String exchangeSize;
    private String exchangeColor;
}