import { FiBell, FiSearch, FiMenu } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'

// ✅ THÊM: prop onMenuClick
function AdminHeader({ onMenuClick }) {
  const user = useAuthStore((s) => s.user)
  const displayName = user?.fullName || user?.name || 'Admin'

  // Greet theo giờ
  const hour = new Date().getHours()
  const greetPrefix =
    hour < 12 ? 'Chào buổi sáng' :
    hour < 18 ? 'Chào buổi chiều' :
    'Chào buổi tối'

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-[#D1C4B9] bg-white px-6 lg:left-72 lg:px-10">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center border border-[#D1C4B9] lg:hidden"
        aria-label="Mở menu"
      >
        <FiMenu className="h-5 w-5 text-[#4E453D]" />
      </button>

      {/* Search */}
      <div className="hidden items-center gap-3 border border-[#D1C4B9] px-4 py-2 sm:flex">
        <FiSearch className="h-4 w-4 text-[#4E453D]" />
        <input
          type="search"
          placeholder="Tìm kiếm đơn hàng, sản phẩm..."
          className="w-64 bg-transparent font-beVietnamPro text-sm text-[#1B1C19] outline-none placeholder:text-[#4E453D]/60"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-[#D1C4B9]"
          aria-label="Thông báo"
        >
          <FiBell className="h-5 w-5 text-[#4E453D]" />
        </button>

        <div className="flex items-center gap-3 border border-[#D1C4B9] px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAE1DB]">
            <span className="font-beVietnamPro text-xs font-bold text-[#1F1B17]">
              {(displayName).charAt(0).toUpperCase()}
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