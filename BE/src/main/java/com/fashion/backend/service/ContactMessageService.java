package com.fashion.backend.service;

import com.fashion.backend.dto.ContactRequest;
import com.fashion.backend.dto.ContactReplyRequest;
import com.fashion.backend.dto.ContactResponse;
import com.fashion.backend.dto.ContactUpdateRequest;
import com.fashion.backend.entity.ContactMessage;
import com.fashion.backend.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository repo;
    private final EmailService emailService;

    // ── PUBLIC ──────────────────────────────────────────────────────

    /** Khách hàng gửi tin nhắn liên hệ */
    public ContactResponse submit(ContactRequest req) {
        if (req.getName()    == null || req.getName().isBlank())    throw new RuntimeException("Vui lòng nhập họ tên");
        if (req.getEmail()   == null || req.getEmail().isBlank())   throw new RuntimeException("Vui lòng nhập email");
        if (req.getMessage() == null || req.getMessage().isBlank()) throw new RuntimeException("Vui lòng nhập nội dung");

        ContactMessage msg = new ContactMessage();
        msg.setName(req.getName().trim());
        msg.setEmail(req.getEmail().trim().toLowerCase());
        msg.setSubject(req.getSubject() != null ? req.getSubject().trim() : "");
        msg.setMessage(req.getMessage().trim());
        msg.setStatus("UNREAD");
        msg.setCreatedAt(LocalDateTime.now());
        msg.setUpdatedAt(LocalDateTime.now());

        return toResponse(repo.save(msg));
    }

    // ── ADMIN ────────────────────────────────────────────────────────

    /** Danh sách tin nhắn có tìm kiếm + lọc trạng thái */
    public Page<ContactResponse> search(String keyword, String status, int page, int size) {
        String kw  = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        String st  = (status  != null && !status.isBlank()  && !"ALL".equals(status)) ? status.trim() : null;
        return repo.search(kw, st, PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(this::toResponse);
    }

    /** Chi tiết một tin nhắn — tự động đổi UNREAD → READ */
    public ContactResponse getById(Long id) {
        ContactMessage msg = findOrThrow(id);
        if ("UNREAD".equals(msg.getStatus())) {
            msg.setStatus("READ");
            msg.setUpdatedAt(LocalDateTime.now());
            repo.save(msg);
        }
        return toResponse(msg);
    }

    /** Admin cập nhật trạng thái và/hoặc ghi chú */
    public ContactResponse update(Long id, ContactUpdateRequest req) {
        ContactMessage msg = findOrThrow(id);
        if (req.getStatus() != null && !req.getStatus().isBlank()) {
            msg.setStatus(req.getStatus().toUpperCase());
        }
        if (req.getAdminNote() != null) {
            msg.setAdminNote(req.getAdminNote().trim());
        }
        msg.setUpdatedAt(LocalDateTime.now());
        return toResponse(repo.save(msg));
    }

    /** Admin gửi email phản hồi đến user — tự chuyển status → REPLIED */
    public ContactResponse reply(Long id, ContactReplyRequest req) {
        if (req.getReplyContent() == null || req.getReplyContent().isBlank()) {
            throw new RuntimeException("Vui lòng nhập nội dung phản hồi");
        }
        ContactMessage msg = findOrThrow(id);
        // Gửi email
        emailService.sendContactReply(
                msg.getEmail(),
                msg.getName(),
                msg.getSubject(),
                msg.getMessage(),
                req.getReplyContent().trim()
        );
        // Cập nhật trạng thái
        msg.setStatus("REPLIED");
        msg.setReplyContent(req.getReplyContent().trim());
        msg.setRepliedAt(LocalDateTime.now());
        msg.setUpdatedAt(LocalDateTime.now());
        return toResponse(repo.save(msg));
    }

    /** Xoá tin nhắn */
    public void delete(Long id) {
        repo.delete(findOrThrow(id));
    }

    /** Số tin chưa đọc — dùng cho badge sidebar */
    public long countUnread() {
        return repo.countByStatus("UNREAD");
    }

    // ── Private helpers ───────────────────────────────────────────

    private ContactMessage findOrThrow(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy tin nhắn #" + id));
    }

    private ContactResponse toResponse(ContactMessage m) {
        ContactResponse r = new ContactResponse();
        r.setId(m.getId());
        r.setName(m.getName());
        r.setEmail(m.getEmail());
        r.setSubject(m.getSubject());
        r.setMessage(m.getMessage());
        r.setStatus(m.getStatus());
        r.setAdminNote(m.getAdminNote());
        r.setReplyContent(m.getReplyContent());
        r.setRepliedAt(m.getRepliedAt());
        r.setCreatedAt(m.getCreatedAt());
        r.setUpdatedAt(m.getUpdatedAt());
        return r;
    }
}