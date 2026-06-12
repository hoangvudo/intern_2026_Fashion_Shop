package com.fashion.backend.service;

import com.fashion.backend.dto.BrandResponse;
import com.fashion.backend.entity.Brand;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    // ── Public ──────────────────────────────────────────────
    public List<BrandResponse> getActive() {
        return brandRepository.findByIsActiveTrueOrderByNameAsc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BrandResponse getBySlug(String slug) {
        Brand brand = brandRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Brand không tồn tại: " + slug));
        return toResponse(brand);
    }

    // ── Admin ───────────────────────────────────────────────
    public List<BrandResponse> getAll() {
        return brandRepository.findAllByOrderByNameAsc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BrandResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public BrandResponse create(Brand brand) {
        if (brand.getSlug() == null || brand.getSlug().isBlank()) {
            brand.setSlug(buildUniqueSlug(brand.getName(), null));
        } else {
            if (brandRepository.existsBySlug(brand.getSlug()))
                throw new RuntimeException("Slug đã tồn tại: " + brand.getSlug());
        }
        return toResponse(brandRepository.save(brand));
    }

    @Transactional
    public BrandResponse update(Long id, Brand data) {
        Brand brand = findOrThrow(id);
        brand.setName(data.getName());
        brand.setDescription(data.getDescription());
        brand.setLogoUrl(data.getLogoUrl());
        brand.setBannerUrl(data.getBannerUrl());
        if (data.getIsActive() != null) brand.setIsActive(data.getIsActive());
        if (data.getSlug() != null && !data.getSlug().isBlank()) {
            if (brandRepository.existsBySlugAndIdNot(data.getSlug(), id))
                throw new RuntimeException("Slug đã tồn tại: " + data.getSlug());
            brand.setSlug(data.getSlug());
        }
        return toResponse(brandRepository.save(brand));
    }

    @Transactional
    public BrandResponse toggleActive(Long id) {
        Brand brand = findOrThrow(id);
        brand.setIsActive(!Boolean.TRUE.equals(brand.getIsActive()));
        return toResponse(brandRepository.save(brand));
    }

    @Transactional
    public void delete(Long id) {
        findOrThrow(id);
        brandRepository.deleteById(id);
    }

    // ── Helpers ─────────────────────────────────────────────
    private Brand findOrThrow(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Brand không tồn tại: " + id));
    }

    private BrandResponse toResponse(Brand brand) {
        BrandResponse r = BrandResponse.from(brand);
        r.setProductCount(brandRepository.countActiveProductsByBrandId(brand.getId()));
        r.setTotalProductCount(brandRepository.countAllProductsByBrandId(brand.getId()));
        return r;
    }

    private String buildUniqueSlug(String input, Long excludeId) {
        String base = slugify(input);
        String slug = base;
        int counter = 1;
        while (true) {
            boolean taken = (excludeId == null)
                    ? brandRepository.existsBySlug(slug)
                    : brandRepository.existsBySlugAndIdNot(slug, excludeId);
            if (!taken) return slug;
            slug = base + "-" + counter++;
        }
    }

    private String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "").replaceAll("[\\s]+", "-").trim();
    }
}