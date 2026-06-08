import { useEffect, useState, useCallback } from 'react'
import StatCards from './StatCards'
import RevenueChart from './RevenueChart'
import BestSellers from './BestSellers'
import RecentOrdersTable from './RecentOrdersTable'
import LowStockWidget from './LowStockWidget'
import useAuthStore from '../../../store/authStore'
import axios from '../../../utils/axios'

const POLL_INTERVAL = 30_000 // 30s realtime polling

function DashboardContent() {
  const user = useAuthStore((s) => s.user)
  const displayName = user?.fullName || user?.name || 'Admin'

  const [stats, setStats]           = useState(null)
  const [revenue, setRevenue]       = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStock, setLowStock]     = useState([])
  const [period, setPeriod]         = useState('month')
  const [loading, setLoading]       = useState(true)

  const fetchAll = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true)
    try {
      const [statsRes, revenueRes, bsRes, ordersRes, lsRes] = await Promise.allSettled([
        axios.get('/admin/stats'),
        axios.get(`/admin/revenue?period=${period}`),
        axios.get('/admin/best-sellers'),
        axios.get('/admin/orders/recent'),
        axios.get('/admin/low-stock'),
      ])

      if (statsRes.status   === 'fulfilled') setStats(statsRes.value.data)
      if (revenueRes.status === 'fulfilled') setRevenue(revenueRes.value.data)
      if (bsRes.status      === 'fulfilled') setBestSellers(bsRes.value.data)
      if (ordersRes.status  === 'fulfilled') setRecentOrders(ordersRes.value.data)
      if (lsRes.status      === 'fulfilled') setLowStock(lsRes.value.data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      if (showLoader) setLoading(false)
    }
  }, [period])

  // First load
  useEffect(() => {
    fetchAll(true)
  }, [fetchAll])

  // Realtime poll (silent, no loader)
  useEffect(() => {
    const timer = setInterval(() => fetchAll(false), POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [fetchAll])

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Chào buổi sáng' :
    hour < 18 ? 'Chào buổi chiều' :
    'Chào buổi tối'

  return (
    <div className="flex min-h-screen flex-col gap-10 px-6 pb-24 pt-8 lg:px-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-beVietnamPro text-2xl font-semibold leading-8 text-[#1B1C19]">
          {greeting}, {displayName}
        </h1>
        <p className="font-beVietnamPro text-base leading-6 text-[#4E453D] opacity-80">
          Hôm nay là một ngày tuyệt vời để tối ưu hóa doanh thu của ZYRO.
        </p>
      </div>

      <StatCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <RevenueChart data={revenue} period={period} onPeriodChange={setPeriod} loading={loading} />
        <BestSellers data={bestSellers} loading={loading} />
      </div>

      {/* Low stock full width below */}
      <LowStockWidget data={lowStock} loading={loading} />

      <RecentOrdersTable data={recentOrders} loading={loading} />
    </div>
  )
}

export default DashboardContent