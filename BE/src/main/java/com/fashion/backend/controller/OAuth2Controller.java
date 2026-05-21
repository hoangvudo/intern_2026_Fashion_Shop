package com.fashion.backend.controller;

import com.fashion.backend.dto.LoginResponse;
import com.fashion.backend.service.OAuth2Service;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import java.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/auth/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final OAuth2Service oauth2Service;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @GetMapping("/google/callback")
    public void googleCallback(
            @RequestParam String code,
            HttpServletResponse response
    ) throws IOException {
        LoginResponse tokens = oauth2Service.handleGoogleCallback(code);

        String redirectUrl = frontendUrl + "/oauth2/callback"
                + "?accessToken=" + tokens.getAccessToken()
                + "&refreshToken=" + tokens.getRefreshToken();

        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/facebook/callback")
    public void facebookCallback(
            @RequestParam String code,
            HttpServletResponse response
    ) throws IOException {
        LoginResponse tokens = oauth2Service.handleFacebookCallback(code);

        String redirectUrl = frontendUrl + "/oauth2/callback"
                + "?accessToken=" + tokens.getAccessToken()
                + "&refreshToken=" + tokens.getRefreshToken();

        response.sendRedirect(redirectUrl);
    }
}