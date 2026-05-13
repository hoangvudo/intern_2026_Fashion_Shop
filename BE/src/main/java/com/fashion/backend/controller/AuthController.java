package com.fashion.backend.controller;

import com.fashion.backend.dto.CheckEmailResponse;
import com.fashion.backend.dto.LoginRequest;
import com.fashion.backend.dto.LoginResponse;
import com.fashion.backend.dto.RegisterRequest;
import com.fashion.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid
            @RequestBody RegisterRequest request
    ) {

        authService.register(request);

        return ResponseEntity.ok("Register success");
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(
            @RequestParam String email
    ) {

        boolean exists = authService.checkEmail(email);

        return ResponseEntity.ok(
                new CheckEmailResponse(exists)
        );
    }
    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String token
    ) {

        authService.verifyEmail(token);

        return ResponseEntity.ok(
                "Verify thành công"
        );
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        String token =
                authService.login(request);

        return ResponseEntity.ok(
                new LoginResponse(token)
        );
    }
}