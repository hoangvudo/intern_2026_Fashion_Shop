import { NavLink } from 'react-router-dom'
import {
  FiGrid,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'

const navItems = [
  { to: '/admin', label: 'Tổng quan', icon: FiGrid, end: true },
  { to: '/admin/orders', label: 'Đơn hàng', icon: FiShoppingBag },
  { to: '/admin/products', label: 'Sản phẩm', icon: FiPackage },
  { to: '/admin/customers', label: 'Khách hàng', icon: FiUsers },
  { to: '/admin/reports', label: 'Báo cáo', icon: FiBarChart2 },
  { to: '/admin/settings', label: 'Cài đặt', icon: FiSettings },
]

function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-[#D1C4B9] bg-[#F0EEE9]">
      <div className="flex items-center gap-3 border-b border-[#D1C4B9] px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center border border-[#D1C4B9] bg-white">
          <span className="font-beVietnamPro text-sm font-bold tracking-widest text-[#6F583D]">
            ZY
          </span>
        </div>
        <div>
          <p className="font-beVietnamPro text-lg font-semibold text-[#1B1C19]">ZYRO</p>
          <p className="font-beVietnamPro text-xs text-[#4E453D]">Admin Panel</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-beVietnamPro text-sm font-medium transition-colors ${
                isActive
                  ? 'border border-[#D1C4B9] bg-white text-[#1B1C19]'
                  : 'text-[#4E453D] hover:bg-white/60'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#D1C4B9] p-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 font-beVietnamPro text-sm text-[#4E453D] hover:text-[#1B1C19]"
        >
          <FiLogOut className="h-5 w-5" />
          Về cửa hàng
        </NavLink>
      </div>
    </aside>
  )
}

export default AdminSidebar
