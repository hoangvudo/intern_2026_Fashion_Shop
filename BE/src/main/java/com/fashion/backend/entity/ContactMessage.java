package com.fashion.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
@Data
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    // UNREAD | READ | REPLIED | ARCHIVED
    @Column(nullable = false)
    private String status = "UNREAD";

    // Ghi chú nội bộ của admin
    @Column(columnDefinition = "TEXT")
    private String adminNote;

    // Nội dung phản hồi đã gửi email cho user
    @Column(columnDefinition = "TEXT")
    private String replyContent;

    private LocalDateTime repliedAt;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}