package com.fashion.backend.config;

import com.fashion.backend.security.JwtFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtFilter jwtFilter;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http)
                throws Exception {

                http
                        .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                        .csrf(csrf -> csrf.disable())

                        .sessionManagement(session ->
                                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                        )

                        .authorizeHttpRequests(auth -> auth

                                // Preflight request
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                // Auth API
                                .requestMatchers(
                                        "/api/auth/**"
                                ).permitAll()

                                // Public GET APIs
                                .requestMatchers(HttpMethod.GET,
                                        "/api/categories",
                                        "/api/products/**",
                                        "/api/products/*/reviews",
                                        "/api/articles",
                                        "/api/articles/featured",
                                        "/api/articles/recent",
                                        "/api/articles/slug/**"
                                ).permitAll()

                                // Tăng lượt xem bài viết
                                .requestMatchers(HttpMethod.POST,
                                        "/api/articles/*/view"
                                ).permitAll()

                                // Gửi liên hệ từ khách hàng
                                .requestMatchers(HttpMethod.POST,
                                        "/api/contacts"
                                ).permitAll()

                                // Upload ảnh
                                .requestMatchers("/api/upload/**")
                                .authenticated()

                                // Các API còn lại
                                .anyRequest().permitAll()
                        )

                        .addFilterBefore(
                                jwtFilter,
                                UsernamePasswordAuthenticationFilter.class
                        );

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of(
                        "http://localhost:3000",
                        "http://127.0.0.1:3000",
                        "http://localhost:5173"
                ));

                configuration.setAllowedMethods(List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                ));

                configuration.setAllowedHeaders(List.of("*"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source =
                        new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", configuration);

                return source;
        }

        @Bean
        public AuthenticationManager authenticationManager(
                AuthenticationConfiguration config
        ) throws Exception {

                return config.getAuthenticationManager();
        }
}