import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiShoppingCart, FiUser, FiMenu, FiX,
  FiSun, FiMoon, FiGrid, FiShoppingBag, FiChevronDown,
} from "react-icons/fi";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import ProfileModal from "./ProfileModal";
import SearchModal from "./SearchModal";
import categoryService from "../services/categoryService";

function TopNav() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();
  const displayName = user?.fullName || user?.email?.split("@")[0] || "Bạn";
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

  const [showUserMenu,     setShowUserMenu]     = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSearchModal,  setShowSearchModal]  = useState(false);
  const [showMobileMenu,   setShowMobileMenu]   = useState(false);
  const [isLoggingOut,     setIsLoggingOut]     = useState(false);
  const [darkMode,         setDarkMode]         = useState(localStorage.getItem("theme") === "dark");
  const [scrolled,         setScrolled]         = useState(false);
  const [categories,       setCategories]       = useState([]);
  const [mobileBstOpen,    setMobileBstOpen]    = useState(false);

  const userMenuRef = useRef(null);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Click outside user menu
  useEffect(() => {
    const fn = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setShowUserMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Load categories từ API
  useEffect(() => {
    categoryService.getAll()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Đăng xuất thành công!");
      setShowUserMenu(false);
      navigate("/login");
    } catch {
      toast.error("Đăng xuất thất bại");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* ── Top bar ─────────────────────────────────── */}
      <div className="bg-black dark:bg-gray-900 text-white py-2 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className="hover:text-pink-400 transition-colors">
              <FaInstagram size={16} />
            </motion.a>
            <motion.a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className="hover:text-blue-400 transition-colors">
              <FaFacebookF size={16} />
            </motion.a>
            <motion.a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className="hover:text-red-400 transition-colors">
              <FaYoutube size={16} />
            </motion.a>
          </div>
          <div className="flex items-center gap-4">
            <motion.button onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className="hover:text-yellow-400 transition-colors">
              {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Main header ─────────────────────────────── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`bg-white dark:bg-gray-800 sticky top-0 z-50 transition-shadow ${scrolled ? "shadow-md" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-black dark:bg-white rounded-sm flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-2xl">Z</span>
              </motion.div>
              <span className="font-bold text-xl text-black dark:text-white tracking-wider">YRO</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/"
                className="text-sm font-medium text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors uppercase tracking-wide">
                Trang chủ
              </Link>
              <Link to="/story"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-wide">
                Câu chuyện
              </Link>
              <Link to="/design"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-wide">
                Thiết kế
              </Link>

              {/* Bộ sưu tập dropdown — load từ API */}
              <div className="relative group">
                <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-wide flex items-center gap-1">
                  Bộ sưu tập
                  <FiChevronDown className="group-hover:rotate-180 transition-transform duration-200" size={14} />
                </button>

                <div className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all z-50">
                  <div className="py-2">
                    {/* Xem tất cả */}
                    <Link to="/collections"
                      className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                      Tất cả bộ sưu tập
                    </Link>

                    {/* Skeleton khi đang load */}
                    {categories.length === 0 ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="mx-4 my-2.5 h-3.5 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
                      ))
                    ) : (
                      categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/collections/${cat.slug || cat.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {cat.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <Link to="/blog"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-wide">
                Tạp chí
              </Link>
              <Link to="/contact"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-wide">
                Liên hệ
              </Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <motion.button onClick={() => setShowSearchModal(true)}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                <FiSearch size={20} />
              </motion.button>

              {/* Cart */}
              <Link to="/cart" className="relative">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  <FiShoppingCart size={20} />
                </motion.button>
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              </Link>

              {/* User menu */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                    <FiUser size={20} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 overflow-hidden z-50"
                      >
                        <p className="border-b border-gray-100 dark:border-gray-700 px-4 py-2 text-xs text-gray-500">
                          Xin chào, {displayName}
                        </p>

                        {user?.role === "ADMIN" && (
                          <button
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
                            onClick={() => { setShowUserMenu(false); navigate("/admin"); }}>
                            <FiGrid size={18} />
                            <span className="text-sm">Dashboard</span>
                          </button>
                        )}

                        <button
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
                          onClick={() => { setShowUserMenu(false); navigate("/my-orders"); }}>
                          <FiShoppingBag size={18} />
                          <span className="text-sm">Đơn hàng của tôi</span>
                        </button>

                        <button
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
                          onClick={() => { setShowUserMenu(false); setShowProfileModal(true); }}>
                          <FiUser size={18} />
                          <span className="text-sm">Tài khoản</span>
                        </button>

                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left disabled:opacity-50">
                          <span className="text-sm text-red-600">
                            {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                          </span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                    <FiUser size={20} />
                  </motion.button>
                </Link>
              )}

              {/* Mobile hamburger */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileMenu((v) => !v)}
                className="lg:hidden text-gray-700 dark:text-gray-300">
                {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────── */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <nav className="px-4 py-4 space-y-3">
                <Link to="/" onClick={() => setShowMobileMenu(false)}
                  className="block text-sm font-medium text-black dark:text-white uppercase">
                  Trang chủ
                </Link>
                <Link to="/story" onClick={() => setShowMobileMenu(false)}
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 uppercase">
                  Câu chuyện
                </Link>
                <Link to="/design" onClick={() => setShowMobileMenu(false)}
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 uppercase">
                  Thiết kế
                </Link>
                <Link to="/contact" onClick={() => setShowMobileMenu(false)}
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 uppercase">
                  Liên hệ
                </Link>

                {/* Bộ sưu tập accordion */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setMobileBstOpen((v) => !v)}
                    className="flex w-full items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-300 uppercase mb-1"
                  >
                    Bộ sưu tập
                    <FiChevronDown className={`transition-transform ${mobileBstOpen ? "rotate-180" : ""}`} size={14} />
                  </button>

                  <AnimatePresence>
                    {mobileBstOpen && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                        className="overflow-hidden pl-2 space-y-1"
                      >
                        <Link to="/collections" onClick={() => setShowMobileMenu(false)}
                          className="block py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Tất cả
                        </Link>
                        {categories.map((cat) => (
                          <Link key={cat.id}
                            to={`/collections/${cat.slug || cat.id}`}
                            onClick={() => setShowMobileMenu(false)}
                            className="block py-1.5 text-sm text-gray-600 dark:text-gray-300">
                            {cat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/blog" onClick={() => setShowMobileMenu(false)}
                  className="block text-sm font-medium text-gray-600 dark:text-gray-300 uppercase">
                  Tạp chí
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <ProfileModal open={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <SearchModal  open={showSearchModal}  onClose={() => setShowSearchModal(false)} />
    </>
  );
}

export default TopNav;