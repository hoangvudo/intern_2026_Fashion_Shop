import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";
import { useAdminReviews } from "../../hooks/useReviews";
import reviewService from "../../services/reviewService";
import toast from "react-hot-toast";
import DeleteConfirmModal from "../../components/admin/products/DeleteConfirmModal";
import ReviewDetailModal from "../../components/admin/reviews/ReviewDetailModal";

export default function AdminReviews() {
  const { reviews, total, totalPages, loading, params, updateParam, refresh } =
    useAdminReviews();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/40x40?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;

    let cleanPath = imagePath.replace(/^\//, "");
    if (cleanPath.startsWith("api/uploads/")) {
      return `http://localhost:8080/${cleanPath}`;
    }

    return `http://localhost:8080/api/uploads/${cleanPath}`;
  };

  const handleToggleVisible = async (r) => {
    setToggling(r.id);
    try {
      await reviewService.adminToggleVisible(r.id);
      toast.success(r.isVisible ? "Đã ẩn đánh giá" : "Đã hiện đánh giá");
      refresh();
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setToggling(null);
    }
  };

  const openDetail = (r) => {
    setDetailTarget(r);
    setDetailOpen(true);
  };

  const openDelete = (r) => {
    setDeleteTarget(r);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await reviewService.adminDelete(deleteTarget.id);
      toast.success("Đã xoá đánh giá");
      setDeleteOpen(false);
      refresh();
    } catch {
      toast.error("Xoá thất bại");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 px-8 pb-16 pt-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Quản lý đánh giá</h1>
          <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">
            Tổng cộng <span className="font-semibold">{total}</span> đánh giá từ khách hàng
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-[#D1C4B9] bg-white px-3 py-2">
            <span className="text-xs font-medium text-[#9E8E7E] uppercase tracking-wider">Lọc sao:</span>
            <select 
              value={params.rating || 'all'}
              onChange={(e) => updateParam('rating', e.target.value)}
              className="bg-transparent text-sm font-semibold text-[#4E453D] focus:outline-none"
            >
              <option value="all">Tất cả sao</option>
              {[5, 4, 3, 2, 1].map(s => (
                <option key={s} value={s}>{s} Sao</option>
              ))}
            </select>
          </div>
          <button onClick={refresh}
            className="flex items-center gap-2 border border-[#D1C4B9] px-4 py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9] transition-colors">
            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#D1C4B9] bg-white overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#D1C4B9] bg-[#F5F3EE]">
              {[
                "Sản phẩm",
                "Khách hàng",
                "Đánh giá",
                "Nội dung",
                "Ngày gửi",
                "Trạng thái",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]"
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
                    {[...Array(7)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-[#F0EEE9] w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center font-beVietnamPro text-sm text-[#9E8E7E]"
                  >
                    Chưa có đánh giá nào
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[#F0EEE9] hover:bg-[#FAF9F6] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 bg-[#F0EEE9] overflow-hidden">
                          <img
                            src={getImageUrl(r.productMainImage)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-beVietnamPro text-sm font-medium text-[#1B1C19] line-clamp-1 max-w-[150px]">
                          {r.productName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-beVietnamPro text-sm text-[#4E453D]">
                      {r.userFullName}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`h-3.5 w-3.5 ${i < r.rating ? "fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 max-w-[250px]">
                        <p className="font-beVietnamPro text-sm text-[#4E453D] line-clamp-2 italic">
                          "{r.comment || "Không có nội dung"}"
                        </p>
                        {r.comment && r.comment.length > 60 && (
                          <button
                            onClick={() => openDetail(r)}
                            className="text-left text-[11px] font-semibold text-[#1B1C19] hover:underline"
                          >
                            Xem thêm chi tiết
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-beVietnamPro text-sm text-[#9E8E7E]">
                      {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 font-beVietnamPro text-xs font-medium ${
                          r.isVisible
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${r.isVisible ? "bg-green-500" : "bg-gray-400"}`}
                        />
                        {r.isVisible ? "Hiển thị" : "Đã ẩn"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(r)}
                          title="Xem chi tiết"
                          className="p-2 text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleVisible(r)}
                          disabled={toggling === r.id}
                          title={r.isVisible ? "Ẩn đánh giá" : "Hiện đánh giá"}
                          className="p-2 text-[#6F583D] hover:bg-[#F0EEE9] transition-colors"
                        >
                          {r.isVisible ? (
                            <FiEyeOff className="h-4 w-4" />
                          ) : (
                            <FiEye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openDelete(r)}
                          title="Xoá đánh giá"
                          className="p-2 text-red-500 hover:bg-red-50 transition-colors"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => updateParam("page", params.page - 1)}
            disabled={params.page === 0}
            className="flex h-9 w-9 items-center justify-center border border-[#D1C4B9] disabled:opacity-30"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => updateParam("page", i)}
              className={`h-9 w-9 font-beVietnamPro text-sm transition-colors ${
                params.page === i
                  ? "bg-[#1B1C19] text-white"
                  : "border border-[#D1C4B9] hover:bg-[#F0EEE9]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => updateParam("page", params.page + 1)}
            disabled={params.page === totalPages - 1}
            className="flex h-9 w-9 items-center justify-center border border-[#D1C4B9] disabled:opacity-30"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <ReviewDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        review={detailTarget}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Xoá đánh giá"
        message={`Bạn có chắc chắn muốn xoá đánh giá của ${deleteTarget?.userFullName}? Hành động này không thể hoàn tác.`}
        loading={deleting}
      />
    </div>
  );
}
