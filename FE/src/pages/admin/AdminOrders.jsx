import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiRefreshCw, FiShoppingBag, FiChevronLeft, FiChevronRight,
  FiEye, FiX, FiMapPin, FiPhone, FiUser, FiPackage, FiClock, FiTruck,
  FiCheckCircle, FiXCircle, FiAlertCircle, FiCreditCard, FiDownload
} from 'react-icons/fi'
import { getAdminOrders, getAdminOrderDetail, updateOrderStatus } from '../../services/adminService'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + '₫'

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ xử lý',   bg: 'bg-amber-50',  text: 'text-amber-700',  icon: FiClock        },
  SHIPPING:  { label: 'Đang giao',    bg: 'bg-blue-50',   text: 'text-blue-700',   icon: FiTruck        },
  COMPLETED: { label: 'Hoàn thành',   bg: 'bg-green-50',  text: 'text-green-700',  icon: FiCheckCircle  },
  CANCELLED: { label: 'Đã huỷ',       bg: 'bg-red-50',    text: 'text-red-700',    icon: FiXCircle      },
}

const PAYMENT_MAP = {
  COD: 'Tiền mặt (COD)',
  VNPAY: 'VNPay',
  MOMO: 'MoMo',
  BANK_TRANSFER: 'Chuyển khoản',
}

const SHIP_MAP = {
  FAST: 'Giao nhanh (35k)',
  STANDARD: 'Giao tiêu chuẩn (20k)',
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-beVietnamPro text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  )
}

function OrderDetailModal({ order, onClose, onStatusChange }) {
  const [updating, setUpdating] = useState(false)

  const handleStatus = async (newStatus) => {
    setUpdating(true)
    try {
      await onStatusChange(order.id, newStatus)
      toast.success('Đã cập nhật trạng thái')
    } catch {
      toast.error('Cập nhật thất bại')
    } finally {
      setUpdating(false)
    }
  }

  if (!order) return null

  const statusFlow = ['PENDING', 'SHIPPING', 'COMPLETED']
  const currentIdx = statusFlow.indexOf(order.status)

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
          className="relative h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E8E0D8] bg-white px-6 py-4">
            <div>
              <h2 className="font-beVietnamPro text-lg font-semibold text-[#1B1C19]">{order.orderCode}</h2>
              <p className="font-beVietnamPro text-xs text-[#9E8E7E]">
                {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '—'}
              </p>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9]">
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-5 p-6">
            {/* Status */}
            <div className="border border-[#E8E0D8] p-4">
              <p className="mb-3 font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Trạng thái đơn hàng</p>
              <div className="mb-4">
                <StatusBadge status={order.status} />
              </div>
              {order.status !== 'CANCELLED' && (
                <div className="flex flex-wrap gap-2">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatus('SHIPPING')}
                      disabled={updating}
                      className="flex items-center gap-2 bg-blue-600 px-4 py-2 font-beVietnamPro text-xs text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      <FiTruck className="h-3.5 w-3.5" />
                      Xác nhận giao hàng
                    </button>
                  )}
                  {order.status === 'SHIPPING' && (
                    <button
                      onClick={() => handleStatus('COMPLETED')}
                      disabled={updating}
                      className="flex items-center gap-2 bg-green-600 px-4 py-2 font-beVietnamPro text-xs text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      <FiCheckCircle className="h-3.5 w-3.5" />
                      Đã giao thành công
                    </button>
                  )}
                  {order.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleStatus('CANCELLED')}
                      disabled={updating}
                      className="flex items-center gap-2 border border-red-200 px-4 py-2 font-beVietnamPro text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      <FiXCircle className="h-3.5 w-3.5" />
                      Huỷ đơn
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Customer info */}
            <div className="border border-[#E8E0D8] p-4">
              <p className="mb-3 font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Thông tin khách hàng</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiUser className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
                  <span className="font-beVietnamPro text-sm text-[#1B1C19]">{order.shippingName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
                  <span className="font-beVietnamPro text-sm text-[#4E453D]">{order.shippingPhone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9E8E7E]" />
                  <span className="font-beVietnamPro text-sm text-[#4E453D]">{order.shippingAddress}</span>
                </div>
                {order.customerEmail && (
                  <p className="font-beVietnamPro text-xs text-[#9E8E7E]">{order.customerEmail}</p>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="border border-[#E8E0D8] p-4">
              <p className="mb-3 font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Sản phẩm ({order.items?.length || 0})</p>
              <div className="space-y-3">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E8E0D8] bg-[#F5F3EE]">
                      {item.productImage
                        ? <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                        : <FiPackage className="m-auto mt-3 h-5 w-5 text-[#D1C4B9]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19] line-clamp-1">{item.productName}</p>
                      <p className="font-beVietnamPro text-xs text-[#9E8E7E]">
                        {[item.size, item.color].filter(Boolean).join(' · ')} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19] shrink-0">{fmt(item.lineTotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment summary */}
            <div className="border border-[#E8E0D8] p-4">
              <p className="mb-3 font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Thanh toán</p>
              <div className="space-y-2 font-beVietnamPro text-sm">
                <div className="flex justify-between text-[#4E453D]">
                  <span>Tạm tính</span><span>{fmt(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4E453D]">
                  <span>Phí vận chuyển ({SHIP_MAP[order.shippingMethod] || order.shippingMethod})</span>
                  <span>{fmt(order.shippingFee)}</span>
                </div>
                {Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá {order.couponCode && `(${order.couponCode})`}</span>
                    <span>-{fmt(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#E8E0D8] pt-2 font-semibold text-[#1B1C19]">
                  <span>Tổng cộng</span><span>{fmt(order.totalAmount)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <FiCreditCard className="h-4 w-4 text-[#9E8E7E]" />
                  <span className="text-[#4E453D]">{PAYMENT_MAP[order.paymentMethod] || order.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Note */}
            {order.note && (
              <div className="border border-[#E8E0D8] p-4">
                <p className="mb-1 font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">Ghi chú</p>
                <p className="font-beVietnamPro text-sm text-[#4E453D]">{order.note}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [inputKw, setInputKw] = useState('')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(0)

  const [detailOrder, setDetailOrder] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAdminOrders({ keyword, status, page, size: 10 })
      setOrders(data.content || [])
      setTotal(data.totalElements || 0)
      setTotalPages(data.totalPages || 1)
    } catch {
      toast.error('Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }, [keyword, status, page])

  useEffect(() => { load() }, [load])

  const openDetail = async (id) => {
    setDetailLoading(true)
    try {
      const data = await getAdminOrderDetail(id)
      setDetailOrder(data)
    } catch {
      toast.error('Không thể tải chi tiết đơn hàng')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    const updated = await updateOrderStatus(id, newStatus)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: updated.status } : o))
    setDetailOrder(updated)
  }

  const statusTabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xử lý' },
    { key: 'SHIPPING', label: 'Đang giao' },
    { key: 'COMPLETED', label: 'Hoàn thành' },
    { key: 'CANCELLED', label: 'Đã huỷ' },
  ]

  const exportToExcel = () => {
    if (!orders || orders.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }

    const exportData = orders.map(o => ({
      'Mã đơn': o.orderCode,
      'Ngày tạo': o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : '',
      'Khách hàng': o.shippingName,
      'Số điện thoại': o.shippingPhone,
      'Sản phẩm': o.items?.map(i => `${i.productName} (${i.quantity})`).join(', ') || '',
      'Tổng tiền (VNĐ)': o.totalAmount,
      'Thanh toán': PAYMENT_MAP[o.paymentMethod] || o.paymentMethod,
      'Trạng thái': STATUS_CONFIG[o.status]?.label || o.status
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    
    const colWidths = [
      { wch: 15 }, // Mã đơn
      { wch: 20 }, // Ngày tạo
      { wch: 25 }, // Khách hàng
      { wch: 15 }, // SĐT
      { wch: 40 }, // Sản phẩm
      { wch: 15 }, // Tổng tiền
      { wch: 20 }, // Thanh toán
      { wch: 15 }, // Trạng thái
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "DonHang")
    XLSX.writeFile(wb, `DanhSachDonHang_${new Date().toISOString().slice(0,10)}.xlsx`)
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#FBF9F4] px-8 pb-16 pt-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Quản lý đơn hàng</h1>
          <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">
            Tổng cộng <span className="font-semibold">{total}</span> đơn hàng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportToExcel} className="flex items-center gap-2 rounded-xl border border-[#D1C4B9] bg-green-600 px-4 py-2.5 transition-all duration-300 font-beVietnamPro text-sm text-white hover:bg-green-700">
            <FiDownload className="h-4 w-4" />
            Xuất Excel
          </button>
          <button onClick={load} className="flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-2.5 transition-all duration-300 focus:border-[#1B1C19] font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]">
            <FiRefreshCw className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex overflow-x-auto border-b border-[#D1C4B9]">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setStatus(tab.key); setPage(0) }}
            className={`whitespace-nowrap px-5 py-3 font-beVietnamPro text-sm font-medium transition-colors border-b-2 -mb-px ${
              status === tab.key
                ? 'border-[#1B1C19] text-[#1B1C19]'
                : 'border-transparent text-[#9E8E7E] hover:text-[#4E453D]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="border border-[#D1C4B9] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-2.5 transition-all duration-300 focus:border-[#1B1C19]">
            <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
            <input
              value={inputKw}
              onChange={e => setInputKw(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { setKeyword(inputKw); setPage(0) } }}
              placeholder="Tìm theo mã đơn, tên, số điện thoại..."
              className="flex-1 bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
            />
            {inputKw && (
              <button onClick={() => { setInputKw(''); setKeyword(''); setPage(0) }} className="text-[#9E8E7E] hover:text-[#1B1C19]">×</button>
            )}
          </div>
          <button
            onClick={() => { setKeyword(inputKw); setPage(0) }}
            className="rounded-xl bg-[#1B1C19] px-5 py-2.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-beVietnamPro text-sm text-white hover:bg-[#333]"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#D1C4B9] bg-white overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#D1C4B9] bg-[#F5F3EE]">
              {['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Tổng tiền', 'Thanh toán', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} className="px-5 py-4 text-left font-beVietnamPro text-xs font-semibold uppercase tracking-wider text-[#6F583D]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-[#F0EEE9]">
                  {[...Array(7)].map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 animate-pulse rounded bg-[#F0EEE9]" style={{ width: j === 2 ? '75%' : '55%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <FiShoppingBag className="mx-auto mb-3 h-10 w-10 text-[#D1C4B9]" />
                  <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Không tìm thấy đơn hàng nào</p>
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#F0EEE9] hover:bg-[#FAFAF8] transition-all duration-300"
                >
                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">{order.orderCode}</p>
                    <p className="font-beVietnamPro text-xs text-[#9E8E7E]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '—'}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-sm text-[#1B1C19]">{order.shippingName}</p>
                    <p className="font-beVietnamPro text-xs text-[#9E8E7E]">{order.shippingPhone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-sm text-[#4E453D] line-clamp-1">
                      {order.items?.length > 0 ? (
                        <>
                          {order.items[0].productName}
                          {order.items.length > 1 && <span className="text-[#9E8E7E]"> +{order.items.length - 1}</span>}
                        </>
                      ) : '—'}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">{fmt(order.totalAmount)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-beVietnamPro text-xs text-[#4E453D]">{PAYMENT_MAP[order.paymentMethod] || order.paymentMethod}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => openDetail(order.id)}
                      className="flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#1B1C19]"
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
          <p className="font-beVietnamPro text-sm text-[#9E8E7E]">
            Trang {page + 1} / {totalPages} — {total} đơn hàng
          </p>
          <div className="flex items-center gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="flex h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40">
              <FiChevronLeft className="h-4 w-4" />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pg = Math.max(0, Math.min(page - 2, totalPages - 5)) + i
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`flex h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center border font-beVietnamPro text-sm ${
                    page === pg ? 'border-[#1B1C19] bg-[#1B1C19] text-white' : 'border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9]'
                  }`}>
                  {pg + 1}
                </button>
              )
            })}
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="flex h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40">
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}