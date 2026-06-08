import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiRefreshCw, FiUsers, FiChevronLeft, FiChevronRight,
  FiEye, FiX, FiUser, FiMail, FiPhone, FiShoppingBag, FiLock, FiUnlock,
  FiCheckCircle, FiAlertCircle, FiCalendar,
} from 'react-icons/fi'
import { getAdminCustomers, getAdminCustomerDetail, toggleCustomerActive } from '../../services/adminService'
import toast from 'react-hot-toast'

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + '₫'

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-beVietnamPro text-xs font-medium ${
      active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`} />
      {active ? 'Hoạt động' : 'Đã khoá'}
    </span>
  )
}

function RoleBadge({ role }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 font-beVietnamPro text-[10px] font-semibold uppercase tracking-wider ${
      role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : 'bg-[#F5F3EE] text-[#6F583D]'
    }`}>
      {role}
    </span>
  )
}

function CustomerDetailDrawer({ userId, onClose, onToggleActive }) {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    getAdminCustomerDetail(userId)
      .then(setCustomer)
      .catch(() => toast.error('Không thể tải thông tin'))
      .finally(() => setLoading(false))
  }, [userId])

  const handleToggle = async () => {
    setToggling(true)
    try {
      const updated = await onToggleActive(userId)
      setCustomer(updated)
      toast.success(updated.isActive ? 'Đã mở khoá tài khoản' : 'Đã khoá tài khoản')
    } catch {
      toast.error('Cập nhật thất bại')
    } finally {
      setToggling(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-end bg-black/30"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E8E0D8] bg-white px-6 py-4">
            <h2 className="font-beVietnamPro text-lg font-semibold text-[#1B1C19]">Chi tiết khách hàng</h2>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9]">
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <span className="h-8 w-8 rounded-full border-2 border-[#D1C4B9] border-t-[#6F583D] animate-spin" />
            </div>
          ) : customer ? (
            <div className="flex flex-col gap-5 p-6">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center border border-[#D1C4B9] bg-[#F5F3EE]">
                  <span className="font-beVietnamPro text-2xl font-semibold text-[#6F583D]">
                    {(customer.fullName || customer.email || '?')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-beVietnamPro text-lg font-semibold text-[#1B1C19]">{customer.fullName || 'Chưa cập nhật'}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge active={customer.isActive} />
                    <RoleBadge role={customer.role} />
                    {customer.isVerified && (
                      <FiCheckCircle className="h-4 w-4 text-green-500" title="Email đã xác thực" />
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border border-[#E8E0D8] p-4 space-y-2">
                <p className="mb-2 font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Thông tin liên hệ</p>
                <div className="flex items-center gap-2">
                  <FiMail className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
                  <span className="font-beVietnamPro text-sm text-[#4E453D]">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
                    <span className="font-beVietnamPro text-sm text-[#4E453D]">{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FiCalendar className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
                  <span className="font-beVietnamPro text-sm text-[#4E453D]">
                    Tham gia {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-[#E8E0D8] p-4 text-center">
                  <p className="font-beVietnamPro text-2xl font-bold text-[#1B1C19]">{customer.totalOrders || 0}</p>
                  <p className="mt-1 font-beVietnamPro text-xs text-[#9E8E7E]">Đơn hàng</p>
                </div>
                <div className="border border-[#E8E0D8] p-4 text-center">
                  <p className="font-beVietnamPro text-lg font-bold text-[#1B1C19]">{fmt(customer.totalSpent)}</p>
                  <p className="mt-1 font-beVietnamPro text-xs text-[#9E8E7E]">Đã chi tiêu</p>
                </div>
              </div>

              {/* Actions */}
              {customer.role !== 'ADMIN' && (
                <button
                  onClick={handleToggle}
                  disabled={toggling}
                  className={`flex items-center justify-center gap-2 px-4 py-3 font-beVietnamPro text-sm font-medium transition-colors disabled:opacity-60 ${
                    customer.isActive
                      ? 'border border-red-200 text-red-600 hover:bg-red-50'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {customer.isActive ? <FiLock className="h-4 w-4" /> : <FiUnlock className="h-4 w-4" />}
                  {customer.isActive ? 'Khoá tài khoản' : 'Mở khoá tài khoản'}
                </button>
              )}
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [inputKw, setInputKw] = useState('')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [selectedUserId, setSelectedUserId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAdminCustomers({ keyword, page, size: 10 })
      setCustomers(data.content || [])
      setTotal(data.totalElements || 0)
      setTotalPages(data.totalPages || 1)
    } catch {
      toast.error('Không thể tải danh sách khách hàng')
    } finally {
      setLoading(false)
    }
  }, [keyword, page])

  useEffect(() => { load() }, [load])

  const handleToggleActive = async (id) => {
    const updated = await toggleCustomerActive(id)
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, isActive: updated.isActive } : c))
    return updated
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 px-8 pb-16 pt-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Quản lý khách hàng</h1>
          <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">
            Tổng cộng <span className="font-semibold">{total}</span> tài khoản
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-2 border border-[#D1C4B9] px-4 py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]">
          <FiRefreshCw className="h-4 w-4" />
          Làm mới
        </button>
      </div>

      {/* Search */}
      <div className="border border-[#D1C4B9] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 border border-[#D1C4B9] px-4 py-2.5">
            <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
            <input
              value={inputKw}
              onChange={e => setInputKw(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { setKeyword(inputKw); setPage(0) } }}
              placeholder="Tìm theo tên, email, số điện thoại..."
              className="flex-1 bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
            />
            {inputKw && <button onClick={() => { setInputKw(''); setKeyword(''); setPage(0) }} className="text-[#9E8E7E]">×</button>}
          </div>
          <button onClick={() => { setKeyword(inputKw); setPage(0) }}
            className="bg-[#1B1C19] px-5 py-2.5 font-beVietnamPro text-sm text-white hover:bg-[#333]">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#D1C4B9] bg-white overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#D1C4B9] bg-[#F5F3EE]">
              {['Khách hàng', 'Liên hệ', 'Đơn hàng', 'Đã chi', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-[#F0EEE9]">
                  {[...Array(6)].map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 animate-pulse rounded bg-[#F0EEE9]" style={{ width: j === 0 ? '70%' : '55%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <FiUsers className="mx-auto mb-3 h-10 w-10 text-[#D1C4B9]" />
                  <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Không tìm thấy khách hàng nào</p>
                </td>
              </tr>
            ) : (
              customers.map(c => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-[#F0EEE9] hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#E8E0D8] bg-[#F5F3EE]">
                        <span className="font-beVietnamPro text-sm font-medium text-[#6F583D]">
                          {(c.fullName || c.email || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19]">{c.fullName || '—'}</p>
                        <div className="mt-0.5">
                          <RoleBadge role={c.role} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-sm text-[#4E453D]">{c.email}</p>
                    {c.phone && <p className="font-beVietnamPro text-xs text-[#9E8E7E]">{c.phone}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-sm text-[#1B1C19]">{c.totalOrders || 0}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19]">{fmt(c.totalSpent)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge active={c.isActive} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedUserId(c.id)}
                      className="flex h-8 w-8 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#1B1C19]"
                      title="Xem chi tiết"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Trang {page + 1} / {totalPages}</p>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="flex h-9 w-9 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40">
              <FiChevronLeft className="h-4 w-4" />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pg = Math.max(0, Math.min(page - 2, totalPages - 5)) + i
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`flex h-9 w-9 items-center justify-center border font-beVietnamPro text-sm ${
                    page === pg ? 'border-[#1B1C19] bg-[#1B1C19] text-white' : 'border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9]'
                  }`}>
                  {pg + 1}
                </button>
              )
            })}
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="flex h-9 w-9 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40">
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {selectedUserId && (
        <CustomerDetailDrawer
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  )
}