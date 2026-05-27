import StatCards from './StatCards'
import RevenueChart from './RevenueChart'
import BestSellers from './BestSellers'
import RecentOrdersTable from './RecentOrdersTable'
import useAuthStore from '../../../store/authStore'

function DashboardContent() {
  const user = useAuthStore((s) => s.user)
  const displayName = user?.fullName || user?.name || 'Alexander'

  return (
    <div className="flex min-h-screen flex-col gap-10 px-10 pb-24 pt-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-beVietnamPro text-2xl font-semibold leading-8 text-[#1B1C19]">
          Chào buổi sáng, {displayName}
        </h1>
        <p className="font-beVietnamPro text-base leading-6 text-[#4E453D] opacity-80">
          Hôm nay là một ngày tuyệt vời để tối ưu hóa doanh thu của ZYRO.
        </p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <RevenueChart />
        <BestSellers />
      </div>

      <RecentOrdersTable />
    </div>
  )
}

export default DashboardContent
