package com.fashion.backend.service;

import com.fashion.backend.dto.ProductRequest;
import com.fashion.backend.dto.ProductResponse;
import com.fashion.backend.entity.*;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository variantRepository;

    // ── LIST / SEARCH ─────────────────────────────────────────────
    public Page<ProductResponse> search(
            String keyword, Long categoryId, Long brandId,
            BigDecimal minPrice, BigDecimal maxPrice,
            String sortBy, int page, int size) {

        Sort sort = switch (sortBy == null ? "newest" : sortBy) {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "popular"    -> Sort.by("soldCount").descending();
            default           -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productRepository.searchProducts(
                keyword, categoryId, brandId, minPrice, maxPrice, pageable);
        return products.map(ProductResponse::from);
    }

    // Admin: lấy tất cả kể cả inactive
    public Page<ProductResponse> adminSearch(
            String keyword, Long categoryId, Long brandId,
            Boolean isActive, String sortBy, int page, int size) {

        Sort sort = switch (sortBy == null ? "newest" : sortBy) {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "name"       -> Sort.by("name").ascending();
            default           -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sort);
        // Dùng lại search nhưng không lọc isActive ở query
        Page<Product> products = productRepository.adminSearchProducts(
                keyword, categoryId, brandId, isActive, pageable);
        return products.map(ProductResponse::from);
    }

    // ── GET ONE ───────────────────────────────────────────────────
    public ProductResponse getById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + id));
        return ProductResponse.from(p);
    }

    // ── CREATE ────────────────────────────────────────────────────
    @Transactional
    public ProductResponse create(ProductRequest req) {
        Product p = new Product();
        applyRequest(p, req);
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());

        // Slug
        String slug = (req.getSlug() != null && !req.getSlug().isBlank())
                ? req.getSlug() : slugify(req.getName());
        slug = ensureUniqueSlug(slug, null);
        p.setSlug(slug);

        Product saved = productRepository.save(p);

        // Variants
        if (req.getVariants() != null) {
            saveVariants(saved, req.getVariants());
        }
        updateTotalStock(saved);
        return ProductResponse.from(productRepository.save(saved));
    }

    // ── UPDATE ────────────────────────────────────────────────────
    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + id));

        applyRequest(p, req);
        p.setUpdatedAt(LocalDateTime.now());

        if (req.getSlug() != null && !req.getSlug().isBlank()) {
            String slug = ensureUniqueSlug(req.getSlug(), id);
            p.setSlug(slug);
        }

        // Sync variants
        if (req.getVariants() != null) {
            syncVariants(p, req.getVariants());
        }
        updateTotalStock(p);
        return ProductResponse.from(productRepository.save(p));
    }

    // ── DELETE ────────────────────────────────────────────────────
    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id))
            throw new NotFoundException("Sản phẩm không tồn tại: " + id);
        productRepository.deleteById(id);
    }

    // ── TOGGLE ACTIVE ─────────────────────────────────────────────
    @Transactional
    public ProductResponse toggleActive(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + id));
        p.setIsActive(!p.getIsActive());
        p.setUpdatedAt(LocalDateTime.now());
        return ProductResponse.from(productRepository.save(p));
    }

    // ── HELPERS ───────────────────────────────────────────────────
    private void applyRequest(Product p, ProductRequest req) {
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setSalePrice(req.getSalePrice());
        p.setThumbnailUrl(req.getThumbnailUrl());
        p.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
        p.setIsFeatured(req.getIsFeatured() != null ? req.getIsFeatured() : false);
        p.setIsNewArrival(req.getIsNewArrival() != null ? req.getIsNewArrival() : false);

        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category không tồn tại"));
            p.setCategory(cat);
        }
        if (req.getBrandId() != null) {
            Brand brand = brandRepository.findById(req.getBrandId())
                    .orElseThrow(() -> new NotFoundException("Brand không tồn tại"));
            p.setBrand(brand);
        }
    }

    private void saveVariants(Product product, List<ProductRequest.VariantRequest> variantReqs) {
        for (ProductRequest.VariantRequest vr : variantReqs) {
            ProductVariant v = new ProductVariant();
            v.setProduct(product);
            v.setSize(vr.getSize());
            v.setColor(vr.getColor());
            v.setColorHex(vr.getColorHex());
            v.setStock(vr.getStock() != null ? vr.getStock() : 0);
            v.setSku(vr.getSku());
            variantRepository.save(v);
        }
    }

    private void syncVariants(Product product, List<ProductRequest.VariantRequest> variantReqs) {
        List<ProductVariant> existing = variantRepository.findByProductId(product.getId());
        Set<Long> keepIds = variantReqs.stream()
                .filter(v -> v.getId() != null).map(ProductRequest.VariantRequest::getId)
                .collect(Collectors.toSet());

        // Xoá variant không còn trong request
        existing.stream()
                .filter(v -> !keepIds.contains(v.getId()))
                .forEach(variantRepository::delete);

        for (ProductRequest.VariantRequest vr : variantReqs) {
            ProductVariant v;
            if (vr.getId() != null) {
                v = variantRepository.findById(vr.getId()).orElse(new ProductVariant());
            } else {
                v = new ProductVariant();
            }
            v.setProduct(product);
            v.setSize(vr.getSize());
            v.setColor(vr.getColor());
            v.setColorHex(vr.getColorHex());
            v.setStock(vr.getStock() != null ? vr.getStock() : 0);
            v.setSku(vr.getSku());
            variantRepository.save(v);
        }
    }

    private void updateTotalStock(Product p) {
        List<ProductVariant> variants = variantRepository.findByProductId(p.getId());
        int total = variants.stream().mapToInt(v -> v.getStock() != null ? v.getStock() : 0).sum();
        p.setTotalStock(total);
    }

    private String slugify(String input) {
        if (input == null) return "san-pham-" + System.currentTimeMillis();
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").toLowerCase()
                .replaceAll("đ", "d").replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-").trim();
    }

    private String ensureUniqueSlug(String slug, Long excludeId) {
        String base = slug;
        int counter = 1;
        while (true) {
            Optional<Product> existing = productRepository.findBySlug(slug);
            if (existing.isEmpty() || existing.get().getId().equals(excludeId)) break;
            slug = base + "-" + counter++;
        }
        return slug;
    }
}
