import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiRefreshCw, FiAlertCircle, FiRotateCcw,
  FiCheckCircle, FiXCircle, FiClock, FiEye, FiX,
} from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  CANCEL:   { label: 'Hủy đơn',    bg: 'bg-red-50',    text: 'text-red-700',    icon: FiAlertCircle },
  RETURN:   { label: 'Trả hàng',   bg: 'bg-orange-50', text: 'text-orange-700', icon: FiRotateCcw   },
  EXCHANGE: { label: 'Đổi hàng',   bg: 'bg-blue-50',   text: 'text-blue-700',   icon: FiRefreshCw   },
}

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ duyệt',  bg: 'bg-amber-50',  text: 'text-amber-700',  icon: FiClock        },
  APPROVED:  { label: 'Đã duyệt',   bg: 'bg-green-50',  text: 'text-green-700',  icon: FiCheckCircle  },
  REJECTED:  { label: 'Từ chối',    bg: 'bg-red-50',    text: 'text-red-700',    icon: FiXCircle      },
  COMPLETED: { label: 'Hoàn tất',   bg: 'bg-gray-100',  text: 'text-gray-600',   icon: FiCheckCircle  },
}

const FILTER_TABS = [
  { key: 'ALL',       label: 'Tất cả'    },
  { key: 'PENDING',   label: 'Chờ duyệt' },
  { key: 'APPROVED',  label: 'Đã duyệt'  },
  { key: 'REJECTED',  label: 'Từ chối'   },
  { key: 'COMPLETED', label: 'Hoàn tất'  },
]

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—'

function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.RETURN
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  )
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  )
}

/* ── Detail Modal ─────────────────────────────────────────────── */
function ReturnDetailModal({ request, onClose, onUpdate }) {
  const [adminNote, setAdminNote] = useState(request?.adminNote || '')
  const [updating, setUpdating] = useState(false)

  if (!request) return null

  const handleUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await onUpdate(request.id, newStatus, adminNote)
      toast.success('Đã cập nhật yêu cầu')
      onClose()
    } catch {
      toast.error('Cập nhật thất bại')
    } finally {
      setUpdating(false)
    }
  }

  const typeLabel = TYPE_CONFIG[request.type]?.label || request.type

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center rounded-full bg-[#F0EEE9] text-[#4E453D] hover:bg-[#E8E0D8]"
          >
            <FiX className="h-4 w-4" />
          </button>

          <div className="p-6">
            <h2 className="mb-1 text-lg font-bold font-beVietnamPro text-[#1B1C19]">
              Chi tiết yêu cầu
            </h2>
            <p className="mb-5 text-sm text-gray-400">{request.returnCode}</p>

            {/* Info grid */}
            <div className="mb-5 space-y-3 rounded-xl bg-[#F5F3EE] p-4">
              <InfoRow label="Đơn hàng" value={`#${request.orderCode}`} />
              <InfoRow label="Loại" value={<TypeBadge type={request.type} />} />
              <InfoRow label="Trạng thái" value={<StatusBadge status={request.status} />} />
              <InfoRow label="Lý do" value={request.reason} />
              {request.description && <InfoRow label="Mô tả" value={request.description} />}
              {request.type === 'EXCHANGE' && request.exchangeSize && (
                <InfoRow label="Size muốn đổi" value={request.exchangeSize} />
              )}
              {request.type === 'EXCHANGE' && request.exchangeColor && (
                <InfoRow label="Màu muốn đổi" value={request.exchangeColor} />
              )}
              <InfoRow label="Ngày tạo" value={fmtDate(request.createdAt)} />

              {request.imageUrls && (
                <div className="mt-2 border-t border-[#D1C4B9] pt-3">
                  <span className="mb-2 block text-xs font-medium text-gray-500">Ảnh đính kèm:</span>
                  <div className="flex flex-wrap gap-2">
                    {request.imageUrls.split(',').filter(Boolean).map((url, idx) => (
                      <a key={idx} href={url.trim()} target="_blank" rel="noreferrer" className="block h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
                        <img src={url.trim()} alt="minh chứng" className="h-full w-full object-cover transition-opacity hover:opacity-80" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin note */}
            {request.status === 'PENDING' && (
              <>
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium font-beVietnamPro text-[#4E453D]">
                    Ghi chú admin (tùy chọn)
                  </label>
                  <textarea
                    rows={3}
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    placeholder="Nhập phản hồi cho khách hàng..."
                    className="w-full rounded-lg border border-[#D1C4B9] px-3 py-2.5 text-sm outline-none focus:border-[#6F583D] font-beVietnamPro text-[#1B1C19]"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={updating}
                    onClick={() => handleUpdate('REJECTED')}
                    className="flex-1 rounded-full border border-red-200 py-2.5 text-sm font-semibold font-beVietnamPro text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Từ chối
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdate('APPROVED')}
                    className="flex-1 rounded-full bg-[#1B1C19] py-2.5 text-sm font-semibold font-beVietnamPro text-white hover:bg-[#333] disabled:opacity-50"
                  >
                    {updating ? 'Đang xử lý...' : 'Phê duyệt'}
                  </button>
                </div>
              </>
            )}

            {request.status === 'APPROVED' && (
              <button
                disabled={updating}
                onClick={() => handleUpdate('COMPLETED')}
                className="w-full rounded-full bg-[#1B1C19] py-2.5 text-sm font-semibold font-beVietnamPro text-white hover:bg-[#333] disabled:opacity-50"
              >
                {updating ? 'Đang xử lý...' : 'Đánh dấu Hoàn tất'}
              </button>
            )}

            {request.adminNote && request.status !== 'PENDING' && (
              <div className="mt-4 rounded-xl bg-[#F5F3EE] p-3 text-sm">
                <span className="font-medium text-[#6F583D]">Ghi chú admin: </span>
                <span className="text-[#1B1C19]">{request.adminNote}</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-[#9E8E7E] font-beVietnamPro">{label}</span>
      <span className="font-medium font-beVietnamPro text-[#1B1C19] text-right">{value}</span>
    </div>
  )
}

/* ── Main Admin Returns Page ─────────────────────────────────── */
export default function AdminReturns() {
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/returns', {
        params: { keyword, status: statusFilter, page, size: 20 }
      })
      setData(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [keyword, statusFilter, page])

  useEffect(() => { fetchData() }, [fetchData])

  const handleUpdate = async (id, newStatus, adminNote) => {
    await api.patch(`/admin/returns/${id}/status`, { status: newStatus, adminNote })
    fetchData()
  }

  const requests = data.content || []

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#FBF9F4] px-8 pb-16 pt-8">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Yêu cầu Hủy / Đổi / Trả</h1>
            <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">
              Tổng cộng <span className="font-semibold">{data.totalElements || 0}</span> yêu cầu
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-2.5 transition-all duration-300 focus:border-[#1B1C19] font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]"
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Filters bar */}
        <div className="rounded-2xl border border-[#D1C4B9] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-xl border border-[#D1C4B9] px-4 py-2.5 transition-all duration-300 focus:border-[#1B1C19]">
              <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
              <input
                type="text"
                placeholder="Tìm theo mã đơn, tên khách..."
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setPage(0) }}
                className="flex-1 bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E]"
              />
            </div>

            {/* Status Tabs */}
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setStatusFilter(tab.key); setPage(0) }}
                className={`px-4 py-2.5 font-beVietnamPro text-sm font-medium transition-colors ${
                  statusFilter === tab.key
                    ? 'border border-[#1B1C19] bg-[#1B1C19] text-white'
                    : 'border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[#D1C4B9] bg-white overflow-hidden shadow-sm overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 animate-spin rounded-full border-2 border-[#D1C4B9] border-t-[#1B1C19]" />
            </div>
          ) : requests.length === 0 ? (
            <div className="py-20 text-center">
              <FiRotateCcw className="mx-auto mb-3 h-10 w-10 text-[#D1C4B9]" />
              <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Không có yêu cầu nào</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EEE9]">
              {requests.map(req => {
                const tcfg = TYPE_CONFIG[req.type] || TYPE_CONFIG.RETURN
                const TIcon = tcfg.icon
                return (
                  <div
                    key={req.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAF8] transition-all duration-300"
                  >
                    <div className={`flex h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shrink-0 items-center justify-center rounded-full ${tcfg.bg}`}>
                      <TIcon className={`h-4 w-4 ${tcfg.text}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium font-beVietnamPro text-[#1B1C19] text-sm">
                          #{req.orderCode}
                        </span>
                        <TypeBadge type={req.type} />
                      </div>
                      <p className="mt-0.5 text-xs font-beVietnamPro text-[#9E8E7E] truncate">{req.reason}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <StatusBadge status={req.status} />
                      <p className="mt-1 text-xs font-beVietnamPro text-[#9E8E7E]">{fmtDate(req.createdAt)}</p>
                    </div>

                    <button
                      onClick={() => setSelected(req)}
                      className="ml-2 flex h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shrink-0 items-center justify-center text-[#9E8E7E] hover:bg-[#F0EEE9] hover:text-[#6F583D]"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="font-beVietnamPro text-sm text-[#9E8E7E]">
              Trang {page + 1} / {data.totalPages} — {data.totalElements} yêu cầu
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="flex h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40"
              >
                ←
              </button>
              <button
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="flex h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center justify-center border border-[#D1C4B9] text-[#4E453D] hover:bg-[#F0EEE9] disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        )}

      {/* Detail Modal */}
      {selected && (
        <ReturnDetailModal
          request={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}