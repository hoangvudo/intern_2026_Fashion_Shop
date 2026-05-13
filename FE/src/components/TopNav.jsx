import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

function TopNav() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      logout()
      toast.success('Đăng xuất thành công!')
      setShowUserMenu(false)
      navigate('/login')
    } catch (error) {
      toast.error('Đăng xuất thất bại')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface dark:bg-surface-container-lowest flex justify-between items-center px-lg h-16 max-w-container-max mx-auto left-0 right-0">
      <div className="flex items-center gap-lg">
        <Link to="/" className="font-display text-display text-primary dark:text-primary-fixed-dim">
          LuxeCommerce
        </Link>
        <nav className="hidden md:flex gap-md">
          <Link to="/new-arrivals" className="text-primary font-label-bold border-b-2 border-primary pb-1">
            New Arrivals
          </Link>
          <Link to="/best-sellers" className="text-on-surface-variant font-body-md hover:text-primary transition-colors duration-200">
            Best Sellers
          </Link>
          <Link to="/categories" className="text-on-surface-variant font-body-md hover:text-primary transition-colors duration-200">
            Categories
          </Link>
          <Link to="/sale" className="text-on-surface-variant font-body-md hover:text-primary transition-colors duration-200">
            Sale
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-sm">
        <div className="relative bg-surface-container-low dark:bg-surface-container-lowest rounded-full px-sm py-xs flex items-center gap-xs">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-body-sm w-48 lg:w-64" 
            placeholder="Tìm kiếm sản phẩm..." 
            type="text"
          />
        </div>
        
        <button className="p-xs hover:bg-surface-variant rounded-full transition-all active:opacity-80">
          <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">shopping_cart</span>
        </button>
        
        {/* User Menu */}
        {isAuthenticated ? (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
              className="p-xs hover:bg-surface-variant rounded-full transition-all active:opacity-80"
            >
              <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">person</span>
            </button>
            
            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-sm overflow-hidden">
                <Link 
                  to="/profile"
                  className="flex items-center gap-sm px-md py-sm hover:bg-surface-container-low transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">account_circle</span>
                  <span className="font-body-md text-on-surface">Tài khoản</span>
                </Link>
                
                <Link 
                  to="/orders"
                  className="flex items-center gap-sm px-md py-sm hover:bg-surface-container-low transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">shopping_bag</span>
                  <span className="font-body-md text-on-surface">Đơn hàng</span>
                </Link>
                
                <Link 
                  to="/settings"
                  className="flex items-center gap-sm px-md py-sm hover:bg-surface-container-low transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">settings</span>
                  <span className="font-body-md text-on-surface">Cài đặt</span>
                </Link>
                
                <div className="border-t border-outline-variant my-xs" />
                
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-sm px-md py-sm hover:bg-error-container transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-error" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="font-body-md text-error">Đang đăng xuất...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-error text-xl">logout</span>
                      <span className="font-body-md text-error">Đăng xuất</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="p-xs hover:bg-surface-variant rounded-full transition-all active:opacity-80">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">person</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export default TopNav
