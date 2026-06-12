import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok, FaTwitter } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
function Footer() {
  const footerLinks = {
    company: [
      { name: 'Về chúng tôi', path: '/about' },
      { name: 'Câu chuyện thương hiệu', path: '/story' },
      { name: 'Tuyển dụng', path: '/careers' },
      { name: 'Liên hệ', path: '/contact' },
    ],
    support: [
      { name: 'Hướng dẫn mua hàng', path: '/guide' },
      { name: 'Chính sách đổi trả', path: '/return-policy' },
      { name: 'Chính sách bảo mật', path: '/privacy' },
      { name: 'Điều khoản dịch vụ', path: '/terms' },
    ],
    customer: [
      { name: 'Tài khoản của tôi', path: '/profile' },
      { name: 'Theo dõi đơn hàng', path: '/orders' },
      { name: 'Danh sách yêu thích', path: '/wishlist' },
      { name: 'Hỗ trợ khách hàng', path: '/support' },
    ],
  }

  const socialLinks = [
    { icon: FaInstagram, url: 'https://instagram.com', color: 'hover:text-pink-500' },
    { icon: FaFacebookF, url: 'https://facebook.com', color: 'hover:text-blue-500' },
    { icon: FaYoutube, url: 'https://youtube.com', color: 'hover:text-red-500' },
    { icon: FaTiktok, url: 'https://tiktok.com', color: 'hover:text-black dark:hover:text-white' },
    { icon: FaTwitter, url: 'https://twitter.com', color: 'hover:text-blue-400' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
                <span className="text-black font-bold text-2xl">Z</span>
              </div>
              <span className="font-bold text-2xl text-white tracking-wider">YRO</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Thương hiệu thời trang cao cấp, mang đến phong cách hiện đại và tinh tế cho người Việt.
              Chất lượng vượt trội, thiết kế độc đáo.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MdLocationOn className="text-white" size={18} />
                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MdPhone className="text-white" size={18} />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MdEmail className="text-white" size={18} />
                <span>support@zyro.vn</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-gray-400 ${social.color} transition-colors`}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-lg mb-4">Công ty</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-lg mb-4">Khách hàng</h3>
            <ul className="space-y-2">
              {footerLinks.customer.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 ZyRo. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link to="/sitemap" className="text-sm text-gray-500 hover:text-white transition-colors">
              Sơ đồ trang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
