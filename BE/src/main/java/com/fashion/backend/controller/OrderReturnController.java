package com.fashion.backend.controller;

import com.fashion.backend.dto.OrderReturnRequest;
import com.fashion.backend.dto.OrderReturnResponse;
import com.fashion.backend.service.OrderReturnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OrderReturnController {

    private final OrderReturnService returnService;

    // ════════════════════════════════════════════
    //  USER endpoints  →  /api/orders/returns/...
    // ════════════════════════════════════════════

    /**
     * POST /api/orders/returns
     * Gửi yêu cầu hủy / đổi / trả đơn
     */
    @PostMapping("/api/orders/returns")
    public ResponseEntity<OrderReturnResponse> submit(
            @Valid @RequestBody OrderReturnRequest request) {
        return ResponseEntity.ok(returnService.submitRequest(request));
    }

    /**
     * GET /api/orders/returns/my
     * Lấy tất cả yêu cầu của user hiện tại
     */
    @GetMapping("/api/orders/returns/my")
    public ResponseEntity<List<OrderReturnResponse>> getMyRequests() {
        return ResponseEntity.ok(returnService.getMyRequests());
    }

    /**
     * GET /api/orders/{orderId}/returns
     * Lấy các yêu cầu theo đơn hàng cụ thể
     */
    @GetMapping("/api/orders/{orderId}/returns")
    public ResponseEntity<List<OrderReturnResponse>> getByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(returnService.getByOrderId(orderId));
    }


    @GetMapping("/api/admin/returns")
    public ResponseEntity<Page<OrderReturnResponse>> adminList(
            @RequestParam(defaultValue = "")    String keyword,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0")   int    page,
            @RequestParam(defaultValue = "20")  int    size) {
        return ResponseEntity.ok(returnService.adminGetAll(keyword, status, page, size));
    }


    @PatchMapping("/api/admin/returns/{id}/status")
    public ResponseEntity<OrderReturnResponse> adminUpdateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        String adminNote = body.get("adminNote");
        return ResponseEntity.ok(returnService.adminUpdateStatus(id, newStatus, adminNote));
    }
}