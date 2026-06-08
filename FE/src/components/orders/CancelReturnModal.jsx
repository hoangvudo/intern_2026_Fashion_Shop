import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiX, FiAlertCircle, FiRefreshCw, FiRotateCcw,
  FiCheckCircle, FiUpload, FiTrash2,
} from 'react-icons/fi'
import { cancelOrder, createReturnRequest } from '../../services/orderService'
import api from '../../services/api'
import toast from 'react-hot-toast'

/* ── Danh sách lý do theo loại yêu cầu ─────────────────────── */
const REASONS = {
  CANCEL: [
    'Đặt nhầm sản phẩm / số lượng',
    'Muốn thay đổi địa chỉ giao hàng',
    'Muốn thay đổi phương thức thanh toán',
    'Tìm được sản phẩm với giá tốt hơn',
    'Không còn nhu cầu mua nữa',
    'Khác',
  ],
  RETURN: [
    'Sản phẩm bị lỗi / hỏng khi nhận hàng',
    'Sản phẩm không đúng mô tả',
    'Nhận sai sản phẩm / sai màu / sai size',
    'Chất lượng không như kỳ vọng',
    'Sản phẩm thiếu phụ kiện / không đầy đủ',
    'Khác',
  ],
  EXCHANGE: [
    'Sai size (quá to / quá nhỏ)',
    'Muốn đổi sang màu khác',
    'Sản phẩm bị lỗi, muốn đổi hàng mới',
    'Nhận sai size so với đơn',
    'Khác',
  ],
}

const TYPE_CONFIG = {
  CANCEL: {
    label: 'Hủy đơn hàng',
    icon: FiAlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white',
    desc: 'Đơn hàng sẽ bị hủy ngay lập tức.',
    allowedStatuses: ['PENDING', 'CONFIRMED'],
  },
  RETURN: {
    label: 'Trả hàng / Hoàn tiền',
    icon: FiRotateCcw,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    btnClass: 'bg-orange-500 hover:bg-orange-600 text-white',
    desc: 'Yêu cầu sẽ được admin xem xét trong 1–2 ngày làm việc.',
    allowedStatuses: ['COMPLETED'],
  },
  EXCHANGE: {
    label: 'Đổi hàng',
    icon: FiRefreshCw,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    desc: 'Yêu cầu đổi hàng sẽ được admin xem xét trong 1–2 ngày làm việc.',
    allowedStatuses: ['COMPLETED'],
  },
}

const MAX_IMAGES = 5

/* ── Component chính ─────────────────────────────────────────── */
export default function CancelReturnModal({ order, defaultType, onClose, onSuccess }) {
  const [step, setStep] = useState(defaultType ? 2 : 1)
  const [type, setType] = useState(defaultType || null)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])      // { file, previewUrl }
  const [uploadingImages, setUploadingImages] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const fileInputRef = useRef(null)

  const status = order?.status
  const available = Object.entries(TYPE_CONFIG).filter(([, cfg]) =>
    cfg.allowedStatuses.includes(status)
  )
  const cfg = type ? TYPE_CONFIG[type] : null
  const Icon = cfg?.icon

  const canSubmit = reason.trim().length > 0

  /* ── Upload ảnh lên server ─────────────────────────────────── */
  const handleImagePick = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const remaining = MAX_IMAGES - images.length
    const picked = files.slice(0, remaining).map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setImages(prev => [...prev, ...picked])
    // reset input để chọn lại cùng file nếu cần
    e.target.value = ''
  }

  const removeImage = (idx) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].previewUrl)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const uploadImages = async () => {
    if (images.length === 0) return []
    setUploadingImages(true)
    try {
      const urls = await Promise.all(
        images.map(async ({ file }) => {
          const form = new FormData()
          form.append('file', file)
          const res = await api.post('/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          // BE trả về { url: '...' } hoặc string
          return res.data?.url ?? res.data
        })
      )
      return urls.filter(Boolean)
    } finally {
      setUploadingImages(false)
    }
  }

  /* ── Submit ────────────────────────────────────────────────── */
  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (type === 'CANCEL') {
        // Hủy đơn: PATCH /orders/my/:id/cancel
        await cancelOrder(order.id, reason)
        toast.success('Đơn hàng đã được hủy thành công')
      } else {
        // Đổi/trả: upload ảnh trước, rồi POST /orders/return-requests
        let imageUrls = []
        if (images.length > 0) {
          try {
            imageUrls = await uploadImages()
          } catch {
            toast.error('Upload ảnh thất bại, vui lòng thử lại')
            setLoading(false)
            return
          }
        }
        await createReturnRequest({
          orderId: order.id,
          type,
          reason: description ? `${reason} — ${description}` : reason,
          imageUrls,
        })
        toast.success('Yêu cầu của bạn đã được gửi!')
      }
      setDone(true)
      onSuccess?.()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  /* ── Done screen ────────────────────────────────────────────── */
  if (done) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center gap-4 py-10 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <FiCheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {type === 'CANCEL' ? 'Đã hủy đơn hàng' : 'Đã gửi yêu cầu'}
          </h3>
          <p className="text-sm text-gray-500 max-w-xs">
            {type === 'CANCEL'
              ? `Đơn hàng #${order.orderCode} đã được hủy thành công.`
              : `Yêu cầu ${cfg?.label?.toLowerCase()} của bạn đang chờ admin xem xét. Chúng tôi sẽ phản hồi trong 1–2 ngày làm việc.`}
          </p>
          <button
            onClick={onClose}
            className="mt-2 rounded-full bg-black px-8 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black"
          >
            Đóng
          </button>
        </div>
      </ModalShell>
    )
  }

  return (
    <ModalShell onClose={onClose}>
      {/* ── STEP 1: Chọn loại ─────────────────────── */}
      {step === 1 && (
        <div className="p-6">
          <h2 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
            Bạn cần hỗ trợ gì?
          </h2>
          <p className="mb-5 text-sm text-gray-400">
            Đơn hàng <span className="font-medium text-gray-600 dark:text-gray-300">#{order.orderCode}</span>
          </p>

          {available.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/50">
              Đơn hàng đang ở trạng thái <strong>{status}</strong> không hỗ trợ hủy hoặc đổi/trả.
            </div>
          ) : (
            <div className="space-y-3">
              {available.map(([key, c]) => {
                const TIcon = c.icon
                return (
                  <button
                    key={key}
                    onClick={() => { setType(key); setStep(2) }}
                    className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all hover:shadow-sm ${c.bg} ${c.border}`}
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                      <TIcon className={`h-4 w-4 ${c.color}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${c.color}`}>{c.label}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{c.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Nhập lý do + ảnh ────────────────── */}
      {step === 2 && cfg && (
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {!defaultType && (
            <button
              onClick={() => setStep(1)}
              className="mb-4 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
            >
              ← Quay lại
            </button>
          )}
          <div className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 ${cfg.bg} ${cfg.border}`}>
            <Icon className={`h-5 w-5 ${cfg.color}`} />
            <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
          </div>

          {/* Chọn lý do */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Lý do <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {REASONS[type]?.map(r => (
                <label
                  key={r}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                    reason === r
                      ? `${cfg.border} ${cfg.bg}`
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-black"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mô tả thêm */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả thêm (tùy chọn)
            </label>
            <textarea
              rows={3}
              placeholder="Cung cấp thêm thông tin để chúng tôi hỗ trợ tốt hơn..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Upload ảnh – chỉ hiện cho RETURN và EXCHANGE */}
          {type !== 'CANCEL' && (
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ảnh minh chứng{' '}
                <span className="font-normal text-gray-400">(tối đa {MAX_IMAGES} ảnh, tùy chọn)</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {images.map(({ previewUrl }, idx) => (
                  <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                    <img src={previewUrl} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <FiTrash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {images.length < MAX_IMAGES && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 transition hover:border-gray-400 hover:text-gray-600"
                  >
                    <FiUpload className="h-5 w-5" />
                    <span className="text-xs">Thêm ảnh</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImagePick}
              />
            </div>
          )}

          <button
            disabled={!canSubmit}
            onClick={() => setStep(3)}
            className={`w-full rounded-full py-3 text-sm font-semibold transition-all disabled:opacity-40 ${cfg.btnClass}`}
          >
            Tiếp tục
          </button>
        </div>
      )}

      {/* ── STEP 3: Xác nhận ─────────────────────── */}
      {step === 3 && cfg && (
        <div className="p-6">
          <button
            onClick={() => setStep(2)}
            className="mb-4 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700"
          >
            ← Quay lại
          </button>

          <h3 className="mb-5 text-base font-bold text-gray-900 dark:text-white">
            Xác nhận yêu cầu
          </h3>

          <div className={`mb-5 rounded-xl border p-4 space-y-3 ${cfg.bg} ${cfg.border}`}>
            <Row label="Đơn hàng" value={`#${order.orderCode}`} />
            <Row label="Loại yêu cầu" value={cfg.label} />
            <Row label="Lý do" value={reason} />
            {description && <Row label="Mô tả" value={description} />}
            {images.length > 0 && (
              <Row label="Ảnh đính kèm" value={`${images.length} ảnh`} />
            )}
          </div>

          {type === 'CANCEL' && (
            <div className="mb-5 flex gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">
              <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Hành động này không thể hoàn tác. Đơn hàng sẽ bị hủy ngay lập tức.</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || uploadingImages}
              className={`flex-1 rounded-full py-3 text-sm font-semibold transition-all disabled:opacity-60 ${cfg.btnClass}`}
            >
              {loading || uploadingImages ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {uploadingImages ? 'Đang upload ảnh...' : 'Đang xử lý...'}
                </span>
              ) : (
                type === 'CANCEL' ? 'Xác nhận hủy đơn' : 'Gửi yêu cầu'
              )}
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  )
}

/* ── Sub components ─────────────────────────────────────────── */
function ModalShell({ children, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl dark:bg-gray-800"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <FiX className="h-4 w-4" />
          </button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 dark:text-gray-200 text-right max-w-[60%]">{value}</span>
    </div>
  )
}