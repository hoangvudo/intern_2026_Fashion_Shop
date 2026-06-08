package com.fashion.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class PasswordResetDto {

    @Data
    public static class ForgotPasswordRequest {
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        private String email;
    }

    @Data
    public static class ValidateTokenRequest {
        @NotBlank(message = "Token không được để trống")
        private String token;
    }

    @Data
    public static class ResetPasswordRequest {
        @NotBlank(message = "Token không được để trống")
        private String token;

        @NotBlank(message = "Mật khẩu mới không được để trống")
        @Size(min = 8, message = "Mật khẩu tối thiểu 8 ký tự")
        private String newPassword;

        @NotBlank(message = "Xác nhận mật khẩu không được để trống")
        private String confirmPassword;
    }
}