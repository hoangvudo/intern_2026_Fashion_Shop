package com.fashion.backend.controller;

import com.fashion.backend.dto.ContactRequest;
import com.fashion.backend.dto.ContactReplyRequest;
import com.fashion.backend.dto.ContactResponse;
import com.fashion.backend.dto.ContactUpdateRequest;
import com.fashion.backend.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageService service;

    // ── PUBLIC ────────────────────────────────────────────────────

    /** Khách hàng gửi tin nhắn liên hệ (public) */
    @PostMapping
    public ResponseEntity<ContactResponse> submit(@RequestBody ContactRequest req) {
        return ResponseEntity.ok(service.submit(req));
    }

    // ── ADMIN ─────────────────────────────────────────────────────

    /** Danh sách tin nhắn có search + filter trạng thái */
    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<ContactResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.search(keyword, status, page, size));
    }

    /** Chi tiết một tin nhắn (tự đánh dấu READ) */
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ContactResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /** Cập nhật trạng thái hoặc ghi chú */
    @PatchMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ContactResponse> update(
            @PathVariable Long id,
            @RequestBody ContactUpdateRequest req
    ) {
        return ResponseEntity.ok(service.update(id, req));
    }

    /** Admin gửi email phản hồi đến user — tự chuyển status → REPLIED */
    @PostMapping("/admin/{id}/reply")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ContactResponse> reply(
            @PathVariable Long id,
            @RequestBody ContactReplyRequest req
    ) {
        return ResponseEntity.ok(service.reply(id, req));
    }

    /** Xoá tin nhắn */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** Số tin chưa đọc — badge sidebar admin */
    @GetMapping("/admin/unread-count")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Long>> unreadCount() {
        return ResponseEntity.ok(Map.of("count", service.countUnread()));
    }
}