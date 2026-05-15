package com.fashion.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    // Đổi tên từ "password" → "passwordHash" để khớp với PasswordResetService
    // Nếu muốn giữ "password", xem ghi chú bên dưới
    @Column(name = "password")
    private String passwordHash;

    private Boolean isVerified = false;

    // Thêm: kiểm tra tài khoản có bị khoá không (mặc định true = hoạt động)
    private Boolean isActive = true;

    private String emailToken;

    private LocalDateTime tokenExpiredAt;

    // Thêm: token đặt lại mật khẩu
    @Column(name = "reset_token")
    private String resetToken;

    // Thêm: thời hạn của reset token
    @Column(name = "reset_token_exp")
    private LocalDateTime resetTokenExp;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String role = "USER";
}