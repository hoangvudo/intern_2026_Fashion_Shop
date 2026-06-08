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
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700"
          >
            <FiX className="h-4 w-4" />
          </button>

          <div className="p-6">
            <h2 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
              Chi tiết yêu cầu
            </h2>
            <p className="mb-5 text-sm text-gray-400">{request.returnCode}</p>

            {/* Info grid */}
            <div className="mb-5 space-y-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
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
            </div>

            {/* Admin note */}
            {request.status === 'PENDING' && (
              <>
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ghi chú admin (tùy chọn)
                  </label>
                  <textarea
                    rows={3}
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    placeholder="Nhập phản hồi cho khách hàng..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={updating}
                    onClick={() => handleUpdate('REJECTED')}
                    className="flex-1 rounded-full border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Từ chối
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdate('APPROVED')}
                    className="flex-1 rounded-full bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
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
                className="w-full rounded-full bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {updating ? 'Đang xử lý...' : 'Đánh dấu Hoàn tất'}
              </button>
            )}

            {request.adminNote && request.status !== 'PENDING' && (
              <div className="mt-4 rounded-xl bg-gray-50 p-3 text-sm dark:bg-gray-700/40">
                <span className="font-medium text-gray-500">Ghi chú admin: </span>
                <span className="text-gray-700 dark:text-gray-200">{request.adminNote}</span>
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
      <span className="shrink-0 text-gray-400">{label}</span>
      <span className="font-medium text-gray-800 dark:text-gray-200 text-right">{value}</span>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yêu cầu Hủy / Đổi / Trả</h1>
          <p className="mt-1 text-sm text-gray-400">
            Tổng {data.totalElements || 0} yêu cầu
          </p>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên khách..."
              value={keyword}
              onChange={e => { setKeyword(e.target.value); setPage(0) }}
              className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={fetchData}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Status Tabs */}
        <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl bg-white p-1.5 shadow-sm dark:bg-gray-800">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setStatusFilter(tab.key); setPage(0) }}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                statusFilter === tab.key
                  ? 'bg-black text-white shadow dark:bg-white dark:text-black'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black dark:border-t-white" />
            </div>
          ) : requests.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">Không có yêu cầu nào</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {requests.map(req => {
                const tcfg = TYPE_CONFIG[req.type] || TYPE_CONFIG.RETURN
                const TIcon = tcfg.icon
                return (
                  <div
                    key={req.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tcfg.bg}`}>
                      <TIcon className={`h-4 w-4 ${tcfg.text}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          #{req.orderCode}
                        </span>
                        <TypeBadge type={req.type} />
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400 truncate">{req.reason}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <StatusBadge status={req.status} />
                      <p className="mt-1 text-xs text-gray-400">{fmtDate(req.createdAt)}</p>
                    </div>

                    <button
                      onClick={() => setSelected(req)}
                      className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600"
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
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              ← Trước
            </button>
            <span className="text-sm text-gray-500">
              Trang {page + 1} / {data.totalPages}
            </span>
            <button
              disabled={page >= data.totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Sau →
            </button>
          </div>
        )}
      </div>

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