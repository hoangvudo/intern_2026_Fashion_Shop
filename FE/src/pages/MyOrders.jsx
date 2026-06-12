import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingBag, FiClock, FiTruck, FiCheckCircle,
  FiXCircle, FiPackage, FiMapPin, FiPhone,
  FiCreditCard, FiChevronDown, FiChevronUp,
  FiAlertCircle, FiRefreshCw, FiRotateCcw,
} from 'react-icons/fi'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import CancelReturnModal from '../components/orders/CancelReturnModal'
import api from '../services/api'

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + '₫'
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—'

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ xử lý',  bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700',  icon: FiClock       },
  SHIPPING:  { label: 'Đang giao',   bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700',   icon: FiTruck       },
  COMPLETED: { label: 'Hoàn thành',  bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  icon: FiCheckCircle },
  CANCELLED: { label: 'Đã huỷ',      bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',    icon: FiXCircle     },
}

const PAYMENT_MAP = {
  COD: 'Tiền mặt (COD)',
  VNPAY: 'VNPay',
  MOMO: 'MoMo',
  BANK_TRANSFER: 'Chuyển khoản',
}

const TABS = [
  { key: 'ALL',       label: 'Tất cả'     },
  { key: 'PENDING',   label: 'Chờ xử lý'  },
  { key: 'SHIPPING',  label: 'Đang giao'  },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã huỷ'     },
]

const ALLOWED_ACTIONS = {
  PENDING:   ['CANCEL'],
  COMPLETED: ['RETURN', 'EXCHANGE'],
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  )
}

function ActionButtons({ order, onAction }) {
  const actions = ALLOWED_ACTIONS[order.status] || []
  if (actions.length === 0) return null

  const btns = {
    CANCEL:   { label: 'Hủy đơn',   icon: FiAlertCircle, cls: 'border-red-200 text-red-600 hover:bg-red-50' },
    RETURN:   { label: 'Trả hàng',  icon: FiRotateCcw,   cls: 'border-orange-200 text-orange-600 hover:bg-orange-50' },
    EXCHANGE: { label: 'Đổi hàng',  icon: FiRefreshCw,   cls: 'border-blue-200 text-blue-600 hover:bg-blue-50' },
  }

  return (
    <div className="flex flex-wrap gap-2 border-t border-gray-100 px-5 py-3 dark:border-gray-700">
      {actions.map(key => {
        const b = btns[key]
        const BtnIcon = b.icon
        return (
          <button key={key} onClick={() => onAction(order, key)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${b.cls}`}>
            <BtnIcon className="h-3.5 w-3.5" />
            {b.label}
          </button>
        )
      })}
    </div>
  )
}

function ReturnBadge({ orderId }) {
  const [requests, setRequests] = useState([])
  useEffect(() => {
    api.get(`/orders/${orderId}/returns`).then(r => setRequests(r.data || [])).catch(() => {})
  }, [orderId])
  if (requests.length === 0) return null
  const latest = requests[0]
  const statusColors = { PENDING: 'bg-amber-100 text-amber-700', APPROVED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700', COMPLETED: 'bg-gray-100 text-gray-600' }
  const typeLabel = { CANCEL: 'Hủy', RETURN: 'Trả hàng', EXCHANGE: 'Đổi hàng' }
  const statusLabel = { PENDING: 'Đang xử lý', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối', COMPLETED: 'Hoàn tất' }
  return (
    <div className="mx-5 mb-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs dark:bg-gray-700/40">
      <span className="text-gray-400">Yêu cầu {typeLabel[latest.type]}:</span>
      <span className={`rounded-full px-2 py-0.5 font-medium ${statusColors[latest.status] || 'bg-gray-100 text-gray-600'}`}>
        {statusLabel[latest.status] || latest.status}
      </span>
      <span className="ml-auto text-gray-300">{latest.returnCode}</span>
    </div>
  )
}

function OrderCard({ order, onAction }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
  const items = order.items || []

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
            <cfg.icon className={`h-4 w-4 ${cfg.text}`} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">#{order.orderCode || order.id}</p>
            <p className="mt-0.5 text-xs text-gray-400">{fmtDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={order.status} />
          <p className="font-semibold text-gray-900 dark:text-white">{fmt(order.totalAmount)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-3 dark:border-gray-700">
        <div className="flex -space-x-2">
          {items.slice(0, 4).map((item, i) => (
            <div key={i} className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-100 dark:border-gray-800">
              {item.productImage ? <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                : <div className="flex h-full w-full items-center justify-center"><FiPackage className="h-4 w-4 text-gray-400" /></div>}
            </div>
          ))}
        </div>
        <p className="flex-1 text-sm text-gray-500 dark:text-gray-400">
          {items.length} sản phẩm{items[0]?.productName ? ` · ${items[0].productName}` : ''}{items.length > 1 ? ` +${items.length - 1}` : ''}
        </p>
        <button onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-black dark:hover:text-white">
          {expanded ? 'Thu gọn' : 'Chi tiết'}
          {expanded ? <FiChevronUp className="h-3.5 w-3.5" /> : <FiChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      <ReturnBadge orderId={order.id} />
      <ActionButtons order={order} onAction={onAction} />

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden border-t border-gray-100 dark:border-gray-700">
            <div className="space-y-5 p-5">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Sản phẩm</p>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {item.productImage ? <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                          : <div className="flex h-full w-full items-center justify-center"><FiPackage className="h-5 w-5 text-gray-300" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800 dark:text-white">{item.productName}</p>
                        <p className="text-xs text-gray-400">{[item.size, item.color].filter(Boolean).join(' · ')} · x{item.quantity}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">{fmt(item.lineTotal || item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400"><FiMapPin className="h-3 w-3" /> Giao hàng</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{order.shippingName}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400"><FiPhone className="h-3 w-3" /> {order.shippingPhone}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{order.shippingAddress}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400"><FiCreditCard className="h-3 w-3" /> Thanh toán</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{PAYMENT_MAP[order.paymentMethod] || order.paymentMethod}</p>
                  <p className={`mt-1 text-xs font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                    {order.paymentStatus === 'PAID' ? '✓ Đã thanh toán' : '○ Chưa thanh toán'}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500"><span>Tạm tính</span><span>{fmt(order.subtotal)}</span></div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá {order.couponCode ? `(${order.couponCode})` : ''}</span><span>−{fmt(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500"><span>Phí vận chuyển</span><span>{fmt(order.shippingFee)}</span></div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                    <span>Tổng cộng</span><span className="text-base">{fmt(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ALL')
  const [modal, setModal] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/orders/my')
      setOrders(res.data || [])
    } catch (e) {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = activeTab === 'ALL' ? orders : orders.filter(o => o.status === activeTab)
  const countOf = (key) => orders.filter(o => o.status === key).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black dark:bg-white">
            <FiShoppingBag className="h-5 w-5 text-white dark:text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Đơn hàng của tôi</h1>
            <p className="text-sm text-gray-400">{orders.length} đơn hàng</p>
          </div>
        </div>

        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-white p-1.5 shadow-sm dark:bg-gray-800">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-black text-white shadow dark:bg-white dark:text-black' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
              {tab.label}
              {tab.key !== 'ALL' && countOf(tab.key) > 0 && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {countOf(tab.key)}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black dark:border-t-white" />
            <p className="text-sm text-gray-400">Đang tải đơn hàng...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 dark:border-gray-700 dark:bg-gray-800">
            <FiShoppingBag className="mb-4 h-12 w-12 text-gray-200 dark:text-gray-600" />
            <p className="font-medium text-gray-400">
              {activeTab === 'ALL' ? 'Bạn chưa có đơn hàng nào' : `Không có đơn "${TABS.find(t => t.key === activeTab)?.label}"`}
            </p>
            {activeTab === 'ALL' && (
              <Link to="/" className="mt-5 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black">
                Mua sắm ngay
              </Link>
            )}
          </div>
        ) : (
          <motion.div layout className="space-y-4">
            {filtered.map(order => (
              <OrderCard key={order.id} order={order} onAction={(o, t) => setModal({ order: o, defaultType: t })} />
            ))}
          </motion.div>
        )}
      </main>
      <Footer />

      {modal && (
        <CancelReturnModal
          order={modal.order}
          defaultType={modal.defaultType}
          onClose={() => setModal(null)}
          onSuccess={() => { setModal(null); fetchOrders() }}
        />
      )}
    </div>
  )
}