
package com.fashion.backend.service;

import com.fashion.backend.dto.CategoryProductFilterRequest;
import com.fashion.backend.dto.FilterOptionsResponse;
import com.fashion.backend.dto.FilterOptionsResponse.*;
        import com.fashion.backend.dto.PagedResponse;
import com.fashion.backend.dto.ProductResponse;
import com.fashion.backend.entity.Product;
import com.fashion.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryProductService {

    private final ProductRepository productRepository;

    // ─────────────────────────────────────────────────────────────────────────
    //  API 1: Filter products in category
    // ─────────────────────────────────────────────────────────────────────────

    public PagedResponse<ProductResponse> filterProducts(CategoryProductFilterRequest req) {

        Pageable pageable = buildPageable(req);

        // Nếu list rỗng → truyền list rỗng + count=0 để query bỏ qua điều kiện
        List<String> colors = nullToEmpty(req.getColors());
        List<String> sizes  = nullToEmpty(req.getSizes());

        Page<Product> page = productRepository.filterByCategory(
                req.getCategoryId(),
                req.getBrandId(),
                req.getMinPrice(),
                req.getMaxPrice(),
                req.getIsFeatured(),
                req.getIsNewArrival(),
                colors,  colors.size(),
                sizes,   sizes.size(),
                pageable
        );

        List<ProductResponse> content = page.getContent()
                .stream()
                .map(ProductResponse::from)
                .toList();

        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  API 2: Filter options / facets
    // ─────────────────────────────────────────────────────────────────────────

    public FilterOptionsResponse getFilterOptions(Long categoryId) {

        // Colors
        List<ColorFacet> colors = productRepository.findColorFacets(categoryId)
                .stream()
                .map(row -> new ColorFacet(
                        (String) row[0],
                        (String) row[1],
                        (Long)   row[2]
                ))
                .toList();

        // Sizes — sắp xếp theo thứ tự size chuẩn
        List<SizeFacet> sizes = productRepository.findSizeFacets(categoryId)
                .stream()
                .map(row -> new SizeFacet(
                        (String) row[0],
                        (Long)   row[1]
                ))
                .sorted((a, b) -> SIZE_ORDER.indexOf(a.getSize()) - SIZE_ORDER.indexOf(b.getSize()))
                .toList();

        // Brands
        List<BrandFacet> brands = productRepository.findBrandFacets(categoryId)
                .stream()
                .map(row -> new BrandFacet(
                        (Long)   row[0],
                        (String) row[1],
                        (Long)   row[2]
                ))
                .toList();

        // Price range
        Object[] priceRow = productRepository.findPriceRange(categoryId);
        PriceRange priceRange = new PriceRange(
                priceRow[0] != null ? (BigDecimal) priceRow[0] : BigDecimal.ZERO,
                priceRow[1] != null ? (BigDecimal) priceRow[1] : BigDecimal.ZERO
        );

        return new FilterOptionsResponse(colors, sizes, brands, priceRange);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private Pageable buildPageable(CategoryProductFilterRequest req) {
        Sort sort = switch (req.getSortBy()) {
            case "price_asc"    -> Sort.by("price").ascending();
            case "price_desc"   -> Sort.by("price").descending();
            case "best_selling" -> Sort.by("soldCount").descending();
            case "top_rated"    -> Sort.by("avgRating").descending();
            default             -> Sort.by("createdAt").descending(); // newest
        };
        // clamp page size: 1–100
        int size = Math.min(Math.max(req.getSize(), 1), 100);
        return PageRequest.of(Math.max(req.getPage(), 0), size, sort);
    }

    private List<String> nullToEmpty(List<String> list) {
        return (list == null) ? Collections.emptyList() : list;
    }

    // Thứ tự size chuẩn cho thời trang
    private static final List<String> SIZE_ORDER = List.of(
            "XS", "S", "M", "L", "XL", "XXL", "XXXL",
            "28", "29", "30", "31", "32", "33", "34", "36", "38", "40"
    );
}