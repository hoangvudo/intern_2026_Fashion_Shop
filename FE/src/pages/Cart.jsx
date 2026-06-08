import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import useCartStore from '../store/cartStore'
import { validateCoupon } from '../services/orderService'
import toast from 'react-hot-toast'

export default function Cart() {
  const items      = useCartStore(state => state.items)
  const removeItem = useCartStore(state => state.removeItem)
  const updateQty  = useCartStore(state => state.updateQty)
  const getTotal    = useCartStore(state => state.getTotal)
  const subtotal    = getTotal()
  const navigate   = useNavigate()

  const [couponInput,    setCouponInput]    = useState('')
  const [coupon,         setCoupon]         = useState(null)   // { code, discountPercent, discountAmount }
  const [couponLoading,  setCouponLoading]  = useState(false)

  const discount     = coupon?.discountAmount ?? 0
  const shipping     = items.length > 0 ? 35_000 : 0
  const total        = subtotal - discount + shipping

  /* ── Áp mã giảm giá ─────────────────────────────── */
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const res = await validateCoupon(couponInput.trim(), subtotal)
      if (res.valid) {
        setCoupon(res)
        toast.success(res.message)
      } else {
        setCoupon(null)
        toast.error(res.message)
      }
    } catch {
      toast.error('Không thể kiểm tra mã. Thử lại sau.')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCoupon(null)
    setCouponInput('')
    toast('Đã xóa mã giảm giá', { icon: '🗑️' })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopNav />

      <main className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6">Giỏ hàng của bạn</h2>

          {items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-gray-600 mb-4">
                Giỏ hàng trống — hãy thêm sản phẩm yêu thích.
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-black text-white rounded"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* ── Danh sách sản phẩm ─────────────── */}
              <div className="lg:col-span-8 space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={`${item.id}-${item.size ?? ''}-${item.color ?? ''}-${idx}`}
                    className="flex flex-col sm:flex-row gap-4 p-4 border rounded bg-white dark:bg-gray-800"
                  >
                    <img
                      src={item.image || '/src/assets/logo.jpg'}
                      alt={item.name}
                      className="w-full sm:w-36 h-36 object-cover rounded"
                    />
                    <div className="flex-1 flex flex-col">
                      <div>
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        {(item.size || item.color) && (
                          <p className="text-xs text-gray-400 mt-1">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' · '}
                            {item.color && `Màu: ${item.color}`}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-500">Số lượng</label>
                          <div className="inline-flex items-center border rounded overflow-hidden bg-white dark:bg-gray-800">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.size, item.color, Math.max(1, item.qty - 1))}
                              className="px-3 py-1 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >−</button>
                            <div className="w-12 text-center px-2 py-1 text-sm">{item.qty}</div>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)}
                              className="px-3 py-1 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >+</button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                            ₫{((item.price || 0) * item.qty).toLocaleString()}
                          </div>
                          <button
                            onClick={() => {
                              removeItem(item.id, item.size, item.color)
                              toast.success('Xóa sản phẩm thành công')
                            }}
                            aria-label="Xóa sản phẩm"
                            className="w-8 h-8 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-105"
                          >
                            <span className="text-base font-semibold leading-none">×</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ── Mã giảm giá ───────────────────── */}
                <div className="p-5 border rounded-xl bg-[#FFF8F6] dark:bg-gray-800">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#BB5734] mb-3">
                    Mã giảm giá
                  </p>
                  {coupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <div>
                        <span className="font-semibold text-green-700">{coupon.code}</span>
                        <span className="ml-2 text-sm text-green-600">
                          − ₫{Number(coupon.discountAmount).toLocaleString()} ({coupon.discountPercent}%)
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Nhập mã coupon (vd: SALE10)"
                        className="flex-1 border border-[#DDC0B8] rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white outline-none focus:border-[#BB5734]"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2 bg-[#BB5734] text-white text-sm rounded-lg hover:bg-[#9F4A2D] disabled:opacity-50 transition"
                      >
                        {couponLoading ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Thử: SALE10 · SALE20 · NEWUSER · YRO5
                  </p>
                </div>
              </div>

              {/* ── Tóm tắt ────────────────────────── */}
              <aside className="lg:col-span-4">
                <div className="sticky top-24 p-6 border rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>₫{subtotal.toLocaleString()}</span>
                    </div>
                    {coupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá ({coupon.code})</span>
                        <span>−₫{Number(coupon.discountAmount).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span>₫{shipping.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-base font-bold border-t pt-3 mt-3">
                    <span>Tổng</span>
                    <span className="text-[#95002A]">₫{total.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => navigate('/checkout', { state: { coupon } })}
                    className="w-full mt-6 px-4 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-full font-semibold transition"
                  >
                    Tiến hành thanh toán →
                  </button>
                  <Link
                    to="/"
                    className="block text-center mt-3 text-sm text-gray-500 hover:underline"
                  >
                    Tiếp tục mua sắm
                  </Link>
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