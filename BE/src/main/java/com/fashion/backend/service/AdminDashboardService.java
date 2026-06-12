package com.fashion.backend.service;

import com.fashion.backend.dto.*;
import com.fashion.backend.entity.Order;
import com.fashion.backend.entity.OrderStatus;
<<<<<<< Updated upstream
=======
import com.fashion.backend.entity.Review;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

    public DashboardStatsDto getStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDateTime endOfLastMonth = startOfMonth.minusSeconds(1);

        // ✅ FIX: dùng COALESCE trong query nên không cần null check ở đây,
        //        nhưng vẫn bảo vệ phòng khi driver trả về null
        BigDecimal thisMonthRevenue = orderRepository
                .sumRevenueByDateRange(startOfMonth, now);
        if (thisMonthRevenue == null) thisMonthRevenue = BigDecimal.ZERO;

        BigDecimal lastMonthRevenue = orderRepository
                .sumRevenueByDateRange(startOfLastMonth, endOfLastMonth);
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

        return DashboardStatsDto.builder()
                .totalRevenue(thisMonthRevenue)
                .revenueGrowthPercent(growthPercent)
                .newOrdersToday(todayOrders != null ? todayOrders : 0L)
                .pendingOrders(pendingOrders != null ? pendingOrders : 0L)
                .newCustomersThisMonth(newCustomers != null ? newCustomers : 0L)
                .totalCustomers(userRepository.count())
                .lowStockCount(productVariantRepository.countByStockLessThan(5))
                .build();
=======
    private final ReviewRepository reviewRepository;

    public ReportDataDto getReportData() {
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);

            // Stats
            BigDecimal totalRevenue = orderRepository.sumAllTotalRevenue();
            if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

            Long totalOrders = orderRepository.countCompletedOrders();
            if (totalOrders == null) totalOrders = 0L;

            Long newCustomers = userRepository.countNewCustomersAfter(startOfMonth);
            if (newCustomers == null) newCustomers = 0L;

            // Growth calculation helper
            BigDecimal lastMonthRevenue = orderRepository.sumRevenueByDateRange(startOfLastMonth, startOfMonth.minusSeconds(1));
            BigDecimal revenueGrowth = calculateGrowth(totalRevenue, lastMonthRevenue);

            // Monthly Revenue
            List<Object[]> monthlyRows = orderRepository.findMonthlyRevenue(now.getYear());
            List<MonthlyRevenueDto> monthlyRevenue = (monthlyRows == null) ? Collections.emptyList() :
                    monthlyRows.stream().map(row -> {
                        int month = row[0] != null ? ((Number) row[0]).intValue() : 0;
                        BigDecimal rev = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
                        return MonthlyRevenueDto.builder()
                                .month("T" + month)
                                .actual(rev)
                                .target(rev.multiply(BigDecimal.valueOf(1.2)).add(BigDecimal.valueOf(1000000))) // Dummy target
                                .build();
                    }).collect(Collectors.toList());

            // Ensure 12 months for chart even if no data
            if (monthlyRevenue.size() < 12) {
                // ... optional: fill missing months if needed for UI smoothness
            }

            // Category Stats
            List<Object[]> catRows = orderRepository.findCategorySalesDistribution();
            List<CategoryStatDto> categoryStats = (catRows == null) ? Collections.emptyList() :
                    catRows.stream().map(row -> CategoryStatDto.builder()
                            .name(row[0] != null ? row[0].toString() : "Khác")
                            .percentage(row[1] != null ? ((Number) row[1]).doubleValue() : 0.0)
                            .build()).collect(Collectors.toList());

            // Recent Reviews
            List<Review> reviews = reviewRepository.findTopRecentReviews(PageRequest.of(0, 3));
            List<RecentReviewDto> recentReviews = (reviews == null) ? Collections.emptyList() :
                    reviews.stream().map(r -> RecentReviewDto.builder()
                            .customerName(r.getUser() != null ? r.getUser().getFullName() : "Khách")
                            .content(r.getComment() != null ? r.getComment() : "")
                            .rating(r.getRating() != null ? (double) r.getRating() : 5.0)
                            .timeAgo("Vừa xong") // Simplified
                            .build()).collect(Collectors.toList());

            Double avgRating = 0.0;
            try {
                avgRating = reviewRepository.getGlobalAverageRating();
                if (avgRating == null) avgRating = 0.0;
            } catch (Exception e) {
                // Ignore rating error
            }

            // Funnel (Dummy data as we don't have tracking)
            List<FunnelStepDto> funnel = List.of(
                    new FunnelStepDto("Lượt xem sản phẩm", 12400L),
                    new FunnelStepDto("Thêm vào giỏ", 2840L),
                    new FunnelStepDto("Khởi tạo thanh toán", 1120L),
                    new FunnelStepDto("Hoàn tất đơn hàng", totalOrders)
            );

            return ReportDataDto.builder()
                    .totalRevenue(totalRevenue)
                    .revenueGrowth(revenueGrowth)
                    .totalOrders(totalOrders)
                    .orderGrowth(8.4) // Dummy
                    .conversionRate(3.2) // Dummy
                    .conversionGrowth(-1.2) // Dummy
                    .newCustomers(newCustomers)
                    .customerGrowth(12.0) // Dummy
                    .monthlyRevenue(monthlyRevenue)
                    .categoryStats(categoryStats)
                    .conversionFunnel(funnel)
                    .recentReviews(recentReviews)
                    .averageRating(avgRating)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return createEmptyReport();
        }
    }

    private BigDecimal calculateGrowth(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? BigDecimal.valueOf(100) : BigDecimal.ZERO;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    private ReportDataDto createEmptyReport() {
        return ReportDataDto.builder()
                .totalRevenue(BigDecimal.ZERO)
                .revenueGrowth(BigDecimal.ZERO)
                .totalOrders(0L)
                .orderGrowth(0.0)
                .conversionRate(0.0)
                .conversionGrowth(0.0)
                .newCustomers(0L)
                .customerGrowth(0.0)
                .monthlyRevenue(Collections.emptyList())
                .categoryStats(Collections.emptyList())
                .conversionFunnel(Collections.emptyList())
                .recentReviews(Collections.emptyList())
                .averageRating(0.0)
                .build();
    }

    public DashboardStatsDto getStats() {
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
            LocalDateTime endOfLastMonth = startOfMonth.minusSeconds(1);

            BigDecimal thisMonthRevenue = orderRepository
                    .sumRevenueByDateRange(startOfMonth, now);
            if (thisMonthRevenue == null) thisMonthRevenue = BigDecimal.ZERO;

            BigDecimal lastMonthRevenue = orderRepository
                    .sumRevenueByDateRange(startOfLastMonth, endOfLastMonth);
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
            Long newCustomers = userRepository.countNewCustomersAfter(startOfMonth);

            return DashboardStatsDto.builder()
                    .totalRevenue(thisMonthRevenue)
                    .revenueGrowthPercent(growthPercent)
                    .newOrdersToday(todayOrders != null ? todayOrders : 0L)
                    .pendingOrders(pendingOrders != null ? pendingOrders : 0L)
                    .newCustomersThisMonth(newCustomers != null ? newCustomers : 0L)
                    .totalCustomers(userRepository.countAllCustomers())
                    .lowStockCount(productVariantRepository.countByStockLessThan(5))
                    .build();
        } catch (Exception e) {
            return DashboardStatsDto.builder()
                    .totalRevenue(BigDecimal.ZERO)
                    .revenueGrowthPercent(BigDecimal.ZERO)
                    .newOrdersToday(0L)
                    .pendingOrders(0L)
                    .newCustomersThisMonth(0L)
                    .totalCustomers(0L)
                    .lowStockCount(0L)
                    .build();
        }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
