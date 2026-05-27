import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="w-full bg-surface-container-highest dark:bg-surface-container border-t border-outline-variant mt-xl">
      {/* Main Footer Content */}
      <div className="px-xl py-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
          {/* Brand Column */}
          <div>
            <Link to="/" className="font-headline-md text-headline-md text-primary inline-block mb-sm">
              LuxeCommerce
            </Link>
            <p className="font-body-sm text-on-surface-variant mb-sm leading-relaxed">
              Nâng tầm phong cách với thời trang cao cấp được tuyển chọn kỹ lưỡng.
            </p>
            <div className="flex gap-xs">
              <a href="#" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-lg">facebook</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-lg">photo_camera</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-lg">chat</span>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-label-bold text-on-surface mb-sm">Mua Sắm</h3>
            <ul className="space-y-xs">
              <li>
                <Link to="/new-arrivals" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  Hàng Mới Về
                </Link>
              </li>
              <li>
                <Link to="/best-sellers" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  Bán Chạy Nhất
                </Link>
              </li>
              <li>
                <Link to="/sale" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  Sale & Khuyến Mãi
                </Link>
              </li>
              <li>
                <Link to="/categories" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  Danh Mục
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h3 className="font-label-bold text-on-surface mb-sm">Hỗ Trợ</h3>
            <ul className="space-y-xs">
              <li>
                <Link to="/contact" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  Giao Hàng
                </Link>
              </li>
              <li>
                <Link to="/returns" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  Đổi Trả
                </Link>
              </li>
              <li>
                <Link to="/faq" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-label-bold text-on-surface mb-sm">Liên Hệ</h3>
            <ul className="space-y-xs mb-sm">
              <li className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-lg">call</span>
                <span className="font-body-sm text-on-surface-variant">1900 1234</span>
              </li>
              <li className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                <span className="font-body-sm text-on-surface-variant">support@luxe.vn</span>
              </li>
            </ul>
            
            <div className="flex gap-xs mt-sm">
              <input 
                type="email" 
                placeholder="Email của bạn"
                className="flex-1 px-sm py-xs rounded bg-surface border border-outline text-on-surface font-body-sm text-sm focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-on-primary px-sm py-xs rounded hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline-variant">
        <div className="px-xl py-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-xs text-sm">
            <p className="font-body-sm text-on-surface-variant">
              © 2024 LuxeCommerce
            </p>
            <div className="flex gap-md">
              <Link to="/privacy" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Bảo Mật
              </Link>
              <Link to="/terms" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Điều Khoản
              </Link>
            </div>
            <div className="flex gap-xs items-center">
              <div className="w-8 h-5 bg-surface-container rounded flex items-center justify-center">
                <span className="text-xs font-bold text-primary">VISA</span>
              </div>
              <div className="w-8 h-5 bg-surface-container rounded flex items-center justify-center">
                <span className="text-xs font-bold text-error">MC</span>
              </div>
              <div className="w-8 h-5 bg-surface-container rounded flex items-center justify-center">
                <span className="text-xs font-bold text-tertiary">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
