import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX
} from "react-icons/fi";
import { usePublicCategories } from "../hooks/useCategories";
import { usePublicProducts } from "../hooks/useProducts";
import { usePublicBrands } from "../hooks/useBrands";
import BannerImage from "../assets/high_end_luxury_fashion_brand_banner.png";

export default function Design() {
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("S");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { categories } = usePublicCategories();
  const { brands } = usePublicBrands();

  const [productParams, setProductParams] = useState({
    page: 0,
    size: 12,
    sortBy: "createdAt_desc",
  });

  const {
    products,
    totalPages,
    totalElements,
    loading: productsLoading,
    refetch,
  } = usePublicProducts(productParams);

  const priceRanges = [
    { label: "Dưới 1.000.000₫", min: 0, max: 1000000 },
    { label: "1.000.000₫ - 3.000.000₫", min: 1000000, max: 3000000 },
    { label: "Trên 3.000.000₫", min: 3000000, max: null },
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { name: "Trắng", value: "#FFFFFF" },
    { name: "Đen", value: "#000000" },
    { name: "Be", value: "#F5F5DC" },
    { name: "Nâu", value: "#8B4513" },
    { name: "Đỏ đậm", value: "#8B0000" },
  ];

  // Listen for URL search param changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchTerm(q);
  }, [searchParams]);

  useEffect(() => {
    const params = {
      ...productParams,
      keyword: searchTerm || undefined,
      categoryId: selectedCategory?.id || undefined,
      brandId: selectedBrand?.id || undefined,
      minPrice: selectedPrice?.min ?? undefined,
      maxPrice: selectedPrice?.max ?? undefined,
    };
    refetch(params);
  }, [searchTerm, selectedCategory, selectedBrand, selectedPrice, productParams, refetch]);

  useEffect(() => {
    setProductParams((prev) => ({ ...prev, page: 0 }));
  }, [searchTerm, selectedCategory, selectedBrand, selectedPrice]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setProductParams((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x600?text=ZYRO";
    if (imagePath.startsWith("http")) return imagePath;
    let cleanPath = imagePath.replace(/^\//, "");
    if (cleanPath.startsWith("api/uploads/")) {
      return `http://localhost:8080/${cleanPath}`;
    }
    return `http://localhost:8080/api/uploads/${cleanPath}`;
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/400x600?text=ZYRO";
  };

  // =====================
  // SIDEBAR COMPONENT
  // =====================
  const SidebarContent = () => (
    <div className="space-y-12">
      {/* Search */}
      <div className="relative group">
        <input
          type="text"
          placeholder="Tìm kiếm thiết kế..."
          className="w-full border-b border-[#DDC0B8] dark:border-gray-800 bg-transparent py-3 pr-8 text-sm outline-none transition-colors placeholder:text-[#9A8C80] dark:text-gray-500 focus:border-[#BB5734] text-[#231916] dark:text-gray-100 font-beVietnamPro"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8C80] dark:text-gray-500 group-focus-within:text-[#BB5734] transition-colors" />
      </div>

      {/* Categories */}
      <section className="space-y-5">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-[#695D4B] dark:text-gray-400 uppercase">
          Danh Mục
        </h3>
        <div className="space-y-3 font-beVietnamPro text-sm">
          <p
            onClick={() => setSelectedCategory(null)}
            className={`cursor-pointer transition-colors ${!selectedCategory ? "text-[#BB5734] font-semibold" : "text-[#4A4A4A] dark:text-gray-300 hover:text-[#BB5734]"}`}
          >
            Tất cả thiết kế
          </p>
          {categories.map((cat) => (
            <p
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer transition-colors ${selectedCategory?.id === cat.id ? "text-[#BB5734] font-semibold" : "text-[#4A4A4A] dark:text-gray-300 hover:text-[#BB5734]"}`}
            >
              {cat.name}
            </p>
          ))}
        </div>
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="space-y-5">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-[#695D4B] dark:text-gray-400 uppercase">
            Thương Hiệu
          </h3>
          <div className="space-y-3 font-beVietnamPro text-sm">
            <p
              onClick={() => setSelectedBrand(null)}
              className={`cursor-pointer transition-colors ${!selectedBrand ? "text-[#BB5734] font-semibold" : "text-[#4A4A4A] dark:text-gray-300 hover:text-[#BB5734]"}`}
            >
              Tất cả thương hiệu
            </p>
            {brands.map((brand) => (
              <p
                key={brand.id}
                onClick={() => setSelectedBrand(selectedBrand?.id === brand.id ? null : brand)}
                className={`cursor-pointer transition-colors ${selectedBrand?.id === brand.id ? "text-[#BB5734] font-semibold" : "text-[#4A4A4A] dark:text-gray-300 hover:text-[#BB5734]"}`}
              >
                {brand.name}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Price Range */}
      <section className="space-y-5">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-[#695D4B] dark:text-gray-400 uppercase">
          Mức Giá
        </h3>
        <div className="space-y-3 font-beVietnamPro text-sm">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                onClick={() =>
                  setSelectedPrice(
                    range.label === selectedPrice?.label ? null : range,
                  )
                }
                className={`w-4 h-4 border transition-all flex items-center justify-center rounded-sm ${selectedPrice?.label === range.label ? "border-[#BB5734] bg-[#BB5734]" : "border-[#DDC0B8] dark:border-gray-800 bg-transparent group-hover:border-[#BB5734]"}`}
              >
                {selectedPrice?.label === range.label && (
                  <FiChevronRight className="w-3 h-3 text-white" />
                )}
              </div>
              <span
                className={`transition-colors ${selectedPrice?.label === range.label ? "text-[#231916] dark:text-gray-100 font-medium" : "text-[#4A4A4A] dark:text-gray-300 group-hover:text-[#BB5734]"}`}
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-5">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-[#695D4B] dark:text-gray-400 uppercase">
          Màu Sắc
        </h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color, i) => (
            <button
              key={i}
              onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
              className={`w-7 h-7 rounded-full border border-[#DDC0B8] dark:border-gray-800 cursor-pointer relative shadow-sm transition-all ${selectedColor === color.name ? "ring-2 ring-offset-2 ring-[#BB5734] scale-110" : "hover:scale-110"}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-5">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-[#695D4B] dark:text-gray-400 uppercase">
          Kích Thước
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(selectedSize === size ? null : size)}
              className={`min-w-[40px] h-10 px-2 border text-xs font-medium transition-all ${selectedSize === size ? "bg-[#231916] text-white border-[#231916]" : "border-[#DDC0B8] dark:border-gray-800 text-[#4A4A4A] dark:text-gray-300 hover:border-[#BB5734] hover:text-[#BB5734] bg-white"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-gray-950 text-[#231916] dark:text-gray-100">
      <TopNav />

      <main>
        {/* Hero Banner Section */}
        <section className="relative h-[25vh] md:h-[35vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[#231916]">
            <img 
              src={BannerImage} 
              alt="Thiết kế ZYRO" 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
          <div className="relative z-10 text-center px-4">
            <Reveal duration={0.8}>
              <p className="text-sm uppercase tracking-[0.45em] text-amber-200/90 mb-4">
                Bộ sưu tập
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-wide">
                Các Thiết Kế Nổi Bật
              </h1>
            </Reveal>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-8 pb-4 border-b border-[#DDC0B8] dark:border-gray-800">
            <span className="font-serif text-xl">
              {selectedBrand?.name || selectedCategory?.name || "Tất cả thiết kế"}
            </span>
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[#695D4B] dark:text-gray-400 border border-[#DDC0B8] dark:border-gray-800 px-4 py-2 rounded-full"
            >
              <FiFilter /> Lọc
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-fit">
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
              {/* Header Info */}
              <div className="hidden lg:flex items-end justify-between mb-10 pb-6 border-b border-[#DDC0B8] dark:border-gray-800">
                <h2 className="text-3xl font-serif tracking-wide text-[#231916] dark:text-gray-100">
                  {selectedBrand?.name || selectedCategory?.name || "Tất cả thiết kế"}
                </h2>
                <span className="text-sm font-medium tracking-[0.1em] text-[#695D4B] dark:text-gray-400 uppercase">
                  {productsLoading ? "Đang tải..." : `${totalElements} Sản phẩm`}
                </span>
              </div>

              {/* Product Grid */}
              {productsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse space-y-4">
                      <div className="aspect-[3/4] bg-[#EAE2D4] dark:bg-gray-900 rounded-sm" />
                      <div className="h-4 bg-[#EAE2D4] dark:bg-gray-900 w-2/3 rounded" />
                      <div className="h-4 bg-[#EAE2D4] dark:bg-gray-900 w-1/3 rounded" />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                  {products.map((product, index) => (
                    <Reveal key={product.id} delay={index * 0.05} direction="up">
                      <Link
                        to={`/product/${product.id}`}
                        className="group block"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-[#F4EFEA] dark:bg-gray-800 mb-4 relative rounded-sm">
                          <img
                            src={getImageUrl(product.thumbnailUrl || product.imageUrls?.[0])}
                            alt={product.name}
                            onError={handleImageError}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white/90 backdrop-blur-sm text-[#231916] dark:text-gray-100 text-xs font-semibold uppercase tracking-widest py-3 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                              Xem chi tiết
                            </span>
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          {product.brandName && (
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A8C80] dark:text-gray-500">
                              {product.brandName}
                            </p>
                          )}
                          <h3 className="text-sm font-semibold tracking-wider uppercase text-[#231916] dark:text-gray-100 group-hover:text-[#BB5734] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm font-medium text-[#695D4B] dark:text-gray-400">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <p className="text-[#695D4B] dark:text-gray-400 text-lg font-serif">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory(null);
                      setSelectedBrand(null);
                      setSelectedPrice(null);
                      setSelectedColor(null);
                      setSelectedSize(null);
                    }}
                    className="mt-6 inline-flex items-center justify-center border border-[#BB5734] text-[#BB5734] hover:bg-[#BB5734] hover:text-white transition-colors px-6 py-2.5 text-sm uppercase tracking-widest font-semibold"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}

              {/* Pagination & View All */}
              {totalPages > 0 && (
                <div className="flex flex-col items-center justify-center gap-6 mt-20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(productParams.page - 1)}
                      disabled={productParams.page === 0}
                      className={`w-10 h-10 flex items-center justify-center border transition-all ${productParams.page === 0 ? "border-[#DDC0B8] dark:border-gray-800 text-[#DDC0B8] cursor-not-allowed" : "border-[#DDC0B8] dark:border-gray-800 text-[#4A4A4A] dark:text-gray-300 hover:border-[#BB5734] hover:text-[#BB5734]"}`}
                    >
                      <FiChevronLeft />
                    </button>
                    <div className="flex gap-2">
                      {[...Array(Math.min(5, Math.max(1, totalPages)))].map((_, i) => {
                        const pg = Math.max(0, Math.min(productParams.page - 2, Math.max(1, totalPages) - 5)) + i
                        return (
                          <button
                            key={pg}
                            onClick={() => handlePageChange(pg)}
                            className={`w-10 h-10 flex items-center justify-center text-sm font-medium transition-all ${
                              productParams.page === pg
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
                      onClick={() => handlePageChange(productParams.page + 1)}
                      disabled={productParams.page >= totalPages - 1}
                      className={`w-10 h-10 flex items-center justify-center border transition-all ${productParams.page >= totalPages - 1 ? "border-[#DDC0B8] dark:border-gray-800 text-[#DDC0B8] cursor-not-allowed" : "border-[#DDC0B8] dark:border-gray-800 text-[#4A4A4A] dark:text-gray-300 hover:border-[#BB5734] hover:text-[#BB5734]"}`}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                  
                  {/* Xem tất cả button */}
                  <button 
                    onClick={() => {
                      setProductParams({ ...productParams, page: 0, size: 1000 });
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="text-sm font-semibold tracking-widest uppercase text-[#231916] dark:text-gray-100 border-b border-[#231916] pb-1 hover:text-[#BB5734] hover:border-[#BB5734] transition-colors"
                  >
                    Xem tất cả thiết kế
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
