package com.fashion.backend.service;

import com.fashion.backend.dto.*;
import com.fashion.backend.entity.*;
import com.fashion.backend.exception.BadRequestException;
import com.fashion.backend.exception.ForbiddenException;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.*;
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

    private final OrderRepository        orderRepository;
    private final ProductRepository      productRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository         userRepository;
    private final ReturnRequestRepository returnRequestRepository;

    // Số ngày tối đa được đổi/trả sau khi nhận hàng
    private static final int MAX_RETURN_DAYS = 7;

    /* ── Coupon tĩnh (mở rộng sau bằng CouponRepository) ── */
    private static final Map<String, BigDecimal> COUPON_MAP = Map.of(
            "SALE10",  BigDecimal.valueOf(10),
            "SALE20",  BigDecimal.valueOf(20),
            "NEWUSER", BigDecimal.valueOf(15),
            "YRO5",    BigDecimal.valueOf(5)
    );

    /* ════════════════════════════════════════════════════════
     * [1] API TẠO ĐƠN HÀNG
     *     Validate user, địa chỉ, sản phẩm tồn kho, coupon
     *     Tạo order + order_items trong transaction
     * ════════════════════════════════════════════════════════ */
    @Transactional
    public OrderResponse placeOrder(OrderRequest req) {

        // 1a. Validate user (phải đăng nhập)
        User user = getRequiredCurrentUser();

        // 1b. Validate địa chỉ (tất cả field đã có @NotBlank trong DTO)

        // 1c. Validate items + tồn kho, giảm stock
        validateAndDeductStock(req.getItems());

        // 2. Tính subtotal
        BigDecimal subtotal = req.getItems().stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Phí vận chuyển cố định
        BigDecimal shippingFee = "FAST".equals(req.getShippingMethod())
                ? BigDecimal.valueOf(35_000)
                : BigDecimal.valueOf(20_000);

        // 4. Validate & áp coupon
        BigDecimal discountPercent = BigDecimal.ZERO;
        BigDecimal discountAmount  = BigDecimal.ZERO;
        String     appliedCoupon   = null;

        if (req.getCouponCode() != null && !req.getCouponCode().isBlank()) {
            String code = req.getCouponCode().trim().toUpperCase();
            BigDecimal pct = COUPON_MAP.get(code);
            if (pct == null) {
                throw new BadRequestException("Mã giảm giá '" + code + "' không hợp lệ hoặc đã hết hạn");
            }
            discountPercent = pct;
            discountAmount  = subtotal.multiply(pct).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            appliedCoupon   = code;
        }

        // 5. Tổng cuối
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(shippingFee);

        // 6. Địa chỉ đầy đủ
        String fullAddress = String.format("%s, %s, %s, %s",
                req.getStreetAddress(), req.getWard(), req.getDistrict(), req.getCity());

        // 7. Build Order
        Order order = Order.builder()
                .orderCode(generateOrderCode())
                .user(user)
                .shippingName(req.getShippingName())
                .shippingPhone(req.getShippingPhone())
                .shippingAddress(fullAddress)
                .shippingMethod(req.getShippingMethod())
                .shippingFee(shippingFee)
                .paymentMethod(req.getPaymentMethod())
                .paymentStatus("PENDING")
                .couponCode(appliedCoupon)
                .discountPercent(discountPercent)
                .discountAmount(discountAmount)
                .subtotal(subtotal)
                .totalAmount(totalAmount)
                .note(req.getNote())
                .status(OrderStatus.PENDING)
                .build();

        // 8. Build OrderItems (snapshot giá)
        List<OrderItem> items = req.getItems().stream().map(i -> {
            Product product = i.getProductId() != null
                    ? productRepository.findById(i.getProductId()).orElse(null)
                    : null;
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

        order.setItems(items);
        Order saved = orderRepository.save(order);

        log.info("[Order] Created: {} | user={} | method={} | total={}₫",
                saved.getOrderCode(), user.getEmail(), saved.getPaymentMethod(), saved.getTotalAmount());

        return toResponse(saved);
    }

    /* ════════════════════════════════════════════════════════
     * [2] API TÍNH PHÍ VẬN CHUYỂN (logic cố định, cache không cần thiết)
     * ════════════════════════════════════════════════════════ */
    public List<ShippingFeeResponse> getShippingFees() {
        return List.of(
                ShippingFeeResponse.builder()
                        .method("STANDARD")
                        .fee(BigDecimal.valueOf(20_000))
                        .estimatedDays("4-5 ngày")
                        .description("Giao hàng tiêu chuẩn")
                        .build(),
                ShippingFeeResponse.builder()
                        .method("FAST")
                        .fee(BigDecimal.valueOf(35_000))
                        .estimatedDays("2-3 ngày")
                        .description("Giao hàng nhanh")
                        .build()
        );
    }

    /* ════════════════════════════════════════════════════════
     * [3] API DANH SÁCH & CHI TIẾT ĐƠN HÀNG CỦA USER
     *     Chỉ trả đơn của đúng user đang đăng nhập
     * ════════════════════════════════════════════════════════ */
    public List<OrderResponse> getMyOrders(String status) {
        User user = getRequiredCurrentUser();
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        // Filter theo status nếu có
        if (status != null && !status.isBlank()) {
            OrderStatus filterStatus;
            try {
                filterStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Status không hợp lệ: " + status);
            }
            orders = orders.stream()
                    .filter(o -> o.getStatus() == filterStatus)
                    .collect(Collectors.toList());
        }

        return orders.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrderResponse getMyOrderById(Long id) {
        User user = getRequiredCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + id));

        // Bảo đảm chỉ user sở hữu mới xem được
        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Bạn không có quyền xem đơn hàng này");
        }
        return toResponse(order);
    }

    /* ════════════════════════════════════════════════════════
     * [4] API HUỶ ĐƠN HÀNG
     *     Chỉ cho huỷ PENDING / CONFIRMED
     *     Hoàn tồn kho
     *     Nếu đã PAID → tạo refund request (ở đây set flag, admin xử lý)
     * ════════════════════════════════════════════════════════ */
    @Transactional
    public OrderResponse cancelOrder(Long id, String reason) {
        User user = getRequiredCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + id));

        // Chỉ user sở hữu mới được huỷ
        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Bạn không có quyền huỷ đơn hàng này");
        }

        // Chỉ cho phép huỷ ở trạng thái PENDING hoặc CONFIRMED
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException(
                    "Không thể huỷ đơn hàng ở trạng thái " + order.getStatus().name()
                            + ". Chỉ có thể huỷ đơn PENDING hoặc CONFIRMED.");
        }

        // Hoàn lại tồn kho
        restoreStock(order.getItems());

        // Nếu đã thanh toán → đánh dấu cần hoàn tiền
        if ("PAID".equals(order.getPaymentStatus())) {
            order.setPaymentStatus("REFUND_REQUESTED");
            log.info("[Order] Refund requested for paid order: {}", order.getOrderCode());
        }

        order.setStatus(OrderStatus.CANCELLED);
        if (reason != null && !reason.isBlank()) {
            String note = (order.getNote() != null ? order.getNote() + " | " : "") + "Huỷ: " + reason;
            order.setNote(note);
        }

        Order saved = orderRepository.save(order);
        log.info("[Order] Cancelled: {} by user={}", saved.getOrderCode(), user.getEmail());

        return toResponse(saved);
    }

    /* ════════════════════════════════════════════════════════
     * [5] API TẠO YÊU CẦU ĐỔI/TRẢ
     *     Kiểm tra thời hạn (COMPLETED + trong MAX_RETURN_DAYS ngày)
     *     Không duplicate (1 đơn chỉ tạo 1 return request)
     * ════════════════════════════════════════════════════════ */
    @Transactional
    public ReturnRequestDto.Response createReturnRequest(ReturnRequestDto.CreateRequest req) {
        User user = getRequiredCurrentUser();

        Order order = orderRepository.findById(req.getOrderId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + req.getOrderId()));

        // Chỉ user sở hữu mới được tạo yêu cầu
        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Bạn không có quyền tạo yêu cầu đổi/trả cho đơn hàng này");
        }

        // Chỉ đơn COMPLETED mới được đổi/trả
        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new BadRequestException("Chỉ có thể đổi/trả đơn hàng đã hoàn thành (COMPLETED)");
        }

        // Kiểm tra thời hạn đổi/trả
        LocalDateTime deadline = order.getUpdatedAt().plusDays(MAX_RETURN_DAYS);
        if (LocalDateTime.now().isAfter(deadline)) {
            throw new BadRequestException(
                    "Đã quá thời hạn đổi/trả " + MAX_RETURN_DAYS + " ngày kể từ khi nhận hàng");
        }

        // Không cho tạo duplicate
        if (returnRequestRepository.existsByOrderIdAndUserId(order.getId(), user.getId())) {
            throw new BadRequestException("Bạn đã tạo yêu cầu đổi/trả cho đơn hàng này rồi");
        }

        // Validate type
        if (!"RETURN".equals(req.getType()) && !"EXCHANGE".equals(req.getType())) {
            throw new BadRequestException("Loại yêu cầu phải là RETURN hoặc EXCHANGE");
        }

        // Chuyển danh sách ảnh → JSON string đơn giản (comma-separated)
        String imageUrlsStr = req.getImageUrls() != null
                ? String.join(",", req.getImageUrls())
                : "";

        ReturnRequest returnReq = ReturnRequest.builder()
                .order(order)
                .user(user)
                .type(req.getType())
                .reason(req.getReason())
                .imageUrls(imageUrlsStr)
                .status("PENDING")
                .build();

        ReturnRequest saved = returnRequestRepository.save(returnReq);
        log.info("[ReturnRequest] Created id={} | order={} | type={} | user={}",
                saved.getId(), order.getOrderCode(), req.getType(), user.getEmail());

        return toReturnResponse(saved);
    }

    /* ════════════════════════════════════════════════════════
     * VALIDATE COUPON (helper endpoint)
     * ════════════════════════════════════════════════════════ */
    public Map<String, Object> validateCoupon(String code, BigDecimal subtotal) {
        String upper = code.trim().toUpperCase();
        BigDecimal pct = COUPON_MAP.get(upper);
        Map<String, Object> result = new HashMap<>();
        if (pct != null) {
            BigDecimal discount = subtotal.multiply(pct)
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            result.put("valid",           true);
            result.put("code",            upper);
            result.put("discountPercent", pct);
            result.put("discountAmount",  discount);
            result.put("message",         "Mã giảm giá hợp lệ! Giảm " + pct.intValue() + "%");
        } else {
            result.put("valid",   false);
            result.put("message", "Mã giảm giá không hợp lệ hoặc đã hết hạn");
        }
        return result;
    }

    /* ════════════════════════════════════════════════════════
     * PRIVATE HELPERS
     * ════════════════════════════════════════════════════════ */

    /**
     * Validate tồn kho theo ProductVariant (size + color).
     * Nếu không tìm được variant cụ thể → bỏ qua validate stock
     * (cho phép đặt hàng sản phẩm không có variant DB).
     */
    private void validateAndDeductStock(List<OrderRequest.OrderItemRequest> items) {
        for (OrderRequest.OrderItemRequest item : items) {
            if (item.getProductId() == null) continue;

            // Tìm variant theo productId + size + color
            variantRepository.findByProductId(item.getProductId()).stream()
                    .filter(v -> matchVariant(v, item.getSize(), item.getColor()))
                    .findFirst()
                    .ifPresent(variant -> {
                        if (variant.getStock() < item.getQuantity()) {
                            throw new BadRequestException(
                                    "Sản phẩm '" + item.getProductName() + "'"
                                            + (item.getSize() != null ? " size " + item.getSize() : "")
                                            + (item.getColor() != null ? " màu " + item.getColor() : "")
                                            + " chỉ còn " + variant.getStock() + " sản phẩm trong kho");
                        }
                        variant.setStock(variant.getStock() - item.getQuantity());
                        variantRepository.save(variant);
                    });
        }
    }

    /** Hoàn lại stock khi huỷ đơn */
    private void restoreStock(List<OrderItem> items) {
        if (items == null) return;
        for (OrderItem item : items) {
            if (item.getProduct() == null) continue;
            variantRepository.findByProductId(item.getProduct().getId()).stream()
                    .filter(v -> matchVariant(v, item.getSize(), item.getColor()))
                    .findFirst()
                    .ifPresent(variant -> {
                        variant.setStock(variant.getStock() + item.getQuantity());
                        variantRepository.save(variant);
                        log.debug("[Stock] Restored +{} for variant id={}", item.getQuantity(), variant.getId());
                    });
        }
    }

    private boolean matchVariant(ProductVariant v, String size, String color) {
        boolean sizeMatch  = size  == null || size.equalsIgnoreCase(v.getSize());
        boolean colorMatch = color == null || color.equalsIgnoreCase(v.getColor());
        return sizeMatch && colorMatch;
    }

    private String generateOrderCode() {
        String ts = String.valueOf(System.currentTimeMillis()).substring(7);
        return "YRO" + ts.toUpperCase();
    }

    /** Lấy user hiện tại, throw 401 nếu chưa đăng nhập */
    private User getRequiredCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                return userRepository.findByEmail(auth.getName())
                        .orElseThrow(() -> new NotFoundException("Không tìm thấy thông tin người dùng"));
            }
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception ignored) {}
        throw new ForbiddenException("Vui lòng đăng nhập để thực hiện thao tác này");
    }

    private String estimatedDelivery(String method) {
        int days = "FAST".equals(method) ? 3 : 5;
        return LocalDateTime.now().plusDays(days)
                .format(DateTimeFormatter.ofPattern("EEEE, dd/MM/yyyy", new java.util.Locale("vi")));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.ItemDto> items = order.getItems() == null ? List.of()
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

        boolean refundRequested = "REFUND_REQUESTED".equals(order.getPaymentStatus());

        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .status(order.getStatus().name())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingMethod(order.getShippingMethod())
                .shippingFee(order.getShippingFee())
                .subtotal(order.getSubtotal())
                .couponCode(order.getCouponCode())
                .discountPercent(order.getDiscountPercent())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .note(order.getNote())
                .items(items)
                .createdAt(order.getCreatedAt())
                .estimatedDelivery(estimatedDelivery(order.getShippingMethod()))
                .refundRequested(refundRequested)
                .refundStatus(refundRequested ? "Đang chờ hoàn tiền" : null)
                .build();
    }

    private ReturnRequestDto.Response toReturnResponse(ReturnRequest r) {
        ReturnRequestDto.Response res = new ReturnRequestDto.Response();
        res.setId(r.getId());
        res.setOrderId(r.getOrder().getId());
        res.setOrderCode(r.getOrder().getOrderCode());
        res.setStatus(r.getStatus());
        res.setType(r.getType());
        res.setReason(r.getReason());
        res.setImageUrls(r.getImageUrls() != null && !r.getImageUrls().isBlank()
                ? Arrays.asList(r.getImageUrls().split(","))
                : List.of());
        res.setCreatedAt(r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
        return res;
    }
}