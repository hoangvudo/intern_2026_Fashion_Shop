package com.fashion.backend.service;

import com.fashion.backend.entity.User;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    // ── Đã có sẵn ────────────────────────────────────────────────────────────

    public void sendVerifyEmail(User user) {
        try {
            String verifyLink = frontendUrl + "/verify-email?token=" + user.getEmailToken();

            log.info("[Email] Sending verify email to: {} with token: {}", user.getEmail(), user.getEmailToken());

            String body = """
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px">
                  <h2 style="color:#333">Xác nhận tài khoản</h2>
                  <p>Xin chào <strong>%s</strong>,</p>
                  <p>Nhấn link bên dưới để xác thực email
                     (link có hiệu lực trong <strong>24 giờ</strong>):</p>
                  <div style="text-align:center;margin:28px 0">
                    <a href="%s"
                       style="background:#2563eb;color:#fff;padding:12px 28px;
                              border-radius:6px;text-decoration:none;font-weight:bold">
                      Xác nhận tài khoản
                    </a>
                  </div>
                </div>
                """.formatted(user.getFullName(), verifyLink);

            sendHtml(user.getEmail(), "[Fashion Shop] Xác nhận tài khoản", body);
            log.info("[Email] Verify email sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("[Email] Failed to send verify email: {}", e.getMessage(), e);
            throw new RuntimeException("Không gửi được email");
        }
    }

    // ── 3.4 Gửi link reset mật khẩu ──────────────────────────────────────────

    public void sendPasswordResetEmail(String toEmail, String fullName, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String body = """
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px">
                  <h2 style="color:#333">Đặt lại mật khẩu</h2>
                  <p>Xin chào <strong>%s</strong>,</p>
                  <p>Nhấn nút bên dưới để đặt lại mật khẩu
                     (link có hiệu lực trong <strong>1 giờ</strong>):</p>
                  <div style="text-align:center;margin:28px 0">
                    <a href="%s"
                       style="background:#2563eb;color:#fff;padding:12px 28px;
                              border-radius:6px;text-decoration:none;font-weight:bold">
                      Đặt lại mật khẩu
                    </a>
                  </div>
                  <p style="color:#888;font-size:13px">
                    Nếu bạn không yêu cầu, hãy bỏ qua email này.
                  </p>
                </div>
                """.formatted(fullName, resetLink);

        sendHtml(toEmail, "[Fashion Shop] Đặt lại mật khẩu", body);
    }

    // ── 3.6 Thông báo đổi mật khẩu thành công ────────────────────────────────

    public void sendPasswordChangedEmail(String toEmail, String fullName) {
        String body = """
                <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px">
                  <h2 style="color:#16a34a">✅ Mật khẩu đã được thay đổi</h2>
                  <p>Xin chào <strong>%s</strong>,</p>
                  <p>Mật khẩu tài khoản Fashion Shop của bạn vừa được đặt lại thành công.</p>
                  <p style="color:#dc2626;font-weight:bold">
                    ⚠️ Nếu bạn KHÔNG thực hiện thao tác này,
                    hãy liên hệ hỗ trợ ngay lập tức.
                  </p>
                </div>
                """.formatted(fullName);

        sendHtml(toEmail, "[Fashion Shop] Mật khẩu đã được thay đổi", body);
    }

    // ── Phản hồi tin nhắn liên hệ ─────────────────────────────────────────────

    public void sendContactReply(String toEmail, String userName, String originalSubject,
                                 String originalMessage, String replyContent) {
        String subject = "Re: " + (originalSubject != null && !originalSubject.isBlank()
                ? originalSubject : "Phản hồi từ ZYRO Fashion");
        String body = """
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#333">
                  <div style="background:#1B1C19;padding:20px 24px;margin-bottom:24px">
                    <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:2px">ZYRO FASHION</h1>
                  </div>
                  <p>Xin chào <strong>%s</strong>,</p>
                  <p>Cảm ơn bạn đã liên hệ với chúng tôi. Đây là phản hồi của đội ngũ ZYRO Fashion:</p>
                  <div style="background:#F5F0EB;border-left:4px solid #6F583D;padding:16px 20px;margin:20px 0;border-radius:0 4px 4px 0">
                    <p style="margin:0;white-space:pre-line;line-height:1.7">%s</p>
                  </div>
                  <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0"/>
                  <p style="color:#9E8E7E;font-size:13px">
                    <strong>Tin nhắn gốc của bạn:</strong><br/>
                    <em style="white-space:pre-line">%s</em>
                  </p>
                  <hr style="border:none;border-top:1px solid #E8E0D8;margin:24px 0"/>
                  <p style="color:#9E8E7E;font-size:12px;text-align:center">
                    © ZYRO Fashion · Nếu bạn cần hỗ trợ thêm, hãy trả lời email này.
                  </p>
                </div>
                """.formatted(userName, replyContent, originalMessage);

        sendHtml(toEmail, subject, body);
    }

    // ── Helper dùng chung ─────────────────────────────────────────────────────

    private void sendHtml(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Không gửi được email: " + e.getMessage());
        }
    }
}