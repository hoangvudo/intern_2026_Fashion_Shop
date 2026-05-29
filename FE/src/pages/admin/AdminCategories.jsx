import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiRefreshCw, FiTag, FiEye, FiEyeOff,
} from 'react-icons/fi'
import { useAdminCategories } from '../../hooks/useCategories'
import categoryService from '../../services/categoryService'
import CategoryFormModal from '../../components/admin/categories/CategoryFormModal'
import DeleteCategoryModal from '../../components/admin/categories/DeleteCategoryModal'
import toast from 'react-hot-toast'

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-beVietnamPro text-xs font-medium ${
      active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`} />
      {active ? 'Hiển thị' : 'Ẩn'}
    </span>
  )
}

export default function AdminCategories() {
  const { categories, loading, refresh } = useAdminCategories()

  const [keyword, setKeyword] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(null)

  const openCreate = () => { setEditCategory(null); setFormOpen(true) }
  const openEdit   = (c) => { setEditCategory(c);    setFormOpen(true) }
  const openDelete = (c) => { setDeleteTarget(c);    setDeleteOpen(true) }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await categoryService.delete(deleteTarget.id)
      toast.success('Đã xoá danh mục')
      setDeleteOpen(false)
      refresh()
    } catch {
      toast.error('Xoá thất bại — danh mục có thể đang có sản phẩm')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleActive = async (c) => {
    setToggling(c.id)
    try {
      await categoryService.update(c.id, { ...c, isActive: !c.isActive })
      toast.success(c.isActive ? 'Đã ẩn danh mục' : 'Đã hiện danh mục')
      refresh()
    } catch {
      toast.error('Cập nhật thất bại')
    } finally {
      setToggling(null)
    }
  }

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <div className="flex min-h-screen flex-col gap-6 px-8 pb-16 pt-8">

      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Quản lý danh mục</h1>
          <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">
            Tổng cộng <span className="font-semibold">{categories.length}</span> danh mục
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1B1C19] px-5 py-2.5 font-beVietnamPro text-sm text-white hover:bg-[#333] transition-colors"
        >
          <FiPlus className="h-4 w-4" />
          Thêm danh mục
        </button>
      </div>

      {/* Filter bar */}
      <div className="border border-[#D1C4B9] bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 min-w-[240px] items-center gap-2 border border-[#D1C4B9] px-4 py-2.5">
            <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Tìm theo tên danh mục..."
              className="flex-1 bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
            />
            {keyword && (
              <button onClick={() => setKeyword('')} className="text-[#9E8E7E] hover:text-[#1B1C19]">×</button>
            )}
          </div>
          <button onClick={refresh}
            className="flex items-center gap-2 border border-[#D1C4B9] px-4 py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]">
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#D1C4B9] bg-white overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#D1C4B9] bg-[#F5F3EE]">
              {['Danh mục', 'Slug', 'Mô tả', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#F0EEE9]">
                    {[...Array(5)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-[#F0EEE9]" style={{ width: j === 0 ? '70%' : '50%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <FiTag className="mx-auto mb-3 h-10 w-10 text-[#D1C4B9]" />
                    <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Không tìm thấy danh mục nào</p>
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[#F0EEE9] hover:bg-[#FAFAF8] transition-colors"
                  >
                    {/* Danh mục */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden border border-[#E8E0D8] bg-[#F5F3EE]">
                          {c.imageUrl
                            ? <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                            : <FiTag className="m-auto h-5 w-5 text-[#D1C4B9] mt-3.5" />
                          }
                        </div>
                        <div>
                          <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19]">{c.name}</p>
                          <p className="font-beVietnamPro text-xs text-[#9E8E7E]">ID #{c.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-5 py-4">
                      <code className="font-beVietnamPro text-xs text-[#6F583D] bg-[#F5F3EE] px-2 py-1">
                        {c.slug || '—'}
                      </code>
                    </td>

                    {/* Mô tả */}
                    <td className="px-5 py-4 max-w-[220px]">
                      <p className="font-beVietnamPro text-sm text-[#4E453D] line-clamp-2">
                        {c.description || <span className="text-[#C5B9AE]">Chưa có mô tả</span>}
                      </p>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-5 py-4">
                      <StatusBadge active={c.isActive} />
                    </td>

                    {/* Thao tác */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {/* Toggle */}
                        <button
                          onClick={() => handleToggleActive(c)}
                          disabled={toggling === c.id}
                          title={c.isActive ? 'Ẩn danh mục' : 'Hiện danh mục'}
                          className="flex h-8 w-8 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#6F583D] disabled:opacity-40"
                        >
                          {toggling === c.id
                            ? <span className="h-3.5 w-3.5 rounded-full border-2 border-[#9E8E7E] border-t-[#6F583D] animate-spin" />
                            : c.isActive ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />
                          }
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEdit(c)}
                          title="Chỉnh sửa"
                          className="flex h-8 w-8 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#1B1C19]"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => openDelete(c)}
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
  )
}
