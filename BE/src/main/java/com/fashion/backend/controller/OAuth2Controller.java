package com.fashion.backend.controller;

import com.fashion.backend.dto.LoginResponse;
import com.fashion.backend.service.OAuth2Service;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Task 1.7 — OAuth2 callback endpoints.
 *
 * Luồng phía client:
 *  1. Redirect user đến:
 *     https://accounts.google.com/o/oauth2/auth
 *       ?client_id=YOUR_CLIENT_ID
 *       &redirect_uri=http://localhost:8080/api/auth/oauth2/google/callback
 *       &response_type=code
 *       &scope=openid email profile
 *
 *  2. Google redirect về:
 *     GET /api/auth/oauth2/google/callback?code=...
 *
 *  3. Server trả về { accessToken, refreshToken }
 */
@RestController
@RequestMapping("/api/auth/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final OAuth2Service oauth2Service;

    // ─── GOOGLE CALLBACK ──────────────────────────────────────
    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback(
            @RequestParam String code
    ) {
        LoginResponse response =
                oauth2Service.handleGoogleCallback(code);

        return ResponseEntity.ok(response);
    }
}