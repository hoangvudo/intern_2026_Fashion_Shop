package com.fashion.backend.service;

import com.fashion.backend.dto.AdminOrderDto;
import com.fashion.backend.entity.Order;
import com.fashion.backend.entity.OrderStatus;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.OrderRepository;
<<<<<<< Updated upstream
=======
import com.fashion.backend.repository.ProductVariantRepository;
>>>>>>> Stashed changes
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;
<<<<<<< Updated upstream
=======
    private final ProductVariantRepository productVariantRepository;
>>>>>>> Stashed changes

    public Page<AdminOrderDto> getOrders(String keyword, String status, int page, int size) {
        OrderStatus statusEnum = null;
        if (status != null && !status.isBlank() && !status.equals("ALL")) {
            try { statusEnum = OrderStatus.valueOf(status.toUpperCase()); } catch (Exception ignored) {}
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findAdminOrders(statusEnum, keyword, pageable);
        return orders.map(this::toDto);
    }

    public AdminOrderDto getOrderDetail(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + id));
        return toDto(order);
    }

    @Transactional
    public AdminOrderDto updateStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng #" + id));
        try {
            order.setStatus(OrderStatus.valueOf(newStatus.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + newStatus);
        }
        return toDto(orderRepository.save(order));
    }

    private AdminOrderDto toDto(Order o) {
        List<AdminOrderDto.ItemDto> items = o.getItems() == null ? List.of() :
                o.getItems().stream().map(i -> AdminOrderDto.ItemDto.builder()
                                               .productId(i.getProduct() != null ? i.getProduct().getId() : null)
                                               .productName(i.getProductName())
                                               .productImage(i.getProductImage())
                                               .size(i.getSize())
                                               .color(i.getColor())
                                               .quantity(i.getQuantity())
                                               .price(i.getPrice())
                                               .lineTotal(i.getLineTotal())
                                               .build()).collect(Collectors.toList());

        String customerEmail = (o.getUser() != null) ? o.getUser().getEmail() : null;
        String customerName = (o.getUser() != null && o.getUser().getFullName() != null)
                ? o.getUser().getFullName() : o.getShippingName();

        return AdminOrderDto.builder()
                .id(o.getId())
                .orderCode(o.getOrderCode())
                .status(o.getStatus().name())
                .paymentStatus(o.getPaymentStatus())
                .paymentMethod(o.getPaymentMethod())
                .customerName(customerName)
                .customerEmail(customerEmail)
                .shippingName(o.getShippingName())
                .shippingPhone(o.getShippingPhone())
                .shippingAddress(o.getShippingAddress())
                .shippingMethod(o.getShippingMethod())
                .subtotal(o.getSubtotal())
                .shippingFee(o.getShippingFee())
                .discountAmount(o.getDiscountAmount())
                .totalAmount(o.getTotalAmount())
                .couponCode(o.getCouponCode())
                .note(o.getNote())
                .items(items)
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}