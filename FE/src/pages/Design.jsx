import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import {
  FiSearch as Search,
  FiChevronLeft as ChevronLeft,
  FiChevronRight as ChevronRight,
} from "react-icons/fi";
import { usePublicCategories } from "../hooks/useCategories";
import { usePublicProducts } from "../hooks/useProducts";

export default function Design() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("S");

  const { categories } = usePublicCategories();

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
    { label: "DƯỚI 1.000.000đ", min: 0, max: 1000000 },
    { label: "1.000.000đ - 3.000.000đ", min: 1000000, max: 3000000 },
    { label: "TRÊN 3.000.000đ", min: 3000000, max: null },
  ];

  const sizes = ["XS", "S", "M", "L"];
  const colors = [
    { name: "Trắng", value: "#FFFFFF" },
    { name: "Đen", value: "#000000" },
    { name: "Xám nhạt", value: "#E2E2E2" },
    { name: "Xám trắng", value: "#F3F3F4" },
  ];

  // Cập nhật params và refetch khi filter hoặc phân trang thay đổi
  useEffect(() => {
    const params = {
      ...productParams,
      keyword: searchTerm || undefined,
      categoryId: selectedCategory?.id || undefined,
      minPrice: selectedPrice?.min ?? undefined,
      maxPrice: selectedPrice?.max ?? undefined,
    };
    refetch(params);
  }, [searchTerm, selectedCategory, selectedPrice, productParams, refetch]);

  // Reset về trang 0 khi thay đổi bộ lọc
  useEffect(() => {
    setProductParams((prev) => ({ ...prev, page: 0 }));
  }, [searchTerm, selectedCategory, selectedPrice]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setProductParams((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;

    let cleanPath = imagePath.replace(/^\//, "");
    if (cleanPath.startsWith("api/uploads/")) {
      return `http://localhost:8080/${cleanPath}`;
    }

    return `http://localhost:8080/api/uploads/${cleanPath}`;
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1C1C] font-sans selection:bg-black selection:text-white">
      <TopNav />

      <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-20 lg:py-32 flex flex-col lg:row lg:flex-row gap-16 lg:gap-24">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-64 space-y-12"
        >
          {/* Search */}
          <div className="relative group">
            <input
              type="text"
              placeholder="TÌM KIẾM..."
              className="w-full border-b border-[#CFC4C5] bg-transparent py-3 pr-8 text-base tracking-[0.05em] text-[#5E5E5E] focus:outline-none focus:border-black transition-colors placeholder:text-[#5E5E5E]/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E5E5E] group-focus-within:text-black transition-colors" />
          </div>

          {/* Categories */}
          <section className="space-y-6">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase">
              DANH MỤC
            </h3>
            <div className="space-y-3">
              <motion.p
                whileHover={{ x: 4 }}
                onClick={() => setSelectedCategory(null)}
                className={`text-base cursor-pointer transition-all ${!selectedCategory ? "text-black font-medium" : "text-[#5E5E5E] hover:text-black"}`}
              >
                TẤT CẢ
              </motion.p>
              {categories.map((cat) => (
                <motion.p
                  key={cat.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-base cursor-pointer transition-all ${selectedCategory?.id === cat.id ? "text-black font-medium" : "text-[#5E5E5E] hover:text-black"}`}
                >
                  {cat.name.toUpperCase()}
                </motion.p>
              ))}
            </div>
          </section>

          {/* Price Range */}
          <section className="space-y-6">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase">
              KHOẢNG GIÁ
            </h3>
            <div className="space-y-4">
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
                    className={`w-4 h-4 border border-[#CFC4C5] bg-white transition-all flex items-center justify-center ${selectedPrice?.label === range.label ? "border-black" : "group-hover:border-black"}`}
                  >
                    {selectedPrice?.label === range.label && (
                      <div className="w-2 h-2 bg-black" />
                    )}
                  </div>
                  <span
                    className={`text-base transition-colors ${selectedPrice?.label === range.label ? "text-black font-medium" : "text-[#5E5E5E] group-hover:text-black"}`}
                  >
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Colors */}
          <section className="space-y-6">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase">
              MÀU SẮC
            </h3>
            <div className="flex gap-3">
              {colors.map((color, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-6 h-6 rounded-full border border-[#CFC4C5] cursor-pointer relative ${selectedColor === color.name ? "ring-1 ring-offset-2 ring-black" : ""}`}
                  style={{ backgroundColor: color.value }}
                >
                  {color.value === "#000000" && (
                    <div className="absolute inset-0 rounded-full border border-white/20" />
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Sizes */}
          <section className="space-y-6">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase">
              KÍCH THƯỚC
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[44px] h-8 px-3 border text-xs font-medium transition-all ${selectedSize === size ? "bg-black text-white border-black" : "border-[#CFC4C5] text-[#1A1C1C] hover:border-black"}`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </section>
        </motion.aside>

        {/* Content Area */}
        <div className="flex-1 space-y-24">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-5xl lg:text-6xl font-light tracking-[-0.02em] uppercase">
              THIẾT KẾ
            </h1>
            <div className="w-12 h-0.5 bg-black" />
          </motion.div>

          {/* Featured Categories Grid */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8"
          >
            {categories.slice(0, 4).map((cat, i) => (
              <motion.div
                key={cat.id}
                variants={itemVariants}
                className="group cursor-pointer"
                onClick={() => setSelectedCategory(cat)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#EEE] mb-4">
                  <motion.img
                    src={getImageUrl(cat.imageUrl)}
                    alt={cat.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                </div>
                <h4 className="text-sm font-semibold tracking-[0.3em] uppercase group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h4>
              </motion.div>
            ))}
          </motion.section>

          {/* Product List Section */}
          <section className="space-y-12 border-t border-[#CFC4C5] pt-16">
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-medium tracking-[0.2em] uppercase">
                {selectedCategory
                  ? `SẢN PHẨM ${selectedCategory.name.toUpperCase()}`
                  : "TẤT CẢ SẢN PHẨM"}
              </h2>
              <span className="text-xs text-[#5E5E5E] font-medium tracking-[0.1em]">
                {productsLoading
                  ? "ĐANG TẢI..."
                  : `HIỂN THỊ ${totalElements} SẢN PHẨM`}
              </span>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="aspect-[3/4] bg-[#EEE]" />
                    <div className="h-4 bg-[#EEE] w-2/3" />
                    <div className="h-4 bg-[#EEE] w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16"
              >
                {products.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <Link
                      to={`/product/${product.id}`}
                      className="group block space-y-4"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-[#EEE] relative">
                        <img
                          src={getImageUrl(
                            product.thumbnailUrl || product.imageUrls?.[0],
                          )}
                          alt={product.name}
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />

                        {/* Quick View Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[2px] transition-all"
                        >
                          <button className="bg-white px-8 py-3 text-sm tracking-[0.1em] hover:bg-black hover:text-white transition-colors">
                            XEM NHANH
                          </button>
                        </motion.div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-medium tracking-[0.05em] uppercase">
                          {product.name}
                        </h3>
                        <p className="text-base text-[#5E5E5E]">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-20 text-center text-[#5E5E5E] tracking-widest">
                KHÔNG TÌM THẤY SẢN PHẨM PHÙ HỢP
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 pt-12">
                <button
                  onClick={() => handlePageChange(productParams.page - 1)}
                  disabled={productParams.page === 0}
                  className={`p-2 transition-colors ${productParams.page === 0 ? "text-gray-300" : "text-[#5E5E5E] hover:text-black"}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-6 text-sm">
                  {[...Array(totalPages)].map((_, i) => (
                    <span
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`cursor-pointer w-8 h-8 flex items-center justify-center transition-all ${
                        productParams.page === i
                          ? "bg-black text-white"
                          : "text-[#5E5E5E] hover:text-black"
                      }`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(productParams.page + 1)}
                  disabled={productParams.page === totalPages - 1}
                  className={`p-2 transition-colors ${productParams.page === totalPages - 1 ? "text-gray-300" : "text-[#5E5E5E] hover:text-black"}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="border-t border-[#CFC4C5] py-24 bg-white"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col lg:row lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="space-y-3">
            <h3 className="text-xl font-medium tracking-[0.2em] uppercase">
              NHẬN TIN MỚI
            </h3>
            <p className="text-sm text-[#5E5E5E] max-w-md">
              Đăng ký để nhận thông tin về các bộ sưu tập mới nhất và ưu đãi độc
              quyền.
            </p>
          </div>
          <form
            onSubmit={handleNewsletterSubmit}
            className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 flex-1 lg:max-w-xl lg:justify-end"
          >
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="ĐỊA CHỈ EMAIL"
                className="w-full border-b border-[#CFC4C5] py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-[#5E5E5E]/60 uppercase tracking-widest"
              />
            </div>
            <button className="bg-black text-white px-12 py-3 text-sm tracking-[0.1em] font-medium hover:bg-black/80 transition-all uppercase">
              ĐĂNG KÝ
            </button>
          </form>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
