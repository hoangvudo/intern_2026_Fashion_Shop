import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import {
  FiShoppingCart,
  FiArrowLeft,
  FiPackage,
  FiChevronRight,
  FiTrash2,
} from "react-icons/fi";
import { MdShoppingBag } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import productService from "../services/productService";
import reviewService from "../services/reviewService";
import uploadService from "../services/uploadService";
import axiosInstance from "../utils/axios";
// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function fmt(n) {
  if (!n) return "—";
  return Number(n).toLocaleString("vi-VN") + "₫";
}

// ─────────────────────────────────────────────────────────────
// StarRating (interactive)
// ─────────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
  hover,
  onHover,
  onLeave,
  readonly = false,
  size = 18,
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && onHover?.(star)}
          onMouseLeave={() => !readonly && onLeave?.()}
          className={`text-amber-400 transition ${readonly ? "cursor-default" : "cursor-pointer"}`}
          disabled={readonly}
        >
          {star <= (hover || value) ? (
            <FaStar size={size} />
          ) : (
            <FaRegStar size={size} />
          )}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RatingSummary bar
// ─────────────────────────────────────────────────────────────
function RatingSummary({ avgRating, reviewTotal, reviews }) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="flex flex-wrap gap-6 rounded-2xl border border-[#DDC0B8] bg-[#FFF8F6] p-5 mb-6">
      {/* Average */}
      <div className="flex flex-col items-center justify-center min-w-[72px]">
        <span className="text-4xl font-bold text-[#231916]">
          {avgRating.toFixed(1)}
        </span>
        <StarRating value={Math.round(avgRating)} readonly size={14} />
        <span className="mt-1 text-xs text-gray-400">
          {reviewTotal} đánh giá
        </span>
      </div>

      {/* Bars */}
      <div className="flex flex-1 flex-col justify-center gap-1.5 min-w-[160px]">
        {counts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-6 text-right text-gray-500">{star}★</span>
            <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{
                  width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="w-4 text-gray-400">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ReviewItem
// ─────────────────────────────────────────────────────────────
function ReviewItem({ review, currentUserId, onDelete }) {
  const isOwner = currentUserId && review.userId === currentUserId;

  return (
    <div className="border-b border-gray-100 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAE1DB] text-sm font-bold text-[#231916]">
            {(review.userFullName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#231916]">
              {review.userFullName || "Người dùng"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StarRating value={review.rating} readonly size={13} />
          {isOwner && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-red-400 hover:text-red-600 transition"
              title="Xoá đánh giá"
            >
              <FiTrash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {review.comment && (
        <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">
          {review.comment}
        </p>
      )}

      {review.imageUrls?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.imageUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`review-img-${idx}`}
              className="h-16 w-16 rounded-lg object-cover border border-gray-100"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { user, isAuthenticated } = useAuthStore();

  // ── Product state ─────────────────────────────────────────
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [liveStock, setLiveStock] = useState(null);

  // ── Review state ──────────────────────────────────────────
  const [reviews, setReviews] = useState([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewTotalPages, setReviewTotalPages] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewSortBy, setReviewSortBy] = useState("newest");
  const [reviewRatingFilter, setReviewRatingFilter] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]); // [{ url, fileName, preview }]
  const [imgUploading, setImgUploading] = useState(false);

  // ── Fetch product ─────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getById(id);
        setProduct(data);
        const firstImage = data.images?.[0]?.url ?? data.thumbnailUrl ?? null;
        setSelectedImage(firstImage);
        if (data.categoryId) {
          const relRes = await productService.getByCategory(data.categoryId, 4);
          const related = (relRes?.content ?? relRes ?? [])
            .filter((p) => p.id !== data.id)
            .slice(0, 3);
          setRelated(related);
        }
      } catch (err) {
        console.error("ProductDetail fetch error:", err);
        setError("Không tìm thấy sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  // ── Fetch reviews ─────────────────────────────────────────
  const fetchReviews = useCallback(async (productId, page, sortBy, rating) => {
    setReviewLoading(true);
    try {
      const data = await reviewService.getByProduct(productId, {
        page,
        size: 5,
        sortBy,
        rating: rating || undefined,
      });
      setReviews(data.content ?? []);
      setReviewTotal(data.totalElements ?? 0);
      setReviewTotalPages(data.totalPages ?? 0);
    } catch (err) {
      console.error("fetch reviews error:", err);
    } finally {
      setReviewLoading(false);
    }
  }, []);

  useEffect(() => {
    if (product?.id) {
      fetchReviews(product.id, reviewPage, reviewSortBy, reviewRatingFilter);
    }
  }, [product?.id, reviewPage, reviewSortBy, reviewRatingFilter, fetchReviews]);

  useEffect(() => {
    if (!product?.id) return;
    const fetchStock = async () => {
      try {
        const res = await axiosInstance.get(`/products/${product.id}/stock`, {
          params: {
            ...(selectedSize && { size: selectedSize }),
            ...(selectedColor && { color: selectedColor }),
          },
        });
        setLiveStock(res.data.stock ?? 0);
      } catch {
        /* keep previous */
      }
    };
    fetchStock();
    const timer = setInterval(fetchStock, 15_000);
    return () => clearInterval(timer);
  }, [product?.id, selectedSize, selectedColor]);
  // ── Computed ──────────────────────────────────────────────
  const sizes = product
    ? [...new Set((product.variants ?? []).map((v) => v.size).filter(Boolean))]
    : [];
  const colors = product
    ? [...new Set((product.variants ?? []).map((v) => v.color).filter(Boolean))]
    : [];

  const selectedVariant = product?.variants?.find(
    (v) =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor),
  );
  const currentStock =
    liveStock !== null
      ? liveStock
      : (selectedVariant?.stock ?? product?.totalStock ?? 0);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : (product?.avgRating ?? 0);

  const allImages = product
    ? [
        ...(product.thumbnailUrl ? [{ url: product.thumbnailUrl }] : []),
        ...(product.images ?? []).filter(
          (img) => img.url !== product.thumbnailUrl,
        ),
      ]
    : [];

  // ── Cart actions ──────────────────────────────────────────
  function handleAdd() {
    if (!product) return;
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Vui lòng chọn size");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: selectedImage ?? product.thumbnailUrl,
      size: selectedSize,
      color: selectedColor,
      qty,
    });
    toast.success("Đã thêm vào giỏ hàng!");
  }

  function handleBuyNow() {
    handleAdd();
    navigate("/cart");
  }

  // ── Review actions ────────────────────────────────────────
  async function submitReview(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Vui lòng nhập nhận xét");
      return;
    }

    setReviewSubmitting(true);
    try {
      await reviewService.create(product.id, {
        rating: reviewRating,
        comment: reviewComment,
        imageUrls: reviewImages.map((img) => img.url),
      });
      toast.success("Cảm ơn bạn đã đánh giá!");
      setReviewRating(5);
      setReviewComment("");
      setReviewImages([]);
      setReviewPage(0);
      fetchReviews(product.id, 0, reviewSortBy, reviewRatingFilter);
    } catch (err) {
      const msg = err.response?.data?.message || "Gửi đánh giá thất bại";
      toast.error(msg);
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Xoá đánh giá này?")) return;
    try {
      await reviewService.delete(reviewId);
      toast.success("Đã xoá đánh giá");
      fetchReviews(product.id, reviewPage, reviewSortBy, reviewRatingFilter);
    } catch {
      toast.error("Xoá thất bại");
    }
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (reviewImages.length + files.length > 5) {
      toast.error("Tối đa 5 ảnh");
      return;
    }
    setImgUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const preview = URL.createObjectURL(file);
          const res = await uploadService.uploadImage(file);
          return { url: res.url, fileName: res.fileName, preview };
        }),
      );
      setReviewImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.log("Upload error response:", err.response?.data);
      console.log("Upload error status:", err.response?.status);
      toast.error("Upload ảnh thất bại");
    } finally {
      setImgUploading(false);
      e.target.value = "";
    }
  }

  // ── LOADING ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <TopNav />
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-gray-100" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-6 w-1/3 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
              <div className="h-12 w-full animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <TopNav />
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
          <FiPackage className="h-16 w-16 text-gray-200" />
          <h2 className="font-serif text-2xl text-gray-700">
            {error ?? "Sản phẩm không tồn tại"}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-[#231916] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#9B3F1E]"
          >
            <FiArrowLeft /> Quay lại
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopNav />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#9B3F1E]">
            Trang chủ
          </Link>
          <FiChevronRight className="h-4 w-4" />
          {product.categoryName && (
            <>
              <span className="cursor-pointer hover:text-[#9B3F1E]">
                {product.categoryName}
              </span>
              <FiChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="line-clamp-1 font-medium text-[#231916]">
            {product.name}
          </span>
        </nav>

        {/* ── MAIN PRODUCT ── */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              {selectedImage ? (
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-200">
                  <MdShoppingBag size={80} />
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img.url)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === img.url
                        ? "border-[#9B3F1E]"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#695D4B]">
              {product.brandName && <span>{product.brandName}</span>}
              {product.brandName && product.categoryName && <span>·</span>}
              {product.categoryName && <span>{product.categoryName}</span>}
            </div>

            <h1 className="font-serif text-3xl font-semibold leading-tight text-[#231916] dark:text-white">
              {product.name}
            </h1>

            {/* Rating summary (từ API) */}
            {(product.reviewCount > 0 || reviewTotal > 0) && (
              <div className="flex items-center gap-2">
                <StarRating value={Math.round(avgRating)} readonly size={14} />
                <span className="text-sm text-gray-500">
                  ({reviewTotal || product.reviewCount} đánh giá)
                </span>
              </div>
            )}

            {/* Price */}
            <div>
              {product.salePrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#9B3F1E]">
                    {fmt(product.salePrice)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {fmt(product.price)}
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    -{Math.round((1 - product.salePrice / product.price) * 100)}
                    %
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-[#231916] dark:text-white">
                  {fmt(product.price)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-sm">
              {currentStock === 0 ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="font-medium text-red-500">Hết hàng</span>
                </>
              ) : currentStock < 10 ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-amber-600">
                    Sắp hết — còn {currentStock} sản phẩm
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium text-green-700">Còn hàng</span>
                </>
              )}
            </div>

            {/* Size */}
            {sizes.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Kích thước:{" "}
                  <span className="font-semibold text-[#231916]">
                    {selectedSize || "Chưa chọn"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        selectedSize === s
                          ? "border-[#231916] bg-[#231916] text-white"
                          : "border-gray-200 hover:border-[#231916]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {colors.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Màu sắc:{" "}
                  <span className="font-semibold text-[#231916]">
                    {selectedColor || "Chưa chọn"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const variant = product.variants?.find(
                      (v) => v.color === c,
                    );
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          selectedColor === c
                            ? "border-[#231916] bg-[#231916] text-white"
                            : "border-gray-200 hover:border-[#231916]"
                        }`}
                      >
                        {variant?.colorHex && (
                          <span
                            className="inline-block h-4 w-4 rounded-full border border-white/30"
                            style={{ background: variant.colorHex }}
                          />
                        )}
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Số lượng
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty((q) => Math.min(currentStock || 99, q + 1))
                    }
                    className="flex h-10 w-10 items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    disabled={qty >= (currentStock || 99)}
                  >
                    +
                  </button>
                </div>
                {currentStock > 0 && (
                  <span className="text-xs text-gray-400">
                    Tối đa {currentStock}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleBuyNow}
                disabled={currentStock === 0}
                className="flex-1 rounded-full bg-[#231916] py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#9B3F1E] disabled:opacity-40"
              >
                Mua ngay
              </button>
              <button
                onClick={handleAdd}
                disabled={currentStock === 0}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#231916] py-3 text-sm font-semibold uppercase tracking-wide text-[#231916] transition hover:bg-[#231916] hover:text-white disabled:opacity-40"
              >
                <FiShoppingCart /> Thêm vào giỏ
              </button>
            </div>

            {/* Quick info */}
            <div className="rounded-xl border border-[#DDC0B8] bg-[#FFF8F6] p-4">
              <div className="grid grid-cols-1 gap-2 text-sm text-[#695D4B] sm:grid-cols-3">
                {[
                  "🚚 Miễn phí vận chuyển đơn từ 500k",
                  "🔄 Đổi trả trong 7 ngày",
                  "✅ Bảo hành chính hãng",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {product.id && (
              <p className="text-xs text-gray-400">
                Mã sản phẩm: <span className="font-medium">#{product.id}</span>
                {product.slug && <> · {product.slug}</>}
              </p>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-gray-200">
            {[
              { id: "desc", label: "Mô tả" },
              {
                id: "reviews",
                label: `Đánh giá (${reviewTotal || product.reviewCount || 0})`,
              },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`border-b-2 px-6 py-3 text-sm font-medium transition ${
                  tab === t.id
                    ? "border-[#9B3F1E] text-[#9B3F1E]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── Tab: Mô tả ── */}
            {tab === "desc" && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-8"
              >
                {product.description ? (
                  <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-[#4A4A4A] dark:text-gray-300">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-sm italic text-gray-400">
                    Chưa có mô tả cho sản phẩm này.
                  </p>
                )}
              </motion.div>
            )}
            {/* ── Tab: Đánh giá ── */}
            {tab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-8 space-y-8"
              >
                {/* Rating summary */}
                {reviews.length > 0 && (
                  <RatingSummary
                    avgRating={avgRating}
                    reviewTotal={reviewTotal}
                    reviews={reviews}
                  />
                )}

                {/* Filter & Sort */}
                {reviewTotal > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        Lọc theo:
                      </span>
                      <button
                        onClick={() => {
                          setReviewRatingFilter(null);
                          setReviewPage(0);
                        }}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                          !reviewRatingFilter
                            ? "bg-[#1B1C19] text-white"
                            : "bg-white text-[#4E453D] border border-[#D1C4B9] hover:bg-[#F0EEE9]"
                        }`}
                      >
                        Tất cả
                      </button>
                      {[5, 4, 3, 2, 1].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setReviewRatingFilter(s);
                            setReviewPage(0);
                          }}
                          className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                            reviewRatingFilter === s
                              ? "bg-[#1B1C19] text-white"
                              : "bg-white text-[#4E453D] border border-[#D1C4B9] hover:bg-[#F0EEE9]"
                          }`}
                        >
                          {s}{" "}
                          <FaStar
                            className={
                              reviewRatingFilter === s
                                ? "text-amber-300"
                                : "text-amber-400"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">Sắp xếp:</span>
                      <select
                        value={reviewSortBy}
                        onChange={(e) => {
                          setReviewSortBy(e.target.value);
                          setReviewPage(0);
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#9B3F1E]"
                      >
                        <option value="newest">Mới nhất</option>
                        <option value="rating_desc">Sao cao nhất</option>
                        <option value="rating_asc">Sao thấp nhất</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Review list */}
                {reviewLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="space-y-2 border-b border-gray-100 pb-6"
                      >
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-400 italic">
                    Chưa có đánh giá nào. Hãy là người đầu tiên!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((r) => (
                      <ReviewItem
                        key={r.id}
                        review={r}
                        currentUserId={user?.id}
                        onDelete={handleDeleteReview}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {reviewTotalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: reviewTotalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewPage(i)}
                        className={`h-9 w-9 rounded-lg border text-sm font-medium transition ${
                          reviewPage === i
                            ? "border-[#231916] bg-[#231916] text-white"
                            : "border-gray-200 hover:border-[#231916] text-gray-600"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Form đánh giá ── */}
                {isAuthenticated ? (
                  <div className="rounded-2xl border border-[#DDC0B8] bg-[#FFF8F6] p-6">
                    <h4 className="mb-4 font-semibold text-[#231916]">
                      Viết đánh giá của bạn
                    </h4>
                    <form onSubmit={submitReview} className="space-y-4">
                      {/* Rating */}
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Đánh giá sao <span className="text-red-500">*</span>
                        </label>
                        <StarRating
                          value={reviewRating}
                          onChange={setReviewRating}
                          hover={reviewHover}
                          onHover={setReviewHover}
                          onLeave={() => setReviewHover(0)}
                        />
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Nhận xét <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          maxLength={2000}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                          className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#9B3F1E]"
                        />
                        <p className="mt-1 text-right text-xs text-gray-400">
                          {reviewComment.length}/2000
                        </p>
                      </div>

                      {/* Images upload */}
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Ảnh đính kèm (tối đa 5)
                        </label>

                        {/* Upload button */}
                        <label
                          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-500 transition hover:border-[#9B3F1E] hover:text-[#9B3F1E] ${imgUploading ? "opacity-50 pointer-events-none" : ""}`}
                        >
                          {imgUploading ? (
                            <>
                              <svg
                                className="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"
                                />
                              </svg>
                              Đang tải lên...
                            </>
                          ) : (
                            <>
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4"
                                />
                              </svg>
                              Chọn ảnh
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={imgUploading || reviewImages.length >= 5}
                          />
                        </label>
                        <span className="ml-3 text-xs text-gray-400">
                          {reviewImages.length}/5 ảnh
                        </span>

                        {/* Preview */}
                        {reviewImages.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {reviewImages.map((img, idx) => (
                              <div key={idx} className="relative">
                                <img
                                  src={img.preview || img.url}
                                  alt={`preview-${idx}`}
                                  className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setReviewImages((prev) =>
                                      prev.filter((_, i) => i !== idx),
                                    )
                                  }
                                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs leading-none"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="rounded-full bg-[#231916] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#9B3F1E] transition disabled:opacity-50"
                      >
                        {reviewSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#DDC0B8] bg-[#FFF8F6] p-6 text-center">
                    <p className="text-sm text-gray-500">
                      <Link
                        to="/login"
                        className="font-semibold text-[#231916] underline hover:text-[#9B3F1E]"
                      >
                        Đăng nhập
                      </Link>{" "}
                      để viết đánh giá sản phẩm
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SẢN PHẨM LIÊN QUAN ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 font-serif text-2xl text-[#231916]">
              Sản phẩm liên quan
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                    {p.thumbnailUrl ? (
                      <img
                        src={p.thumbnailUrl}
                        alt={p.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-200">
                        <MdShoppingBag size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="line-clamp-1 font-semibold text-[#231916]">
                      {p.name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#9B3F1E]">
                      {fmt(p.salePrice ?? p.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
