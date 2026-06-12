# Phân Tích Dự Án: ZYRO Fashion Shop

Tài liệu này phân tích chi tiết các yêu cầu kỹ thuật và nghiệp vụ cho dự án ZYRO Fashion Shop, chia theo từng màn hình/chức năng cụ thể cho cả **Frontend (UI/UX & Tương tác)** và **Backend (Logic, DB & Bảo mật)**.

---

## BẢNG TỔNG QUAN CHI TIẾT - PHÂN BỔ TÍNH NĂNG & ƯỚC TÍNH THỜI GIAN

*Bảng dưới đây mô phỏng kế hoạch chi tiết cho phân hệ Authentication (Đăng nhập, Đăng ký, Quên mật khẩu) theo cấu trúc chuẩn.*

| # | Màn hình | Tính năng | Mô tả | Độ ưu tiên | TG Ước tính |
|---|----------|-----------|-------|:---:|:---:|
| **1** | **ĐĂNG NHẬP** | [FE] Form nhập Email & Password | Hiển thị form 2 trường: Email, Password (toggle hiện/ẩn). Nút Đăng nhập, link Quên mật khẩu, link Đăng ký | Cao | 2 ngày |
| | | [FE] Xử lý submit & lưu token | Gọi API login, nhận access_token + refresh_token → lưu vào httpOnly cookie. Redirect về trang trước đó hoặc Home | Cao | 1-2 ngày |
| | | [FE] Đăng nhập mạng xã hội | Nút Google / Facebook OAuth2. Redirect đến OAuth provider, nhận callback code | Trung bình | 2-3 ngày |
| | | [FE] Hiển thị lỗi & loading state | Toast thông báo lỗi (sai mật khẩu, tài khoản bị khóa). Spinner trên nút khi chờ phản hồi | Cao | 1 ngày |
| | | [BE] API xác thực người dùng | Nhận email + password. Tìm user theo email, so sánh bcrypt hash, kiểm tra is_active & is_verified | Cao | 2 ngày |
| | | [BE] Phát hành JWT Token | Tạo access_token (15 phút) + refresh_token (7 ngày). Lưu refresh_token hash vào DB hoặc Redis | Cao | 1-2 ngày |
| | | [BE] OAuth2 callback handler | Nhận code từ Google/Facebook, đổi lấy profile. Tìm hoặc tạo user, phát JWT | Trung bình | 2-3 ngày |
| | | [BE] Rate limiting & bảo mật | Giới hạn 5 lần thử sai/IP/phút → trả 429. Log IP đáng ngờ. Thêm CAPTCHA sau 3 lần sai | Cao | 2 ngày |
| **2** | **ĐĂNG KÝ** | [FE] Form đăng ký | Các trường: Họ tên, Email, Số điện thoại, Mật khẩu, Xác nhận mật khẩu. Nút Đăng ký | Cao | 2-3 ngày |
| | | [FE] Kiểm tra email tồn tại realtime | onBlur email field → gọi API check email. Hiện icon tick/x ngay trên field | Trung bình | 1 ngày |
| | | [FE] Trang xác nhận email | Sau đăng ký → hiện trang Kiểm tra hộp thư. Nút Gửi lại email. Countdown 60s | Trung bình | 1 ngày |
| | | [BE] API tạo tài khoản | Validate dữ liệu đầu vào. Kiểm tra email/phone chưa tồn tại. Hash password bcrypt rounds=12 | Cao | 2-3 ngày |
| | | [BE] Gửi email xác nhận | Gửi email HTML có link verify chứa token. Token hết hạn sau 24h | Cao | 2 ngày |
| | | [BE] Verify email | Nhận token từ URL. Tìm user có email_token khớp và chưa hết hạn. UPDATE is_verified=1 | Cao | 1 ngày |
| **3** | **QUÊN MK** | [FE] Form nhập email quên mật khẩu| Nhập địa chỉ email. Nút Gửi link đặt lại. Hiện thông báo Kiểm tra hộp thư sau khi gửi thành công | Cao | 1-2 ngày |
| | | [FE] Trang đặt lại mật khẩu | Nhận token từ URL. Form: Mật khẩu mới + Xác nhận. Validate token còn hiệu lực trước khi hiện form | Cao | 2 ngày |
| | | [FE] Trạng thái token hết hạn | Nếu token hết hạn (>1h) → hiện trang lỗi với nút Yêu cầu link mới | Trung bình | 1 ngày |
| **4** | **TRANG CHỦ** | [FE] Slider / Banner | Hiển thị Carousel Banner ưu đãi, BST mới. Hỗ trợ swipe trên Mobile | Trung bình | 1 ngày |
| | | [FE] Component SP nổi bật | Layout Grid sản phẩm, có Badge (Mới/Hot), nút Thêm vào giỏ nhanh | Cao | 2 ngày |
| | | [BE] API Lấy SP nổi bật | Trả về danh sách sản phẩm is_featured/is_new_arrival, giới hạn số lượng | Cao | 1 ngày |
| **5** | **TÌM KIẾM** | [FE] Thanh tìm kiếm & Gợi ý | Ô search trên header. Có debounce. Hiển thị dropdown gợi ý khi gõ. Lưu lịch sử tìm kiếm | Cao | 2 ngày |
| | | [BE] API Tìm kiếm Full-text | Tìm theo Tên, Thương hiệu. Tối ưu index tìm kiếm, phân trang kết quả | Cao | 1-2 ngày |
| **6** | **DANH MỤC** | [FE] Breadcrumb & Header | Đường dẫn phân cấp (Trang chủ > Áo > Áo thun). Tiêu đề H1 chuẩn SEO | Cao | 1 ngày |
| | | [FE] Sidebar Bộ Lọc | Lọc theo Thương hiệu, Giá, Màu sắc, Size. Sync với URL Params. Responsive Drawer trên mobile | Cao | 3 ngày |
| | | [FE] Phân trang & Hiển thị | Toggle Grid/List view. Sort theo Mới nhất/Giá/Bán chạy. Cấu hình Infinite scroll hoặc Pagination | Cao | 2 ngày |
| | | [BE] API Get Filter Options | Trả về các options filter (size, color, brand) khả dụng trong danh mục kèm count | Cao | 2 ngày |
| | | [BE] API Lọc Sản phẩm | Query động theo nhiều filter cùng lúc. Phân trang và Sort | Cao | 2-3 ngày |
| **7** | **CT SẢN PHẨM**| [FE] Image Gallery | Ảnh chính to, hỗ trợ Zoom (Kính lúp). Thumbnail slider nhỏ bên dưới | Cao | 1-2 ngày |
| | | [FE] Chọn Biến thể (Variants) | Chọn Màu (swatch), Chọn Size. Hiển thị tồn kho. Disable "Hết hàng" | Cao | 2 ngày |
| | | [FE] Nút Thao tác & Mô tả | Thêm vào giỏ hàng, Mua ngay. Nội dung chi tiết SP (Rich text) | Cao | 1 ngày |
| | | [FE] Đánh giá & Bình luận | Hiển thị số sao trung bình. Danh sách comment có phân trang. Form gửi review | Trung bình | 2 ngày |
| | | [BE] API Get Product Detail | Trả thông tin chi tiết kèm các variants (color, size, stock) | Cao | 1 ngày |
| | | [BE] API Submit Review | Lưu rating & comment. Kiểm tra user đã mua SP chưa | Trung bình | 1 ngày |
| **8** | **GIỎ HÀNG** | [FE] Mini Cart Drawer | Drawer trượt từ phải. Danh sách SP, thay đổi số lượng, Xóa SP, Tạm tính giá | Cao | 2-3 ngày |
| | | [FE] Trang Giỏ Hàng chi tiết | Danh sách SP rộng hơn, tổng tiền, check out button | Cao | 1 ngày |
| | | [BE] API Quản lý Giỏ hàng | CRUD giỏ hàng theo User_id. Validate lại giá và tồn kho thực tế | Cao | 2 ngày |
| **9** | **ĐẶT HÀNG** | [FE] Form Thông tin nhận hàng | Nhập Địa chỉ (Tỉnh/Thành, Quận/Huyện, Phường/Xã). API địa chỉ local | Cao | 2-3 ngày |
| | | [FE] Áp dụng Mã giảm giá | Ô nhập mã, Validate realtime. Trừ tiền nếu hợp lệ | Cao | 1-2 ngày |
| | | [FE] Chọn Thanh toán | COD hoặc Cổng TT Online (VNPAY/MOMO) | Cao | 2 ngày |
| | | [BE] API Đặt hàng (Checkout) | Transaction xử lý: Trừ tồn kho -> Tạo Order -> Update Coupon. Tránh concurrency (Locking) | Cao | 3-4 ngày |
| **10**| **ĐƠN HÀNG** | [FE] Lịch sử mua hàng | Tab Lịch sử: Chờ duyệt, Đang giao, Hoàn thành, Đã hủy | Cao | 2 ngày |
| | | [FE] Yêu cầu Đổi/Trả | Nút yêu cầu đổi trả (trong 7 ngày). Form chọn lý do, upload ảnh lỗi | Trung bình | 2-3 ngày |
| | | [BE] API Quản lý Đơn (User) | Lấy danh sách đơn hàng. Logic cho phép hủy đơn (khi Pending) | Cao | 1-2 ngày |
| **11**| **ADMIN PANEL**| [FE] Dashboard Thống kê | Biểu đồ doanh thu (Line/Pie chart). Tổng quan Đơn/Sản phẩm/Khách hàng | Cao | 3 ngày |
| | | [FE] Quản lý Sản phẩm | Bảng danh sách, form Thêm/Sửa (Drawer). Quản lý Variants. | Cao | 3-4 ngày |
| | | [FE] Quản lý Đơn hàng | Xem chi tiết, duyệt đơn, thay đổi trạng thái giao hàng | Cao | 2 ngày |
| | | [FE] Quản lý Đổi/Trả | Modal duyệt trả hàng/hoàn tiền. Ghi chú admin | Trung bình | 2 ngày |
| | | [BE] APIs Admin | Các CRUD APIs cho Product, Brand, Category, Order, User, Thống kê | Cao | 5-7 ngày |

---

## 1. MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ / QUÊN MẬT KHẨU (Auth)
### 1.1 Đăng ký & Xác thực Email
- **FRONTEND**: Form đăng ký (Tên, Email, Mật khẩu, Nhập lại mật khẩu). Validate Real-time (Email đúng định dạng, mật khẩu đủ mạnh). Hiển thị UI gửi mail thành công.
  - *Tech*: React Hook Form, Yup/Zod Validation.
- **BACKEND**: Mã hóa mật khẩu (BCrypt). Lưu User với trạng thái `is_verified = false`. Tạo token xác thực (UUID) và gửi qua EmailService.
  - *Tech*: Spring Security, JavaMailSender, BCryptPasswordEncoder.

### 1.2 Đăng nhập & Quản lý Phiên (Session)
- **FRONTEND**: Form đăng nhập. Nút "Ghi nhớ đăng nhập". Xử lý lưu Token. Chuyển hướng theo Role (Admin sang Dashboard, User về Trang chủ).
  - *Tech*: JWT lưu ở `localStorage` hoặc `httpOnly cookies`, Context API/Zustand quản lý Auth state.
- **BACKEND**: Kiểm tra `is_verified`. Xác thực mật khẩu. Trả về Access Token & Refresh Token. Phân quyền Role (USER/ADMIN).
  - *Tech*: Spring Security, JWT Filter, Redis (lưu blacklist token nếu có).

---

## 2. TRANG CHỦ (Home)
### 2.1 Banner & Slider Mở Đầu
- **FRONTEND**: Hiển thị Carousel Banner ưu đãi, BST mới. Hỗ trợ vuốt trên Mobile (Swipe). Nút Call-to-Action (Mua ngay).
  - *Tech*: SwiperJS / Framer Motion. Tối ưu ảnh WebP, Lazy loading.
- **BACKEND**: Cung cấp API Lấy danh sách Banner đang `is_active = true`.

### 2.2 Section: Sản phẩm Nổi bật / Mới nhất
- **FRONTEND**: Giao diện Grid sản phẩm. Hiển thị Badge (New, Hot). Nút "Thêm vào giỏ" nhanh. Skeleton loading.
- **BACKEND**: Query các sản phẩm `is_featured = true` hoặc `is_new_arrival = true`. Giới hạn `LIMIT 8`.
  - *Tech*: Cache Redis trang chủ để giảm tải DB.

---

## 3. TÌM KIẾM (Search)
### 3.1 Thanh tìm kiếm & Gợi ý (Autocomplete)
- **FRONTEND**: Ô tìm kiếm trên Header. Debounce input (tránh gọi API liên tục). Hiển thị dropdown gợi ý kết quả khi gõ. Lịch sử tìm kiếm (lưu LocalStorage).
  - *Tech*: Lodash debounce, Click-outside listener.
- **BACKEND**: API tìm kiếm full-text theo Tên sản phẩm, Thương hiệu. Trả về top 5 kết quả nhanh.
  - *Tech*: SQL `LIKE` tối ưu hoặc Elasticsearch (nếu mở rộng). Tối ưu Index trường `name`.

---

## 4. TRANG DANH MỤC (Category)
### 4.1 Breadcrumb & Tiêu đề
- **FRONTEND**: Đường dẫn `Trang chủ > Áo > Áo thun`. 
  - *Tech*: Recursive breadcrumb, JSON-LD structured data cho SEO, H1 tag.
- **BACKEND**: Trả về Cây danh mục (Category Tree).

### 4.2 Bộ lọc (Filter) & Sắp xếp (Sort)
- **FRONTEND**: Sidebar lọc: Thương hiệu, Giá (range slider), Màu sắc (swatch), Size. Đồng bộ URL params (`?brand=zara&price=0-500000`).
  - *Tech*: `useSearchParams`, noUiSlider.
- **BACKEND**: Dynamic Query builder (JPA Specification/QueryDSL). Query danh sách kèm phân trang. Lấy list options có sẵn theo Category.

---

## 5. CHI TIẾT SẢN PHẨM (Product Detail)
### 5.1 Hình ảnh & Gallery
- **FRONTEND**: Ảnh chính to, có tính năng Zoom (Kính lúp). Thumbnail slider nhỏ bên dưới. Khi đổi màu, ảnh chính thay đổi tương ứng.
  - *Tech*: React Image Magnify.
- **BACKEND**: Trả về mảng URLs hình ảnh theo `product_id`.

### 5.2 Chọn Biến thể (Variants - Size/Color)
- **FRONTEND**: Chọn Màu sắc (ô vuông màu), Chọn Size. Hiển thị trạng thái "Hết hàng" (disable nút). Hiển thị số lượng tồn kho (Stock). Cảnh báo nếu mua lố tồn kho.
- **BACKEND**: API lấy chi tiết sản phẩm kèm `variants`. Trả về `stock` theo `(product_id, color, size)`.

### 5.3 Đánh giá & Bình luận (Reviews)
- **FRONTEND**: Hiển thị điểm trung bình (Sao). Danh sách comment, kèm ảnh feedback. Nút viết đánh giá (chỉ cho người đã mua hàng).
- **BACKEND**: Lưu Review. Tính toán lại Rating trung bình lưu vào Product. Kiểm tra quyền đánh giá (Order status = COMPLETED).

---

## 6. GIỎ HÀNG (Cart)
### 6.1 Quản lý Giỏ hàng (Mini Cart & Cart Page)
- **FRONTEND**: Mini cart dạng Drawer kéo từ phải sang. Cập nhật số lượng (+ / -). Xóa sản phẩm. Tính tạm tính (Subtotal).
  - *Tech*: Lưu Cart tạm dưới LocalStorage (Guest) hoặc đồng bộ Database (Logged-in user).
- **BACKEND**: API CRUD Giỏ hàng (Lưu theo `user_id`). Tự động validate lại giá hiện tại và tồn kho khi load giỏ hàng (vì giá/kho có thể đổi).

---

## 7. ĐẶT HÀNG (Checkout)
### 7.1 Thông tin Giao hàng & Áp mã giảm giá
- **FRONTEND**: Form nhập Địa chỉ (Tỉnh/Thành, Quận/Huyện, Phường/Xã). Ô nhập Mã giảm giá (Apply -> trừ tiền). Chọn phương thức thanh toán (COD, VNPAY).
  - *Tech*: Gọi API Tỉnh/Thành VN (như GHN API/Local DB).
- **BACKEND**: API Validate mã giảm giá (Thời hạn, Lượt dùng, Điều kiện đơn tối thiểu). API Tính phí Ship.

### 7.2 Xử lý Đặt hàng (Place Order)
- **FRONTEND**: Block nút "Đặt hàng" để tránh click đúp (Double submit). Hiện trang Success kèm Mã đơn hàng.
- **BACKEND**: 
  - *Transaction Database*: Trừ tồn kho (`ProductVariant`) -> Tạo Đơn hàng (`Order`) -> Lưu Chi tiết Đơn (`OrderItem`) -> Cập nhật Lượt dùng Coupon.
  - *Lỗi N+1*: Tối ưu query trừ kho bằng batch update.
  - Xử lý đồng thời (Concurrency/Pessimistic Locking) để tránh bán âm kho.
  - Gửi Email xác nhận đơn hàng chứa Hóa đơn HTML (EmailService).

---

## 8. QUẢN LÝ TÀI KHOẢN (User Profile)
### 8.1 Thông tin & Lịch sử đơn hàng
- **FRONTEND**: Tab Lịch sử đơn (Chờ duyệt, Đang giao, Đã giao, Đã hủy). Nút "Hủy đơn" (nếu đang chờ xử lý). Nút "Yêu cầu Đổi/Trả" (nếu đã nhận hàng trong 7 ngày).
- **BACKEND**: API Lấy danh sách đơn theo `user_id`. Logic chuyển đổi Status. Tính toán hạng VIP dựa trên `total_spent` (`AuthService`).

---

## 9. QUẢN TRỊ VIÊN (Admin Panel)
### 9.1 Dashboard (Tổng quan)
- **FRONTEND**: Biểu đồ doanh thu (Line chart), Tỷ lệ đơn (Pie chart). Thống kê: Tổng Doanh thu, Số Khách hàng, Đơn chờ duyệt.
  - *Tech*: Chart.js / Recharts.
- **BACKEND**: API Thống kê. Query SUM(total_amount), COUNT(orders) theo khoảng thời gian (Ngày/Tháng/Năm). Cần đánh Index trường `created_at` để query nhanh.

### 9.2 Quản lý Đơn hàng (Orders)
- **FRONTEND**: Table danh sách đơn. Modal xem chi tiết. Select đổi trạng thái (Pending -> Processing -> Shipping -> Completed).
- **BACKEND**: Update status. Gửi email thông báo trạng thái đơn cho khách (tùy chọn).

### 9.3 Quản lý Sản phẩm & Biến thể (Products & Variants)
- **FRONTEND**: Form "Thêm Sản Phẩm" dạng Drawer. Tạo danh sách Variant (Size, Màu, SKU, Số lượng). Upload nhiều ảnh cùng lúc.
- **BACKEND**: Lưu Product, Bulk Insert Product Variants. Lưu Image URLs vào DB hoặc Cloudinary/AWS S3. Xử lý xóa (Hard delete/Soft delete).

### 9.4 Quản lý Đổi/Trả (Returns)
- **FRONTEND**: Danh sách yêu cầu (Kèm hình ảnh minh chứng). Nút Phê duyệt / Từ chối (nhập lý do từ chối). Modal duyệt dạng Side-drawer.
- **BACKEND**: Chuyển trạng thái Order sang RETURNED. Cộng lại tồn kho (Restore stock) nếu cần. Tạo giao dịch hoàn tiền (Refund logic).

---
*Tài liệu được xây dựng để làm kim chỉ nam xuyên suốt trong quá trình Code, Refactor và Tối ưu hóa dự án ZYRO Fashion.*
