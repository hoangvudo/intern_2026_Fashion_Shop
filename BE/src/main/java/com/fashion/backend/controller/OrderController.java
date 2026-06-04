package com.fashion.backend.controller;

import com.fashion.backend.dto.*;
import com.fashion.backend.service.OrderService;
import com.fashion.backend.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService  orderService;
    private final VNPayService  vnPayService;

    /* ─────────────────────────────────────────────────────────
     * [1] TẠO ĐƠN HÀNG
     * POST /api/orders
     * Body: OrderRequest (validated)
     * Auth: required
     * ───────────────────────────────────────────────────────── */
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody OrderRequest req) {
        return ResponseEntity.ok(orderService.placeOrder(req));
    }

    /* ─────────────────────────────────────────────────────────
     * [2] PHÍ VẬN CHUYỂN
     * GET /api/orders/shipping-fees
     * Auth: không cần
     * ───────────────────────────────────────────────────────── */
    @GetMapping("/shipping-fees")
    public ResponseEntity<List<ShippingFeeResponse>> getShippingFees() {
        return ResponseEntity.ok(orderService.getShippingFees());
    }

    /* ─────────────────────────────────────────────────────────
     * [3a] DANH SÁCH ĐƠN HÀNG CỦA TÔI
     * GET /api/orders/my?status=PENDING
     * Auth: required
     * ───────────────────────────────────────────────────────── */
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.getMyOrders(status));
    }

    /* ─────────────────────────────────────────────────────────
     * [3b] CHI TIẾT ĐƠN HÀNG
     * GET /api/orders/my/{id}
     * Auth: required – chỉ đúng user mới xem được
     * ───────────────────────────────────────────────────────── */
    @GetMapping("/my/{id}")
    public ResponseEntity<OrderResponse> getMyOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getMyOrderById(id));
    }

    /* ─────────────────────────────────────────────────────────
     * [4] HUỶ ĐƠN HÀNG
     * PATCH /api/orders/my/{id}/cancel
     * Body: { "reason": "..." }   (optional)
     * Auth: required
     * ───────────────────────────────────────────────────────── */
    @PatchMapping("/my/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            @RequestBody(required = false) CancelOrderRequest req) {
        String reason = req != null ? req.getReason() : null;
        return ResponseEntity.ok(orderService.cancelOrder(id, reason));
    }

    /* ─────────────────────────────────────────────────────────
     * [5] TẠO YÊU CẦU ĐỔI/TRẢ
     * POST /api/orders/return-requests
     * Body: ReturnRequestDto.CreateRequest
     * Auth: required
     * ───────────────────────────────────────────────────────── */
    @PostMapping("/return-requests")
    public ResponseEntity<ReturnRequestDto.Response> createReturnRequest(
            @Valid @RequestBody ReturnRequestDto.CreateRequest req) {
        return ResponseEntity.ok(orderService.createReturnRequest(req));
    }

    /* ─────────────────────────────────────────────────────────
     * VALIDATE COUPON
     * GET /api/orders/coupon/validate?code=SALE10&subtotal=500000
     * Auth: không cần
     * ───────────────────────────────────────────────────────── */
    @GetMapping("/coupon/validate")
    public ResponseEntity<Map<String, Object>> validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal subtotal) {
        return ResponseEntity.ok(orderService.validateCoupon(code, subtotal));
    }

    /* ─────────────────────────────────────────────────────────
     * [VNPAY] TẠO LINK THANH TOÁN
     * POST /api/orders/{id}/vnpay/create
     * Auth: required
     * ───────────────────────────────────────────────────────── */
    @PostMapping("/{id}/vnpay/create")
    public ResponseEntity<VNPayResponse> createVNPayUrl(
            @PathVariable Long id,
            HttpServletRequest request) {
        return ResponseEntity.ok(vnPayService.createPaymentUrl(id, request));
    }

    /* ─────────────────────────────────────────────────────────
     * [VNPAY] IPN – Webhook từ VNPay (server-to-server)
     * GET /api/orders/vnpay/ipn
     * Auth: không cần (validate IP whitelist + HMAC trong service)
     * ───────────────────────────────────────────────────────── */
    @GetMapping("/vnpay/ipn")
    public ResponseEntity<Map<String, String>> vnPayIpn(HttpServletRequest request) {
        return ResponseEntity.ok(vnPayService.handleIpn(request));
    }

    /* ─────────────────────────────────────────────────────────
     * [VNPAY] RETURN URL – redirect sau khi thanh toán
     * GET /api/orders/vnpay/return
     * Auth: không cần
     * ───────────────────────────────────────────────────────── */
    @GetMapping("/vnpay/return")
    public ResponseEntity<Map<String, Object>> vnPayReturn(HttpServletRequest request) {
        return ResponseEntity.ok(vnPayService.handleReturn(request));
    }
}