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
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
    }

    public Category create(Category category) {

        if (category.getIsActive() == null) {
            category.setIsActive(true);
        }

        String slug = category.getSlug();

        if (slug == null || slug.isBlank()) {
            slug = category.getName();
        }

        slug = slug
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");

        category.setSlug(slug);

        return categoryRepository.save(category);
    }

    public Category update(Long id, Category data) {
        Category category = getById(id);
        category.setName(data.getName());
        category.setDescription(data.getDescription());
        category.setImageUrl(data.getImageUrl());
        category.setIsActive(data.getIsActive());
        if (data.getSlug() != null) category.setSlug(data.getSlug());
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    private String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-").trim();
    }
}
