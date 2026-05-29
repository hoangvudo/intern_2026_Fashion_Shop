package com.fashion.backend.controller;

import com.fashion.backend.dto.*;
import com.fashion.backend.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminDashboardService dashboardService;

    // GET /api/admin/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard() {
        return ResponseEntity.ok("Welcome Admin");
    }

    // GET /api/admin/stats
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    // GET /api/admin/revenue?period=month|quarter|year
    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueDataDto>> getRevenue(
            @RequestParam(defaultValue = "month") String period
    ) {
        return ResponseEntity.ok(dashboardService.getRevenue(period));
    }
    @GetMapping("/product-stats")
    public ResponseEntity<DashboardStatsDto> getProductStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }
    // GET /api/admin/best-sellers
    @GetMapping("/best-sellers")
    public ResponseEntity<List<BestSellerDto>> getBestSellers() {
        return ResponseEntity.ok(dashboardService.getBestSellers());
    }

    // GET /api/admin/orders/recent
    @GetMapping("/orders/recent")
    public ResponseEntity<List<RecentOrderDto>> getRecentOrders() {
        return ResponseEntity.ok(dashboardService.getRecentOrders());
    }
}