import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { FiShoppingCart, FiArrowLeft, FiPackage, FiChevronRight } from 'react-icons/fi'
import { MdShoppingBag } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import useCartStore from '../store/cartStore'
import productService from '../services/productService'

function fmt(n) {
  if (!n) return '—'
  return Number(n).toLocaleString('vi-VN') + '₫'
}

function getProductImages(product) {
  const urls = [
    ...(product?.thumbnailUrl ? [product.thumbnailUrl] : []),
    ...(product?.imageUrls || []),
    ...(product?.images || []).map((img) => (
      typeof img === 'string' ? img : img?.url || img?.imageUrl
    )),
  ]

  return [...new Set(urls.filter(Boolean))].map((url) => ({ url }))
}

function StarRating({ value, onChange, hover, onHover, onLeave }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onLeave?.()}
          className="text-amber-400 transition"
        >
          {star <= (hover || value) ? <FaStar size={18} /> : <FaRegStar size={18} />}
        </button>
      ))}
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)

  const [product, setProduct]           = useState(null)
  const [relatedProducts, setRelated]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedSize, setSelectedSize]   = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty]                     = useState(1)
  const [tab, setTab]                     = useState('desc')

  // Mock reviews (chưa có API)
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Lan Anh', rating: 5, comment: 'Chất lượng tốt, mặc thoải mái.', date: '2026-05-10' },
    { id: 2, name: 'Minh Tuấn', rating: 4, comment: 'Đẹp, đúng form, giao hàng nhanh.', date: '2026-05-12' },
  ])
  const [reviewName, setReviewName]       = useState('')
  const [reviewRating, setReviewRating]   = useState(5)
  const [reviewHover, setReviewHover]     = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  // Fetch sản phẩm theo id
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await productService.getById(id)
        setProduct(data)
        const firstImage = getProductImages(data)[0]?.url ?? null
        setSelectedImage(firstImage)

        // Fetch sản phẩm liên quan cùng danh mục
        if (data.categoryId) {
          const relRes = await productService.getByCategory(data.categoryId, 4)
          const related = (relRes?.content ?? relRes ?? []).filter((p) => p.id !== data.id).slice(0, 3)
          setRelated(related)
        }
      } catch (err) {
        console.error('ProductDetail fetch error:', err)
        setError('Không tìm thấy sản phẩm')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  // Lấy sizes & colors duy nhất từ variants
  const sizes  = product ? [...new Set((product.variants ?? []).map((v) => v.size).filter(Boolean))]  : []
  const colors = product ? [...new Set((product.variants ?? []).map((v) => v.color).filter(Boolean))] : []

  // Tìm variant đang chọn để lấy stock
  const selectedVariant = product?.variants?.find(
    (v) => (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor)
  )
  const currentStock = selectedVariant?.stock ?? product?.totalStock ?? 0

  function handleAdd() {
    if (!product) return
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Vui lòng chọn size')
      return
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error('Vui lòng chọn màu sắc')
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: selectedImage ?? product.thumbnailUrl,
      size: selectedSize,
      color: selectedColor,
      qty,
    })
    toast.success('Đã thêm vào giỏ hàng!')
  }

  function handleBuyNow() {
    handleAdd()
    navigate('/cart')
  }

  function submitReview(e) {
    e.preventDefault()
    if (!reviewName || !reviewComment) return toast.error('Vui lòng nhập tên và bình luận')
    setReviews([
      {
        id: Date.now(),
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString().slice(0, 10),
      },
      ...reviews,
    ])
    setReviewName('')
    setReviewRating(5)
    setReviewComment('')
    toast.success('Cảm ơn bạn đã đánh giá!')
  }

  const allImages = product ? getProductImages(product) : []

  // ── LOADING ──
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
    )
  }

  // ── ERROR ──
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <TopNav />
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
          <FiPackage className="h-16 w-16 text-gray-200" />
          <h2 className="font-serif text-2xl text-gray-700">{error ?? 'Sản phẩm không tồn tại'}</h2>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-[#231916] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#9B3F1E]"
          >
            <FiArrowLeft /> Quay lại
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 0

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopNav />

      <main className="mx-auto max-w-6xl px-4 py-10">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#9B3F1E]">Trang chủ</Link>
          <FiChevronRight className="h-4 w-4" />
          {product.categoryName && (
            <>
              <span className="hover:text-[#9B3F1E] cursor-pointer">{product.categoryName}</span>
              <FiChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-[#231916] font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* ── MAIN PRODUCT ── */}
        <div className="grid gap-10 lg:grid-cols-2">

          {/* Images */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              {selectedImage ? (
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-200">
                  <MdShoppingBag size={80} />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img.url)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === img.url ? 'border-[#9B3F1E]' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img src={img.url} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {/* Brand + Category */}
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#695D4B]">
              {product.brandName && <span>{product.brandName}</span>}
              {product.brandName && product.categoryName && <span>·</span>}
              {product.categoryName && <span>{product.categoryName}</span>}
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl font-semibold text-[#231916] dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    s <= avgRating
                      ? <FaStar key={s} className="h-4 w-4 text-amber-400" />
                      : <FaRegStar key={s} className="h-4 w-4 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({reviews.length} đánh giá)</span>
              </div>
            )}

            {/* Price */}
            <div>
              {product.salePrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#9B3F1E]">{fmt(product.salePrice)}</span>
                  <span className="text-xl text-gray-400 line-through">{fmt(product.price)}</span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    -{Math.round((1 - product.salePrice / product.price) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-[#231916] dark:text-white">{fmt(product.price)}</span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-sm">
              {currentStock === 0 ? (
                <><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-red-500 font-medium">Hết hàng</span></>
              ) : currentStock < 10 ? (
                <><span className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-amber-600 font-medium">Sắp hết — còn {currentStock} sản phẩm</span></>
              ) : (
                <><span className="h-2 w-2 rounded-full bg-green-500" /><span className="text-green-700 font-medium">Còn hàng</span></>
              )}
            </div>

            {/* Size */}
            {sizes.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Kích thước: <span className="font-semibold text-[#231916]">{selectedSize || 'Chưa chọn'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        selectedSize === s
                          ? 'border-[#231916] bg-[#231916] text-white'
                          : 'border-gray-200 hover:border-[#231916]'
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
                  Màu sắc: <span className="font-semibold text-[#231916]">{selectedColor || 'Chưa chọn'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const variant = product.variants?.find((v) => v.color === c)
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          selectedColor === c
                            ? 'border-[#231916] bg-[#231916] text-white'
                            : 'border-gray-200 hover:border-[#231916]'
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
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Số lượng</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(currentStock || 99, q + 1))}
                    className="flex h-10 w-10 items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    disabled={qty >= (currentStock || 99)}
                  >
                    +
                  </button>
                </div>
                {currentStock > 0 && (
                  <span className="text-xs text-gray-400">Tối đa {currentStock}</span>
                )}
              </div>
            </div>

            {/* CTA buttons */}
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
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm text-[#695D4B]">
                {[
                  '🚚 Miễn phí vận chuyển đơn từ 500k',
                  '🔄 Đổi trả trong 7 ngày',
                  '✅ Bảo hành chính hãng',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">{item}</div>
                ))}
              </div>
            </div>

            {/* SKU */}
            {product.id && (
              <p className="text-xs text-gray-400">
                Mã sản phẩm: <span className="font-medium">#{product.id}</span>
                {product.slug && <> · {product.slug}</>}
              </p>
            )}
          </div>
        </div>

        {/* ── TABS: MÔ TẢ / ĐÁnh GIÁ ── */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-gray-200">
            {[
              { id: 'desc', label: `Mô tả` },
              { id: 'reviews', label: `Đánh giá (${reviews.length})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-6 py-3 text-sm font-medium transition border-b-2 ${
                  tab === t.id
                    ? 'border-[#9B3F1E] text-[#9B3F1E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'desc' && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-8"
              >
                {product.description ? (
                  <p className="max-w-3xl text-base leading-8 text-[#4A4A4A] dark:text-gray-300 whitespace-pre-line">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">Chưa có mô tả cho sản phẩm này.</p>
                )}
              </motion.div>
            )}

            {tab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-8 space-y-8"
              >
                {/* List reviews */}
                <div className="space-y-6">
                  {reviews.map((r) => (
                    <div key={r.id} className="border-b border-gray-100 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAE1DB] text-sm font-bold text-[#231916]">
                            {r.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#231916]">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) =>
                            s <= r.rating
                              ? <FaStar key={s} className="h-3.5 w-3.5 text-amber-400" />
                              : <FaRegStar key={s} className="h-3.5 w-3.5 text-amber-400" />
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">{r.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Form đánh giá */}
                <div className="rounded-2xl border border-[#DDC0B8] bg-[#FFF8F6] p-6">
                  <h4 className="mb-4 font-semibold text-[#231916]">Viết đánh giá của bạn</h4>
                  <form onSubmit={submitReview} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Tên của bạn</label>
                        <input
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#9B3F1E]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Đánh giá sao</label>
                        <div className="pt-1">
                          <StarRating
                            value={reviewRating}
                            onChange={setReviewRating}
                            hover={reviewHover}
                            onHover={setReviewHover}
                            onLeave={() => setReviewHover(0)}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Nhận xét</label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#9B3F1E]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-full bg-[#231916] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#9B3F1E]"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SẢN PHẨM LIÊN QUAN ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 font-serif text-2xl text-[#231916]">Sản phẩm liên quan</h2>
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
                    <p className="font-semibold text-[#231916] line-clamp-1">{p.name}</p>
                    <p className="mt-1 text-sm font-bold text-[#9B3F1E]">{fmt(p.salePrice ?? p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
