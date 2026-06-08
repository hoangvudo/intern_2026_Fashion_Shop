package com.fashion.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {

    // =========================
    // SECRET KEY
    // =========================
    private final String jwtSecret =
            "abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

    // 1 day
    private final long jwtExpiration =
            86400000;

    // =========================
    // GENERATE TOKEN
    // =========================
    public String generateToken(
            String email,
            String role
    ) {

        return Jwts.builder()

                .setSubject(email)

                .claim("role", role)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + jwtExpiration
                        )
                )

                .signWith(
                        SignatureAlgorithm.HS256,
                        jwtSecret
                )

                .compact();
    }

    // =========================
    // GET EMAIL FROM TOKEN
    // =========================
    public String getEmailFromToken(
            String token
    ) {

        return getClaims(token)
                .getSubject();
    }

    // =========================
    // GET ROLE FROM TOKEN
    // =========================
    public String getRoleFromToken(
            String token
    ) {

        return getClaims(token)
                .get("role", String.class);
    }

    // =========================
    // GET CLAIMS
    // =========================
    private Claims getClaims(
            String token
    ) {

        return Jwts.parser()

                .setSigningKey(jwtSecret)

                .parseClaimsJws(token)

                .getBody();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================
    public boolean validateToken(
            String token
    ) {

        try {

            Jwts.parser()

                    .setSigningKey(jwtSecret)

                    .parseClaimsJws(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }
}