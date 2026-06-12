import { useState, useEffect, useCallback } from "react";
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
  FiX, FiTag, FiImage, FiCheck
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import brandService from "../../services/brandService";

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
function BrandFormModal({ brand, onClose, onSaved }) {
  const isEdit = !!brand;
  const [form, setForm] = useState({
    name: "", slug: "", description: "", logoUrl: "", isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (brand) {
      setForm({
        name: brand.name || "",
        slug: brand.slug || "",
        description: brand.description || "",
        logoUrl: brand.logoUrl || "",
        isActive: brand.isActive ?? true,
      });
    }
  }, [brand]);

  const handleChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !isEdit) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Vui lòng nhập tên thương hiệu");
    if (!form.slug.trim()) return toast.error("Vui lòng nhập slug");
    setSaving(true);
    try {
      if (isEdit) {
        await brandService.updateBrand(brand.id, form);
        toast.success("Cập nhật thương hiệu thành công");
      } else {
        await brandService.createBrand(form);
        toast.success("Tạo thương hiệu thành công");
      }
      onSaved();
    } catch (e) {
      toast.error(e.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const [tab, setTab] = useState("basic");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
        className="fixed right-0 top-0 z-[10000] flex h-screen w-full max-w-2xl flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D1C4B9] px-8 py-6">
          <div>
            <h2 className="font-beVietnamPro text-xl font-semibold text-[#1B1C19]">
              {isEdit ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
            </h2>
            <p className="mt-0.5 font-beVietnamPro text-sm text-[#6F583D]">
              {isEdit ? `ID: #${brand.id}` : "Điền đầy đủ thông tin thương hiệu"}
            </p>
          </div>
          <button onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-[#D1C4B9] hover:bg-[#F0EEE9]">
            <FiX className="h-5 w-5 text-[#4E453D]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#D1C4B9] px-8">
          {[
            { id: "basic", label: "Thông tin cơ bản", icon: FiTag },
            { id: "images", label: "Hình ảnh", icon: FiImage }
          ].map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-beVietnamPro text-sm font-medium transition-colors ${
                tab === t.id ? "border-[#1B1C19] text-[#1B1C19]" : "border-transparent text-[#9E8E7E] hover:text-[#4E453D]"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {tab === "basic" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-beVietnamPro text-[#1B1C19] mb-2">Tên thương hiệu <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={e => handleChange("name", e.target.value)}
                  className="w-full border border-[#D1C4B9] bg-white px-4 py-2.5 text-sm font-beVietnamPro text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
                  placeholder="VD: ZYRO Fashion"
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-beVietnamPro text-[#1B1C19] mb-2">Slug (SEO URL)</label>
                <input
                  value={form.slug}
                  onChange={e => handleChange("slug", e.target.value)}
                  className="w-full border border-[#D1C4B9] bg-white px-4 py-2.5 text-sm font-beVietnamPro text-[#6F583D] focus:border-[#6F583D] focus:outline-none"
                  placeholder="zyro-fashion (tự sinh nếu bỏ trống)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium font-beVietnamPro text-[#1B1C19] mb-2">Mô tả thương hiệu</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={e => handleChange("description", e.target.value)}
                  className="w-full border border-[#D1C4B9] bg-white px-4 py-2.5 text-sm font-beVietnamPro text-[#1B1C19] focus:border-[#6F583D] focus:outline-none resize-none"
                  placeholder="Mô tả chi tiết về thương hiệu..."
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none w-fit pt-2">
                <div
                  onClick={() => handleChange("isActive", !form.isActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${form.isActive ? "bg-[#1B1C19]" : "bg-[#D1C4B9]"}`}
                >
                  <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${form.isActive ? "translate-x-6" : ""}`} />
                </div>
                <span className="text-sm font-medium font-beVietnamPro text-[#1B1C19]">Cho phép hiển thị (Hoạt động)</span>
              </label>
            </div>
          )}

          {tab === "images" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-beVietnamPro text-[#1B1C19] mb-2">Logo URL</label>
                <input
                  value={form.logoUrl}
                  onChange={e => handleChange("logoUrl", e.target.value)}
                  className="w-full border border-[#D1C4B9] bg-white px-4 py-2.5 text-sm font-beVietnamPro text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
                  placeholder="https://example.com/logo.png"
                />
                {form.logoUrl && (
                  <div className="mt-4 p-4 border border-[#D1C4B9] bg-[#F5F3EE] flex items-center justify-center">
                    <img src={form.logoUrl} alt="preview" className="max-h-32 object-contain" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#D1C4B9] bg-white px-8 py-4 flex items-center justify-between">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium font-beVietnamPro border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] transition-all">
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#1B1C19] px-6 py-2.5 text-sm font-semibold font-beVietnamPro text-white transition-all duration-300 hover:bg-[#333] disabled:opacity-50"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : null}
            {isEdit ? "Lưu thay đổi" : "Thêm thương hiệu"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ========================
// MAIN PAGE
// ========================
export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  
  const [editBrand, setEditBrand] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await brandService.getAllBrands();
      setBrands(data || []);
    } catch {
      toast.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá thương hiệu này? Cảnh báo: Việc xoá có thể lỗi nếu thương hiệu đang có sản phẩm.")) return;
    try {
      await brandService.deleteBrand(id);
      toast.success("Đã xoá thương hiệu");
      load();
    } catch {
      toast.error("Không thể xoá thương hiệu");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await brandService.toggleActive(id);
      toast.success("Đã cập nhật trạng thái");
      load();
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(keyword.toLowerCase()) || 
    b.slug.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#FBF9F4] px-8 pb-16 pt-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Quản lý Thương hiệu</h1>
          <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">
            Tổng cộng <span className="font-semibold">{brands.length}</span> thương hiệu
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#1B1C19] px-5 py-2.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-beVietnamPro text-sm text-white"
        >
          <FiPlus className="h-4 w-4" /> Tạo thương hiệu
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#D1C4B9] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-xl border border-[#D1C4B9] transition-all duration-300 focus-within:border-[#1B1C19] focus-within:shadow-sm px-4 py-2.5">
            <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Tìm kiếm thương hiệu..."
              className="flex-1 bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#D1C4B9] bg-white overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#D1C4B9] bg-[#F5F3EE]">
              <th className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D] w-16">ID</th>
              <th className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Thương hiệu</th>
              <th className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Mô tả</th>
              <th className="px-5 py-4 text-center font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Trạng thái</th>
              <th className="px-5 py-4 text-right font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-[#F0EEE9]">
                  <td className="px-5 py-4"><div className="h-4 w-8 animate-pulse rounded bg-[#F0EEE9]" /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 animate-pulse rounded-xl bg-[#F0EEE9]" />
                      <div className="h-4 w-32 animate-pulse rounded bg-[#F0EEE9]" />
                    </div>
                  </td>
                  <td className="px-5 py-4"><div className="h-4 w-48 animate-pulse rounded bg-[#F0EEE9]" /></td>
                  <td className="px-5 py-4"><div className="h-6 w-20 mx-auto animate-pulse rounded-full bg-[#F0EEE9]" /></td>
                  <td className="px-5 py-4"><div className="h-8 w-24 ml-auto animate-pulse rounded-xl bg-[#F0EEE9]" /></td>
                </tr>
              ))
            ) : filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <FiTag className="mx-auto mb-3 h-10 w-10 text-[#D1C4B9]" />
                  <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Không tìm thấy thương hiệu nào</p>
                </td>
              </tr>
            ) : filteredBrands.map(b => (
              <tr key={b.id} className="border-b border-[#F0EEE9] hover:bg-[#FAFAF8] transition-all duration-300">
                <td className="px-5 py-4 font-beVietnamPro text-sm text-[#4E453D]">#{b.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E8E0D8] bg-[#F5F3EE] p-1 flex items-center justify-center">
                      {b.logoUrl ? (
                        <img src={b.logoUrl} className="max-h-full max-w-full object-contain" alt="" />
                      ) : (
                        <FiImage className="h-5 w-5 text-[#D1C4B9]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19]">{b.name}</p>
                      <p className="font-beVietnamPro text-xs text-[#9E8E7E]">/{b.slug}</p>
                    </div>
                  </div>
                </td>
                
                <td className="px-5 py-4 font-beVietnamPro text-sm text-[#6F583D] max-w-xs truncate">
                  {b.description || "—"}
                </td>

                <td className="px-5 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-beVietnamPro text-xs font-medium rounded-full ${b.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {b.isActive ? <><FiEye className="h-3 w-3" /> Đang hoạt động</> : <><FiEyeOff className="h-3 w-3" /> Đã ẩn</>}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditBrand(b)} title="Sửa"
                      className="flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#1B1C19]">
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleToggleActive(b.id)} title={b.isActive ? "Ẩn thương hiệu" : "Hiện thương hiệu"}
                      className="flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#6F583D]">
                      {b.isActive ? <FiEyeOff className="h-4 w-4" /> : <FiCheck className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleDelete(b.id)} title="Xoá"
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

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <BrandFormModal
            brand={null}
            onClose={() => setShowCreateModal(false)}
            onSaved={() => { setShowCreateModal(false); load(); }}
          />
        )}
        {editBrand && (
          <BrandFormModal
            brand={editBrand}
            onClose={() => setEditBrand(null)}
            onSaved={() => { setEditBrand(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
