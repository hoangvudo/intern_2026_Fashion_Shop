import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiRefreshCw, FiChevronLeft, FiChevronRight,
  FiEye, FiX, FiLock, FiUnlock, FiCheckCircle, FiCalendar, FiMail, FiPhone,
  FiPlus, FiFilter
} from 'react-icons/fi'
import { getAdminCustomers, getAdminCustomerDetail, toggleCustomerActive, getVipStats } from '../../services/adminService'
import toast from 'react-hot-toast'

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + ' ₫'

const VIP_TIERS = {
  DIAMOND: { label: 'DIAMOND', class: 'bg-blue-50 text-blue-600 border-blue-100', bg: '#E0F2FE' },
  PLATINUM: { label: 'PLATINUM', class: 'bg-purple-50 text-purple-600 border-purple-100', bg: '#F3E8FF' },
  GOLD: { label: 'GOLD', class: 'bg-yellow-50 text-yellow-600 border-yellow-100', bg: '#FEF9C3' },
  SILVER: { label: 'SILVER', class: 'bg-gray-50 text-gray-600 border-gray-100', bg: '#F3F4F6' },
  NONE: { label: 'MỚI', class: 'bg-[#F5F3EE] text-[#6F583D] border-transparent', bg: '#F5F3EE' }
}

function VipBadge({ tier }) {
  const current = VIP_TIERS[tier] || VIP_TIERS['NONE']
  return (
    <span className={`inline-flex items-center px-2.5 py-1 border rounded-lg font-beVietnamPro text-[11px] font-bold tracking-wider ${current.class}`}>
      {current.label}
    </span>
  )
}

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-beVietnamPro text-xs font-medium rounded-full ${
      active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`} />
      {active ? 'Hoạt động' : 'Đã khoá'}
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
                    <VipBadge tier={customer.vipTier} />
                  </div>
                </div>
              </div>

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

              {customer.role !== 'ADMIN' && (
                <button
                  onClick={handleToggle}
                  disabled={toggling}
                  className={`flex items-center justify-center gap-2 px-4 py-3 font-beVietnamPro text-sm font-medium transition-colors disabled:opacity-60 ${
                    customer.isActive
                      ? 'border border-red-200 text-red-600 hover:bg-red-50'
                      : 'bg-[#1B1C19] text-white hover:bg-black'
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
  const [stats, setStats] = useState(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [inputKw, setInputKw] = useState('')
  const [keyword, setKeyword] = useState('')
  const [tier, setTier] = useState('ALL')
  const [page, setPage] = useState(0)
  const [selectedUserId, setSelectedUserId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAdminCustomers({ keyword, tier, page, size: 10 })
      setCustomers(data.content || [])
      setTotal(data.totalElements || 0)
      setTotalPages(data.totalPages || 1)
    } catch {
      toast.error('Không thể tải danh sách khách hàng')
    } finally {
      setLoading(false)
    }
  }, [keyword, tier, page])

  const loadStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const data = await getVipStats()
      setStats(data)
    } catch {
      console.error('Failed to load VIP stats')
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { loadStats() }, [loadStats])

  const handleToggleActive = async (id) => {
    const updated = await toggleCustomerActive(id)
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, isActive: updated.isActive } : c))
    return updated
  }

  return (
    <div className="flex flex-col items-start gap-10 bg-[#FBF9F4] w-full min-h-screen p-8">
      {/* Header Section */}
      <div className="flex justify-between items-end w-full">
        <div className="flex flex-col items-start gap-2 w-fit">
          <h1 className="text-[#6F583D] font-beVietnamPro text-2xl font-semibold leading-8 w-fit">
            Danh sách Khách hàng VIP
          </h1>
          <p className="text-[#4E453D] font-beVietnamPro text-base leading-6 w-fit">
            Quản lý và theo dõi những khách hàng thân thiết có chi tiêu cao nhất.
          </p>
        </div>
        
        <div className="flex items-start gap-4 w-fit">
          {/* Tier Filter */}
          <div className="relative group">
            <select 
              value={tier}
              onChange={(e) => { setTier(e.target.value); setPage(0) }}
              className="appearance-none cursor-pointer flex pt-2 pr-10 pb-2 pl-10 items-center gap-2 rounded bg-[#EAE2D4] text-[#696459] font-beVietnamPro text-base leading-6 outline-none border-none"
            >
              <option value="ALL">Lọc theo hạng</option>
              <option value="DIAMOND">Diamond</option>
              <option value="PLATINUM">Platinum</option>
              <option value="GOLD">Gold</option>
              <option value="SILVER">Silver</option>
            </select>
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#696459] pointer-events-none" />
          </div>

          <button className="flex pt-2 pr-6 pb-2 pl-6 items-center gap-2 rounded bg-[#6F583D] text-white font-beVietnamPro text-base leading-6 shadow-sm hover:bg-[#5D4933] transition-colors">
            <FiPlus className="w-5 h-5" />
            <span>Thêm khách hàng</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex p-8 flex-col justify-between items-start rounded-lg border border-[#D1C4B9] bg-white w-full"
        >
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-[#4E453D] font-beVietnamPro text-sm leading-6 tracking-[0.1em] font-semibold uppercase">
              DOANH THU TỪ VIP
            </p>
            <p className="text-[#6F583D] font-beVietnamPro text-2xl font-bold leading-8">
              {statsLoading ? '...' : fmt(stats?.totalVipRevenue || 0)}
            </p>
          </div>
          
          <div className="flex pt-8 flex-col items-start w-full">
            <div className="flex items-center gap-10 w-full">
              <div className="flex flex-col items-start gap-1 w-fit">
                <p className="text-[#4E453D] font-beVietnamPro text-xs leading-4">
                  Tăng trưởng tháng này
                </p>
                <div className="flex items-center gap-1">
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.816667 7L0 6.18333L4.31667 1.8375L6.65 4.17083L9.68333 1.16667H8.16667V0H11.6667V3.5H10.5V1.98333L6.65 5.83333L4.31667 3.5L0.816667 7V7" fill="#059669" />
                  </svg>
                  <p className="text-[#059669] font-beVietnamPro text-base font-bold leading-6">
                    +{stats?.revenueGrowthPercent || 0}%
                  </p>
                </div>
              </div>
              <div className="bg-[#D1C4B9] w-px h-10"></div>
              <div className="flex flex-col items-start gap-1 w-fit">
                <p className="text-[#4E453D] font-beVietnamPro text-xs leading-4">
                  Khách hàng mới (VIP)
                </p>
                <p className="text-[#1B1C19] font-beVietnamPro text-base font-bold leading-6">
                  {statsLoading ? '...' : `${stats?.newVipMembersThisMonth || 0} thành viên`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex p-8 flex-col justify-end items-start rounded-lg bg-[#EAE8E3] w-full relative overflow-hidden"
        >
          <div className="flex flex-col items-start w-full">
            <p className="text-[#6F583D] font-beVietnamPro text-lg font-bold leading-6">
              Hạng Diamond
            </p>
          </div>
          <div className="flex pb-4 flex-col items-start w-full mt-2">
            <p className="text-[#4E453D] font-beVietnamPro text-base leading-6 max-w-[80%]">
              Nhóm khách hàng ưu tiên bậc nhất với {stats?.diamondCount || 0} thành viên hiện tại.
            </p>
          </div>
          <button 
            onClick={() => { setTier('DIAMOND'); setPage(0) }}
            className="text-[#6F583D] font-beVietnamPro text-base font-semibold leading-6 hover:underline"
          >
            Xem danh sách ưu tiên
          </button>
          
          {/* Diamond Background Icon */}
          <div className="absolute -right-4 -top-4 opacity-10 text-[#80756B]">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L1 12l11 10 11-10L12 2zm0 16.3L5.7 12 12 5.7 18.3 12 12 18.3z" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="w-full flex items-center gap-4">
        <div className="flex py-2 px-4 items-center rounded-xl bg-[#F0EEE9] w-full max-w-md border border-transparent focus-within:border-[#D1C4B9] transition-all">
          <FiSearch className="text-[#80756B] w-5 h-5" />
          <input 
            type="text"
            value={inputKw}
            onChange={(e) => setInputKw(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setKeyword(inputKw); setPage(0) } }}
            placeholder="Tìm kiếm khách hàng VIP..."
            className="bg-transparent border-none outline-none pl-3 w-full font-beVietnamPro text-[#1B1C19] placeholder:text-[#6B7280]"
          />
          {inputKw && (
            <button onClick={() => { setInputKw(''); setKeyword(''); setPage(0) }}>
              <FiX className="text-[#80756B]" />
            </button>
          )}
        </div>
        <button 
          onClick={() => { setKeyword(inputKw); setPage(0) }}
          className="bg-[#1B1C19] text-white px-6 py-2.5 rounded-xl font-beVietnamPro text-sm font-medium hover:bg-black transition-colors"
        >
          Tìm kiếm
        </button>
        <button 
          onClick={load}
          className="p-2.5 rounded-xl bg-[#F0EEE9] text-[#4E453D] hover:bg-[#EAE2D4] transition-colors"
          title="Làm mới"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col items-start rounded-lg border border-[#D1C4B9] bg-white w-full overflow-hidden shadow-sm">
        <div className="flex justify-start items-center border-b border-[#D1C4B9] bg-[#F5F3EE] w-full">
          <div className="px-6 py-5 w-[25%] font-beVietnamPro text-xs font-bold tracking-widest text-[#4E453D] uppercase">KHÁCH HÀNG</div>
          <div className="px-6 py-5 w-[25%] font-beVietnamPro text-xs font-bold tracking-widest text-[#4E453D] uppercase">LIÊN HỆ</div>
          <div className="px-6 py-5 w-[20%] font-beVietnamPro text-xs font-bold tracking-widest text-[#4E453D] uppercase">TỔNG CHI TIÊU</div>
          <div className="px-6 py-5 w-[15%] font-beVietnamPro text-xs font-bold tracking-widest text-[#4E453D] uppercase text-center">HẠNG</div>
          <div className="px-6 py-5 w-[15%] font-beVietnamPro text-xs font-bold tracking-widest text-[#4E453D] uppercase text-right">THAO TÁC</div>
        </div>

        <div className="flex flex-col w-full min-h-[400px]">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center border-b border-[#F0EEE9] w-full px-6 py-4 animate-pulse">
                <div className="w-[25%] flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F0EEE9] rounded-xl" />
                  <div className="h-4 bg-[#F0EEE9] w-24 rounded" />
                </div>
                <div className="w-[25%] h-4 bg-[#F0EEE9] rounded" />
                <div className="w-[20%] h-4 bg-[#F0EEE9] rounded" />
                <div className="w-[15%] flex justify-center"><div className="w-16 h-6 bg-[#F0EEE9] rounded" /></div>
                <div className="w-[15%] flex justify-end"><div className="w-8 h-8 bg-[#F0EEE9] rounded" /></div>
              </div>
            ))
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-20">
              <FiSearch className="w-12 h-12 text-[#D1C4B9] mb-4" />
              <p className="text-[#9E8E7E] font-beVietnamPro">Không tìm thấy khách hàng nào</p>
            </div>
          ) : (
            customers.map((c) => (
              <motion.div 
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center border-b border-[#F0EEE9] w-full hover:bg-[#FBF9F4] transition-colors px-6 py-4"
              >
                <div className="w-[25%] flex items-center gap-4">
                  <div 
                    className="flex justify-center items-center shrink-0 rounded-xl w-10 h-10 text-sm font-bold"
                    style={{ backgroundColor: VIP_TIERS[c.vipTier]?.bg || '#F5F3EE', color: '#281804' }}
                  >
                    {(c.fullName || c.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-beVietnamPro text-sm font-bold text-[#1B1C19]">
                      {c.fullName || '—'}
                    </span>
                    <span className="text-[10px] text-[#9E8E7E] font-medium uppercase tracking-wider">
                      ID: #{c.id}
                    </span>
                  </div>
                </div>
                
                <div className="w-[25%] flex flex-col">
                  <span className="font-beVietnamPro text-sm text-[#4E453D] truncate">
                    {c.email}
                  </span>
                  {c.phone && (
                    <span className="text-xs text-[#9E8E7E] font-beVietnamPro">
                      {c.phone}
                    </span>
                  )}
                </div>

                <div className="w-[20%] font-beVietnamPro text-sm font-bold text-[#6F583D]">
                  {fmt(c.totalSpent)}
                </div>

                <div className="w-[15%] flex justify-center">
                  <VipBadge tier={c.vipTier} />
                </div>

                <div className="w-[15%] flex justify-end items-center gap-2">
                  <button 
                    onClick={() => setSelectedUserId(c.id)}
                    className="p-2 hover:bg-[#EAE2D4] rounded-lg text-[#696459] transition-colors"
                    title="Xem chi tiết"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleToggleActive(c.id)}
                    className={`p-2 rounded-lg transition-colors ${c.isActive ? 'text-[#696459] hover:bg-[#FEE2E2] hover:text-red-600' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}
                    title={c.isActive ? 'Khoá tài khoản' : 'Mở khoá'}
                  >
                    {c.isActive ? <FiUnlock className="w-5 h-5" /> : <FiLock className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-[#F5F3EE] border-t border-[#D1C4B9]">
            <p className="font-beVietnamPro text-sm text-[#696459]">
              Trang <span className="font-bold">{page + 1}</span> / {totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded bg-white border border-[#D1C4B9] disabled:opacity-50 text-[#696459]"
              >
                <FiChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded font-beVietnamPro text-sm font-bold transition-all ${
                    page === i ? 'bg-[#6F583D] text-white shadow-md' : 'bg-white text-[#696459] border border-[#D1C4B9] hover:bg-[#EAE2D4]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded bg-white border border-[#D1C4B9] disabled:opacity-50 text-[#696459]"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
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
