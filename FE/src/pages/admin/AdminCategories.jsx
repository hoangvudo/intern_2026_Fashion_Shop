import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPlus, FiPackage, FiFilter } from "react-icons/fi";

import { useAdminCategories } from "../../hooks/useCategories";
import categoryService from "../../services/categoryService";
import CategoryFormModal from "../../components/admin/categories/CategoryFormModal";
import DeleteCategoryModal from "../../components/admin/categories/DeleteCategoryModal";
import toast from "react-hot-toast";

function StatusPill({ isActive }) {
  const active = Boolean(isActive);
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

function getCategoryImageUrl(c) {
  if (!c?.imageUrl) return "";

  // Nếu imageUrl là URL full thì dùng luôn.
  if (
    /^(https?:)?\/\//.test(c.imageUrl) ||
    c.imageUrl.startsWith("data:") ||
    c.imageUrl.startsWith("blob:")
  ) {
    return c.imageUrl;
  }

  // Backend có thể trả về path dạng /api/uploads/... hoặc uploads/... hoặc plain uploads/...
  const imagePath = c.imageUrl.replace(/^\//, "");
  if (imagePath.startsWith("api/uploads/")) {
    return `http://localhost:8080/${imagePath}`;
  }
  if (imagePath.startsWith("uploads/")) {
    return `http://localhost:8080/api/uploads/${imagePath.replace(/^uploads\//, "")}`;
  }
  return `http://localhost:8080/api/uploads/${imagePath}`;
}

export default function AdminCategories() {
  const { categories, loading, refresh } = useAdminCategories();

  const [keyword, setKeyword] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(null);

  const filtered = useMemo(() => {
    const k = keyword.toLowerCase().trim();
    if (!k) return categories;
    return categories.filter((c) => c.name?.toLowerCase().includes(k));
  }, [categories, keyword]);

  const activeCount = useMemo(
    () => categories.filter((c) => c.isActive).length,
    [categories],
  );

  const openCreate = () => {
    setEditCategory(null);
    setFormOpen(true);
  };

  const openEdit = (c) => {
    setEditCategory(c);
    setFormOpen(true);
  };

  const openDelete = (c) => {
    setDeleteTarget(c);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoryService.delete(deleteTarget.id);
      toast.success("Đã xoá danh mục");
      setDeleteOpen(false);
      refresh();
    } catch {
      toast.error("Xoá thất bại — danh mục có thể đang có sản phẩm");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (c) => {
    setToggling(c.id);
    try {
      await categoryService.toggleActive(c.id);
      toast.success(c.isActive ? "Đã ẩn danh mục" : "Đã hiện danh mục");
      refresh();
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setToggling(null);
    }
  };

  const total = categories.length;
  const percentActive = total ? Math.round((activeCount / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FBF9F4] px-8 pb-12 pt-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_50px_rgba(27,28,25,0.05)] lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9E8E7E]">
              Admin • Danh mục
            </p>
            <h1 className="font-beVietnamPro text-3xl font-semibold text-[#1B1C19]">
              Quản lý danh mục
            </h1>
            <p className="mt-2 max-w-2xl font-beVietnamPro text-sm leading-6 text-[#6F583D]">
              Quản lý danh mục: tạo mới, cập nhật, ẩn/hiện và xoá trực tiếp từ
              dữ liệu backend.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-3 font-beVietnamPro text-sm font-medium text-[#4E453D] transition-colors hover:bg-[#F6F2EC]"
            >
              <span className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1B1C19] px-5 py-3 font-beVietnamPro text-sm font-semibold text-white transition-colors hover:bg-[#2d2d28]"
            >
              <FiPlus className="h-4 w-4" />
              Thêm danh mục
            </button>
          </div>
        </motion.div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Tổng danh mục",
              value: total,
              note: `Đang có ${total} danh mục trong hệ thống`,
            },
            {
              label: "Đang hiển thị",
              value: activeCount,
              note: "Theo trạng thái active",
            },
            {
              label: "Tỷ lệ hiển thị",
              value: `${percentActive}%`,
              note: "Tính theo danh mục active",
            },
            {
              label: "Lọc hiện tại",
              value: filtered.length,
              note: "Số danh mục khớp từ khoá",
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
                <FiFilter className="h-3.5 w-3.5" />
                Bộ lọc
              </div>

              <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(1,minmax(0,1fr))]">
                <div className="flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-3">
                  <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm theo tên danh mục..."
                    className="w-full bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-3">
                  <span className="font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#9E8E7E]">
                    Trạng thái
                  </span>
                  <span className="ml-auto inline-flex items-center rounded-full bg-[#F5F3EE] px-3 py-1 font-beVietnamPro text-xs font-semibold text-[#6F583D]">
                    {activeCount}/{total} active
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-[#F0EEE9] bg-[#FBF9F4] px-4 py-3 sm:grid-cols-2 xl:min-w-[420px]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9E8E7E]">
                  Hiển thị
                </p>
                <p className="mt-1 font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                  {filtered.length} / {total}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9E8E7E]">
                  Tỷ lệ
                </p>
                <p className="mt-1 font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                  {percentActive}%
                </p>
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
                    "Danh mục",
                    "Đường dẫn (slug)",
                    "Số sản phẩm",
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
                    [...Array(4)].map((_, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-[#F0EEE9]">
                        {[...Array(5)].map((__, colIndex) => (
                          <td key={colIndex} className="px-5 py-5">
                            <div className="h-4 w-full animate-pulse rounded bg-[#F0EEE9]" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <FiPackage className="mx-auto mb-3 h-10 w-10 text-[#D1C4B9]" />
                        <p className="font-beVietnamPro text-sm text-[#9E8E7E]">
                          Không tìm thấy danh mục nào
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c, index) => {
                      const statusActive = Boolean(c.isActive);

                      return (
                        <motion.tr
                          key={c.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.22,
                            ease: "easeOut",
                            delay: Math.min(index, 6) * 0.01,
                          }}
                          className="border-b border-[#F0EEE9] transition-colors hover:bg-[#FAF9F6]"
                          style={
                            toggling === c.id
                              ? { boxShadow: "0 0 0 3px rgba(111,88,61,0.18)" }
                              : undefined
                          }
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-start gap-4">
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#E8E0D8] bg-[#F5F3EE]">
                                {c.imageUrl ? (
                                  <img
                                    src={getCategoryImageUrl(c)}
                                    alt={c.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : null}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-beVietnamPro text-sm font-semibold text-[#1B1C19]">
                                  {c.name}
                                </p>
                                <p className="mt-1 text-xs text-[#6F583D]">
                                  {c.description ? c.description : "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-beVietnamPro text-sm font-medium text-[#4E453D]">
                              {c.slug || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                              {c.productCount ?? 0}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <StatusPill isActive={statusActive} />
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleActive(c)}
                                disabled={toggling === c.id}
                                title={statusActive ? "Ẩn" : "Hiện"}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6F583D] transition-colors hover:bg-[#F0EEE9] disabled:opacity-50"
                              >
                                {toggling === c.id ? (
                                  <span className="h-4 w-4 rounded-full border-2 border-[#9E8E7E] border-t-[#6F583D] animate-spin" />
                                ) : (
                                  <span className="text-sm font-bold">
                                    {statusActive ? "👁" : "🙈"}
                                  </span>
                                )}
                              </button>

                              <button
                                onClick={() => openEdit(c)}
                                title="Chỉnh sửa"
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6F583D] transition-colors hover:bg-[#F0EEE9] hover:text-[#1B1C19]"
                              >
                                <span className="text-base">✎</span>
                              </button>

                              <button
                                onClick={() => openDelete(c)}
                                title="Xoá"
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition-colors hover:bg-red-50"
                              >
                                <span className="text-base">🗑</span>
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

        {/* Footer pagination (giữ UI tĩnh giống mock) */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#FBF9F4] px-5 py-4">
          <p className="font-beVietnamPro text-sm text-[#6F583D]">
            Hiển thị 1-10 trên tổng số {total} danh mục
          </p>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1C4B9] bg-white text-[#4E453D]">
              1
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1C4B9] bg-white text-[#4E453D]">
              2
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1C4B9] bg-white text-[#4E453D]">
              3
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={editCategory}
        onSaved={refresh}
      />
      <DeleteCategoryModal
        open={deleteOpen}
        category={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </div>
  );
}
