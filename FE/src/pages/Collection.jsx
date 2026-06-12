import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiPackage,
  FiChevronLeft,
  FiX,
} from "react-icons/fi";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import categoryService from "../services/categoryService";
import productService from "../services/productService";
import useCartStore from "../store/cartStore";
import toast from "react-hot-toast";
import brandService from "../services/brandService";

const fmt = (n) => Number(n).toLocaleString("vi-VN") + "₫";

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-[#F0EEE9]" />
      <div className="mt-3 h-4 w-4/5 rounded bg-[#F0EEE9]" />
      <div className="mt-2 h-4 w-1/2 rounded bg-[#F0EEE9]" />
    </div>
  );
}

function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    const variants = product.variants || [];
    const defaultVariant = variants[0];
    addItem({
      id: product.id,
      variantId: defaultVariant?.id,
      name: product.name,
      price: product.salePrice || product.price,
      thumbnail: product.thumbnailUrl,
      size: defaultVariant?.size,
      color: defaultVariant?.color,
    });
    toast.success("Đã thêm vào giỏ hàng");
  };

  const discount =
    product.salePrice && product.price
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F3EE]">
          {product.thumbnailUrl ? (
            <img
              src={product.thumbnailUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FiPackage className="h-12 w-12 text-[#D1C4B9]" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-[#C0392B] px-2 py-0.5 font-beVietnamPro text-xs font-semibold text-white">
                -{discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-[#1B1C19] px-2 py-0.5 font-beVietnamPro text-xs font-semibold text-white">
                MỚI
              </span>
            )}
          </div>

          {/* Quick add */}
          <AnimatePresence>
            {hovered && (
              <motion.button
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={handleAddToCart}
                className="absolute bottom-0 left-0 right-0 bg-[#1B1C19]/90 py-3 font-beVietnamPro text-sm font-medium text-white hover:bg-[#1B1C19]"
              >
                + Thêm vào giỏ
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="mt-3 px-0.5">
          <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19] line-clamp-1 group-hover:text-[#6F583D] transition-colors">
            {product.name}
          </p>
          <div className="mt-1 flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="font-beVietnamPro text-sm font-semibold text-[#C0392B]">
                  {fmt(product.salePrice)}
                </span>
                <span className="font-beVietnamPro text-xs text-[#9E8E7E] line-through">
                  {fmt(product.price)}
                </span>
              </>
            ) : (
              <span className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                {fmt(product.price)}
              </span>
            )}
          </div>
          {/* Color dots */}
          {product.variants?.length > 0 && (
            <div className="mt-1.5 flex gap-1">
              {[
                ...new Set(
                  product.variants.map((v) => v.colorHex).filter(Boolean),
                ),
              ]
                .slice(0, 5)
                .map((hex) => (
                  <span
                    key={hex}
                    className="h-3 w-3 rounded-full border border-[#D1C4B9]"
                    style={{ backgroundColor: hex }}
                  />
                ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "popular", label: "Bán chạy" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
];

function BrandThumb({ brand, active, onClick }) {
  const logo = brand.logoUrl || brand.logo || brand.imageUrl || "";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-3 transition-colors ${
        active
          ? "border-[#1B1C19] bg-[#1B1C19]"
          : "border-[#DDC0B8] bg-white/60 hover:bg-white"
      }`}
    >
      <div
        className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border transition-colors ${
          active ? "border-white/20" : "border-[#E8E0D8] bg-[#F5F3EE]"
        }`}
      >
        {logo ? (
          <img
            src={logo}
            alt={brand.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="text-xs text-[#9E8E7E]">BR</span>
        )}
      </div>
      <p
        className={`text-center font-beVietnamPro text-sm font-semibold line-clamp-1 ${
          active ? "text-white" : "text-[#231916]"
        }`}
      >
        {brand.name}
      </p>
    </button>
  );
}

export default function Collection() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);

  const [brands, setBrands] = useState([]);
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandId, setBrandId] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    sortBy: "newest",
    page: 0,
    size: 12,
  });
  const [keyword, setKeyword] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Load categories
  useEffect(() => {
    setCatLoading(true);
    categoryService
      .getAll()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setCatLoading(false));
  }, []);

  // Load active brands
  useEffect(() => {
    setBrandLoading(true);
    brandService
      .getActive()
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setBrandLoading(false));
  }, []);

  // Identify current category
  useEffect(() => {
    if (!categories.length) return;
    const found = categories.find(
      (c) => c.slug === slug || String(c.id) === String(slug),
    );
    setCategory(found || null);
  }, [slug, categories]);

  // Load products
  const loadProducts = useCallback(async (f, catId, bId) => {
    setLoading(true);
    try {
      const params = {
        ...(catId ? { categoryId: catId } : {}),
        ...(bId ? { brandId: bId } : {}),
        keyword: f.keyword || undefined,
        sortBy: f.sortBy,
        page: f.page,
        size: f.size,
      };

      Object.keys(params).forEach(
        (k) => params[k] === undefined && delete params[k],
      );

      const data = await productService.search(params);
      setProducts(data.content ?? []);
      setTotal(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const catId = category?.id ?? null;
    loadProducts(filters, catId, brandId);
  }, [filters, category, brandId, loadProducts]);

  const updateFilter = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 0,
    }));

  const pageTitle = category?.name ?? (slug ? slug : "Tất cả bộ sưu tập");

  return (
    <>
      <TopNav />

      <main className="mx-auto max-w-[1440px] px-5 pb-20 pt-6 md:px-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 font-beVietnamPro text-xs text-[#9E8E7E]">
          <Link to="/" className="hover:text-[#1B1C19]">
            Trang chủ
          </Link>
          <FiChevronRight className="h-3 w-3" />
          <Link to="/collections" className="hover:text-[#1B1C19]">
            Bộ sưu tập
          </Link>
          {category && (
            <>
              <FiChevronRight className="h-3 w-3" />
              <span className="text-[#1B1C19] font-medium">
                {category.name}
              </span>
            </>
          )}
        </div>

        {/* Hero Header */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] border border-[#DDC0B8] bg-[#FFF1ED] px-6 py-10 md:px-14"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(155,63,30,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(35,25,22,0.08),transparent_35%)]" />
          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[#695D4B]">
                  Bộ sưu tập
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-tight text-[#231916] md:text-5xl">
                  {category?.name ?? (slug ? slug : "Tất cả bộ sưu tập")}
                </h1>
                {category?.description && (
                  <p className="mt-4 text-base leading-7 text-[#695D4B]">
                    {category.description}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-[#DDC0B8] bg-white/60 px-4 py-2 text-sm font-medium text-[#231916]">
                    {loading ? "Đang tải..." : `${total} sản phẩm`}
                  </span>
                  <span className="rounded-full bg-[#231916] px-4 py-2 text-sm font-semibold text-white">
                    Mở khóa phong cách của bạn
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 lg:mt-0 lg:w-[320px]">
                {[0, 1, 2, 3].map((n) => (
                  <motion.div
                    key={n}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: n * 0.05, duration: 0.5 }}
                    className="h-24 rounded-2xl border border-[#DDC0B8] bg-white/70"
                  />
                ))}
              </div>
            </div>

            {/* Brand featured */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="mt-10"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#695D4B]">
                    Thương hiệu nổi bật
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-[#231916]">
                    Chọn thương hiệu để lọc sản phẩm
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setBrandId(null)}
                  className={`w-fit rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    !brandId
                      ? "border-[#1B1C19] bg-[#1B1C19] text-white"
                      : "border-[#DDC0B8] bg-white/70 text-[#231916] hover:bg-white"
                  }`}
                >
                  Tất cả thương hiệu
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {brandLoading
                  ? [...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-28 animate-pulse rounded-2xl border border-[#DDC0B8] bg-white/70"
                      />
                    ))
                  : brands.slice(0, 8).map((b) => (
                      <BrandThumb
                        key={b.id}
                        brand={b}
                        active={brandId === b.id}
                        onClick={() => {
                          setBrandId(b.id);
                          setFilters((prev) => ({ ...prev, page: 0 }));
                        }}
                      />
                    ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Product toolbar */}
        <div className="mt-10">
          <h1 className="font-beVietnamPro text-3xl font-bold text-[#1B1C19]">
            {pageTitle}
          </h1>
          {category?.description && (
            <p className="mt-2 max-w-xl font-beVietnamPro text-sm text-[#6F583D]">
              {category.description}
            </p>
          )}
          <p className="mt-2 font-beVietnamPro text-sm text-[#9E8E7E]">
            {loading ? "..." : `${total} sản phẩm`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar categories */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <h3 className="mb-3 font-beVietnamPro text-xs font-semibold uppercase tracking-widest text-[#9E8E7E]">
              Bộ sưu tập
            </h3>
            <ul className="space-y-0.5">
              <li>
                <Link
                  to="/collections"
                  className={`block rounded px-3 py-2 font-beVietnamPro text-sm transition-colors ${
                    !slug
                      ? "bg-[#1B1C19] text-white"
                      : "text-[#4E453D] hover:bg-[#FAF8F5] hover:text-[#1B1C19]"
                  }`}
                >
                  Tất cả
                </Link>
              </li>
              {catLoading
                ? [...Array(4)].map((_, i) => (
                    <li key={i}>
                      <div className="mx-3 my-2 h-4 animate-pulse rounded bg-[#F0EEE9]" />
                    </li>
                  ))
                : categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/collections/${cat.slug || cat.id}`}
                        className={`flex items-center justify-between rounded px-3 py-2 font-beVietnamPro text-sm transition-colors ${
                          cat.slug === slug || String(cat.id) === String(slug)
                            ? "bg-[#1B1C19] text-white"
                            : "text-[#4E453D] hover:bg-[#FAF8F5] hover:text-[#1B1C19]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-[#E8E0D8] bg-[#F5F3EE]">
                            {cat.imageUrl ? (
                              <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : null}
                          </span>
                          <span className="min-w-0 truncate">{cat.name}</span>
                        </div>

                        <FiChevronRight className="h-3 w-3 opacity-50" />
                      </Link>
                    </li>
                  ))}
            </ul>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              {/* Search */}
              <div className="flex min-w-[200px] flex-1 items-center gap-2 border border-[#D1C4B9] bg-white px-4 py-2.5 sm:max-w-xs">
                <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && updateFilter("keyword", keyword)
                  }
                  placeholder="Tìm sản phẩm..."
                  className="flex-1 bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
                />
                {keyword && (
                  <button
                    onClick={() => {
                      setKeyword("");
                      updateFilter("keyword", "");
                    }}
                  >
                    <FiX className="h-3.5 w-3.5 text-[#9E8E7E] hover:text-[#1B1C19]" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilter((v) => !v)}
                  className="flex items-center gap-2 border border-[#D1C4B9] px-4 py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#FAF8F5] lg:hidden"
                >
                  <FiFilter className="h-4 w-4" /> Danh mục
                </button>

                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                  className="border border-[#D1C4B9] bg-white px-4 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] focus:outline-none"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile category sheet */}
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="mb-5 overflow-hidden border border-[#E8E0D8] bg-white"
                >
                  <div className="flex flex-wrap gap-2 p-4">
                    <Link
                      to="/collections"
                      onClick={() => setShowFilter(false)}
                      className={`px-4 py-2 font-beVietnamPro text-sm ${
                        !slug
                          ? "bg-[#1B1C19] text-white"
                          : "border border-[#D1C4B9] text-[#4E453D] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      Tất cả
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/collections/${cat.slug || cat.id}`}
                        onClick={() => setShowFilter(false)}
                        className={`px-4 py-2 font-beVietnamPro text-sm ${
                          cat.slug === slug || String(cat.id) === String(slug)
                            ? "bg-[#1B1C19] text-white"
                            : "border border-[#D1C4B9] text-[#4E453D] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product grid */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
            >
              {loading ? (
                [...Array(12)].map((_, idx) => <ProductSkeleton key={idx} />)
              ) : products.length === 0 ? (
                <div className="col-span-full py-24 text-center">
                  <FiPackage className="mx-auto mb-4 h-14 w-14 text-[#D1C4B9]" />
                  <p className="font-beVietnamPro text-base text-[#9E8E7E]">
                    Chưa có sản phẩm nào
                  </p>
                  <p className="mt-1 font-beVietnamPro text-sm text-[#C5B9AE]">
                    Bộ sưu tập này đang được cập nhật
                  </p>
                </div>
              ) : (
                products.map((p) => <ProductCard key={p.id} product={p} />)
              )}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1.5">
                <button
                  disabled={filters.page === 0}
                  onClick={() => updateFilter("page", filters.page - 1)}
                  className="flex h-9 w-9 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#FAF8F5] disabled:opacity-40"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>

                {[...Array(Math.min(7, totalPages))].map((_, _i) => {
                  const pg =
                    Math.max(0, Math.min(filters.page - 3, totalPages - 7)) +
                    _i;
                  return (
                    <button
                      key={pg}
                      onClick={() => updateFilter("page", pg)}
                      className={`flex h-9 w-9 items-center justify-center border font-beVietnamPro text-sm ${
                        filters.page === pg
                          ? "border-[#1B1C19] bg-[#1B1C19] text-white"
                          : "border-[#D1C4B9] text-[#4E453D] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      {pg + 1}
                    </button>
                  );
                })}

                <button
                  disabled={filters.page >= totalPages - 1}
                  onClick={() => updateFilter("page", filters.page + 1)}
                  className="flex h-9 w-9 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#FAF8F5] disabled:opacity-40"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
