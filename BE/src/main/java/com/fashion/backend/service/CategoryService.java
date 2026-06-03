package com.fashion.backend.service;

import com.fashion.backend.entity.Category;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public List<Category> getActive() {
        return categoryRepository.findByIsActiveTrue();
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category không tồn tại: " + id));
    }

    public Category create(Category category) {
        if (category.getIsActive() == null) {
            category.setIsActive(true);
        }

        // ✅ FIX: slugify đúng tiếng Việt
        String slug = (category.getSlug() != null && !category.getSlug().isBlank())
                ? category.getSlug()
                : category.getName();

        slug = slugify(slug);

        // Đảm bảo slug unique
        slug = ensureUniqueSlug(slug, null);
        category.setSlug(slug);

        return categoryRepository.save(category);
    }

    public Category update(Long id, Category data) {
        Category category = getById(id);
        category.setName(data.getName());
        category.setDescription(data.getDescription());
        category.setImageUrl(data.getImageUrl());
        if (data.getIsActive() != null) category.setIsActive(data.getIsActive());

        // Cập nhật slug nếu có
        if (data.getSlug() != null && !data.getSlug().isBlank()) {
            String slug = ensureUniqueSlug(slugify(data.getSlug()), id);
            category.setSlug(slug);
        }

        return categoryRepository.save(category);
    }

    // ✅ MỚI: toggle active thay vì phải gửi toàn bộ object
    public Category toggleActive(Long id) {
        Category category = getById(id);
        category.setIsActive(!category.getIsActive());
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id))
            throw new NotFoundException("Category không tồn tại: " + id);
        categoryRepository.deleteById(id);
    }

    // ✅ FIX: slugify xử lý đúng tiếng Việt (đ, Đ, dấu thanh)
    private String slugify(String input) {
        if (input == null || input.isBlank()) return "danh-muc-" + System.currentTimeMillis();

        String result = input.toLowerCase();

        // Xử lý đ/Đ trước khi normalize
        result = result.replace("đ", "d").replace("Đ", "d");

        // Normalize NFD rồi bỏ combining marks (dấu thanh)
        String normalized = Normalizer.normalize(result, Normalizer.Form.NFD);
        Pattern diacritics = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        result = diacritics.matcher(normalized).replaceAll("");

        // Chỉ giữ a-z, 0-9, khoảng trắng, gạch ngang
        result = result.replaceAll("[^a-z0-9\\s-]", "");
        result = result.replaceAll("\\s+", "-").trim();
        result = result.replaceAll("-+", "-");

        return result;
    }

    private String ensureUniqueSlug(String slug, Long excludeId) {
        String base = slug;
        int counter = 1;
        while (true) {
            var existing = categoryRepository.findBySlug(slug);
            if (existing.isEmpty() || existing.get().getId().equals(excludeId)) break;
            slug = base + "-" + counter++;
        }
        return slug;
    }
}