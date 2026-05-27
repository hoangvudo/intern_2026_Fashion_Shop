package com.fashion.backend.service;

import com.fashion.backend.entity.Brand;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;

    public List<Brand> getAll() { return brandRepository.findAll(); }
    public List<Brand> getActive() { return brandRepository.findByIsActiveTrue(); }

    public Brand getById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Brand not found: " + id));
    }

    public Brand create(Brand brand) {
        if (brand.getSlug() == null || brand.getSlug().isBlank()) {
            brand.setSlug(slugify(brand.getName()));
        }
        return brandRepository.save(brand);
    }

    public Brand update(Long id, Brand data) {
        Brand brand = getById(id);
        brand.setName(data.getName());
        brand.setDescription(data.getDescription());
        brand.setLogoUrl(data.getLogoUrl());
        brand.setIsActive(data.getIsActive());
        if (data.getSlug() != null) brand.setSlug(data.getSlug());
        return brandRepository.save(brand);
    }

    public void delete(Long id) { brandRepository.deleteById(id); }

    private String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "").replaceAll("[\\s]+", "-").trim();
    }
}
