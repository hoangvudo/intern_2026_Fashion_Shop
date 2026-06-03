import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiImage, FiTag } from 'react-icons/fi'
import categoryService from '../../../services/categoryService'
import toast from 'react-hot-toast'

export default function CategoryFormModal({
  open,
  onClose,
  category,
  onSaved
}) {

  const isEdit = Boolean(category?.id)

  const [saving, setSaving] = useState(false)

  const emptyForm = {
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true
  }

  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        isActive: category.isActive ?? true,
      })
    } else {
      setForm(emptyForm)
    }
  }, [category, open])

  const set = (key, val) => {
    setForm(prev => ({
      ...prev,
      [key]: val
    }))
  }

  const slugify = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Tên danh mục là bắt buộc')
      return
    }

    try {
      setSaving(true)

      const payload = {
        ...form,
        slug: form.slug
          ? slugify(form.slug)
          : slugify(form.name)
      }

      console.log('CATEGORY PAYLOAD:', payload)

      if (isEdit) {
        await categoryService.update(category.id, payload)
        toast.success('Cập nhật danh mục thành công')
      } else {
        await categoryService.create(payload)
        toast.success('Thêm danh mục thành công')
      }

      onSaved?.()
      onClose?.()

    } catch (err) {

      console.error(err)

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Có lỗi xảy ra'

      toast.error(message)

    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

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
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.3
            }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col bg-white shadow-2xl"
          >

            <div className="flex items-center justify-between border-b border-[#D1C4B9] px-8 py-6">
              <div>
                <h2 className="font-beVietnamPro text-xl font-semibold text-[#1B1C19]">
                  {isEdit
                    ? 'Chỉnh sửa danh mục'
                    : 'Thêm danh mục mới'}
                </h2>

                <p className="mt-0.5 font-beVietnamPro text-sm text-[#6F583D]">
                  {isEdit
                    ? `ID: #${category.id}`
                    : 'Điền thông tin danh mục'}
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
                    Tên danh mục *
                  </label>

                  <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E7E]" />

                    <input
                      value={form.name}
                      onChange={(e) => {
                        set('name', e.target.value)

                        if (!isEdit) {
                          set('slug', slugify(e.target.value))
                        }
                      }}
                      placeholder="VD: Áo nam"
                      className="w-full border border-[#D1C4B9] pl-9 pr-4 py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                    Slug
                  </label>

                  <input
                    value={form.slug}
                    onChange={(e) =>
                      set('slug', slugify(e.target.value))
                    }
                    placeholder="ao-nam"
                    className="w-full border border-[#D1C4B9] px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                    Mô tả
                  </label>

                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      set('description', e.target.value)
                    }
                    className="w-full border border-[#D1C4B9] px-4 py-3 resize-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                    URL hình ảnh
                  </label>

                  <div className="relative">
                    <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E7E]" />

                    <input
                      value={form.imageUrl}
                      onChange={(e) =>
                        set('imageUrl', e.target.value)
                      }
                      placeholder="https://..."
                      className="w-full border border-[#D1C4B9] pl-9 pr-4 py-3"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      set('isActive', e.target.checked)
                    }
                  />

                  <span>Hiển thị danh mục</span>
                </label>

              </div>

              <div className="flex items-center justify-between border-t border-[#D1C4B9] px-8 py-5 bg-[#FAFAF8]">

                <button
                  type="button"
                  onClick={onClose}
                  className="border border-[#D1C4B9] px-6 py-2.5"
                >
                  Huỷ
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black px-8 py-2.5 text-white"
                >
                  {saving
                    ? 'Đang lưu...'
                    : isEdit
                      ? 'Cập nhật'
                      : 'Thêm danh mục'}
                </button>

              </div>

            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}