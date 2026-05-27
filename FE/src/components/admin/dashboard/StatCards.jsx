// Fallback data khi API chưa ready
const FALLBACK = [
  {
    title: 'Tổng doanh thu',
    value: '—',
    badge: { text: '+0%', variant: 'neutral' },
    icon: 'revenue',
  },
  {
    title: 'Đơn hàng mới',
    value: '—',
    subtitle: 'Đang chờ xử lý: —',
    badge: { text: 'Hôm nay', variant: 'neutral' },
    icon: 'orders',
  },
  {
    title: 'Khách hàng mới',
    value: '—',
    subtitle: 'Tổng số: —',
    badge: { text: '+0%', variant: 'neutral' },
    icon: 'customers',
  },
  {
    title: 'Sắp hết hàng',
    value: '—',
    subtitle: 'Cần nhập thêm ngay',
    badge: { text: 'Cảnh báo', variant: 'warning' },
    icon: 'stock',
  },
]

const badgeStyles = {
  success: 'bg-[#E8F5E9] text-[#2E7D32]',
  neutral: 'bg-[#EAE8E3] text-[#4E453D]',
  warning: 'bg-[#FFDAD6] text-[#BA1A1A]',
}

const icons = {
  revenue: (
    <svg width="24" height="20" viewBox="0 0 40 34" fill="none" className="h-5 w-6">
      <path d="M22 18C21.1667 18 20.4583 17.7083 19.875 17.125C19.2917 16.5417 19 15.8333 19 15C19 14.1667 19.2917 13.4583 19.875 12.875C20.4583 12.2917 21.1667 12 22 12C22.8333 12 23.5417 12.2917 24.125 12.875C24.7083 13.4583 25 14.1667 25 15C25 15.8333 24.7083 16.5417 24.125 17.125C23.5417 17.7083 22.8333 18 22 18ZM15 21C14.45 21 13.9792 20.8042 13.5875 20.4125C13.1958 20.0208 13 19.55 13 19V11C13 10.45 13.1958 9.97917 13.5875 9.5875C13.9792 9.19583 14.45 9 15 9H29C29.55 9 30.0208 9.19583 30.4125 9.5875C30.8042 9.97917 31 10.45 31 11V19C31 19.55 30.8042 20.0208 30.4125 20.4125C30.0208 20.8042 29.55 21 29 21H15Z" fill="#6F583D" />
    </svg>
  ),
  orders: (
    <svg width="22" height="24" viewBox="0 0 34 38" fill="none" className="h-6 w-5">
      <path d="M11 29C10.45 29 9.97917 28.8042 9.5875 28.4125C9.19583 28.0208 9 27.55 9 27V15C9 14.45 9.19583 13.9792 9.5875 13.5875C9.97917 13.1958 10.45 13 11 13H23C23.55 13 24.0208 13.1958 24.4125 13.5875C24.8042 13.9792 25 14.45 25 15V27C25 27.55 24.8042 28.0208 24.4125 28.4125C24.0208 28.8042 23.55 29 23 29H11Z" fill="#6F583D" />
    </svg>
  ),
  customers: (
    <svg width="24" height="20" viewBox="0 0 40 34" fill="none" className="h-5 w-6">
      <path d="M17 17C15.9 17 14.9583 16.6083 14.175 15.825C13.3917 15.0417 13 14.1 13 13C13 11.9 13.3917 10.9583 14.175 10.175C14.9583 9.39167 15.9 9 17 9C18.1 9 19.0417 9.39167 19.825 10.175C20.6083 10.9583 21 11.9 21 13C21 14.1 20.6083 15.0417 19.825 15.825C19.0417 16.6083 18.1 17 17 17ZM9 25V22.2C9 21.6333 9.14583 21.1125 9.4375 20.6375C9.72917 20.1625 10.1167 19.8 10.6 19.55C11.6333 19.0333 12.6833 18.6458 13.75 18.3875C14.8167 18.1292 15.9 18 17 18C18.1 18 19.1833 18.1292 20.25 18.3875C21.3167 18.6458 22.3667 19.0333 23.4 19.55C23.8833 19.8 24.2708 20.1625 24.5625 20.6375C24.8542 21.1125 25 21.6333 25 22.2V25H9Z" fill="#6F583D" />
    </svg>
  ),
  stock: (
    <svg width="22" height="22" viewBox="0 0 38 38" fill="none" className="h-5 w-5">
      <path d="M12 29C11.45 29 10.9792 28.8042 10.5875 28.4125C10.1958 28.0208 10 27.55 10 27V15.725C9.7 15.5417 9.45833 15.3042 9.275 15.0125C9.09167 14.7208 9 14.3833 9 14V11C9 10.45 9.19583 9.97917 9.5875 9.5875C9.97917 9.19583 10.45 9 11 9H27C27.55 9 28.0208 9.19583 28.4125 9.5875C28.8042 9.97917 29 10.45 29 11V14C29 14.3833 28.9083 14.7208 28.725 15.0125C28.5417 15.3042 28.3 15.5417 28 15.725V27C28 27.55 27.8042 28.0208 27.4125 28.4125C27.0208 28.8042 26.55 29 26 29H12Z" fill="#BA1A1A" />
    </svg>
  ),
}

function fmt(n) {
  if (n == null) return '—'
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' tỷ ₫'
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(0) + ' triệu ₫'
  return Number(n).toLocaleString('vi-VN') + ' ₫'
}

function TrendUpIcon() {
  return (
    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className="h-2 w-3">
      <path d="M0.816667 7L0 6.18333L4.31667 1.8375L6.65 4.17083L9.68333 1.16667H8.16667V0H11.6667V3.5H10.5V1.98333L6.65 5.83333L4.31667 3.5L0.816667 7Z" fill="currentColor" />
    </svg>
  )
}

// ✅ THÊM: nhận props stats từ API
function StatCards({ stats, loading }) {
  const cards = stats ? [
    {
      title: 'Tổng doanh thu',
      value: fmt(stats.totalRevenue),
      badge: {
        text: stats.revenueGrowth != null
          ? `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth}%`
          : '+0%',
        variant: (stats.revenueGrowth ?? 0) >= 0 ? 'success' : 'warning',
      },
      sparkline: true,
      icon: 'revenue',
    },
    {
      title: 'Đơn hàng mới',
      value: stats.newOrders ?? '—',
      subtitle: `Đang chờ xử lý: ${stats.pendingOrders ?? '—'}`,
      badge: { text: 'Hôm nay', variant: 'neutral' },
      icon: 'orders',
    },
    {
      title: 'Khách hàng mới',
      value: stats.newCustomers ?? '—',
      subtitle: `Tổng số: ${stats.totalCustomers?.toLocaleString('vi-VN') ?? '—'}`,
      badge: {
        text: stats.customerGrowth != null
          ? `${stats.customerGrowth >= 0 ? '+' : ''}${stats.customerGrowth}%`
          : '+0%',
        variant: (stats.customerGrowth ?? 0) >= 0 ? 'success' : 'warning',
      },
      icon: 'customers',
    },
    {
      title: 'Sắp hết hàng',
      value: stats.lowStockCount ?? '—',
      subtitle: 'Cần nhập thêm ngay',
      badge: { text: 'Cảnh báo', variant: 'warning' },
      icon: 'stock',
    },
  ] : FALLBACK

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat) => (
        <div
          key={stat.title}
          className="flex flex-col gap-1 border border-[#D1C4B9] bg-white p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex border border-[#D1C4B9] bg-[#F0EEE9] p-2">
              {icons[stat.icon]}
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-1 font-beVietnamPro text-xs font-semibold tracking-[0.05em] ${badgeStyles[stat.badge.variant]}`}
            >
              {stat.badge.text}
              {stat.badge.variant === 'success' && stat.badge.text.startsWith('+') && <TrendUpIcon />}
            </div>
          </div>

          <p className="pt-3 font-beVietnamPro text-sm font-medium tracking-[0.01em] text-[#4E453D]">
            {stat.title}
          </p>

          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-[#F0EEE9]" />
          ) : (
            <p className="font-beVietnamPro text-2xl font-semibold leading-8 text-[#1B1C19]">
              {stat.value}
            </p>
          )}

          {stat.subtitle && (
            <p className="font-beVietnamPro text-xs font-semibold tracking-[0.05em] text-[#4E453D]">
              {stat.subtitle}
            </p>
          )}

          {stat.sparkline && (
            <div className="mt-3 h-10 w-full overflow-hidden opacity-30">
              <svg viewBox="0 0 160 40" fill="none" className="h-full w-full">
                <path d="M0 28C26.6667 17.3333 53.3333 17.3333 80 28C106.667 38.6667 133.333 36 160 20" stroke="#6F583D" strokeWidth="3.2" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default StatCards