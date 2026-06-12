import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiFilter, FiChevronRight, FiPackage,
  FiChevronLeft, FiX, FiStar,
} from 'react-icons/fi'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import categoryService from '../services/categoryService'
import productService from '../services/productService'
import { usePublicBrands } from '../hooks/useBrands'
import useCartStore from '../store/cartStore'
import toast from 'react-hot-toast'
import BannerImage from "../assets/high_end_luxury_fashion_brand_banner.png"
import LookbookWomen from "../assets/lookbook_women_elegant.png"
import LookbookMen from "../assets/lookbook_men_elegant.png"

const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫'

function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="aspect-[3/4] rounded-sm bg-[#EAE2D4] dark:bg-gray-900" />
      <div className="h-4 w-2/3 rounded bg-[#EAE2D4] dark:bg-gray-900" />
      <div className="h-4 w-1/3 rounded bg-[#EAE2D4] dark:bg-gray-900" />
    </div>
  )
}

function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem)
  const [hovered, setHovered] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    const variants = product.variants || []
    const defaultVariant = variants[0]
    addItem({
      id: product.id,
      variantId: defaultVariant?.id,
      name: product.name,
      price: product.salePrice || product.price,
      thumbnail: product.thumbnailUrl,
      size: defaultVariant?.size,
      color: defaultVariant?.color,
    })
    toast.success('Đã thêm vào giỏ hàng')
  }

  const discount = product.salePrice && product.price
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block break-inside-avoid mb-12"
    >
      <Link to={`/product/${product.id}`} className="block relative">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F4EFEA] dark:bg-gray-800 rounded-sm mb-4">
          {product.thumbnailUrl ? (
            <img
              src={product.thumbnailUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FiPackage className="h-12 w-12 text-[#DDC0B8]" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-[#BB5734] px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-white shadow-sm">
                -{discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-[#231916] px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-white shadow-sm">
                MỚI
              </span>
            )}
          </div>

          {/* Quick add overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/10 flex items-end justify-center pb-4 px-4"
              >
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white/95 backdrop-blur-sm text-[#231916] dark:text-gray-100 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#231916] hover:text-white transition-colors duration-300 rounded-sm shadow-lg transform translate-y-2 group-hover:translate-y-0"
                >
                  Thêm vào giỏ
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="text-center space-y-1.5 px-2">
          {product.brandName && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A8C80] dark:text-gray-500">
              {product.brandName}
            </p>
          )}
          <p className="text-sm font-semibold tracking-wider uppercase text-[#231916] dark:text-gray-100 group-hover:text-[#BB5734] transition-colors line-clamp-1">
            {product.name}
          </p>
          <div className="flex items-center justify-center gap-3">
            {product.salePrice ? (
              <>
                <span className="text-sm font-medium text-[#BB5734]">{fmt(product.salePrice)}</span>
                <span className="text-xs text-[#9A8C80] dark:text-gray-500 line-through">{fmt(product.price)}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-[#695D4B] dark:text-gray-400">{fmt(product.price)}</span>
            )}
          </div>
          {/* Color dots */}
          {product.variants?.length > 0 && (
            <div className="mt-2 flex justify-center gap-1.5">
              {[...new Set(product.variants.map(v => v.colorHex).filter(Boolean))].slice(0, 5).map(hex => (
                <span key={hex} className="h-2.5 w-2.5 rounded-full border border-[#DDC0B8] dark:border-gray-800 shadow-sm"
                  style={{ backgroundColor: hex }} />
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

const LookbookHotspot = ({ x, y, product, align = 'right' }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute z-20" style={{ top: `${y}%`, left: `${x}%` }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Pulse dot */}
      <div className="relative flex items-center justify-center cursor-pointer group">
        <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-lg transition-transform group-hover:scale-150"></span>
      </div>

      {/* Popup card */}
      <AnimatePresence>
        {open && product && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute top-full mt-4 w-48 bg-white p-3 shadow-2xl rounded-sm ${align === 'right' ? 'left-0' : 'right-0'}`}
          >
            <div className="aspect-[3/4] overflow-hidden bg-[#F4EFEA] dark:bg-gray-800 mb-3 relative">
              {product.thumbnailUrl ? (
                <img src={product.thumbnailUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center"><FiPackage className="h-6 w-6 text-[#DDC0B8]" /></div>
              )}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#231916] dark:text-gray-100 truncate mb-1">{product.name}</p>
            <p className="text-xs text-[#BB5734] font-medium">{product.salePrice ? fmt(product.salePrice) : fmt(product.price)}</p>
            <Link to={`/product/${product.id}`} className="mt-3 block text-center text-[10px] font-semibold uppercase tracking-widest bg-[#231916] text-white py-2 hover:bg-[#BB5734] transition-colors">
              Xem chi tiết
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Mới nhất'     },
  { value: 'popular',    label: 'Bán chạy'     },
  { value: 'price_asc',  label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
]

export default function Collection() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const initialKeyword = searchParams.get('q') || ''

  const [category,   setCategory]   = useState(null)
  const [categories, setCategories] = useState([])
  const [products,   setProducts]   = useState([])
  const [total,      setTotal]      = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [catLoading, setCatLoading] = useState(true)

  const [filters, setFilters] = useState({
    keyword: initialKeyword, sortBy: 'newest', page: 0, size: 12, brandId: '',
  })
  const [keyword, setKeyword] = useState(initialKeyword)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const { brands } = usePublicBrands()

  // Listen for URL search param changes
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setKeyword(q)
    setFilters(prev => ({ ...prev, keyword: q, page: 0 }))
  }, [searchParams])

  // Load categories
  useEffect(() => {
    setCatLoading(true)
    categoryService.getAll()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setCatLoading(false))
  }, [])

  // Identify category
  useEffect(() => {
    if (!categories.length) return
    const found = categories.find(c => c.slug === slug || String(c.id) === String(slug))
    setCategory(found || null)
  }, [slug, categories])

  // Load products
  const loadProducts = useCallback(async (f, catId) => {
    setLoading(true)
    try {
      const params = {
        ...(catId ? { categoryId: catId } : {}),
        keyword:   f.keyword || undefined,
        brandId:   f.brandId || undefined,
        sortBy:    f.sortBy,
        page:      f.page,
        size:      f.size,
      }
      Object.keys(params).forEach(k => params[k] === undefined && delete params[k])
      const data = await productService.search(params)
      setProducts(data.content ?? [])
      setTotal(data.totalElements ?? 0)
      setTotalPages(data.totalPages ?? 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const catId = category?.id ?? null
    loadProducts(filters, catId)
  }, [filters, category, catLoading])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key === 'page' ? value : 0 }))
    if (key === 'page') window.scrollTo({ top: 800, behavior: 'smooth' })
  }

  const pageTitle = category?.name ?? (slug ? slug : 'Tất cả bộ sưu tập')
  const selectedBrand = brands.find(b => String(b.id) === String(filters.brandId)) ?? null
  const displayTitle = selectedBrand?.name || pageTitle

  const SidebarContent = () => (
    <div className="space-y-10">
      {/* Search */}
      <div className="relative group">
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              updateFilter('keyword', keyword)
              setIsMobileFilterOpen(false)
            }
          }}
          placeholder="Tìm sản phẩm..."
          className="w-full border-b border-[#DDC0B8] dark:border-gray-800 bg-transparent py-3 pr-8 text-sm outline-none transition-colors placeholder:text-[#9A8C80] dark:text-gray-500 focus:border-[#BB5734] text-[#231916] dark:text-gray-100 font-beVietnamPro"
        />
        <FiSearch 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8C80] dark:text-gray-500 group-focus-within:text-[#BB5734] transition-colors cursor-pointer" 
          onClick={() => {
            updateFilter('keyword', keyword)
            setIsMobileFilterOpen(false)
          }}
        />
      </div>

      <section className="space-y-5">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-[#695D4B] dark:text-gray-400 uppercase">
          Danh Mục
        </h3>
        <div className="space-y-2 font-beVietnamPro text-sm">
          <Link 
            to="/collections"
            onClick={() => setIsMobileFilterOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-sm transition-all group ${!slug ? "bg-[#EAE2D4] dark:bg-gray-900/50 text-[#BB5734] font-semibold" : "hover:bg-[#EAE2D4] dark:bg-gray-900/30 text-[#4A4A4A] dark:text-gray-300 hover:text-[#BB5734]"}`}
          >
            <div className="w-10 h-12 rounded-sm overflow-hidden bg-[#DDC0B8] flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
              <img src={LookbookWomen} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt="Tất cả" />
            </div>
            <span className="tracking-wide">Tất cả</span>
          </Link>
          {catLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-10 h-12 bg-[#EAE2D4] dark:bg-gray-900 animate-pulse rounded-sm flex-shrink-0" />
                <div className="h-4 w-24 bg-[#EAE2D4] dark:bg-gray-900 animate-pulse rounded" />
              </div>
            ))
          ) : categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/collections/${cat.slug || cat.id}`}
              onClick={() => setIsMobileFilterOpen(false)}
              className={`flex items-center gap-3 p-2 rounded-sm transition-all group ${
                (cat.slug === slug || String(cat.id) === String(slug))
                  ? "bg-[#EAE2D4] dark:bg-gray-900/50 text-[#BB5734] font-semibold" 
                  : "hover:bg-[#EAE2D4] dark:bg-gray-900/30 text-[#4A4A4A] dark:text-gray-300 hover:text-[#BB5734]"
              }`}
            >
              <div className="w-10 h-12 rounded-sm overflow-hidden bg-[#DDC0B8] flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={cat.imageUrl || (index % 2 === 0 ? LookbookMen : LookbookWomen)} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                  alt={cat.name} 
                />
              </div>
              <span className="tracking-wide">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {brands.length > 0 && (
        <section className="space-y-5">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-[#695D4B] dark:text-gray-400 uppercase">
            Thương Hiệu
          </h3>
          <div className="space-y-2 font-beVietnamPro text-sm">
            <button
              type="button"
              onClick={() => {
                updateFilter('brandId', '')
                setIsMobileFilterOpen(false)
              }}
              className={`block w-full text-left p-2 rounded-sm transition-all ${
                !filters.brandId
                  ? 'bg-[#EAE2D4] dark:bg-gray-900/50 text-[#BB5734] font-semibold'
                  : 'hover:bg-[#EAE2D4] dark:bg-gray-900/30 text-[#4A4A4A] dark:text-gray-300 hover:text-[#BB5734]'
              }`}
            >
              Tất cả thương hiệu
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => {
                  updateFilter('brandId', String(brand.id))
                  setIsMobileFilterOpen(false)
                }}
                className={`block w-full text-left p-2 rounded-sm transition-all ${
                  String(filters.brandId) === String(brand.id)
                    ? 'bg-[#EAE2D4] dark:bg-gray-900/50 text-[#BB5734] font-semibold'
                    : 'hover:bg-[#EAE2D4] dark:bg-gray-900/30 text-[#4A4A4A] dark:text-gray-300 hover:text-[#BB5734]'
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-gray-950 text-[#231916] dark:text-gray-100">
      <TopNav />

      <main>
        {/* Editorial Hero Section */}
        <section className="relative h-[25vh] md:h-[35vh] flex items-center justify-center overflow-hidden bg-[#EAE2D4] dark:bg-gray-900">
          <div className="absolute inset-0">
            {/* Soft gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-10" />
            <img 
              src={category?.imageUrl || BannerImage} 
              alt={pageTitle} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-20 text-center px-4 mt-12">
            <Reveal duration={0.8}>
              <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-white/80 mb-4 font-semibold">
                ZYRO Editorial
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-wide uppercase">
                {displayTitle}
              </h1>
              {category?.description && (
                <p className="mt-6 max-w-2xl mx-auto text-white/90 text-sm md:text-base font-beVietnamPro tracking-wider font-light leading-relaxed">
                  {category.description}
                </p>
              )}
            </Reveal>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-24">
          
          {/* Breadcrumb & Mobile Filter Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 pb-6 border-b border-[#DDC0B8] dark:border-gray-800">
            <div className="flex items-center gap-2 font-beVietnamPro text-xs text-[#9A8C80] dark:text-gray-500 uppercase tracking-wider">
              <Link to="/" className="hover:text-[#BB5734] transition-colors">Trang chủ</Link>
              <FiChevronRight className="h-3 w-3" />
              <Link to="/collections" className="hover:text-[#BB5734] transition-colors">Bộ sưu tập</Link>
              {category && (
                <>
                  <FiChevronRight className="h-3 w-3" />
                  <span className="text-[#231916] dark:text-gray-100 font-semibold">{category.name}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex-1 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-wider text-[#695D4B] dark:text-gray-400 border border-[#DDC0B8] dark:border-gray-800 px-4 py-2 rounded-full"
              >
                <FiFilter /> Bộ lọc
              </button>
              
              <select
                value={filters.sortBy}
                onChange={e => updateFilter('sortBy', e.target.value)}
                className="flex-1 md:w-auto appearance-none border border-[#DDC0B8] dark:border-gray-800 bg-transparent px-5 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase text-[#695D4B] dark:text-gray-400 focus:outline-none focus:border-[#BB5734] rounded-full text-center cursor-pointer"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0 sticky top-32 h-fit">
              <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {isMobileFilterOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  />
                  <motion.aside
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="fixed inset-y-0 left-0 w-80 bg-[#FBF9F4] dark:bg-gray-950 z-50 p-6 overflow-y-auto lg:hidden shadow-2xl"
                  >
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#DDC0B8] dark:border-gray-800">
                      <span className="font-serif text-xl tracking-wide">Bộ Lọc</span>
                      <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-[#4A4A4A] dark:text-gray-300">
                        <FiX size={24} />
                      </button>
                    </div>
                    <SidebarContent />
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              
              {/* Interactive Lookbook Spotlight (Only show on first page without search/category) */}
              {!slug && !filters.keyword && filters.page === 0 && (
                <div className="mb-20 pb-16 border-b border-[#DDC0B8] dark:border-gray-800">
                  <div className="text-center mb-12">
                    <Reveal>
                      <h2 className="text-3xl lg:text-4xl font-serif tracking-wide text-[#231916] dark:text-gray-100 mb-4">Gợi Ý Phối Đồ</h2>
                      <p className="text-[#695D4B] dark:text-gray-400 max-w-xl mx-auto font-beVietnamPro text-sm leading-relaxed">
                        Khám phá những bản phối tinh tế và thanh lịch nhất được thiết kế riêng cho những ngày giao mùa. Hãy nhấp vào các điểm sáng để xem chi tiết sản phẩm.
                      </p>
                    </Reveal>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
                    {/* Women Lookbook */}
                    <Reveal delay={0.2}>
                      <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-[#F4EFEA] dark:bg-gray-800 group shadow-xl">
                        <img src={LookbookWomen} alt="Lookbook Nữ" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/5" />
                        
                        {/* Hotspots matching women's products (mock logic) */}
                        {products.length > 0 && <LookbookHotspot x={40} y={35} product={products[0]} />}
                        {products.length > 1 && <LookbookHotspot x={55} y={65} product={products[1]} align="left" />}
                      </div>
                    </Reveal>

                    {/* Men Lookbook - Offset for Masonry feel */}
                    <Reveal delay={0.4}>
                      <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-[#F4EFEA] dark:bg-gray-800 group shadow-xl mt-0 md:mt-24">
                        <img src={LookbookMen} alt="Lookbook Nam" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/5" />

                        {/* Hotspots matching men's products (mock logic) */}
                        {products.length > 2 && <LookbookHotspot x={45} y={30} product={products[2]} />}
                        {products.length > 3 && <LookbookHotspot x={50} y={70} product={products[3]} align="left" />}
                      </div>
                    </Reveal>
                  </div>
                </div>
              )}

              <div className="mb-10 flex items-center justify-between">
                <span className="text-sm font-medium tracking-[0.1em] text-[#695D4B] dark:text-gray-400 uppercase">
                  {loading ? "Đang tải..." : `${total} Sản phẩm`}
                </span>
              </div>

              {/* Product grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="py-24 text-center">
                  <FiPackage className="mx-auto mb-4 h-14 w-14 text-[#DDC0B8]" />
                  <p className="font-serif text-lg text-[#695D4B] dark:text-gray-400 mb-2">Chưa có sản phẩm nào</p>
                  <p className="text-sm font-medium tracking-wider uppercase text-[#9A8C80] dark:text-gray-500">
                    Bộ sưu tập này đang được cập nhật
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}

              {/* Pagination & View All */}
              {totalPages > 0 && (
                <div className="flex flex-col items-center justify-center gap-6 mt-20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateFilter('page', filters.page - 1)}
                      disabled={filters.page === 0}
                      className={`w-10 h-10 flex items-center justify-center border transition-all ${filters.page === 0 ? "border-[#DDC0B8] dark:border-gray-800 text-[#DDC0B8] cursor-not-allowed" : "border-[#DDC0B8] dark:border-gray-800 text-[#4A4A4A] dark:text-gray-300 hover:border-[#BB5734] hover:text-[#BB5734]"}`}
                    >
                      <FiChevronLeft />
                    </button>
                    <div className="flex gap-2">
                      {[...Array(Math.min(5, Math.max(1, totalPages)))].map((_, i) => {
                        const pg = Math.max(0, Math.min(filters.page - 2, Math.max(1, totalPages) - 5)) + i
                        return (
                          <button
                            key={pg}
                            onClick={() => updateFilter('page', pg)}
                            className={`w-10 h-10 flex items-center justify-center text-sm font-medium transition-all ${
                              filters.page === pg
                                ? "bg-[#231916] text-white"
                                : "border border-[#DDC0B8] dark:border-gray-800 text-[#4A4A4A] dark:text-gray-300 hover:border-[#BB5734] hover:text-[#BB5734]"
                            }`}
                          >
                            {pg + 1}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => updateFilter('page', filters.page + 1)}
                      disabled={filters.page >= totalPages - 1}
                      className={`w-10 h-10 flex items-center justify-center border transition-all ${filters.page >= totalPages - 1 ? "border-[#DDC0B8] dark:border-gray-800 text-[#DDC0B8] cursor-not-allowed" : "border-[#DDC0B8] dark:border-gray-800 text-[#4A4A4A] dark:text-gray-300 hover:border-[#BB5734] hover:text-[#BB5734]"}`}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                  
                  {/* Xem tất cả button */}
                  <button 
                    onClick={() => {
                      setFilters({ keyword: '', sortBy: 'newest', page: 0, size: 1000 });
                      window.scrollTo({ top: 800, behavior: 'smooth' });
                    }}
                    className="text-sm font-semibold tracking-widest uppercase text-[#231916] dark:text-gray-100 border-b border-[#231916] pb-1 hover:text-[#BB5734] hover:border-[#BB5734] transition-colors"
                  >
                    Xem tất cả sản phẩm
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}