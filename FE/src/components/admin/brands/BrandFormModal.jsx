import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTag, FiUpload, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import brandService from "../../../services/brandService";
import uploadService from "../../../services/uploadService";

export default function BrandFormModal({ open, onClose, brand, onSaved }) {
  const isEdit = Boolean(brand?.id);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
    isActive: true,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (brand) {
      setForm({
        name: brand.name || "",
        slug: brand.slug || "",
        description: brand.description || "",
        logoUrl: brand.logoUrl || "",
        bannerUrl: brand.bannerUrl || "",
        isActive: brand.isActive ?? true,
      });
    } else {
      setForm(emptyForm);
    }
  }, [brand, open]);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const slugify = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const autoSlug = useMemo(() => !isEdit, [isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Tên thương hiệu là bắt buộc");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        slug: form.slug ? slugify(form.slug) : slugify(form.name),
      };

      if (isEdit) {
        await brandService.update(brand.id, payload);
        toast.success("Cập nhật thương hiệu thành công");
      } else {
        await brandService.create(payload);
        toast.success("Thêm thương hiệu thành công");
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Có lỗi xảy ra",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#D1C4B9] px-8 py-6">
              <div>
                <h2 className="font-beVietnamPro text-xl font-semibold text-[#1B1C19]">
                  {isEdit ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
                </h2>
                <p className="mt-0.5 font-beVietnamPro text-sm text-[#6F583D]">
                  {isEdit ? `ID: #${brand?.id}` : "Điền thông tin thương hiệu"}
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center border border-[#D1C4B9] hover:bg-[#F0EEE9]"
              >
                <FiX className="h-5 w-5 text-[#4E453D]" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
                <div>
                  <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                    Tên thương hiệu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E7E]" />
                    <input
                      value={form.name}
                      onChange={(e) => {
                        const v = e.target.value;
                        set("name", v);
                        if (autoSlug) set("slug", slugify(v));
                      }}
                      placeholder="VD: ZYRO Couture"
                      className="w-full border border-[#D1C4B9] pl-9 pr-4 py-3 font-beVietnamPro text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                    Slug
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                    placeholder="zyro-couture"
                    className="w-full border border-[#D1C4B9] px-4 py-3 font-beVietnamPro text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                    Mô tả
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className="w-full border border-[#D1C4B9] px-4 py-3 resize-none font-beVietnamPro text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                    Logo (upload)
                  </label>
                  <div className="flex items-start gap-4">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D1C4B9] bg-[#FBF9F4] px-4 py-6 hover:border-[#6F583D]">
                      <FiUpload className="mb-2 h-6 w-6 text-[#9E8E7E]" />
                      <p className="font-beVietnamPro text-sm text-[#4E453D]">
                        Chọn ảnh
                      </p>
                      <p className="mt-1 text-center font-beVietnamPro text-xs text-[#9E8E7E]">
                        (upload lên /upload/image)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          try {
                            const res = await uploadService.uploadImage(file);
                            const url =
                              res?.url ||
                              res?.imageUrl ||
                              res?.location ||
                              res?.data?.url ||
                              res?.data?.imageUrl ||
                              res?.data?.location ||
                              "";

                            if (!url) {
                              toast.error(
                                "Upload ảnh thành công nhưng không lấy được URL",
                              );
                              return;
                            }

                            set("logoUrl", url);
                          } catch (err) {
                            console.error(err);
                            toast.error("Upload ảnh thất bại");
                          } finally {
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>

                    {form.logoUrl ? (
                      <div className="flex flex-col items-start">
                        <p className="mb-2 font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#9E8E7E]">
                          Preview
                        </p>
                        <img
                          src={form.logoUrl}
                          alt="brand logo preview"
                          className="h-24 w-24 rounded-xl border border-[#D1C4B9] object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            toast.error("Không load được ảnh từ URL");
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-start">
                        <p className="font-beVietnamPro text-xs text-[#9E8E7E]">
                          Chưa có logo
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-beVietnamPro text-sm font-medium text-[#6F583D]">
                    Hoặc dán URL logo
                  </label>
                  <div className="relative">
                    <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E7E]" />
                    <input
                      value={form.logoUrl}
                      onChange={(e) => set("logoUrl", e.target.value)}
                      placeholder="https://..."
                      className="w-full border border-[#D1C4B9] pl-9 pr-4 py-3 font-beVietnamPro text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-beVietnamPro text-sm font-medium text-[#6F583D]">
                    Banner URL (tuỳ chọn)
                  </label>
                  <div className="relative">
                    <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E7E]" />
                    <input
                      value={form.bannerUrl}
                      onChange={(e) => set("bannerUrl", e.target.value)}
                      placeholder="https://..."
                      className="w-full border border-[#D1C4B9] pl-9 pr-4 py-3 font-beVietnamPro text-sm"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => set("isActive", e.target.checked)}
                  />
                  <span>Hiển thị thương hiệu</span>
                </label>
              </div>

              <div className="flex items-center justify-between border-t border-[#D1C4B9] px-8 py-5 bg-[#FAFAF8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-[#D1C4B9] px-6 py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]"
                >
                  Huỷ
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black px-8 py-2.5 text-white font-beVietnamPro text-sm hover:bg-[#333] disabled:opacity-50"
                >
                  {saving
                    ? "Đang lưu..."
                    : isEdit
                      ? "Cập nhật"
                      : "Thêm thương hiệu"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
