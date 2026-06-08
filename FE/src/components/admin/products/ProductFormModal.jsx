import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiX, FiPlus, FiTrash2, FiUpload, FiChevronDown,
  FiTag, FiPackage, FiDollarSign, FiImage, FiList
} from 'react-icons/fi'
import productService from '../../../services/productService'
import toast from 'react-hot-toast'

const SIZES  = ['XS','S','M','L','XL','2XL','3XL','Free']
const COLORS = [
  { name:'Đen', hex:'#1a1a1a' }, { name:'Trắng', hex:'#f5f5f5' },
  { name:'Xám', hex:'#9e9e9e' }, { name:'Đỏ', hex:'#e53e3e' },
  { name:'Xanh navy', hex:'#1a365d' }, { name:'Xanh dương', hex:'#3182ce' },
  { name:'Xanh lá', hex:'#38a169' }, { name:'Vàng', hex:'#d69e2e' },
  { name:'Cam', hex:'#dd6b20' }, { name:'Hồng', hex:'#d53f8c' },
  { name:'Tím', hex:'#805ad5' }, { name:'Be/Kem', hex:'#e8d5b7' },
  { name:'Nâu', hex:'#744210' },
]

function VariantRow({ variant, index, onUpdate, onRemove }) {
  const [colorOpen, setColorOpen] = useState(false)
  const colorRef = useRef(null)

  useEffect(() => {
    const handleClick = e => { if (colorRef.current && !colorRef.current.contains(e.target)) setColorOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_80px_40px] gap-2 items-center">
      {/* Size */}
      <select
        value={variant.size || ''}
        onChange={e => onUpdate(index, 'size', e.target.value)}
        className="border border-[#D1C4B9] bg-white px-3 py-2 text-sm font-beVietnamPro text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
      >
        <option value="">Chọn size</option>
        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Color picker */}
      <div className="relative" ref={colorRef}>
        <button
          type="button"
          onClick={() => setColorOpen(o => !o)}
          className="flex w-full items-center gap-2 border border-[#D1C4B9] bg-white px-3 py-2 text-sm font-beVietnamPro text-[#1B1C19] hover:border-[#6F583D]"
        >
          {variant.color
            ? <><span className="inline-block h-4 w-4 rounded-full border border-[#D1C4B9]" style={{ background: variant.colorHex }} />{variant.color}</>
            : <span className="text-[#9E8E7E]">Chọn màu</span>
          }
          <FiChevronDown className="ml-auto h-3 w-3 text-[#9E8E7E]" />
        </button>
        <AnimatePresence>
          {colorOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="absolute left-0 top-full z-50 mt-1 w-56 border border-[#D1C4B9] bg-white shadow-lg"
            >
              {COLORS.map(c => (
                <button
                  key={c.name} type="button"
                  onClick={() => { onUpdate(index, 'color', c.name); onUpdate(index, 'colorHex', c.hex); setColorOpen(false) }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm font-beVietnamPro hover:bg-[#F0EEE9]"
                >
                  <span className="h-4 w-4 rounded-full border border-[#D1C4B9] flex-shrink-0" style={{ background: c.hex }} />
                  {c.name}
                  {variant.color === c.name && <span className="ml-auto text-[#6F583D]">✓</span>}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SKU */}
      <input
        value={variant.sku || ''}
        onChange={e => onUpdate(index, 'sku', e.target.value)}
        placeholder="SKU (tuỳ chọn)"
        className="border border-[#D1C4B9] bg-white px-3 py-2 text-sm font-beVietnamPro placeholder:text-[#9E8E7E] focus:border-[#6F583D] focus:outline-none"
      />

      {/* Stock */}
      <input
        type="number" min="0"
        value={variant.stock ?? 0}
        onChange={e => onUpdate(index, 'stock', Number(e.target.value))}
        className="border border-[#D1C4B9] bg-white px-3 py-2 text-sm font-beVietnamPro text-center focus:border-[#6F583D] focus:outline-none"
      />

      {/* Remove */}
      <button type="button" onClick={() => onRemove(index)}
        className="flex h-9 w-9 items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600">
        <FiTrash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function ProductFormModal({ open, onClose, product, categories, brands, onSaved }) {
  const isEdit = Boolean(product?.id)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('basic') // basic | variants | images

  const emptyForm = {
    name: '', slug: '', description: '', price: '', salePrice: '',
    categoryId: '', brandId: '', thumbnailUrl: '',
    isActive: true, isFeatured: false, isNewArrival: false,
    variants: [],
  }

  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        thumbnailUrl: product.thumbnailUrl || '',
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        isNewArrival: product.isNewArrival ?? false,
        variants: product.variants || [],
      })
    } else {
      setForm(emptyForm)
    }
    setTab('basic')
  }, [product, open])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // ── variants ────────────────────────────────────────────────────
  const addVariant = () =>
    setForm(f => ({ ...f, variants: [...f.variants, { size: '', color: '', colorHex: '', stock: 0, sku: '' }] }))

  const updateVariant = (idx, key, val) =>
    setForm(f => ({ ...f, variants: f.variants.map((v, i) => i === idx ? { ...v, [key]: val } : v) }))

  const removeVariant = (idx) =>
    setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }))

  // ── submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Tên sản phẩm là bắt buộc'); return }
    if (!form.price || Number(form.price) <= 0) { toast.error('Giá sản phẩm không hợp lệ'); return }

    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        brandId: form.brandId ? Number(form.brandId) : null,
      }
      if (isEdit) {
        await productService.update(product.id, payload)
        toast.success('Cập nhật sản phẩm thành công')
      } else {
        await productService.create(payload)
        toast.success('Thêm sản phẩm thành công')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'basic',    label: 'Thông tin cơ bản', icon: FiTag },
    { id: 'variants', label: 'Size & Màu sắc',   icon: FiList },
    { id: 'images',   label: 'Hình ảnh',          icon: FiImage },
  ]

  const totalStock = form.variants.reduce((s, v) => s + (Number(v.stock) || 0), 0)

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D1C4B9] px-8 py-6">
              <div>
                <h2 className="font-beVietnamPro text-xl font-semibold text-[#1B1C19]">
                  {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h2>
                <p className="mt-0.5 font-beVietnamPro text-sm text-[#6F583D]">
                  {isEdit ? `ID: #${product.id}` : 'Điền đầy đủ thông tin sản phẩm'}
                </p>
              </div>
              <button onClick={onClose}
                className="flex h-10 w-10 items-center justify-center border border-[#D1C4B9] hover:bg-[#F0EEE9]">
                <FiX className="h-5 w-5 text-[#4E453D]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#D1C4B9] px-8">
              {tabs.map(t => (
                <button key={t.id} type="button" onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 font-beVietnamPro text-sm font-medium transition-colors ${
                    tab === t.id
                      ? 'border-[#6F583D] text-[#6F583D]'
                      : 'border-transparent text-[#9E8E7E] hover:text-[#4E453D]'
                  }`}>
                  <t.icon className="h-4 w-4" />
                  {t.label}
                  {t.id === 'variants' && form.variants.length > 0 && (
                    <span className="ml-1 rounded-full bg-[#6F583D] px-1.5 py-0.5 text-[10px] text-white">
                      {form.variants.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-8 py-6">

                {/* ── Tab: Thông tin cơ bản ── */}
                {tab === 'basic' && (
                  <div className="space-y-5">
                    {/* Tên */}
                    <div>
                      <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="VD: Áo Polo Nam Premium Cotton"
                        className="w-full border border-[#D1C4B9] px-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] placeholder:text-[#9E8E7E] focus:border-[#6F583D] focus:outline-none"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                        Slug (SEO URL)
                      </label>
                      <input
                        value={form.slug}
                        onChange={e => set('slug', e.target.value)}
                        placeholder="ao-polo-nam-premium-cotton (tự sinh nếu bỏ trống)"
                        className="w-full border border-[#D1C4B9] px-4 py-3 font-beVietnamPro text-sm text-[#9E8E7E] placeholder:text-[#9E8E7E] focus:border-[#6F583D] focus:outline-none"
                      />
                    </div>

                    {/* Giá */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                          Giá bán <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E7E]" />
                          <input
                            type="number" min="0"
                            value={form.price}
                            onChange={e => set('price', e.target.value)}
                            placeholder="350000"
                            className="w-full border border-[#D1C4B9] pl-9 pr-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] placeholder:text-[#9E8E7E] focus:border-[#6F583D] focus:outline-none"
                          />
                        </div>
                        {form.price && <p className="mt-1 font-beVietnamPro text-xs text-[#6F583D]">{Number(form.price).toLocaleString('vi-VN')}₫</p>}
                      </div>
                      <div>
                        <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                          Giá khuyến mãi
                        </label>
                        <div className="relative">
                          <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E7E]" />
                          <input
                            type="number" min="0"
                            value={form.salePrice}
                            onChange={e => set('salePrice', e.target.value)}
                            placeholder="280000"
                            className="w-full border border-[#D1C4B9] pl-9 pr-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] placeholder:text-[#9E8E7E] focus:border-[#6F583D] focus:outline-none"
                          />
                        </div>
                        {form.salePrice && <p className="mt-1 font-beVietnamPro text-xs text-green-600">{Number(form.salePrice).toLocaleString('vi-VN')}₫</p>}
                      </div>
                    </div>

                    {/* Category & Brand */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">Danh mục</label>
                        <select
                          value={form.categoryId}
                          onChange={e => set('categoryId', e.target.value)}
                          className="w-full border border-[#D1C4B9] bg-white px-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
                        >
                          <option value="">-- Chọn danh mục --</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">Thương hiệu</label>
                        <select
                          value={form.brandId}
                          onChange={e => set('brandId', e.target.value)}
                          className="w-full border border-[#D1C4B9] bg-white px-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
                        >
                          <option value="">-- Chọn thương hiệu --</option>
                          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Mô tả */}
                    <div>
                      <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">Mô tả sản phẩm</label>
                      <textarea
                        rows={5}
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                        placeholder="Mô tả chi tiết về chất liệu, kiểu dáng, phong cách..."
                        className="w-full border border-[#D1C4B9] px-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] placeholder:text-[#9E8E7E] focus:border-[#6F583D] focus:outline-none resize-none"
                      />
                    </div>

                    {/* Flags */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: 'isActive',     label: 'Đang bán',     color: 'green' },
                        { key: 'isFeatured',   label: 'Nổi bật',      color: 'amber' },
                        { key: 'isNewArrival', label: 'Hàng mới',     color: 'blue'  },
                      ].map(({ key, label, color }) => (
                        <label key={key} className="flex cursor-pointer items-center gap-3 border border-[#D1C4B9] px-4 py-3 hover:bg-[#F0EEE9]">
                          <input
                            type="checkbox"
                            checked={form[key]}
                            onChange={e => set(key, e.target.checked)}
                            className="h-4 w-4 accent-[#6F583D]"
                          />
                          <span className="font-beVietnamPro text-sm text-[#1B1C19]">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Tab: Variants ── */}
                {tab === 'variants' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-beVietnamPro text-base font-semibold text-[#1B1C19]">Biến thể sản phẩm</h3>
                        <p className="font-beVietnamPro text-sm text-[#9E8E7E]">
                          Tổng tồn kho: <span className="font-semibold text-[#6F583D]">{totalStock}</span>
                        </p>
                      </div>
                      <button type="button" onClick={addVariant}
                        className="flex items-center gap-2 border border-[#6F583D] px-4 py-2 font-beVietnamPro text-sm text-[#6F583D] hover:bg-[#6F583D] hover:text-white transition-colors">
                        <FiPlus className="h-4 w-4" /> Thêm biến thể
                      </button>
                    </div>

                    {form.variants.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 py-16 border-2 border-dashed border-[#D1C4B9]">
                        <FiPackage className="h-10 w-10 text-[#D1C4B9]" />
                        <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Chưa có biến thể nào</p>
                        <button type="button" onClick={addVariant}
                          className="flex items-center gap-2 bg-[#6F583D] px-4 py-2 font-beVietnamPro text-sm text-white hover:bg-[#5a4730]">
                          <FiPlus className="h-4 w-4" /> Thêm biến thể đầu tiên
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Header */}
                        <div className="grid grid-cols-[1fr_1fr_1fr_80px_40px] gap-2 px-0">
                          {['Size', 'Màu sắc', 'SKU', 'Tồn kho', ''].map((h, i) => (
                            <span key={i} className="font-beVietnamPro text-xs font-medium uppercase tracking-wider text-[#9E8E7E]">{h}</span>
                          ))}
                        </div>
                        {form.variants.map((v, i) => (
                          <VariantRow key={i} variant={v} index={i} onUpdate={updateVariant} onRemove={removeVariant} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab: Images ── */}
                {tab === 'images' && (
                  <div className="space-y-5">
                    <div>
                      <label className="mb-1.5 block font-beVietnamPro text-sm font-medium text-[#1B1C19]">URL ảnh đại diện</label>
                      <input
                        value={form.thumbnailUrl}
                        onChange={e => set('thumbnailUrl', e.target.value)}
                        placeholder="https://..."
                        className="w-full border border-[#D1C4B9] px-4 py-3 font-beVietnamPro text-sm text-[#1B1C19] placeholder:text-[#9E8E7E] focus:border-[#6F583D] focus:outline-none"
                      />
                    </div>

                    {form.thumbnailUrl && (
                      <div className="border border-[#D1C4B9] p-3">
                        <p className="mb-2 font-beVietnamPro text-xs text-[#9E8E7E] uppercase tracking-wider">Xem trước</p>
                        <img
                          src={form.thumbnailUrl}
                          alt="preview"
                          className="h-48 w-full object-cover"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-3 border-2 border-dashed border-[#D1C4B9] py-10">
                      <FiUpload className="h-8 w-8 text-[#D1C4B9]" />
                      <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Upload nhiều ảnh</p>
                      <p className="font-beVietnamPro text-xs text-[#C5B9AE]">Tính năng upload file sẽ tích hợp qua Cloudinary hoặc S3</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#D1C4B9] px-8 py-5 bg-[#FAFAF8]">
                <button type="button" onClick={onClose}
                  className="border border-[#D1C4B9] px-6 py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]">
                  Huỷ
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 bg-[#1B1C19] px-8 py-2.5 font-beVietnamPro text-sm text-white hover:bg-[#333] disabled:opacity-50">
                  {saving ? (
                    <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Đang lưu...</>
                  ) : (
                    isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
