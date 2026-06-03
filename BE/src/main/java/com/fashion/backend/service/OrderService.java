package com.fashion.backend.service;

import com.fashion.backend.dto.OrderRequest;
import com.fashion.backend.dto.OrderResponse;
import com.fashion.backend.entity.*;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.OrderRepository;
import com.fashion.backend.repository.ProductRepository;
import com.fashion.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository  orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository   userRepository;

    /* ─── Coupon tĩnh (mở rộng sau bằng CouponRepository) ─── */
    private static final Map<String, BigDecimal> COUPON_MAP = Map.of(
            "SALE10",  BigDecimal.valueOf(10),
            "SALE20",  BigDecimal.valueOf(20),
            "NEWUSER", BigDecimal.valueOf(15),
            "YRO5",    BigDecimal.valueOf(5)
    );

    /* ════════════════════════════════════════════════════════ */
    @Transactional
    public OrderResponse placeOrder(OrderRequest req) {

        // 1. Lấy user hiện tại (nếu đã đăng nhập)
        User user = getCurrentUser();

        // 2. Tính subtotal từ cart items
        BigDecimal subtotal = req.getItems().stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Phí vận chuyển
        BigDecimal shippingFee = "FAST".equals(req.getShippingMethod())
                ? BigDecimal.valueOf(35_000)
                : BigDecimal.valueOf(20_000);

        // 4. Coupon
        BigDecimal discountPercent = BigDecimal.ZERO;
        BigDecimal discountAmount  = BigDecimal.ZERO;
        String couponCode = null;

        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {
            String code = req.getCouponCode().trim().toUpperCase();
            BigDecimal pct = COUPON_MAP.get(code);
            if (pct != null) {
                discountPercent = pct;
                discountAmount  = subtotal.multiply(pct)
                        .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
                couponCode = code;
            }
            // code không hợp lệ → bỏ qua, không báo lỗi (đã validate ở FE)
        }

        // 5. Tổng cuối
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(shippingFee);

        // 6. Tạo địa chỉ đầy đủ
        String fullAddress = String.format("%s, %s, %s, %s",
                req.getStreetAddress(), req.getWard(), req.getDistrict(), req.getCity());

        // 7. Tạo Order entity
        String orderCode = generateOrderCode();

        Order order = Order.builder()
                .orderCode(orderCode)
                .user(user)
                .shippingName(req.getShippingName())
                .shippingPhone(req.getShippingPhone())
                .shippingAddress(fullAddress)
                .shippingMethod(req.getShippingMethod())
                .shippingFee(shippingFee)
                .paymentMethod(req.getPaymentMethod())
                .paymentStatus("COD".equals(req.getPaymentMethod()) ? "PENDING" : "PENDING")
                .couponCode(couponCode)
                .discountPercent(discountPercent)
                .discountAmount(discountAmount)
                .subtotal(subtotal)
                .totalAmount(totalAmount)
                .note(req.getNote())
                .status(OrderStatus.PENDING)
                .build();

        // 8. Tạo OrderItems
        List<OrderItem> orderItems = req.getItems().stream().map(i -> {
            Product product = null;
            if (i.getProductId() != null) {
                product = productRepository.findById(i.getProductId()).orElse(null);
            }
            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(i.getProductName())
                    .productImage(i.getProductImage())
                    .size(i.getSize())
                    .color(i.getColor())
                    .quantity(i.getQuantity())
                    .price(i.getPrice())
                    .lineTotal(i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        Order saved = orderRepository.save(order);

        log.info("✅ Order placed: {} | {} | {}₫",
                saved.getOrderCode(), saved.getPaymentMethod(), saved.getTotalAmount());

        return toResponse(saved);
    }

    /* ─── Lấy đơn hàng theo ID ─────────────────────────────── */
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + id));
        return toResponse(order);
    }

    /* ─── Xác nhận coupon ──────────────────────────────────── */
    public Map<String, Object> validateCoupon(String code, BigDecimal subtotal) {
        String upper = code.trim().toUpperCase();
        BigDecimal pct = COUPON_MAP.get(upper);
        Map<String, Object> result = new HashMap<>();
        if (pct != null) {
            BigDecimal discount = subtotal.multiply(pct)
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            result.put("valid", true);
            result.put("code", upper);
            result.put("discountPercent", pct);
            result.put("discountAmount", discount);
            result.put("message", "Mã giảm giá hợp lệ! Bạn được giảm " + pct.intValue() + "%");
        } else {
            result.put("valid", false);
            result.put("message", "Mã giảm giá không hợp lệ hoặc đã hết hạn");
        }
        return result;
    }


    /* ─── Lấy tất cả đơn hàng của user hiện tại ────────────── */
    public List<OrderResponse> getMyOrders() {
        User user = getCurrentUser();
        if (user == null) return List.of();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /* ═══════════════ Helpers ═════════════════════════════════ */

    private String generateOrderCode() {
        String ts = String.valueOf(System.currentTimeMillis()).substring(7); // 6 digits
        return "YRO" + ts.toUpperCase();
    }

    private User getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                return userRepository.findByEmail(auth.getName()).orElse(null);
            }
        } catch (Exception ignored) {}
        return null;
    }

    private String estimatedDelivery(String method) {
        LocalDateTime now = LocalDateTime.now();
        int days = "FAST".equals(method) ? 3 : 5;
        return now.plusDays(days).format(DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy",
                new java.util.Locale("vi")));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.ItemDto> items = order.getItems() == null
                ? List.of()
                : order.getItems().stream().map(i -> OrderResponse.ItemDto.builder()
                                                     .productId(i.getProduct() != null ? i.getProduct().getId() : null)
                                                     .productName(i.getProductName())
                                                     .productImage(i.getProductImage())
                                                     .size(i.getSize())
                                                     .color(i.getColor())
                                                     .quantity(i.getQuantity())
                                                     .price(i.getPrice())
                                                     .lineTotal(i.getLineTotal())
                                                     .build())
                  .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus())
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingMethod(order.getShippingMethod())
                .shippingFee(order.getShippingFee())
                .paymentMethod(order.getPaymentMethod())
                .subtotal(order.getSubtotal())
                .couponCode(order.getCouponCode())
                .discountPercent(order.getDiscountPercent())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .note(order.getNote())
                .items(items)
                .createdAt(order.getCreatedAt())
                .estimatedDelivery(estimatedDelivery(order.getShippingMethod()))
                .build();
    }
}