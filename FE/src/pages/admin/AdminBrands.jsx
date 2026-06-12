import { useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiRefreshCw,
  FiTag,
  FiImage,
  FiPackage,
} from "react-icons/fi";

import toast from "react-hot-toast";
import { useAdminBrands } from "../../hooks/useBrands";
import brandService from "../../services/brandService";
import BrandFormModal from "../../components/admin/brands/BrandFormModal";
import DeleteBrandModal from "../../components/admin/brands/DeleteBrandModal";

function getImageUrl(imagePath) {
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

  // folder: BE/uploads -> /api/uploads/{name}
  return `http://localhost:8080/api/uploads/${cleanPath}`;
}

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {active ? "Đang hiển thị" : "Đang ẩn"}
    </span>
  );
}

export default function AdminBrands() {
  const navigate = useNavigate();
  const { brands, loading, refresh } = useAdminBrands();

  const [keyword, setKeyword] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toggling, setToggling] = useState(null);

  const filtered = useMemo(() => {
    const k = keyword.toLowerCase().trim();
    if (!k) return brands;
    return brands.filter((b) => {
      return (
        (b.name || "").toLowerCase().includes(k) ||
        (b.slug || "").toLowerCase().includes(k)
      );
    });
  }, [brands, keyword]);

  const activeCount = useMemo(
    () => brands.filter((b) => Boolean(b.isActive)).length,
    [brands],
  );

  const openCreate = () => {
    setEditBrand(null);
    setFormOpen(true);
  };

  const openEdit = (b) => {
    setEditBrand(b);
    setFormOpen(true);
  };

  const openDelete = (b) => {
    setDeleteTarget(b);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await brandService.delete(deleteTarget.id);
      toast.success("Đã xoá thương hiệu");
      setDeleteOpen(false);
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Xoá thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewProducts = (brandId) => {
    navigate(`/admin/products?brandId=${brandId}`);
  };

  const handleToggleActive = async (b) => {
    setToggling(b.id);
    try {
      await brandService.update(b.id, {
        ...b,
        isActive: !b.isActive,
      });
      toast.success(b.isActive ? "Đã ẩn thương hiệu" : "Đã hiện thương hiệu");
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    } finally {
      setToggling(null);
    }
  };

  const total = brands.length;
  const percentActive = total ? Math.round((activeCount / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FBF9F4] px-8 pb-16 pt-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_50px_rgba(27,28,25,0.05)] lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9E8E7E]">
              Admin • Thương hiệu
            </p>
            <h1 className="font-beVietnamPro text-3xl font-semibold text-[#1B1C19]">
              Quản lý thương hiệu
            </h1>
            <p className="mt-2 max-w-2xl font-beVietnamPro text-sm leading-6 text-[#6F583D]">
              Tạo mới, cập nhật, ẩn/hiện và xoá thương hiệu trực tiếp từ
              backend.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-3 font-beVietnamPro text-sm font-medium text-[#4E453D] transition-colors hover:bg-[#F6F2EC]"
            >
              <FiRefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1B1C19] px-5 py-3 font-beVietnamPro text-sm font-semibold text-white transition-colors hover:bg-[#2d2d28]"
            >
              <FiPlus className="h-4 w-4" />
              Thêm thương hiệu
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Tổng thương hiệu",
              value: total,
              note: "Tổng số thương hiệu trong hệ thống",
            },
            {
              label: "Đang hiển thị",
              value: activeCount,
              note: "Theo trạng thái isActive",
            },
            {
              label: "Tỷ lệ hiển thị",
              value: `${percentActive}%`,
              note: "Phần trăm thương hiệu active",
            },
            {
              label: "Kết quả lọc",
              value: filtered.length,
              note: "Khớp theo tên hoặc slug",
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
                <FiTag className="h-5 w-5 text-[#D1C4B9]" />
              </div>
              <p className="mt-2 text-xs leading-5 text-[#6F583D]">
                {item.note}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_50px_rgba(27,28,25,0.05)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E8E7E]">
                <FiSearch className="h-3.5 w-3.5" />
                Tìm kiếm
              </div>
              <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(1,minmax(0,1fr))]">
                <div className="flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-3">
                  <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm theo tên hoặc slug..."
                    className="w-full bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[#D1C4B9] bg-white px-4 py-3">
                  <FiImage className="h-4 w-4 text-[#9E8E7E]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9E8E7E]">
                    Hiển thị
                  </span>
                  <span className="ml-auto inline-flex items-center rounded-full bg-[#F5F3EE] px-3 py-1 font-beVietnamPro text-xs font-semibold text-[#6F583D]">
                    {filtered.length}/{total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_18px_50px_rgba(27,28,25,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F5F3EE]">
                  {[
                    "HÌNH",
                    "TÊN THƯƠNG HIỆU",
                    "SLUG",
                    "TRẠNG THÁI",
                    "THAO TÁC",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6F583D]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-[#F0EEE9]">
                        {[...Array(5)].map((__, j) => (
                          <td key={j} className="px-5 py-5">
                            <div className="h-4 w-full animate-pulse rounded bg-[#F0EEE9]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F3EE]">
                            <FiImage className="h-5 w-5 text-[#D1C4B9]" />
                          </div>
                          <p className="font-beVietnamPro text-sm text-[#9E8E7E]">
                            Không tìm thấy thương hiệu
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((b) => {
                      const logo = b.logoUrl || b.logoURL || b.imageUrl || "";
                      return (
                        <motion.tr
                          key={b.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-[#F0EEE9] transition-colors hover:bg-[#FAF9F6]"
                        >
                          <td className="px-5 py-5">
                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-[#E8E0D8] bg-[#F5F3EE]">
                              {logo ? (
                                <img
                                  src={getImageUrl(logo)}
                                  alt={b.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : null}
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                              {b.name}
                            </p>
                            {b.description && (
                              <p className="mt-1 text-xs text-[#6F583D] line-clamp-2">
                                {b.description}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-beVietnamPro text-sm font-medium text-[#4E453D]">
                              {b.slug || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <StatusBadge active={Boolean(b.isActive)} />
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleActive(b)}
                                disabled={toggling === b.id}
                                title={
                                  b.isActive
                                    ? "Ẩn thương hiệu"
                                    : "Hiện thương hiệu"
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6F583D] transition-colors hover:bg-[#F0EEE9] disabled:opacity-50"
                              >
                                {toggling === b.id ? (
                                  <span className="h-4 w-4 rounded-full border-2 border-[#9E8E7E] border-t-[#6F583D] animate-spin" />
                                ) : b.isActive ? (
                                  <FiEyeOff className="h-4 w-4" />
                                ) : (
                                  <FiEye className="h-4 w-4" />
                                )}
                              </button>

                              <button
                                onClick={() => handleViewProducts(b.id)}
                                title="Xem sản phẩm của thương hiệu"
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6F583D] transition-colors hover:bg-[#F0EEE9] hover:text-[#1B1C19]"
                              >
                                <FiPackage className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => openEdit(b)}
                                title="Chỉnh sửa"
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6F583D] transition-colors hover:bg-[#F0EEE9] hover:text-[#1B1C19]"
                              >
                                <span className="text-base">✎</span>
                              </button>

                              <button
                                onClick={() => openDelete(b)}
                                title="Xoá"
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BrandFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        brand={editBrand}
        onSaved={refresh}
      />

      <DeleteBrandModal
        open={deleteOpen}
        brand={deleteTarget}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
