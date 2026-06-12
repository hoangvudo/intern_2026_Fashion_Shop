package com.fashion.backend.dto;

import lombok.Data;

@Data
public class ContactReplyRequest {
    private String replyContent;  // Nội dung admin phản hồi gửi email cho user
}