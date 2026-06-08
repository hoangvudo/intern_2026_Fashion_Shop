import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import useCheckoutStore from '../store/checkoutStore'

const PAYMENT_LABEL = {
  COD:           'Thanh toán khi nhận hàng (COD)',
  VNPAY:         'QR VNPay',
  MOMO:          'Ví MoMo',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
}

const SHIPPING_LABEL = {
  FAST:     'Giao hàng nhanh (2–3 ngày)',
  STANDARD: 'Giao hàng tiêu chuẩn (4–5 ngày)',
}

/* ════════════════════════════════════════════════════════════ */
function OrderSuccessPage() {
  const order = useCheckoutStore(state => state.order)

  /* Fallback nếu không có order trong store (F5 trang) */
  const fallbackCode = useMemo(() => `YRO${Math.floor(10000 + Math.random() * 90000)}`, [])

  if (!order) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
        <TopNav />
        <main className="flex flex-col items-center justify-center py-32 gap-6 text-center px-6">
          <SuccessIcon />
          <h1 className="text-4xl font-bold text-[#1A1B22] dark:text-white">
            Đặt hàng thành công!
          </h1>
          <p className="text-base text-[#4A4A4A] dark:text-gray-400">
            Mã đơn hàng của bạn là <strong>#{fallbackCode}</strong>.
            Chúng tôi đã gửi email xác nhận cho bạn.
          </p>
          <div className="flex gap-4 flex-wrap justify-center mt-2">
            <Link to="/design" className="rounded border border-[#1A1B22] px-8 py-3 text-sm hover:bg-[#1A1B22] hover:text-white transition dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
              Tiếp tục mua sắm
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const {
    orderCode, shippingName, shippingPhone, shippingAddress,
    shippingMethod, shippingFee, paymentMethod,
    subtotal, couponCode, discountPercent, discountAmount, totalAmount,
    note, estimatedDelivery, items = [],
  } = order

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <TopNav />

      {/* ── Hero ──────────────────────────────────── */}
      <main className="bg-[#FBF8FF] py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto flex max-w-[576px] flex-col items-center gap-10 text-center">
            <SuccessIcon />

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-[-0.02em] text-[#1A1B22] sm:text-[40px] dark:text-white">
                Cảm ơn bạn đã đặt hàng!
              </h1>
              <p className="text-base leading-7 text-[#1A1B22] dark:text-gray-300">
                Mã đơn hàng của bạn là{' '}
                <span className="font-bold text-[#BE123C]">#{orderCode}</span>.{' '}
                Chúng tôi đã gửi email xác nhận cho bạn.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/design" className="inline-flex items-center justify-center rounded border border-[#1A1B22] px-10 py-4 text-base text-[#1A1B22] transition hover:bg-[#1A1B22] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                Tiếp tục mua sắm
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center rounded bg-[#BE123C] px-10 py-4 text-base text-white transition hover:bg-[#9F0F32]">
                Hỗ trợ đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Chi tiết ─────────────────────────────── */}
      <section className="bg-white py-16 dark:bg-gray-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Giao hàng */}
          <InfoCard title="Địa chỉ giao hàng">
            <p className="font-semibold">{shippingName}</p>
            <p>{shippingPhone}</p>
            <p className="mt-1 text-sm leading-6 text-[#4A4A4A] dark:text-gray-400">
              {shippingAddress}
            </p>
          </InfoCard>

          {/* Vận chuyển & thanh toán */}
          <InfoCard title="Vận chuyển & Thanh toán">
            <div className="space-y-1 text-sm">
              <p>🚚 {SHIPPING_LABEL[shippingMethod] ?? shippingMethod}</p>
              <p>💳 {PAYMENT_LABEL[paymentMethod] ?? paymentMethod}</p>
              {estimatedDelivery && (
                <p className="mt-2 font-semibold text-[#BB5734]">
                  📅 Dự kiến: {estimatedDelivery}
                </p>
              )}
            </div>
          </InfoCard>

          {/* Tổng tiền */}
          <InfoCard title="Tóm tắt thanh toán">
            <div className="space-y-1 text-sm">
              <Row label="Tạm tính"        value={`₫${Number(subtotal).toLocaleString()}`} />
              {discountAmount > 0 && (
                <Row label={`Giảm giá (${couponCode} – ${discountPercent}%)`}
                     value={`−₫${Number(discountAmount).toLocaleString()}`}
                     className="text-green-600 dark:text-green-400" />
              )}
              <Row label="Phí vận chuyển"  value={`₫${Number(shippingFee).toLocaleString()}`} />
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2 border-[#DDC0B8] dark:border-white/10">
                <span>Tổng cộng</span>
                <span className="text-[#95002A]">₫{Number(totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </InfoCard>
        </div>

        {note && (
          <div className="mx-auto mt-4 max-w-7xl px-6">
            <div className="rounded-2xl border border-[#DDC0B8] bg-[#FFF8F6] dark:border-white/10 dark:bg-slate-900 px-6 py-4 text-sm text-[#4A4A4A] dark:text-gray-400">
              📝 Ghi chú: {note}
            </div>
          </div>
        )}
      </section>

      {/* ── Sản phẩm đã mua ──────────────────────── */}
      {items.length > 0 && (
        <section className="bg-[#FBF8FF] py-16 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-serif mb-8 text-[#231916] dark:text-white">
              Sản phẩm đã đặt
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <div key={`${item.productId ?? i}-${item.size ?? ''}-${item.color ?? ''}`} className="overflow-hidden rounded-2xl border border-[#E3BDBF] bg-white shadow-sm dark:border-white/10 dark:bg-slate-900 flex gap-4 p-4">
                  {item.productImage && (
                    <img src={item.productImage} alt={item.productName}
                      className="h-20 w-16 object-cover rounded-xl flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#231916] dark:text-white truncate">{item.productName}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-[#695D4B] dark:text-gray-400 mt-0.5">
                        {[item.size && `Size ${item.size}`, item.color && `Màu ${item.color}`].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-xs text-[#695D4B] dark:text-gray-400 mt-0.5">SL: {item.quantity}</p>
                    <p className="text-sm font-semibold text-[#95002A] mt-1">
                      ₫{Number(item.lineTotal).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

/* ═══ Sub-components ════════════════════════════════════════ */
const SuccessIcon = () => (
  <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-[#E3BDBF] bg-white shadow-sm dark:bg-slate-900">
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" className="h-14 w-14">
      <path d="M22.6846 38.7231L41.8731 19.5346L39.75 17.4115L22.6846 34.4769L14.1346 25.9269L12.0115 28.05L22.6846 38.7231ZM27.0101 54C23.2764 54 19.7662 53.2916 16.4793 51.8746C13.1925 50.4576 10.3334 48.5346 7.90198 46.1055C5.4706 43.6764 3.54576 40.8199 2.12746 37.5361C0.709152 34.2524 0 30.7437 0 27.0101C0 23.2764 0.708487 19.7662 2.12546 16.4793C3.54244 13.1925 5.46547 10.3334 7.89457 7.90198C10.3237 5.4706 13.1801 3.54576 16.4639 2.12746C19.7477 0.709152 23.2564 0 26.99 0C30.7236 0 34.2338 0.708487 37.5207 2.12546C40.8076 3.54243 43.6667 5.46547 46.0981 7.89457C48.5294 10.3237 50.4543 13.1801 51.8726 16.4639C53.2909 19.7477 54 23.2564 54 26.99C54 30.7236 53.2916 34.2338 51.8746 37.5207C50.4576 40.8076 48.5346 43.6667 46.1055 46.0981C43.6764 48.5294 40.8199 50.4543 37.5361 51.8726C34.2524 53.2909 30.7437 54 27.0101 54ZM27 51C33.7 51 39.375 48.675 44.025 44.025C48.675 39.375 51 33.7 51 27C51 20.3 48.675 14.625 44.025 9.97502C39.375 5.32502 33.7 3.00002 27 3.00002C20.3 3.00002 14.625 5.32502 9.97502 9.97502C5.32502 14.625 3.00002 20.3 3.00002 27C3.00002 33.7 5.32502 39.375 9.97502 44.025C14.625 48.675 20.3 51 27 51Z" fill="#95002A"/>
    </svg>
  </div>
)

const InfoCard = ({ title, children }) => (
  <div className="rounded-3xl border border-[#E3BDBF] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5E5E5E] dark:text-gray-400 mb-3">
      {title}
    </p>
    <div className="text-[#1A1B22] dark:text-gray-200">{children}</div>
  </div>
)

const Row = ({ label, value, className = '' }) => (
  <div className={`flex justify-between ${className}`}>
    <span>{label}</span><span>{value}</span>
  </div>
)

export default OrderSuccessPage