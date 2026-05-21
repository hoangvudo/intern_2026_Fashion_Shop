import TopNav from '../components/TopNav'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import { motion } from 'framer-motion'
import { MdCheckroom, MdMale, MdFemale, MdOutlineStyle, MdEco, MdDesignServices, MdStraighten, MdAutorenew, MdShoppingBag } from 'react-icons/md'
import useCartStore from '../store/cartStore'
import toast from 'react-hot-toast'

function Home() {
  const addItem = useCartStore(state => state.addItem)
  function handleAdd(product){
    addItem(product)
    toast.success('Đã thêm vào giỏ hàng')
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopNav />
      
      <main className="pt-20">
        <section className="bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                zyro — Thời trang tối giản, tinh tế
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Bộ sưu tập mới giao thoa giữa phong cách hiện đại và sự tinh tế Á Đông. Khám phá các thiết kế thủ công,
                chất liệu cao cấp và dịch vụ cá nhân hóa cho trải nghiệm mua sắm khác biệt.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <a
                  href="#"
                  className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
                >
                  Mua ngay
                </a>
                <a
                  href="#"
                  className="inline-block border border-gray-300 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Xem bộ sưu tập
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-md rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/src/assets/logo.jpg"
                  alt="zyro hero"
                  className="w-full h-72 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Brand philosophy + categories (styled) */}
        <section className="py-16 bg-gradient-to-r from-rose-50 via-amber-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <blockquote className="border-l-4 border-rose-300 pl-6 italic text-2xl sm:text-3xl text-rose-700 dark:text-rose-300">
                  Trang phục không chỉ là vải vóc, đó là ngôn ngữ của sự tự tin.
                </blockquote>

                <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg">
                  Tôi muốn mỗi thiết kế <strong>ZYRO</strong> là lời khẳng định kiêu hãnh nhất về khí chất của chính bạn.
                </p>

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Ms Hương, Founder ZYRO</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <MdEco className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Chất liệu thân thiện</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Sợi vải tự nhiên, vỗ về làn da nhạy cảm.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <MdDesignServices className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Kiểu dáng tinh tế</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Đường may tinh xảo, tôn vinh khí chất.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
                    <MdStraighten className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">May đo tinh chỉnh</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Thấu hiểu từng đường cong, chiều chuộng mọi vóc dáng.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <MdAutorenew className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">Thời trang bền vững</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Kéo dài vòng đời, sẻ chia giá trị.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Danh mục</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <a href="/category/ao" className="block group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition p-4 text-center">
                  <MdCheckroom className="text-4xl mx-auto text-gray-700 dark:text-gray-200 mb-3" />
                  <span className="font-medium">Áo</span>
                </a>
                <a href="/category/quan" className="block group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition p-4 text-center">
                  <MdMale className="text-4xl mx-auto text-gray-700 dark:text-gray-200 mb-3" />
                  <span className="font-medium">Quần</span>
                </a>
                <a href="/category/vay" className="block group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition p-4 text-center">
                  <MdFemale className="text-4xl mx-auto text-gray-700 dark:text-gray-200 mb-3" />
                  <span className="font-medium">Váy</span>
                </a>
                <a href="/category/dam" className="block group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition p-4 text-center">
                  <MdOutlineStyle className="text-4xl mx-auto text-gray-700 dark:text-gray-200 mb-3" />
                  <span className="font-medium">Đầm</span>
                </a>
              </div>
            </div>
            {/* Featured products */}
            <section className="mt-12">
              <h4 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Sản phẩm nổi bật</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map((i) => {
                  const product = { id: `featured-${i}`, name: `Sản phẩm mẫu ${i}`, price: 499000, image: '/src/assets/logo.jpg', description: 'Mô tả ngắn về sản phẩm' }
                  return (
                    <div key={i} className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 hover:scale-102">
                        <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden relative">
                          <img src="/src/assets/logo.jpg" alt={`product-${i}`} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <Link to={`/product/${product.id}`} className="px-4 py-2 bg-white text-black rounded">Xem chi tiết</Link>
                          </div>
                        </div>
                      <div className="p-4">
                        <h5 className="font-semibold text-gray-900 dark:text-white">Sản phẩm mẫu {i}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Mô tả ngắn về sản phẩm, chất liệu và kiểu dáng.</p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">₫499.000</div>
                          <button onClick={() => handleAdd(product)} className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md hover:opacity-90 transition">
                            <MdShoppingBag /> Thêm
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
            
          </div>
        </section>
        {/* Full-width marquee banner */}
        <div className="w-full bg-black text-white overflow-hidden mt-8">
          <style>{`
            @keyframes zyro-marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          <div className="whitespace-nowrap will-change-transform" style={{
            display: 'inline-block',
            padding: '1rem 0',
            animation: 'zyro-marquee 18s linear infinite'
          }}>
            <div style={{display: 'inline-block', marginRight: '2rem'}}>
              {Array.from({length: 8}).map((_,i) => (
                <span key={i} className="inline-block px-8 text-xl font-semibold">✦ CHẠM LÀ MÊ ✦</span>
              ))}
            </div>
            <div style={{display: 'inline-block'}}>
              {Array.from({length: 8}).map((_,i) => (
                <span key={i} className="inline-block px-8 text-xl font-semibold">✦ CHẠM LÀ MÊ ✦</span>
              ))}
            </div>
          </div>
        </div>

        {/* Collection showcase under marquee - title on top, cards below */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">Áo dài - Pháp phục</h2>
              <h3 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">BST Khai Hoa Phú Quý</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">Tuyệt tác gấm lụa tôn vinh cốt cách đại các, gửi gắm nguồn năng lượng an lành và lời chúc phồn vinh cho chủ nhân.</p>
              <a href="#" className="inline-block border border-gray-800 text-gray-800 dark:text-white px-6 py-3 rounded-md hover:bg-gray-50 transition">Xem Ngay</a>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map((i) => {
                const product = { id: `collection-${i}`, name: `Sản phẩm ${i}`, price: 499000, image: '/src/assets/logo.jpg', description: 'Mô tả ngắn gọn' }
                return (
                <div key={i} className="group overflow-hidden rounded-lg shadow hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 hover:scale-102 bg-white dark:bg-gray-800">
                  <div className="relative">
                    <img src="/src/assets/logo.jpg" alt={`collection-${i}`} className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Link to={`/product/${product.id}`} className="px-4 py-2 bg-white text-black rounded">Xem chi tiết</Link>
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white">Sản phẩm {i}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Mô tả ngắn gọn sản phẩm.</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">₫499.000</div>
                      <button onClick={() => handleAdd(product)} className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md hover:opacity-90 transition">
                        <MdShoppingBag /> Thêm
                      </button>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home
