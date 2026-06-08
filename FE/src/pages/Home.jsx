import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MdShoppingBag } from 'react-icons/md'
import { FiShoppingCart, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import useCartStore from '../store/cartStore'
import productService from '../services/productService'
import categoryService from '../services/categoryService'

// Local assets (fallback)
import BannerImage from '../assets/high_end_luxury_fashion.png'
import Image1 from '../assets/Image1.png'
import Image2 from '../assets/Image2.png'
import Image3 from '../assets/Image3.png'
import Image8 from '../assets/Image8.png'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

// Format giá tiền VND
function fmt(n) {
  if (!n) return '—'
  return Number(n).toLocaleString('vi-VN') + '₫'
}

// Skeleton card dùng khi đang load
function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-gray-100" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-24 animate-pulse rounded bg-gray-100" />
          <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

// Skeleton category card
function CategorySkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#DDC0B8] bg-white shadow-sm">
      <div className="h-48 animate-pulse bg-gray-100" />
      <div className="p-6 space-y-2">
        <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  )
}

// Ảnh fallback cho danh mục theo index
const categoryFallbackImages = [Image1, Image2, Image3, Image8]

function Home() {
  const addItem = useCartStore((state) => state.addItem)
  const navigate = useNavigate()

  // State từ API
  const [newArrivals, setNewArrivals]   = useState([])
  const [categories, setCategories]     = useState([])
  const [featuredProducts, setFeatured] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Fetch sản phẩm mới + nổi bật
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)
      try {
        const [newRes, featuredRes] = await Promise.allSettled([
          productService.getNewArrivals(6),
          productService.getFeatured(4),
        ])

        if (newRes.status === 'fulfilled') {
          const data = newRes.value
          setNewArrivals(data?.content ?? data ?? [])
        }
        if (featuredRes.status === 'fulfilled') {
          const data = featuredRes.value
          setFeatured(data?.content ?? data ?? [])
        }
      } catch (err) {
        console.error('Lỗi fetch sản phẩm:', err)
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  // Fetch danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      try {
        const data = await categoryService.getAll()
        setCategories(Array.isArray(data) ? data.slice(0, 4) : [])
      } catch (err) {
        console.error('Lỗi fetch danh mục:', err)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  const handleAdd = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: product.thumbnailUrl,
    })
    toast.success('Đã thêm vào giỏ hàng')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <TopNav />

      <main>
        {/* ── HERO ── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
          }}
          className="relative overflow-hidden bg-slate-950 text-white"
        >
          <img
            src={BannerImage}
            alt="Ảnh nền trang chủ"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="flex w-full items-center">
              <div className="flex-1 pr-6 lg:pr-20">
                <motion.div variants={fadeInUp} className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.45em] text-amber-200">
                    ZYRO — THỜI TRANG TỐI GIẢN
                  </p>
                  <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                    Định nghĩa lại
                    <br />
                    vẻ thanh lịch tự nhiên
                  </h1>
                  <p className="mt-5 text-base leading-7 text-slate-200 sm:text-lg">
                    Sang trọng bền vững dành cho con người hiện đại — nơi di sản thủ công gặp gỡ sự tinh tế kiến trúc.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      to="/story"
                      className="inline-flex items-center justify-center rounded-full bg-[#9B3F1E] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-md hover:bg-[#7f2f15]"
                    >
                      KHÁM PHÁ BỘ SƯU TẬP
                    </Link>
                    <button
                      onClick={() => document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:bg-white/10"
                    >
                      XEM SẢN PHẨM
                    </button>
                  </div>
                </motion.div>
              </div>
              <div className="hidden w-[420px] lg:block" />
            </div>
          </div>
        </motion.section>

        {/* ── MARQUEE ── */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden bg-[#BB5734] text-white"
        >
          <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="overflow-hidden">
              <div className="flex min-w-[200%] animate-marquee gap-4 whitespace-nowrap">
                {[...Array(20)].map((_, i) => (
                  <span key={i} className="inline-flex px-8 py-2 text-sm uppercase tracking-[0.3em]">
                    ✦ CHẠM LÀ MÊ ✦
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── QUOTE ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-[#FFF8F6] py-20"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="border-y border-[#DDC0B8] py-16 text-center">
              <p className="font-playfairDisplay text-3xl leading-tight tracking-[-0.02em] text-[#231916] sm:text-4xl">
                &quot;Trang phục không chỉ là vải vóc, đó là ngôn ngữ của sự tự tin.&quot;
              </p>
              <p className="mt-8 text-sm uppercase tracking-[0.12em] text-[#695D4B]">
                — Ms Hương, Nhà sáng lập ZYRO
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── DANH MỤC — lấy từ API ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-[#FFF1ED] py-24"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#695D4B]">Danh mục nổi bật</p>
              <h2 className="mt-4 font-serif text-4xl text-[#231916]">
                Khám phá phong cách của bạn.
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {loadingCategories ? (
                // Skeleton
                [...Array(4)].map((_, i) => <CategorySkeleton key={i} />)
              ) : categories.length > 0 ? (
                categories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group cursor-pointer overflow-hidden rounded-3xl border border-[#DDC0B8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    onClick={() => navigate(`/?categoryId=${cat.id}`)}
                  >
                    <div className="overflow-hidden">
                      <img
                        src={cat.imageUrl || categoryFallbackImages[i % categoryFallbackImages.length]}
                        alt={cat.name}
                        className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = categoryFallbackImages[i % categoryFallbackImages.length] }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#231916] group-hover:text-[#9B3F1E] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#695D4B] line-clamp-2">
                        {cat.description || 'Khám phá bộ sưu tập ' + cat.name}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#9B3F1E]">
                        Xem thêm <FiArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                // Fallback khi không có data
                [
                  { title: 'Beige Dịu Dàng', subtitle: 'Nền ấm áp cho mọi ngày.', image: Image1 },
                  { title: 'Terracotta Ấm Nồng', subtitle: 'Đậm nét, vẫn nhẹ nhàng.', image: Image2 },
                  { title: 'Ivory Thanh Lịch', subtitle: 'Sạch, tinh tế và hiện đại.', image: Image3 },
                  { title: 'Olive Dịu Dàng', subtitle: 'Tự nhiên mà vẫn sang trọng.', image: Image1 },
                ].map((tone) => (
                  <div
                    key={tone.title}
                    className="overflow-hidden rounded-3xl border border-[#DDC0B8] bg-white shadow-sm"
                  >
                    <div className="overflow-hidden rounded-t-3xl">
                      <img src={tone.image} alt={tone.title} className="h-48 w-full object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#231916]">{tone.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#695D4B]">{tone.subtitle}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.section>

        {/* ── SẢN PHẨM MỚI — lấy từ API ── */}
        <motion.section
          id="new-arrivals"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="bg-white py-24"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#695D4B]">Sản phẩm mới</p>
              <h2 className="mt-4 font-serif text-4xl text-[#231916]">
                Khám phá mẫu mới nhất của chúng tôi.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#4A4A4A]">
                Những thiết kế tinh tế, cân bằng giữa vẻ đẹp tối giản và sự thoải mái.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loadingProducts ? (
                [...Array(3)].map((_, i) => <ProductSkeleton key={i} />)
              ) : newArrivals.length > 0 ? (
                newArrivals.slice(0, 6).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: index * 0.08 }}
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Ảnh */}
                    <div
                      className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-slate-100"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-300">
                          <MdShoppingBag size={48} />
                        </div>
                      )}

                      {/* Badge mới */}
                      {product.isNewArrival && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#9B3F1E] px-3 py-1 text-xs font-semibold text-white">
                          Mới
                        </span>
                      )}

                      {/* Badge giảm giá */}
                      {product.salePrice && product.price && (
                        <span className="absolute right-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                          -{Math.round((1 - product.salePrice / product.price) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <p className="text-xs font-medium uppercase tracking-wide text-[#695D4B]">
                        {product.categoryName || 'ZYRO'}
                      </p>
                      <h3
                        className="mt-1 cursor-pointer text-lg font-semibold text-[#231916] line-clamp-1 hover:text-[#9B3F1E] transition-colors"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="mt-2 text-sm leading-6 text-[#4A4A4A] line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div>
                          {product.salePrice ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-[#9B3F1E]">{fmt(product.salePrice)}</span>
                              <span className="text-sm text-gray-400 line-through">{fmt(product.price)}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-[#231916]">{fmt(product.price)}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Xem chi tiết */}
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-[#9B3F1E] hover:text-[#9B3F1E]"
                            title="Xem chi tiết"
                          >
                            <FiArrowRight className="h-4 w-4" />
                          </button>

                          {/* Thêm giỏ hàng */}
                          <button
                            onClick={() => handleAdd(product)}
                            className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9B3F1E]"
                          >
                            <FiShoppingCart className="h-4 w-4" /> Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                // Hiển thị thông báo nếu không có sản phẩm mới
                <div className="col-span-full py-16 text-center">
                  <MdShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-200" />
                  <p className="text-base text-[#695D4B]">Chưa có sản phẩm mới. Hãy quay lại sau nhé!</p>
                </div>
              )}
            </div>

            {/* Nút xem thêm — chỉ hiện khi có sản phẩm */}
            {!loadingProducts && newArrivals.length > 0 && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => navigate('/?isNewArrival=true')}
                  className="inline-flex items-center gap-2 rounded-full border border-[#231916] bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-[#231916] transition hover:bg-[#231916] hover:text-white"
                >
                  Xem tất cả sản phẩm <FiArrowRight />
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* ── SẢN PHẨM NỔI BẬT — lấy từ API ── */}
        {!loadingProducts && featuredProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="bg-[#FFF8F6] py-24"
          >
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-10 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-[#695D4B]">Được yêu thích</p>
                <h2 className="mt-4 font-serif text-4xl text-[#231916]">Sản phẩm nổi bật.</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-[#DDC0B8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="aspect-square overflow-hidden bg-slate-50">
                      {product.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-200">
                          <MdShoppingBag size={40} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-[#231916] line-clamp-1">{product.name}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        {product.salePrice ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-[#9B3F1E]">{fmt(product.salePrice)}</span>
                            <span className="text-xs text-gray-400 line-through">{fmt(product.price)}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-[#231916]">{fmt(product.price)}</span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAdd(product) }}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-white transition hover:bg-[#9B3F1E]"
                        >
                          <FiShoppingCart className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── BANNER BỘ SƯU TẬP ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden bg-[#8B4331] text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.2),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-24">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#F8E6DC]">BỘ SƯU TẬP TIÊU BIỂU</p>
                <h2 className="font-serif text-5xl leading-tight tracking-[-0.03em]">Khai Hoa Phú Quý</h2>
                <p className="max-w-2xl text-base leading-8 text-[#F2DDD3]">
                  Tinh thần mới cho phong cách tối giản: ấm áp, sang trọng và dễ tiếp cận.
                </p>
                <Link
                  to="/story"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-slate-100"
                >
                  Khám phá bộ sưu tập
                </Link>
              </div>
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-10 backdrop-blur-sm">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/5">
                  <img src={Image8} alt="Khai Hoa Phú Quý" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── CTA ĐĂNG KÝ ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-[#F8F2EC] py-24"
        >
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#695D4B]">Tham gia Cộng Đồng</p>
            <h2 className="mt-4 font-serif text-4xl text-[#231916]">
              Đăng ký để nhận cập nhật và ưu đãi riêng.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#4A4A4A]">
              Nhận trước thông tin về bộ sưu tập mới, sự kiện cửa hàng và chương trình ưu đãi đặc biệt.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#231916] px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#3a3a3a]"
              >
                Tham gia ngay
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center justify-center rounded-full border border-[#695D4B] bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#231916] transition hover:bg-[#f0e7de]"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home
