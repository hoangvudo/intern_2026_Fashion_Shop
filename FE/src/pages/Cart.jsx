import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import useCartStore from '../store/cartStore'
import { MdDelete } from 'react-icons/md'
import toast from 'react-hot-toast'

export default function Cart(){
  const items = useCartStore(state => state.items)
  const removeItem = useCartStore(state => state.removeItem)
  const updateQty = useCartStore(state => state.updateQty)
  const total = useCartStore(state => state.getTotal())

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopNav />

      <main className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6">Giỏ hàng của bạn</h2>

          {items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-gray-600 mb-4">Giỏ hàng trống — hãy thêm sản phẩm yêu thích.</p>
              <a href="/" className="inline-block px-6 py-3 bg-black text-white rounded">Tiếp tục mua sắm</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                {items.map(item => (
                  <div key={item.id} className="relative flex flex-col sm:flex-row gap-4 p-4 border rounded bg-white dark:bg-gray-800">
                    <img src={item.image || '/src/assets/logo.jpg'} alt={item.name} className="w-full sm:w-36 h-36 object-cover rounded" />
                    <div className="flex-1 flex flex-col">
                      <div>
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-500">Số lượng</label>
                          <div className="inline-flex items-center border rounded overflow-hidden bg-white dark:bg-gray-800">
                            <button type="button" onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))} className="px-3 py-1 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">−</button>
                            <div className="w-12 text-center px-2 py-1 text-sm">{item.qty}</div>
                            <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} className="px-3 py-1 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">+</button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-lg font-extrabold text-gray-900">₫{((item.price||0) * item.qty).toLocaleString()}</div>
                          <button onClick={()=>{ removeItem(item.id); toast.success('Xóa sản phẩm thành công') }} aria-label="Xóa sản phẩm" className="w-8 h-8 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-sm transition-transform duration-150 hover:scale-105">
                            <span className="text-base font-semibold leading-none">×</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    
                  </div>
                ))}
              </div>

              <aside className="lg:col-span-4">
                <div className="sticky top-24 p-6 border rounded bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Tạm tính</span><span>₫{total.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-gray-600 mb-4"><span>Phí vận chuyển</span><span>Miễn phí</span></div>
                  <div className="flex justify-between text-base font-bold border-t pt-3"><span>Tổng</span><span>₫{total.toLocaleString()}</span></div>

                  <button className="w-full mt-6 px-4 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded">Thanh toán</button>
                  <a href="/" className="block text-center mt-3 text-sm text-gray-600">Tiếp tục mua sắm</a>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
