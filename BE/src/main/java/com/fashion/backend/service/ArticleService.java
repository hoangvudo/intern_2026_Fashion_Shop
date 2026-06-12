package com.fashion.backend.service;

import com.fashion.backend.dto.ArticleRequest;
import com.fashion.backend.dto.ArticleResponse;
import com.fashion.backend.entity.Article;
import com.fashion.backend.exception.NotFoundException;
import com.fashion.backend.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    // ── PUBLIC ────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Page<ArticleResponse> getPublished(String keyword, String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String kw  = (keyword  != null && !keyword.isBlank())  ? keyword.trim()  : null;
        String cat = (category != null && !category.isBlank()) ? category.trim() : null;
        return articleRepository.findPublished(kw, cat, pageable)
                .map(ArticleResponse::from);
    }

    @Transactional(readOnly = true)
    public ArticleResponse getBySlug(String slug) {
        Article a = articleRepository.findBySlug(slug)
                .filter(Article::getIsPublished)
                .orElseThrow(() -> new NotFoundException("Bài viết không tồn tại"));
        return ArticleResponse.from(a);
    }

    @Transactional(readOnly = true)
    public ArticleResponse getById(Long id) {
        Article a = articleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Bài viết không tồn tại: " + id));
        return ArticleResponse.from(a);
    }

    @Transactional
    public void incrementView(Long id) {
        articleRepository.incrementViewCount(id);
    }

    @Transactional(readOnly = true)
    public List<ArticleResponse> getFeatured() {
        return articleRepository.findTop5ByIsPublishedTrueAndIsFeaturedTrueOrderByPublishedAtDesc()
                .stream().map(ArticleResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ArticleResponse> getRecent() {
        return articleRepository.findTop4ByIsPublishedTrueOrderByPublishedAtDesc()
                .stream().map(ArticleResponse::from).collect(Collectors.toList());
    }

    // ── ADMIN ─────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Page<ArticleResponse> adminSearch(String keyword, String category, Boolean isPublished, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String kw  = (keyword  != null && !keyword.isBlank())  ? keyword.trim()  : null;
        String cat = (category != null && !category.isBlank()) ? category.trim() : null;
        return articleRepository.adminSearch(kw, cat, isPublished, pageable)
                .map(ArticleResponse::from);
    }

    @Transactional
    public ArticleResponse create(ArticleRequest req) {
        Article a = new Article();
        applyRequest(a, req);
        a.setCreatedAt(LocalDateTime.now());
        a.setUpdatedAt(LocalDateTime.now());
        a.setSlug(ensureUniqueSlug(
                req.getSlug() != null && !req.getSlug().isBlank() ? req.getSlug() : slugify(req.getTitle()),
                null
        ));
        if (Boolean.TRUE.equals(req.getIsPublished()) && a.getPublishedAt() == null) {
            a.setPublishedAt(LocalDateTime.now());
        }
        return ArticleResponse.from(articleRepository.save(a));
    }

    @Transactional
    public ArticleResponse update(Long id, ArticleRequest req) {
        Article a = articleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Bài viết không tồn tại: " + id));

        boolean wasUnpublished = !Boolean.TRUE.equals(a.getIsPublished());
        applyRequest(a, req);
        a.setUpdatedAt(LocalDateTime.now());

        if (req.getSlug() != null && !req.getSlug().isBlank()) {
            a.setSlug(ensureUniqueSlug(req.getSlug(), id));
        }
        // Set publishedAt lần đầu khi publish
        if (Boolean.TRUE.equals(req.getIsPublished()) && wasUnpublished && a.getPublishedAt() == null) {
            a.setPublishedAt(LocalDateTime.now());
        }
        return ArticleResponse.from(articleRepository.save(a));
    }

    @Transactional
    public void delete(Long id) {
        if (!articleRepository.existsById(id))
            throw new NotFoundException("Bài viết không tồn tại: " + id);
        articleRepository.deleteById(id);
    }

    @Transactional
    public ArticleResponse togglePublish(Long id) {
        Article a = articleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Bài viết không tồn tại: " + id));
        a.setIsPublished(!a.getIsPublished());
        if (a.getIsPublished() && a.getPublishedAt() == null) {
            a.setPublishedAt(LocalDateTime.now());
        }
        a.setUpdatedAt(LocalDateTime.now());
        return ArticleResponse.from(articleRepository.save(a));
    }

    // ── helpers ───────────────────────────────────────────────────
    private void applyRequest(Article a, ArticleRequest req) {
        if (req.getTitle()       != null) a.setTitle(req.getTitle());
        if (req.getExcerpt()     != null) a.setExcerpt(req.getExcerpt());
        if (req.getContent()     != null) a.setContent(req.getContent());
        if (req.getCoverImage()  != null) a.setCoverImage(req.getCoverImage());
        if (req.getCategory()    != null) a.setCategory(req.getCategory());
        if (req.getAuthor()      != null) a.setAuthor(req.getAuthor());
        if (req.getAuthorAvatar() != null) a.setAuthorAvatar(req.getAuthorAvatar());
        if (req.getReadMinutes() != null) a.setReadMinutes(req.getReadMinutes());
        a.setIsPublished(req.getIsPublished() != null ? req.getIsPublished() : false);
        a.setIsFeatured(req.getIsFeatured()   != null ? req.getIsFeatured()  : false);
    }

    private String slugify(String input) {
        if (input == null || input.isBlank()) return "bai-viet-" + System.currentTimeMillis();
        String n = Normalizer.normalize(input, Normalizer.Form.NFD);
        return Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(n)
                .replaceAll("").toLowerCase()
                .replace("đ", "d")
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-").trim();
    }

    private String ensureUniqueSlug(String slug, Long excludeId) {
        String base = slug; int c = 1;
        while (true) {
            Optional<Article> ex = articleRepository.findBySlug(slug);
            if (ex.isEmpty() || ex.get().getId().equals(excludeId)) break;
            slug = base + "-" + c++;
        }
        return slug;
    }
}