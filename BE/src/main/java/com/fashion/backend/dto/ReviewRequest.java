package com.fashion.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class ReviewRequest {

    @NotNull(message = "Rating không được để trống")
    @Min(value = 1, message = "Rating tối thiểu là 1")
    @Max(value = 5, message = "Rating tối đa là 5")
    private Integer rating;

    @Size(max = 2000, message = "Bình luận tối đa 2000 ký tự")
    private String comment;

    // Danh sách URL ảnh (upload trước, gửi URL vào đây)
    @Size(max = 5, message = "Tối đa 5 ảnh")
    private List<String> imageUrls;

    // Gắn với đơn hàng cụ thể (optional)
    private Long orderId;
}