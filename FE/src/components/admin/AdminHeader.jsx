import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBell, FiMenu, FiShoppingBag, FiX } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'

const POLL_INTERVAL = 20_000 // 20s

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + '₫'

const fmtTime = (d) => {
  if (!d) return ''
  const diff = Math.floor((Date.now() - new Date(d)) / 1000)
  if (diff < 60) return 'Vừa xong'
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const fetchPendingOrders = () =>
  api.get('/admin/orders', { params: { status: 'PENDING', page: 0, size: 20, keyword: '' } })
    .then(r => r.data?.content || [])
    .catch(() => [])

function NotificationPanel({ notifications, unreadIds, onMarkRead, onMarkAllRead, onClose, onNavigate }) {
  return (
    <div className="absolute right-0 top-12 z-50 w-80 border border-[#D1C4B9] bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D1C4B9] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">Thông báo</span>
          {unreadIds.size > 0 && (
            <span className="rounded-full bg-[#1B1C19] px-2 py-0.5 font-beVietnamPro text-xs text-white">
              {unreadIds.size}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadIds.size > 0 && (
            <button
              onClick={onMarkAllRead}
              className="font-beVietnamPro text-xs text-[#6F583D] hover:underline"
            >
              Đánh dấu đã đọc
            </button>
          )}
          <button onClick={onClose}>
            <FiX className="h-4 w-4 text-[#4E453D] hover:text-[#1B1C19]" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-[#F0EDE9]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <FiBell className="h-8 w-8 text-[#D1C4B9]" />
            <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Chưa có đơn hàng mới</p>
          </div>
        ) : (
          notifications.map((n) => {
            const isUnread = unreadIds.has(n.id)
            return (
              <button
                key={n.id}
                onClick={() => { onMarkRead(n.id); onNavigate(); onClose() }}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F7F5F2] ${isUnread ? 'bg-[#FBF9F7]' : 'bg-white'}`}
              >
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isUnread ? 'bg-[#1B1C19]' : 'bg-[#EAE1DB]'}`}>
                  <FiShoppingBag className={`h-4 w-4 ${isUnread ? 'text-white' : 'text-[#4E453D]'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <p className={`font-beVietnamPro text-sm leading-snug ${isUnread ? 'font-semibold text-[#1B1C19]' : 'font-normal text-[#4E453D]'}`}>
                      Đơn mới #{n.orderCode}
                    </p>
                    {isUnread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1B1C19]" />}
                  </div>
                  <p className="mt-0.5 font-beVietnamPro text-xs text-[#9E8E7E]">
                    {n.shippingName} · {fmt(n.totalAmount)}
                  </p>
                  <p className="mt-0.5 font-beVietnamPro text-xs text-[#C5B9AE]">
                    {fmtTime(n.createdAt)}
                  </p>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-[#D1C4B9] px-4 py-2.5 text-center">
          <button
            onClick={() => { onNavigate(); onClose() }}
            className="font-beVietnamPro text-xs text-[#6F583D] hover:underline"
          >
            Xem tất cả đơn hàng →
          </button>
        </div>
      )}
    </div>
  )
}

function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const displayName = user?.fullName || user?.name || 'Admin'

  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadIds, setUnreadIds] = useState(new Set())
  const panelRef = useRef(null)
  const prevMaxIdRef = useRef(null)
  const isFirstLoadRef = useRef(true)

  const poll = useCallback(async () => {
    const orders = await fetchPendingOrders()
    if (!orders.length) return

    const sorted = [...orders].sort((a, b) => b.id - a.id)
    setNotifications(sorted.slice(0, 10))

    const maxId = sorted[0].id

    if (isFirstLoadRef.current) {
      setUnreadIds(new Set(sorted.map(o => o.id)))
      isFirstLoadRef.current = false
    } else if (prevMaxIdRef.current !== null && maxId > prevMaxIdRef.current) {
      const newIds = sorted.filter(o => o.id > prevMaxIdRef.current).map(o => o.id)
      setUnreadIds(prev => new Set([...prev, ...newIds]))
    }

    prevMaxIdRef.current = maxId
  }, [])

  useEffect(() => {
    poll()
    const timer = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [poll])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const markRead = (id) => setUnreadIds(prev => { const s = new Set(prev); s.delete(id); return s })
  const markAllRead = () => setUnreadIds(new Set())

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-20 items-center border-b border-[#D1C4B9] bg-white px-6 lg:left-72 lg:px-10">
      {/* Hamburger mobile */}
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center border border-[#D1C4B9] lg:hidden"
        aria-label="Mở menu"
      >
        <FiMenu className="h-5 w-5 text-[#4E453D]" />
      </button>

      {/* Marquee chạy lui chạy tới */}
      <div className="flex-1 overflow-hidden mx-6 hidden sm:block">
        <div className="marquee-track">
          <span className="marquee-text">
            ✦ Chào mừng đến với ZYRO Admin &nbsp;&nbsp;&nbsp; ✦ Quản lý cửa hàng thời trang của bạn &nbsp;&nbsp;&nbsp; ✦ Hãy kiểm tra đơn hàng mới hôm nay &nbsp;&nbsp;&nbsp; ✦ Tối ưu doanh thu — phát triển thương hiệu &nbsp;&nbsp;&nbsp; ✦ ZYRO Fashion · Phong cách — Chất lượng — Uy tín &nbsp;&nbsp;&nbsp;
          </span>
          <span className="marquee-text" aria-hidden="true">
            ✦ Chào mừng đến với ZYRO Admin &nbsp;&nbsp;&nbsp; ✦ Quản lý cửa hàng thời trang của bạn &nbsp;&nbsp;&nbsp; ✦ Hãy kiểm tra đơn hàng mới hôm nay &nbsp;&nbsp;&nbsp; ✦ Tối ưu doanh thu — phát triển thương hiệu &nbsp;&nbsp;&nbsp; ✦ ZYRO Fashion · Phong cách — Chất lượng — Uy tín &nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>

      <style>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-text {
          white-space: nowrap;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #9E8E7E;
          letter-spacing: 0.03em;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Bell */}
        <div className="relative" ref={panelRef}>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="relative flex h-10 w-10 items-center justify-center border border-[#D1C4B9] transition-colors hover:bg-[#F7F5F2]"
            aria-label="Thông báo"
          >
            <FiBell className="h-5 w-5 text-[#4E453D]" />
            {unreadIds.size > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 font-beVietnamPro text-[10px] font-bold text-white ring-2 ring-white">
                {unreadIds.size > 9 ? '9+' : unreadIds.size}
              </span>
            )}
          </button>

          {open && (
            <NotificationPanel
              notifications={notifications}
              unreadIds={unreadIds}
              onMarkRead={markRead}
              onMarkAllRead={markAllRead}
              onClose={() => setOpen(false)}
              onNavigate={() => navigate('/admin/orders')}
            />
          )}
        </div>

        {/* User chip */}
        <div className="flex items-center gap-3 border border-[#D1C4B9] px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAE1DB]">
            <span className="font-beVietnamPro text-xs font-bold text-[#1F1B17]">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">{displayName}</p>
            <p className="font-beVietnamPro text-xs text-[#4E453D]">Quản trị viên</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader