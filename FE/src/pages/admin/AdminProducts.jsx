import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiEyeOff,
  FiFilter, FiRefreshCw, FiPackage, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi'
import { useAdminProducts } from '../../hooks/useProducts'
import ProductFormModal from '../../components/admin/products/ProductFormModal'
import DeleteConfirmModal from '../../components/admin/products/DeleteConfirmModal'
import productService from '../../services/productService'
import toast from 'react-hot-toast'

// ── helpers ─────────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫'

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-beVietnamPro text-xs font-medium ${
      active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`} />
      {active ? 'Đang bán' : 'Ẩn'}
    </span>
  )
}

function StockBadge({ stock }) {
  if (stock === 0) return <span className="font-beVietnamPro text-xs font-semibold text-red-500">Hết hàng</span>
  if (stock < 10) return <span className="font-beVietnamPro text-xs font-semibold text-amber-600">Sắp hết ({stock})</span>
  return <span className="font-beVietnamPro text-sm text-[#4E453D]">{stock}</span>
}

// ── main page ───────────────────────────────────────────────────
export default function AdminProducts() {
  const { products, total, totalPages, loading, filters, updateFilter, refresh } = useAdminProducts()
  const [categories, setCategories] = useState([])
  const [brands, setBrands]         = useState([])

  // Modal state
  const [formOpen, setFormOpen]         = useState(false)
  const [editProduct, setEditProduct]   = useState(null)
  const [deleteOpen, setDeleteOpen]     = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)
  const [toggling, setToggling]         = useState(null)

  // Load categories & brands for dropdowns
  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {})
    productService.getBrands().then(setBrands).catch(() => {})
  }, [])

  // ── handlers ──────────────────────────────────────────────────
  const openCreate = () => { setEditProduct(null); setFormOpen(true) }
  const openEdit   = (p) => { setEditProduct(p);    setFormOpen(true) }

  const openDelete = (p) => { setDeleteTarget(p); setDeleteOpen(true) }
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await productService.delete(deleteTarget.id)
      toast.success('Đã xoá sản phẩm')
      setDeleteOpen(false)
      refresh()
    } catch {
      toast.error('Xoá thất bại')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (p) => {
    setToggling(p.id)
    try {
      await productService.toggleActive(p.id)
      toast.success(p.isActive ? 'Đã ẩn sản phẩm' : 'Đã hiện sản phẩm')
      refresh()
    } catch {
      toast.error('Cập nhật thất bại')
    } finally {
      setToggling(null)
    }
  }

  const [keyword, setKeyword] = useState(filters.keyword)

  return (
    <div className="flex min-h-screen flex-col gap-6 px-8 pb-16 pt-8">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Quản lý sản phẩm</h1>
          <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">
            Tổng cộng <span className="font-semibold">{total}</span> sản phẩm
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1B1C19] px-5 py-2.5 font-beVietnamPro text-sm text-white hover:bg-[#333] transition-colors"
        >
          <FiPlus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Filters bar */}
      <div className="border border-[#D1C4B9] bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex flex-1 min-w-[240px] items-center gap-2 border border-[#D1C4B9] px-4 py-2.5">
            <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && updateFilter('keyword', keyword)}
              placeholder="Tìm theo tên sản phẩm..."
              className="flex-1 bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
            />
            {keyword && (
              <button onClick={() => { setKeyword(''); updateFilter('keyword', '') }}
                className="text-[#9E8E7E] hover:text-[#1B1C19]">×</button>
            )}
          </div>

          {/* Category */}
          <select
            value={filters.categoryId}
            onChange={e => updateFilter('categoryId', e.target.value)}
            className="border border-[#D1C4B9] bg-white px-4 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Brand */}
          <select
            value={filters.brandId}
            onChange={e => updateFilter('brandId', e.target.value)}
            className="border border-[#D1C4B9] bg-white px-4 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          {/* Status */}
          <select
            value={filters.isActive}
            onChange={e => updateFilter('isActive', e.target.value)}
            className="border border-[#D1C4B9] bg-white px-4 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang bán</option>
            <option value="false">Đã ẩn</option>
          </select>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={e => updateFilter('sortBy', e.target.value)}
            className="border border-[#D1C4B9] bg-white px-4 py-2.5 font-beVietnamPro text-sm text-[#1B1C19] focus:border-[#6F583D] focus:outline-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="name">Tên A→Z</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="popular">Bán chạy</option>
          </select>

          <button onClick={refresh}
            className="flex items-center gap-2 border border-[#D1C4B9] px-4 py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]">
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#D1C4B9] bg-white overflow-x-auto">
        {/* Table header */}
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#D1C4B9] bg-[#F5F3EE]">
              {['Sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                // Skeleton
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-[#F0EEE9]">
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-[#F0EEE9]" style={{ width: j === 0 ? '80%' : '60%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <FiPackage className="mx-auto mb-3 h-10 w-10 text-[#D1C4B9]" />
                    <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Không tìm thấy sản phẩm nào</p>
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#F0EEE9] hover:bg-[#FAFAF8] transition-colors"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden border border-[#E8E0D8] bg-[#F5F3EE]">
                          {p.thumbnailUrl
                            ? <img src={p.thumbnailUrl} alt={p.name} className="h-full w-full object-cover" />
                            : <FiPackage className="m-auto h-6 w-6 text-[#D1C4B9] mt-3" />
                          }
                        </div>
                        <div>
                          <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19] line-clamp-1">{p.name}</p>
                          <p className="font-beVietnamPro text-xs text-[#9E8E7E]">ID #{p.id}</p>
                          <div className="flex gap-1.5 mt-1">
                            {p.isFeatured    && <span className="rounded-full bg-amber-50  px-2 py-0.5 font-beVietnamPro text-[10px] text-amber-600">Nổi bật</span>}
                            {p.isNewArrival  && <span className="rounded-full bg-blue-50   px-2 py-0.5 font-beVietnamPro text-[10px] text-blue-600">Mới</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <p className="font-beVietnamPro text-sm text-[#4E453D]">{p.categoryName || '—'}</p>
                      {p.brandName && <p className="font-beVietnamPro text-xs text-[#9E8E7E]">{p.brandName}</p>}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      {p.salePrice ? (
                        <div>
                          <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">{fmt(p.salePrice)}</p>
                          <p className="font-beVietnamPro text-xs text-[#9E8E7E] line-through">{fmt(p.price)}</p>
                        </div>
                      ) : (
                        <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">{fmt(p.price)}</p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <StockBadge stock={p.totalStock} />
                      {p.variants && p.variants.length > 0 && (
                        <p className="mt-0.5 font-beVietnamPro text-xs text-[#C5B9AE]">{p.variants.length} biến thể</p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge active={p.isActive} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {/* Toggle active */}
                        <button
                          onClick={() => handleToggleActive(p)}
                          disabled={toggling === p.id}
                          title={p.isActive ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                          className="flex h-8 w-8 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#6F583D] disabled:opacity-40"
                        >
                          {toggling === p.id
                            ? <span className="h-3.5 w-3.5 rounded-full border-2 border-[#9E8E7E] border-t-[#6F583D] animate-spin" />
                            : p.isActive ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />
                          }
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEdit(p)}
                          title="Chỉnh sửa"
                          className="flex h-8 w-8 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#1B1C19]"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => openDelete(p)}
                          title="Xoá"
                          className="flex h-8 w-8 items-center justify-center text-[#9E8E7E] hover:bg-red-50 hover:text-red-500"
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
        <div className="flex items-center justify-between">
          <p className="font-beVietnamPro text-sm text-[#9E8E7E]">
            Trang {filters.page + 1} / {totalPages} — {total} sản phẩm
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={filters.page === 0}
              onClick={() => updateFilter('page', filters.page - 1)}
              className="flex h-9 w-9 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = Math.max(0, Math.min(filters.page - 2, totalPages - 5)) + i
              return (
                <button
                  key={pageNum}
                  onClick={() => updateFilter('page', pageNum)}
                  className={`flex h-9 w-9 items-center justify-center border font-beVietnamPro text-sm ${
                    filters.page === pageNum
                      ? 'border-[#1B1C19] bg-[#1B1C19] text-white'
                      : 'border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9]'
                  }`}
                >
                  {pageNum + 1}
                </button>
              )
            })}

            <button
              disabled={filters.page >= totalPages - 1}
              onClick={() => updateFilter('page', filters.page + 1)}
              className="flex h-9 w-9 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
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
  )
}
