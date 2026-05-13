package com.fashion.backend.service;

import com.fashion.backend.entity.User;

import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerifyEmail(
            User user
    ) {

        try {

            String verifyLink =
                    "http://localhost:8080/api/auth/verify?token="
                            + user.getEmailToken();

            String subject = "Verify Account";

            String body = """
                    <h2>Xác nhận tài khoản</h2>

                    <p>Nhấn link bên dưới:</p>

                    <a href="%s">
                        Verify Email
                    </a>
                    """.formatted(verifyLink);

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(user.getEmail());

            helper.setSubject(subject);

            helper.setText(body, true);

            mailSender.send(message);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Không gửi được email"
            );
        }
    }
}