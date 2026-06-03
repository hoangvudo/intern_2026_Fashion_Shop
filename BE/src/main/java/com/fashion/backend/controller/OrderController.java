package com.fashion.backend.controller;

import com.fashion.backend.dto.OrderRequest;
import com.fashion.backend.dto.OrderResponse;
import com.fashion.backend.service.OrderService;
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

    private final OrderService orderService;

    /**
     * POST /api/orders
     * Đặt hàng — body là OrderRequest JSON
     */
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.placeOrder(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/orders/{id}
     * Lấy chi tiết đơn hàng theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }


    /**
     * GET /api/orders/my-orders
     * Lấy danh sách đơn hàng của user đang đăng nhập
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    /**
     * POST /api/orders/validate-coupon
     * Kiểm tra mã giảm giá trước khi đặt hàng
     * Body: { "code": "SALE10", "subtotal": 500000 }
     */
    @PostMapping("/validate-coupon")
    public ResponseEntity<Map<String, Object>> validateCoupon(
            @RequestBody Map<String, Object> body) {
        String code     = (String) body.get("code");
        BigDecimal sub  = new BigDecimal(body.get("subtotal").toString());
        return ResponseEntity.ok(orderService.validateCoupon(code, sub));
    }
}