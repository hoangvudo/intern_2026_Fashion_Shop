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

    private String password;

    private Boolean isVerified = false;

    private String emailToken;

    private LocalDateTime tokenExpiredAt;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String role = "USER";
}