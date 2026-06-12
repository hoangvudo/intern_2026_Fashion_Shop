import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiStar,
} from "react-icons/fi";
import { useAdminProducts } from "../../hooks/useProducts";
import ProductFormModal from "../../components/admin/products/ProductFormModal";
import DeleteConfirmModal from "../../components/admin/products/DeleteConfirmModal";
import productService from "../../services/productService";
import toast from "react-hot-toast";

const formatMoney = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (
    /^(https?:)?\/\//.test(imagePath) ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  let cleanPath = imagePath.replace(/^\//, "");
  if (cleanPath.startsWith("api/uploads/")) {
    return `http://localhost:8080/${cleanPath}`;
  }

  if (cleanPath.startsWith("uploads/")) {
    cleanPath = cleanPath.replace(/^uploads\//, "");
  }

  return `http://localhost:8080/api/uploads/${cleanPath}`;
};

const getProductImage = (p) =>
  p?.thumbnailUrl ||
  p?.imageUrl2 ||
  p?.imageUrls?.[0] ||
  p?.images?.[0]?.imageUrl ||
  "";

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages = new Set([
    0,
    totalPages - 1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const sorted = [...pages]
    .filter((p) => p >= 0 && p < totalPages)
    .sort((a, b) => a - b);

  const result = [];
  sorted.forEach((page, index) => {
    const prev = sorted[index - 1];
    if (index > 0 && page - prev > 1) {
      result.push(`ellipsis-${page}`);
    }
    result.push(page);
  });

  return result;
};

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {active ? "Đang bán" : "Đã ẩn"}
    </span>
  );
}

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
        Hết hàng
      </span>
    );
  }
  if (stock < 10) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        Sắp hết ({stock})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {stock}
    </span>
  );
}

function ProductFlags({ product }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.isFeatured && (
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
          Nổi bật
        </span>
      )}
      {product.isNewArrival && (
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700">
          Mới
        </span>
      )}
      {product.imageUrl2 && (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          Có ảnh phụ
        </span>
      )}
    </div>
  );
}

export default function AdminProducts() {
  const { products, total, totalPages, loading, filters, updateFilter, refresh } =
    useAdminProducts();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [keyword, setKeyword] = useState(filters.keyword ?? "");

  useEffect(() => {
    setKeyword(filters.keyword ?? "");
  }, [filters.keyword]);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {});
    productService.getBrands().then(setBrands).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const openDelete = (product) => {
    setDeleteTarget(product);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.delete(deleteTarget.id);
      toast.success("Đã xoá sản phẩm");
      setDeleteOpen(false);
      refresh();
    } catch {
      toast.error("Xoá thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (product) => {
    setToggling(product.id);
    try {
      await productService.toggleActive(product.id);
      toast.success(product.isActive ? "Đã ẩn sản phẩm" : "Đã hiện sản phẩm");
      refresh();
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setToggling(null);
    }
  };

  const summary = useMemo(() => {
    const active = products.filter((p) => p.isActive).length;
    const featured = products.filter((p) => p.isFeatured).length;
    const lowStock = products.filter((p) => (p.totalStock ?? 0) < 10).length;
    const avgPrice =
      products.length > 0
        ? products.reduce((sum, p) => sum + Number(p.salePrice ?? p.price ?? 0), 0) /
          products.length
        : 0;

    return { active, featured, lowStock, avgPrice };
  }, [products]);

  const visiblePages = getVisiblePages(filters.page, totalPages);

  const handleSearch = () => {
    updateFilter("keyword", keyword.trim());
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] px-8 pb-12 pt-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_50px_rgba(27,28,25,0.05)] lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9E8E7E]">
              Admin • Sản phẩm
            </p>
            <h1 className="font-beVietnamPro text-3xl font-semibold text-[#1B1C19]">
              Quản lý sản phẩm
            </h1>
            <p className="mt-2 max-w-2xl font-beVietnamPro text-sm leading-6 text-[#6F583D]">
              Quản lý danh mục hàng hóa, biến thể, ảnh đại diện, tồn kho và trạng thái bán trực tiếp từ
              dữ liệu backend.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-3 font-beVietnamPro text-sm font-medium text-[#4E453D] transition-colors hover:bg-[#F6F2EC]"
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1B1C19] px-5 py-3 font-beVietnamPro text-sm font-semibold text-white transition-colors hover:bg-[#2d2d28]"
            >
              <FiPlus className="h-4 w-4" />
              Thêm sản phẩm
            </button>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Tổng sản phẩm",
              value: total,
              note: `Đang hiển thị ${products.length} mục trên trang này`,
            },
            {
              label: "Đang bán",
              value: summary.active,
              note: "Theo trạng thái sản phẩm hiện tại",
            },
            {
              label: "Nổi bật",
              value: summary.featured,
              note: "Có bật cờ featured",
            },
            {
              label: "Sắp hết hàng",
              value: summary.lowStock,
              note: "Tồn kho dưới 10",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_30px_rgba(27,28,25,0.04)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8E7E]">
                {item.label}
              </p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="font-beVietnamPro text-3xl font-semibold text-[#1B1C19]">
                  {item.value}
                </p>
                <FiPackage className="h-5 w-5 text-[#D1C4B9]" />
              </div>
              <p className="mt-2 text-xs leading-5 text-[#6F583D]">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(27,28,25,0.05)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8E7E]">
                <FiFilter className="h-3.5 w-3.5" />
                Bộ lọc
              </div>
              <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
                <div className="flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-3">
                  <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Tìm theo tên, slug, SKU..."
                    className="w-full bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
                  />
                </div>

                <select
                  value={filters.categoryId}
                  onChange={(e) => updateFilter("categoryId", e.target.value)}
                  className="rounded-xl border border-[#D1C4B9] bg-white px-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] outline-none"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.brandId}
                  onChange={(e) => updateFilter("brandId", e.target.value)}
                  className="rounded-xl border border-[#D1C4B9] bg-white px-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] outline-none"
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.isActive}
                  onChange={(e) => updateFilter("isActive", e.target.value)}
                  className="rounded-xl border border-[#D1C4B9] bg-white px-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] outline-none"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="true">Đang bán</option>
                  <option value="false">Đã ẩn</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                  className="rounded-xl border border-[#D1C4B9] bg-white px-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] outline-none"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="name">Tên A-Z</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="popular">Bán chạy</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-[#F0EEE9] bg-[#FBF9F4] px-4 py-3 sm:grid-cols-3 xl:min-w-[420px]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9E8E7E]">
                  Hiển thị
                </p>
                <p className="mt-1 font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                  {products.length} / {total}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9E8E7E]">
                  Giá TB
                </p>
                <p className="mt-1 font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                  {formatMoney(summary.avgPrice)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9E8E7E]">
                  Tốc độ bán
                </p>
                <p className="mt-1 font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                  {products.reduce((sum, p) => sum + (p.soldCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_18px_50px_rgba(27,28,25,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1280px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F5F3EE]">
                  {[
                    "Sản phẩm",
                    "Danh mục",
                    "Giá",
                    "Tồn kho",
                    "Hiệu suất",
                    "Trạng thái",
                    "Thao tác",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F583D]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {loading ? (
                    [...Array(6)].map((_, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-[#F0EEE9]">
                        {[...Array(7)].map((__, colIndex) => (
                          <td key={colIndex} className="px-5 py-5">
                            <div className="h-4 w-full animate-pulse rounded bg-[#F0EEE9]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <FiPackage className="mx-auto mb-3 h-10 w-10 text-[#D1C4B9]" />
                        <p className="font-beVietnamPro text-sm text-[#9E8E7E]">
                          Không tìm thấy sản phẩm nào
                        </p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-[#F0EEE9] transition-colors hover:bg-[#FAF9F6]"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-start gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#E8E0D8] bg-[#F5F3EE]">
                              {getProductImage(product) ? (
                                <img
                                  src={getImageUrl(getProductImage(product))}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FiPackage className="mx-auto mt-4 h-8 w-8 text-[#D1C4B9]" />
                              )}
                              {product.imageUrl2 && (
                                <span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                                  +1
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                                  {product.name}
                                </p>
                                <ProductFlags product={product} />
                              </div>
                              <p className="mt-1 truncate text-xs text-[#9E8E7E]">
                                {product.slug || "Chưa có slug"}
                              </p>
                              <p className="mt-1 text-xs text-[#6F583D]">
                                ID #{product.id} • {product.imageUrl2 ? "2 ảnh" : "1 ảnh"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                            {product.categoryName || "—"}
                          </p>
                          {product.brandName && (
                            <p className="mt-1 text-xs text-[#9E8E7E]">{product.brandName}</p>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          {product.salePrice ? (
                            <div>
                              <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                                {formatMoney(product.salePrice)}
                              </p>
                              <p className="mt-1 text-xs text-[#9E8E7E] line-through">
                                {formatMoney(product.price)}
                              </p>
                            </div>
                          ) : (
                            <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                              {formatMoney(product.price)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <StockBadge stock={product.totalStock ?? 0} />
                          <p className="mt-2 text-xs text-[#9E8E7E]">
                            {product.variants?.length || 0} biến thể
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <FiStar className="h-4 w-4 text-amber-400" />
                              <span className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                                {(product.avgRating ?? 0).toFixed(1)}
                              </span>
                              <span className="text-xs text-[#9E8E7E]">
                                ({product.reviewCount ?? 0} đánh giá)
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-[#6F583D]">
                              <span className="rounded-full bg-[#F5F3EE] px-2.5 py-1">
                                Đã bán {product.soldCount ?? 0}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge active={product.isActive} />
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleActive(product)}
                              disabled={toggling === product.id}
                              title={product.isActive ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6F583D] transition-colors hover:bg-[#F0EEE9] disabled:opacity-50"
                            >
                              {toggling === product.id ? (
                                <span className="h-4 w-4 rounded-full border-2 border-[#9E8E7E] border-t-[#6F583D] animate-spin" />
                              ) : product.isActive ? (
                                <FiEyeOff className="h-4 w-4" />
                              ) : (
                                <FiEye className="h-4 w-4" />
                              )}
                            </button>

                            <button
                              onClick={() => openEdit(product)}
                              title="Chỉnh sửa"
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6F583D] transition-colors hover:bg-[#F0EEE9] hover:text-[#1B1C19]"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => openDelete(product)}
                              title="Xoá"
                              className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-[#FBF9F4] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="font-beVietnamPro text-sm text-[#6F583D]">
                Trang {filters.page + 1} / {totalPages} • {total} sản phẩm
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={filters.page === 0}
                  onClick={() => updateFilter("page", filters.page - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1C4B9] text-[#4E453D] transition-colors hover:bg-[#F0EEE9] disabled:opacity-40"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>

                {visiblePages.map((page) =>
                  typeof page === "string" ? (
                    <span
                      key={page}
                      className="flex h-10 min-w-10 items-center justify-center px-3 text-sm text-[#9E8E7E]"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => updateFilter("page", page)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition-colors ${
                        filters.page === page
                          ? "border-[#1B1C19] bg-[#1B1C19] text-white"
                          : "border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9]"
                      }`}
                    >
                      {page + 1}
                    </button>
                  ),
                )}

                <button
                  disabled={filters.page >= totalPages - 1}
                  onClick={() => updateFilter("page", filters.page + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1C4B9] text-[#4E453D] transition-colors hover:bg-[#F0EEE9] disabled:opacity-40"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editProduct}
        categories={categories}
        brands={brands}
        onSaved={refresh}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        product={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </div>
  );
}
