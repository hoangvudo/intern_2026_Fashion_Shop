package com.fashion.backend.service;

import com.fashion.backend.dto.*;
import com.fashion.backend.entity.Order;
import com.fashion.backend.entity.OrderStatus;
import com.fashion.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository; // thêm dòng này

    public DashboardStatsDto getStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDateTime endOfLastMonth = startOfMonth.minusSeconds(1);

        BigDecimal thisMonthRevenue = orderRepository.sumRevenueByDateRange(startOfMonth, now);
        if (thisMonthRevenue == null) thisMonthRevenue = BigDecimal.ZERO;

        BigDecimal lastMonthRevenue = orderRepository.sumRevenueByDateRange(startOfLastMonth, endOfLastMonth);
        if (lastMonthRevenue == null) lastMonthRevenue = BigDecimal.ZERO;

        BigDecimal growthPercent = BigDecimal.ZERO;
        if (lastMonthRevenue.compareTo(BigDecimal.ZERO) > 0) {
            growthPercent = thisMonthRevenue
                    .subtract(lastMonthRevenue)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(lastMonthRevenue, 1, RoundingMode.HALF_UP);
        }

        Long todayOrders = orderRepository.countTodayOrders();
        Long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        Long newCustomers = userRepository.countByCreatedAtAfter(startOfMonth);

        BigDecimal inventoryValue = productVariantRepository.calculateInventoryValue();
        if (inventoryValue == null) inventoryValue = BigDecimal.ZERO;

        return DashboardStatsDto.builder()
                .totalRevenue(thisMonthRevenue)
                .revenueGrowthPercent(growthPercent)
                .newOrdersToday(todayOrders != null ? todayOrders : 0L)
                .pendingOrders(pendingOrders != null ? pendingOrders : 0L)
                .newCustomersThisMonth(newCustomers != null ? newCustomers : 0L)
                .totalCustomers(userRepository.count())
                .lowStockCount(productVariantRepository.countByStockLessThan(5))
                .totalProducts(productRepository.count())
                .inventoryValue(inventoryValue)
                .totalProductViews(0L)
                .build();
    }

    public List<RevenueDataDto> getRevenue(String period) {
        LocalDateTime since = switch (period) {
            case "quarter" -> LocalDateTime.now().minusMonths(3);
            case "year"    -> LocalDateTime.now().minusYears(1);
            default        -> LocalDateTime.now().minusDays(30); // "month"
        };

        try {
            List<Object[]> rows = orderRepository.findDailyRevenue(since);
            if (rows == null) return Collections.emptyList();

            return rows.stream().map(row -> RevenueDataDto.builder()
                    .date(row[0] != null ? row[0].toString() : "")
                    .revenue(row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO)
                    .profit(row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO)
                    .build()
            ).collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<BestSellerDto> getBestSellers() {
        try {
            List<Object[]> rows = orderRepository.findBestSellers(
                    PageRequest.of(0, 5)
            );
            if (rows == null || rows.isEmpty()) return Collections.emptyList();

            int maxSold = ((Number) rows.get(0)[2]).intValue();
            if (maxSold == 0) maxSold = 1;

            final int finalMaxSold = maxSold;
            return rows.stream().map(row -> BestSellerDto.builder()
                    .productId(((Number) row[0]).longValue())
                    .productName(row[1] != null ? row[1].toString() : "")
                    .category(row[3] != null ? row[3].toString() : "")
                    .soldQuantity(((Number) row[2]).longValue())
                    .sellPercent((int) (((Number) row[2]).doubleValue() / finalMaxSold * 100))
                    .build()
            ).collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<RecentOrderDto> getRecentOrders() {
        try {
            List<Order> orders = orderRepository
                    .findTop10ByOrderByCreatedAtDesc(PageRequest.of(0, 10));
            if (orders == null) return Collections.emptyList();

            return orders.stream()
                    .map(o -> {
                        // ✅ FIX: Bảo vệ null cho items và user
                        String productSummary = "";
                        if (o.getItems() != null && !o.getItems().isEmpty()) {
                            productSummary = o.getItems().get(0).getProduct() != null
                                    ? o.getItems().get(0).getProduct().getName() : "";
                            if (o.getItems().size() > 1) {
                                productSummary += " +" + (o.getItems().size() - 1) + " sp";
                            }
                        }

                        String customerName = (o.getUser() != null && o.getUser().getFullName() != null)
                                ? o.getUser().getFullName() : "Khách";

                        return RecentOrderDto.builder()
                                .orderId(o.getId())
                                .orderCode("#ORD-" + (8800 + o.getId()))
                                .customerName(customerName)
                                .productSummary(productSummary)
                                .totalAmount(o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                                .status(o.getStatus() != null ? o.getStatus().name() : "PENDING")
                                .createdAt(o.getCreatedAt())
                                .build();
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}