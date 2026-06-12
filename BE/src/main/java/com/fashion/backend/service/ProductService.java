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

<<<<<<< Updated upstream
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository variantRepository;

    // ── LIST / SEARCH ─────────────────────────────────────────────
=======
    private final ProductRepository     productRepository;
    private final CategoryRepository    categoryRepository;
    private final BrandRepository       brandRepository;
    private final ProductVariantRepository variantRepository;

    // ── PUBLIC SEARCH ────────────────────────────────────────────
    // @Transactional(readOnly=true) giữ session mở để LAZY load an toàn
    // Nhưng với JOIN FETCH trong query -> không cần LAZY load nữa
    @Transactional(readOnly = true)
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    // Admin: lấy tất cả kể cả inactive
=======
    // ── ADMIN SEARCH ─────────────────────────────────────────────
    @Transactional(readOnly = true)
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        // Dùng lại search nhưng không lọc isActive ở query
=======
>>>>>>> Stashed changes
        Page<Product> products = productRepository.adminSearchProducts(
                keyword, categoryId, brandId, isActive, pageable);
        return products.map(ProductResponse::from);
    }
<<<<<<< Updated upstream
    // ── GET STOCK ─────────────────────────────────────────────────
    public int getStock(Long id, String size, String color) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + id));

        List<ProductVariant> variants = variantRepository.findByProductId(id);

        if (variants.isEmpty()) {
            return p.getTotalStock() != null ? p.getTotalStock() : 0;
        }

        return variants.stream()
                .filter(v ->
                        (size == null || size.equals(v.getSize())) &&
                                (color == null || color.equals(v.getColor()))
                )
                .mapToInt(v -> v.getStock() != null ? v.getStock() : 0)
                .sum();
    }
    // ── GET ONE ───────────────────────────────────────────────────
    public ProductResponse getById(Long id) {
        Product p = productRepository.findById(id)
=======

    // ── GET ONE ──────────────────────────────────────────────────
    // Dùng findByIdWithRelations để load đủ category, brand, variants trong 1 query
    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        Product p = productRepository.findByIdWithRelations(id)
>>>>>>> Stashed changes
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + id));
        return ProductResponse.from(p);
    }

<<<<<<< Updated upstream
    // ── CREATE ────────────────────────────────────────────────────
=======
    // ── CREATE ───────────────────────────────────────────────────
>>>>>>> Stashed changes
    @Transactional
    public ProductResponse create(ProductRequest req) {
        Product p = new Product();
        applyRequest(p, req);
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());

<<<<<<< Updated upstream
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
=======
        String slug = (req.getSlug() != null && !req.getSlug().isBlank())
                ? req.getSlug() : slugify(req.getName());
        p.setSlug(ensureUniqueSlug(slug, null));

        Product saved = productRepository.save(p);

        if (req.getVariants() != null) {
            saveVariants(saved, req.getVariants());
        }

        // Tính totalStock sau khi variants đã được persist
        updateTotalStock(saved);
        productRepository.save(saved);

        // Re-fetch với đầy đủ relations để trả về response chính xác
        return ProductResponse.from(
                productRepository.findByIdWithRelations(saved.getId())
                        .orElseThrow(() -> new NotFoundException("Lỗi khi tạo sản phẩm"))
        );
    }

    // ── UPDATE ───────────────────────────────────────────────────
    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        // Load với relations để tránh LAZY issue khi applyRequest đọc category cũ
        Product p = productRepository.findByIdWithRelations(id)
>>>>>>> Stashed changes
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + id));

        applyRequest(p, req);
        p.setUpdatedAt(LocalDateTime.now());

        if (req.getSlug() != null && !req.getSlug().isBlank()) {
<<<<<<< Updated upstream
            String slug = ensureUniqueSlug(req.getSlug(), id);
            p.setSlug(slug);
=======
            p.setSlug(ensureUniqueSlug(req.getSlug(), id));
>>>>>>> Stashed changes
        }

        // Sync variants
        if (req.getVariants() != null) {
            syncVariants(p, req.getVariants());
        }
<<<<<<< Updated upstream
        updateTotalStock(p);
        return ProductResponse.from(productRepository.save(p));
    }

    // ── DELETE ────────────────────────────────────────────────────
=======

        productRepository.save(p);

        // Tính lại totalStock sau khi variants persist
        updateTotalStock(p);
        productRepository.save(p);

        // Re-fetch fresh từ DB để trả về data chính xác 100%
        return ProductResponse.from(
                productRepository.findByIdWithRelations(id)
                        .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + id))
        );
    }

    // ── DELETE ───────────────────────────────────────────────────
>>>>>>> Stashed changes
    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id))
            throw new NotFoundException("Sản phẩm không tồn tại: " + id);
        productRepository.deleteById(id);
    }

<<<<<<< Updated upstream
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
=======
    // ── TOGGLE ACTIVE ────────────────────────────────────────────
    @Transactional
    public ProductResponse toggleActive(Long id) {
        Product p = productRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + id));
        p.setIsActive(!p.getIsActive());
        p.setUpdatedAt(LocalDateTime.now());
        productRepository.save(p);

        // Re-fetch để trả về trạng thái mới nhất
        return ProductResponse.from(
                productRepository.findByIdWithRelations(id)
                        .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + id))
        );
    }

    // ── HELPERS ──────────────────────────────────────────────────
>>>>>>> Stashed changes
    private void applyRequest(Product p, ProductRequest req) {
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setSalePrice(req.getSalePrice());
        p.setThumbnailUrl(req.getThumbnailUrl());
<<<<<<< Updated upstream
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
=======
        p.setImageUrl2(req.getImageUrl2());
        p.setIsActive(req.getIsActive()     != null ? req.getIsActive()     : true);
        p.setIsFeatured(req.getIsFeatured() != null ? req.getIsFeatured()   : false);
        p.setIsNewArrival(req.getIsNewArrival() != null ? req.getIsNewArrival() : false);

        // Luôn update category — kể cả khi null (user muốn xóa category)
        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category không tồn tại: " + req.getCategoryId()));
            p.setCategory(cat);
        } else {
            p.setCategory(null); // Cho phép xóa category
        }

        // Luôn update brand — kể cả khi null
        if (req.getBrandId() != null) {
            Brand brand = brandRepository.findById(req.getBrandId())
                    .orElseThrow(() -> new NotFoundException("Brand không tồn tại: " + req.getBrandId()));
            p.setBrand(brand);
        } else {
            p.setBrand(null); // Cho phép xóa brand
        }
    }

    private void saveVariants(Product product, List<ProductRequest.VariantRequest> reqs) {
        for (ProductRequest.VariantRequest vr : reqs) {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    private void syncVariants(Product product, List<ProductRequest.VariantRequest> variantReqs) {
        List<ProductVariant> existing = variantRepository.findByProductId(product.getId());
        Set<Long> keepIds = variantReqs.stream()
                .filter(v -> v.getId() != null).map(ProductRequest.VariantRequest::getId)
                .collect(Collectors.toSet());

        // Xoá variant không còn trong request
=======
    private void syncVariants(Product product, List<ProductRequest.VariantRequest> reqs) {
        List<ProductVariant> existing = variantRepository.findByProductId(product.getId());
        Set<Long> keepIds = reqs.stream()
                .filter(v -> v.getId() != null)
                .map(ProductRequest.VariantRequest::getId)
                .collect(Collectors.toSet());

        // Xóa variant không còn trong request
>>>>>>> Stashed changes
        existing.stream()
                .filter(v -> !keepIds.contains(v.getId()))
                .forEach(variantRepository::delete);

<<<<<<< Updated upstream
        for (ProductRequest.VariantRequest vr : variantReqs) {
=======
        for (ProductRequest.VariantRequest vr : reqs) {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        List<ProductVariant> variants = variantRepository.findByProductId(p.getId());
        int total = variants.stream().mapToInt(v -> v.getStock() != null ? v.getStock() : 0).sum();
=======
        int total = variantRepository.findByProductId(p.getId())
                .stream()
                .mapToInt(v -> v.getStock() != null ? v.getStock() : 0)
                .sum();
>>>>>>> Stashed changes
        p.setTotalStock(total);
    }

    private String slugify(String input) {
        if (input == null) return "san-pham-" + System.currentTimeMillis();
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
<<<<<<< Updated upstream
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").toLowerCase()
                .replaceAll("đ", "d").replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-").trim();
=======
        String result = Pattern.compile("\\p{InCombiningDiacriticalMarks}+")
                .matcher(normalized).replaceAll("")
                .toLowerCase()
                .replace("đ", "d")
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .trim();
        return result.isEmpty() ? "san-pham-" + System.currentTimeMillis() : result;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
