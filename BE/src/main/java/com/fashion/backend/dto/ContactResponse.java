package com.fashion.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ContactResponse {
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String status;        // UNREAD | READ | REPLIED | ARCHIVED
    private String adminNote;
    private String replyContent;
    private LocalDateTime repliedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}