import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiShoppingBag,
  FiPackage,
  FiTag,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiX,
  FiStar,
  FiHash,
  FiRotateCcw,
  FiMessageSquare,
  FiBookOpen,
} from "react-icons/fi";

import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const navItems = [
  { to: "/admin", label: "Tổng quan", icon: FiGrid, end: true },
  { to: "/admin/orders", label: "Đơn hàng", icon: FiShoppingBag },
  { to: "/admin/returns", label: "Hủy/Đổi/Trả", icon: FiRotateCcw },
  { to: "/admin/products", label: "Sản phẩm", icon: FiPackage },
  { to: "/admin/categories", label: "Danh mục", icon: FiTag },
  { to: "/admin/brands", label: "Thương hiệu", icon: FiHash },
  { to: "/admin/reviews", label: "Đánh giá", icon: FiStar },
  { to: "/admin/customers", label: "Khách hàng", icon: FiUsers },
  { to: "/admin/contacts", label: "Liên hệ", icon: FiMessageSquare },
  { to: "/admin/articles", label: "Tạp chí", icon: FiBookOpen },
  { to: "/admin/reports", label: "Báo cáo", icon: FiBarChart2 },
  { to: "/admin/settings", label: "Cài đặt", icon: FiSettings },
];

// ✅ THÊM: prop open/onClose cho mobile
function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    toast.success("Đã đăng xuất");
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-[#D1C4B9] bg-[#F0EEE9]
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-[#D1C4B9] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-[#D1C4B9] bg-white">
            <span className="font-beVietnamPro text-sm font-bold tracking-widest text-[#6F583D]">
              ZY
            </span>
          </div>
          <div>
            <p className="font-beVietnamPro text-lg font-semibold text-[#1B1C19]">
              ZYRO
            </p>
            <p className="font-beVietnamPro text-xs text-[#4E453D]">
              Admin Panel
            </p>
          </div>
        </div>
        {/* Close button — chỉ hiện trên mobile */}
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center text-[#4E453D] hover:bg-white/60 lg:hidden"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-beVietnamPro text-sm font-medium transition-colors ${
                isActive
                  ? "border border-[#D1C4B9] bg-white text-[#1B1C19]"
                  : "text-[#4E453D] hover:bg-white/60"
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#D1C4B9] p-4 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 font-beVietnamPro text-sm text-[#4E453D] hover:bg-white/60 hover:text-[#1B1C19]"
        >
          <FiPackage className="h-5 w-5" />
          Về cửa hàng
        </NavLink>
        {/* ✅ THÊM: nút logout thật */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 font-beVietnamPro text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <FiLogOut className="h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
