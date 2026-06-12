import { useState, useEffect, useCallback } from "react";
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
  FiChevronLeft, FiChevronRight, FiX, FiStar, FiBookOpen,
  FiImage, FiClock, FiUser, FiCheck, FiFilter
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import articleService from "../../services/articleService";
import uploadService from "../../services/uploadService";
import { getImageUrl } from "../../utils/imageUrl";

const CATEGORIES = [
  { value: "", label: "Tất cả" },
  { value: "STYLE", label: "Phong cách" },
  { value: "TREND", label: "Xu hướng" },
  { value: "CULTURE", label: "Văn hoá" },
  { value: "BEAUTY", label: "Làm đẹp" },
  { value: "LIFE", label: "Đời sống" },
];

const CATEGORY_COLORS = {
  STYLE: "bg-purple-100 text-purple-700",
  TREND: "bg-blue-100 text-blue-700",
  CULTURE: "bg-amber-100 text-amber-700",
  BEAUTY: "bg-pink-100 text-pink-700",
  LIFE: "bg-green-100 text-green-700",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }) : "—";

function slugify(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// ========================
// FORM MODAL
// ========================
function ArticleFormModal({ article, onClose, onSaved }) {
  const isEdit = !!article;
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    coverImage: "", category: "STYLE", author: "ZYRO Editorial",
    authorAvatar: "", readMinutes: 5,
    isPublished: false, isFeatured: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title || "",
        slug: article.slug || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        coverImage: article.coverImage || "",
        category: article.category || "STYLE",
        author: article.author || "ZYRO Editorial",
        authorAvatar: article.authorAvatar || "",
        readMinutes: article.readMinutes || 5,
        isPublished: article.isPublished ?? false,
        isFeatured: article.isFeatured ?? false,
      });
    }
  }, [article]);

  const handleChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !isEdit) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const loadingToast = toast.loading("Đang tải ảnh lên...");
    try {
      const res = await uploadService.uploadImage(file);
      if (res && res.url) {
        handleChange(field, res.url);
        toast.success("Tải ảnh lên thành công", { id: loadingToast });
      } else {
        toast.error("Không nhận được đường dẫn ảnh", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Lỗi khi tải ảnh lên", { id: loadingToast });
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Vui lòng nhập tiêu đề");
    if (!form.slug.trim()) return toast.error("Vui lòng nhập đường dẫn (slug)");
    setSaving(true);
    try {
      if (isEdit) {
        await articleService.update(article.id, form);
        toast.success("Cập nhật bài viết thành công");
      } else {
        await articleService.create(form);
        toast.success("Tạo bài viết thành công");
      }
      onSaved();
    } catch (e) {
      toast.error(e.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-12 pb-12"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#BB5734]/10">
              <FiBookOpen className="h-5 w-5 text-[#BB5734]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề *</label>
            <input
              value={form.title}
              onChange={e => handleChange("title", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#BB5734] focus:ring-1 focus:ring-[#BB5734]/20 outline-none transition"
              placeholder="Nhập tiêu đề bài viết..."
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Đường dẫn (slug)</label>
            <input
              value={form.slug}
              onChange={e => handleChange("slug", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-mono text-gray-600 focus:border-[#BB5734] focus:ring-1 focus:ring-[#BB5734]/20 outline-none transition"
              placeholder="duong-dan-bai-viet"
            />
          </div>

          {/* Row: Category + Read minutes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
              <select
                value={form.category}
                onChange={e => handleChange("category", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#BB5734] outline-none transition"
              >
                {CATEGORIES.filter(c => c.value).map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời gian đọc (phút)</label>
              <input
                type="number" min={1} max={60}
                value={form.readMinutes}
                onChange={e => handleChange("readMinutes", parseInt(e.target.value) || 5)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#BB5734] outline-none transition"
              />
            </div>
          </div>

          {/* Row: Author + Author Avatar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tác giả</label>
              <input
                value={form.author}
                onChange={e => handleChange("author", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#BB5734] outline-none transition"
                placeholder="Tên tác giả"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Avatar tác giả (URL hoặc Tải lên)</label>
              <div className="flex gap-2">
                <input
                  value={form.authorAvatar}
                  onChange={e => handleChange("authorAvatar", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#BB5734] outline-none transition"
                  placeholder="https://..."
                />
                <label className="flex shrink-0 items-center justify-center cursor-pointer rounded-lg border border-gray-200 px-3 bg-gray-50 hover:bg-gray-100 transition">
                  <FiImage className="text-gray-500" title="Tải ảnh lên" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'authorAvatar')} />
                </label>
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh bìa (URL hoặc Tải lên)</label>
            <div className="flex gap-2">
              <input
                value={form.coverImage}
                onChange={e => handleChange("coverImage", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#BB5734] outline-none transition"
                placeholder="https://example.com/image.jpg"
              />
              <label className="flex shrink-0 items-center justify-center gap-2 cursor-pointer rounded-lg border border-gray-200 px-4 bg-gray-50 hover:bg-gray-100 transition">
                <FiImage className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Tải lên</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'coverImage')} />
              </label>
            </div>
            {form.coverImage && (
              <div className="mt-2 h-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img src={getImageUrl(form.coverImage)} alt="preview" className="h-full w-full object-cover" onError={e => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={e => handleChange("excerpt", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#BB5734] focus:ring-1 focus:ring-[#BB5734]/20 outline-none transition resize-none"
              placeholder="Mô tả ngắn gọn cho bài viết..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung (HTML)</label>
            <textarea
              rows={10}
              value={form.content}
              onChange={e => handleChange("content", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-mono focus:border-[#BB5734] focus:ring-1 focus:ring-[#BB5734]/20 outline-none transition resize-y"
              placeholder="<p>Nội dung bài viết...</p>"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-8 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <div
                onClick={() => handleChange("isPublished", !form.isPublished)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.isPublished ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Xuất bản</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <div
                onClick={() => handleChange("isFeatured", !form.isFeatured)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.isFeatured ? "bg-amber-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isFeatured ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Nổi bật</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#BB5734] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#9B3F1E] disabled:opacity-50 transition"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <FiCheck className="h-4 w-4" />
            )}
            {isEdit ? "Lưu thay đổi" : "Tạo bài viết"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ========================
// VIEW MODAL
// ========================
function ArticleViewModal({ article, onClose }) {
  if (!article) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-12 pb-12"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Cover */}
        {article.coverImage && (
          <div className="h-56 overflow-hidden">
            <img src={getImageUrl(article.coverImage)} className="w-full h-full object-cover" alt="" />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {article.category && (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${CATEGORY_COLORS[article.category] || "bg-gray-100 text-gray-600"}`}>
                {CATEGORIES.find(c => c.value === article.category)?.label || article.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiClock className="h-3 w-3" /> {article.readMinutes} phút đọc
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiEye className="h-3 w-3" /> {article.viewCount || 0} lượt xem
            </span>
            {article.isFeatured && (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                <FiStar className="h-3 w-3" /> Nổi bật
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>

          {article.excerpt && (
            <p className="text-sm leading-relaxed text-gray-600 italic border-l-4 border-[#BB5734]/30 pl-4">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <FiUser className="h-4 w-4" />
            <span>{article.author || "ZYRO"}</span>
            <span className="text-gray-300">•</span>
            <span>{article.isPublished ? `Xuất bản: ${fmtDate(article.publishedAt)}` : "Bản nháp"}</span>
          </div>

          {article.content && (
            <div className="pt-4 border-t border-gray-100">
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
              Đóng
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ========================
// DELETE CONFIRM MODAL
// ========================
function DeleteConfirmModal({ onClose, onConfirm, deleting }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <FiTrash2 className="h-6 w-6" />
          </div>
          <h3 className="mb-2 font-beVietnamPro text-lg font-bold text-[#1B1C19]">Xác nhận xoá</h3>
          <p className="text-sm font-beVietnamPro text-[#4E453D] leading-relaxed">
            Bạn có chắc chắn muốn xoá bài viết này không? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex gap-3 bg-[#F5F3EE] px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold font-beVietnamPro text-[#6F583D] border border-[#D1C4B9] transition-all hover:bg-[#F0EEE9]">
            Huỷ
          </button>
          <button onClick={onConfirm} disabled={deleting} className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold font-beVietnamPro text-white transition-all hover:bg-red-600 disabled:opacity-50 flex items-center justify-center">
            {deleting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Xoá bài viết"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ========================
// MAIN PAGE
// ========================
export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [publishFilter, setPublishFilter] = useState("");

  const [editArticle, setEditArticle] = useState(null);
  const [viewArticle, setViewArticle] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { keyword: keyword || undefined, category: categoryFilter || undefined, page, size: 10 };
      if (publishFilter === "published") params.isPublished = true;
      if (publishFilter === "draft") params.isPublished = false;
      const data = await articleService.adminSearch(params);
      setArticles(data.content || []);
      setTotal(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryFilter, publishFilter, page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!articleToDelete) return;
    setDeleting(true);
    try {
      await articleService.delete(articleToDelete);
      toast.success("Đã xoá bài viết");
      setArticleToDelete(null);
      load();
    } catch {
      toast.error("Không thể xoá bài viết");
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await articleService.togglePublish(id);
      toast.success("Đã cập nhật trạng thái xuất bản");
      load();
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleViewDetail = async (a) => {
    try {
      const detail = await articleService.getById(a.id);
      setViewArticle(detail);
    } catch {
      toast.error("Không thể xem chi tiết bài viết");
    }
  };

  const handleEditDetail = async (a) => {
    try {
      const detail = await articleService.getById(a.id);
      setEditArticle(detail);
    } catch {
      toast.error("Không thể tải bài viết để chỉnh sửa");
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 px-8 pb-16 pt-8">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Quản lý Tạp chí</h1>
          <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">
            Tổng cộng <span className="font-semibold">{total}</span> bài viết
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#1B1C19] px-5 py-2.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-beVietnamPro text-sm text-white hover:bg-[#333] transition-colors"
        >
          <FiPlus className="h-4 w-4" /> Tạo bài viết
        </button>
      </div>

      {/* Filters bar */}
      <div className="rounded-2xl border border-[#D1C4B9] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-2.5 transition-all duration-300 focus:border-[#1B1C19]">
            <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
            <input
              value={keyword}
              onChange={e => { setKeyword(e.target.value); setPage(0); }}
              placeholder="Tìm kiếm bài viết..."
              className="flex-1 bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setPage(0); }}
            className="rounded-xl border border-[#D1C4B9] bg-white px-4 py-2.5 transition-all duration-300 focus:border-[#1B1C19] font-beVietnamPro text-sm text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
          >
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          {/* Status */}
          <select
            value={publishFilter}
            onChange={e => { setPublishFilter(e.target.value); setPage(0); }}
            className="rounded-xl border border-[#D1C4B9] bg-white px-4 py-2.5 transition-all duration-300 focus:border-[#1B1C19] font-beVietnamPro text-sm text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#D1C4B9] bg-white overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#D1C4B9] bg-[#F5F3EE]">
              {['Bài viết', 'Danh mục', 'Trạng thái', 'Lượt xem', 'Ngày tạo', 'Thao tác'].map(h => (
                <th key={h} className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#F0EEE9]">
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-[#F0EEE9]" style={{ width: j === 0 ? '80%' : '60%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <FiBookOpen className="mx-auto mb-3 h-10 w-10 text-[#D1C4B9]" />
                    <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Chưa có bài viết nào</p>
                  </td>
                </tr>
              ) : articles.map(a => (
                <tr key={a.id} className="border-b border-[#F0EEE9] hover:bg-[#FAFAF8] transition-all duration-300">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E8E0D8] bg-[#F5F3EE]">
                        {a.coverImage ? (
                          <img src={getImageUrl(a.coverImage)} className="h-full w-full object-cover" alt="" onError={e => e.currentTarget.style.display = 'none'} />
                        ) : (
                          <div className="flex h-full items-center justify-center"><FiImage className="h-5 w-5 text-[#D1C4B9]" /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19] truncate max-w-[260px]">{a.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-beVietnamPro text-xs text-[#9E8E7E]">{a.author || "ZYRO"}</span>
                          {a.isFeatured && <FiStar className="h-3 w-3 text-amber-500 fill-amber-500" />}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${CATEGORY_COLORS[a.category] || "bg-gray-100 text-gray-600"}`}>
                      {CATEGORIES.find(c => c.value === a.category)?.label || a.category || "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${a.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {a.isPublished ? <><FiEye className="h-3 w-3" /> Đã xuất bản</> : <><FiEyeOff className="h-3 w-3" /> Bản nháp</>}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-sm text-[#4E453D]">
                      {a.viewCount || 0}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-xs text-[#9E8E7E]">
                      {fmtDate(a.createdAt)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleViewDetail(a)} title="Xem"
                        className="flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#6F583D]">
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEditDetail(a)} title="Sửa"
                        className="flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#1B1C19]">
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleTogglePublish(a.id)} title={a.isPublished ? "Gỡ xuất bản" : "Xuất bản"}
                        className="flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#6F583D]">
                        {a.isPublished ? <FiEyeOff className="h-4 w-4" /> : <FiCheck className="h-4 w-4" />}
                      </button>
                      <button onClick={() => setArticleToDelete(a.id)} title="Xoá"
                        className="flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center text-[#9E8E7E] hover:bg-red-50 hover:text-red-500">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-beVietnamPro text-sm text-[#9E8E7E]">
            Trang {page + 1} / {totalPages} — {total} bài viết
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="flex h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pg = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`flex h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center border font-beVietnamPro text-sm ${
                    page === pg
                      ? 'border-[#1B1C19] bg-[#1B1C19] text-white'
                      : 'border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9]'
                  }`}
                >
                  {pg + 1}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              className="flex h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <ArticleFormModal
            article={null}
            onClose={() => setShowCreateModal(false)}
            onSaved={() => { setShowCreateModal(false); load(); }}
          />
        )}
        {editArticle && (
          <ArticleFormModal
            article={editArticle}
            onClose={() => setEditArticle(null)}
            onSaved={() => { setEditArticle(null); load(); }}
          />
        )}
        {viewArticle && (
          <ArticleViewModal
            article={viewArticle}
            onClose={() => setViewArticle(null)}
          />
        )}
        {articleToDelete && (
          <DeleteConfirmModal
            onClose={() => setArticleToDelete(null)}
            onConfirm={handleDelete}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
