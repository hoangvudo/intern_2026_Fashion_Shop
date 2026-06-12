-- 1. Xóa dữ liệu cũ (Tùy chọn, bỏ comment nếu cần reset data nhưng cẩn thận với khóa ngoại)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE product_variants;
-- TRUNCATE TABLE products;
-- TRUNCATE TABLE brands;
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE articles;
-- SET FOREIGN_KEY_CHECKS = 1;

-- 2. Thêm dữ liệu cho bảng users (Password mặc định là 123456 hoặc đã mã hóa bcrypt. Dưới đây là password mẫu chưa mã hóa hoặc mã hóa dummy)
INSERT INTO users (full_name, email, phone, password, role, is_active, is_verified, created_at) VALUES 
('Admin ZYRO', 'admin@zyro.com', '0123456789', '$2a$10$X/r93x.X/oF9.X/oF9.X/oF9.X/oF9.X/oF9.X/oF9.X/oF9.X/o', 'ADMIN', true, true, NOW()),
('Khách hàng 1', 'khach1@gmail.com', '0987654321', '$2a$10$X/r93x.X/oF9.X/oF9.X/oF9.X/oF9.X/oF9.X/oF9.X/oF9.X/o', 'USER', true, true, NOW());

-- 3. Thêm dữ liệu cho bảng categories
INSERT INTO categories (name, slug, description, image_url, is_active) VALUES 
('Áo Sơ Mi', 'ao-so-mi', 'Các mẫu áo sơ mi thanh lịch, hiện đại.', 'https://picsum.photos/400/400?random=1', true),
('Quần Tây', 'quan-tay', 'Quần tây công sở phong cách trẻ trung.', 'https://picsum.photos/400/400?random=2', true),
('Váy Đầm', 'vay-dam', 'Váy đầm dạo phố và dự tiệc sang trọng.', 'https://picsum.photos/400/400?random=3', true),
('Phụ Kiện', 'phu-kien', 'Túi xách, thắt lưng và các phụ kiện khác.', 'https://picsum.photos/400/400?random=4', true);

-- 4. Thêm dữ liệu cho bảng brands
INSERT INTO brands (name, slug, description, logo_url, banner_url, is_active, created_at) VALUES 
('ZYRO', 'zyro', 'Thương hiệu thời trang thiết kế cao cấp.', 'https://picsum.photos/100/100?random=5', 'https://picsum.photos/800/300?random=6', true, NOW()),
('KAMIKI', 'kamiki', 'Thương hiệu thời trang bền vững từ chất liệu tái chế.', 'https://picsum.photos/100/100?random=7', 'https://picsum.photos/800/300?random=8', true, NOW());

-- 5. Thêm dữ liệu cho bảng products
-- Category 1 (Áo sơ mi), Brand 1 (ZYRO)
INSERT INTO products (name, slug, description, price, sale_price, category_id, brand_id, thumbnail_url, image_url_2, total_stock, avg_rating, review_count, sold_count, is_active, is_featured, is_new_arrival, created_at, updated_at) VALUES 
('Áo Sơ Mi Lụa Cổ V ZYRO', 'ao-so-mi-lua-co-v-zyro', 'Áo sơ mi chất liệu lụa tơ tằm mềm mại.', 850000, 750000, 1, 1, 'https://picsum.photos/400/500?random=10', 'https://picsum.photos/400/500?random=11', 100, 4.8, 12, 45, true, true, true, NOW(), NOW()),
('Quần Tây Ống Suông Thanh Lịch', 'quan-tay-ong-suong-thanh-lich', 'Quần tây ống suông tôn dáng.', 950000, null, 2, 1, 'https://picsum.photos/400/500?random=12', 'https://picsum.photos/400/500?random=13', 50, 4.5, 8, 20, true, false, true, NOW(), NOW()),
('Đầm Dạ Hội KAMIKI', 'dam-da-hoi-kamiki', 'Đầm dạ hội từ vải sợi trái cây thiên nhiên.', 2500000, 2200000, 3, 2, 'https://picsum.photos/400/500?random=14', 'https://picsum.photos/400/500?random=15', 30, 5.0, 25, 10, true, true, false, NOW(), NOW());

-- 6. Thêm dữ liệu cho bảng product_variants
-- Variants cho Áo Sơ Mi
INSERT INTO product_variants (product_id, size, color, color_hex, stock, sku) VALUES 
(1, 'S', 'Trắng', '#FFFFFF', 30, 'SM-ZYRO-W-S'),
(1, 'M', 'Trắng', '#FFFFFF', 40, 'SM-ZYRO-W-M'),
(1, 'L', 'Trắng', '#FFFFFF', 30, 'SM-ZYRO-W-L'),
(1, 'M', 'Đen', '#000000', 50, 'SM-ZYRO-B-M');

-- Variants cho Quần Tây
INSERT INTO product_variants (product_id, size, color, color_hex, stock, sku) VALUES 
(2, 'M', 'Beige', '#F5F5DC', 25, 'QT-ZYRO-BG-M'),
(2, 'L', 'Beige', '#F5F5DC', 25, 'QT-ZYRO-BG-L');

-- Variants cho Đầm
INSERT INTO product_variants (product_id, size, color, color_hex, stock, sku) VALUES 
(3, 'Freesize', 'Đỏ Rượu', '#722F37', 30, 'DM-KAMIKI-RED-F');

-- 7. Thêm dữ liệu cho bảng articles (Tạp chí/Blog)
INSERT INTO articles (title, slug, excerpt, content, cover_image, category, author, author_avatar, read_minutes, is_published, is_featured, view_count, published_at, created_at, updated_at) VALUES 
('10 Xu Hướng Thời Trang Bền Vững Sẽ Lên Ngôi Trong Năm 2026', '10-xu-huong-thoi-trang-ben-vung-2026', 'Sự lên ngôi của chất liệu thuần tự nhiên...', '<p>Nội dung bài viết về thời trang bền vững...</p>', 'https://picsum.photos/800/400?random=20', 'Xu hướng', 'Hương Ly', 'https://picsum.photos/100/100?random=21', 5, true, true, 120, NOW(), NOW(), NOW()),
('Bí Quyết Phối Đồ Cho Nữ Giới Tuổi 30: Tinh Tế & Thanh Lịch', 'bi-quyet-phoi-do-nu-tuoi-30', 'Làm sao để luôn giữ được khí chất sang trọng...', '<p>Khám phá 5 cách mix & match không bao giờ lỗi mốt...</p>', 'https://picsum.photos/800/400?random=22', 'Phối đồ', 'Hương Ly', 'https://picsum.photos/100/100?random=21', 4, true, false, 85, NOW(), NOW(), NOW()),
('Sự Kiện Ra Mắt Bộ Sưu Tập Hồi Sinh', 'su-kien-ra-mat-bst-hoi-sinh', 'Sự kiện quy tụ hàng loạt gương mặt đình đám...', '<p>Giao thoa giữa quá khứ và hiện đại...</p>', 'https://picsum.photos/800/400?random=23', 'Sự kiện', 'Admin', 'https://picsum.photos/100/100?random=24', 3, true, true, 200, NOW(), NOW(), NOW());
