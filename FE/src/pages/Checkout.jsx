import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import useCartStore, { parsePrice } from '../store/cartStore'
import useCheckoutStore from '../store/checkoutStore'
import { placeOrder, validateCoupon } from '../services/orderService'
import api from '../services/api'
import toast from 'react-hot-toast'

/* ─── Geo API ─── */
const GEO = 'https://provinces.open-api.vn/api'
const fetchProvinces = () => fetch(`${GEO}/p/?depth=1`).then(r => r.json())
const fetchDistricts = c => fetch(`${GEO}/p/${c}?depth=2`).then(r => r.json()).then(d => d.districts ?? [])
const fetchWards     = c => fetch(`${GEO}/d/${c}?depth=2`).then(r => r.json()).then(d => d.wards ?? [])

/* ─── Constants ─── */
const PAYMENT_METHODS = [
  { id: 'COD',    label: 'Tiền mặt khi nhận hàng',  desc: 'Trả tiền cho nhân viên giao hàng', icon: '💵' },
  { id: 'PAYOS',  label: 'Chuyển khoản / QR Code',  desc: 'Thanh toán qua PayOS – hỗ trợ tất cả ngân hàng, VNPay, MoMo', icon: '📲' },
]

const SHIPPING_OPTIONS = [
  { id: 'FAST',     label: 'Giao nhanh (2–3 ngày)',      sub: 'GHTK / GHN',  fee: 35_000 },
  { id: 'STANDARD', label: 'Giao tiêu chuẩn (4–5 ngày)', sub: 'Bưu điện',    fee: 20_000 },
]

const sanitizeImage = url => (!url || !/^https?:\/\//i.test(url)) ? null : url

/* ─── PayOS Modal ─── */
function PayOSModal({ open, onClose, checkoutUrl, qrCode, amount, orderCode, orderId, onConfirmed }) {
  const [checking,    setChecking]   = useState(false)
  const [pollCount,   setPollCount]  = useState(0)
  const [isPaid,      setIsPaid]     = useState(false)
  const navigate = useNavigate()

  // Poll trạng thái mỗi 3s khi modal mở
  useEffect(() => {
    if (!open || !orderId || isPaid) return
    const timer = setInterval(async () => {
      try {
        const res = await api.get(`/orders/${orderId}/payos/status`)
        if (res.data?.isPaid) {
          setIsPaid(true)
          clearInterval(timer)
          onConfirmed()
        }
      } catch { /* ignore */ }
      setPollCount(c => c + 1)
    }, 3000)
    return () => clearInterval(timer)
  }, [open, orderId, isPaid, onConfirmed])

  // Nếu user muốn mở trang PayOS trên trình duyệt
  const openPayOS = () => window.open(checkoutUrl, '_blank')

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', duration: 0.4 }}
className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-5 text-center">
              <p className="font-beVietnamPro text-xs uppercase tracking-widest text-white/70">Thanh toán đơn hàng</p>
              <p className="mt-1 font-serif text-xl text-white">#{orderCode}</p>
              <p className="mt-1 font-beVietnamPro text-2xl font-bold text-white">
                ₫{Number(amount).toLocaleString('vi-VN')}
              </p>
            </div>

            <div className="p-6 text-center">
              {/* QR Code thực từ PayOS */}
              {qrCode && (
                <div className="mb-4 flex justify-center">
                  <div className="rounded-2xl border-4 border-gray-100 bg-white p-2 shadow-inner">
                    {/* PayOS trả về chuỗi VietQR, dùng VietQR render */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrCode)}`}
                      alt="QR thanh toán"
                      className="h-52 w-52 object-contain"
                    />
                  </div>
                </div>
              )}

              <p className="mb-1 font-beVietnamPro text-xs text-gray-500">
                Quét bằng <strong>app ngân hàng</strong>, <strong>VNPay</strong>, <strong>MoMo</strong> hoặc bất kỳ app hỗ trợ VietQR
              </p>

              {/* Polling indicator */}
              <div className="my-3 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Đang chờ xác nhận thanh toán... ({pollCount})
              </div>

              {/* Hoặc mở trang PayOS */}
              <button
                onClick={openPayOS}
                className="mb-3 w-full rounded-xl border-2 border-emerald-500 py-3 font-beVietnamPro text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition"
              >
                🔗 Mở trang thanh toán PayOS
              </button>

              {/* Xác nhận thủ công nếu đã CK nhưng chưa auto detect */}
              <button
                onClick={async () => {
                  setChecking(true)
                  try {
                    const res = await api.get(`/orders/${orderId}/payos/status`)
                    if (res.data?.isPaid) {
                      setIsPaid(true); onConfirmed()
                    } else {
                      toast('Chưa nhận được thanh toán. Vui lòng thử lại sau.', { icon: '⏳' })
                    }
                  } catch { toast.error('Lỗi kiểm tra. Thử lại.') }
                  finally { setChecking(false) }
                }}
                disabled={checking || isPaid}
className="w-full rounded-xl bg-emerald-500 py-3 font-beVietnamPro text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-60 transition flex items-center justify-center gap-2"
              >
                {checking
                  ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Đang kiểm tra...</>
                  : isPaid
                    ? '✓ Đã thanh toán!'
                    : '✓ Tôi đã chuyển khoản xong'
                }
              </button>

              <button onClick={onClose} className="mt-3 w-full py-2 font-beVietnamPro text-xs text-gray-400 hover:text-gray-600 transition">
                Huỷ & quay lại
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Main ─── */
export default function CheckoutPage() {
  const items    = useCartStore(s => s.items)
  const getTotal = useCartStore(s => s.getTotal)
  const clearCart = useCartStore(s => s.clear)
  const setOrder  = useCheckoutStore(s => s.setOrder)
  const navigate  = useNavigate()
  const subtotal  = getTotal()

  const [form, setForm] = useState({
    shippingName: '', shippingPhone: '', email: '',
    city: '', district: '', ward: '', streetAddress: '',
    shippingMethod: 'FAST', paymentMethod: 'COD', note: '',
  })
  const [errors, setErrors] = useState({})

  const [couponInput,   setCouponInput]   = useState('')
  const [coupon,        setCoupon]        = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const [provinces,    setProvinces]    = useState([])
  const [districts,    setDistricts]    = useState([])
  const [wards,        setWards]        = useState([])
  const [provinceCode, setProvinceCode] = useState('')
  const [districtCode, setDistrictCode] = useState('')
  const [geoLoading,   setGeoLoading]   = useState(false)

  const [loading,      setLoading]      = useState(false)

  // PayOS modal state
  const [payosModal,   setPayosModal]   = useState(false)
  const [payosData,    setPayosData]    = useState(null) // { checkoutUrl, qrCode, orderCode, amount, orderId }

  useEffect(() => { fetchProvinces().then(setProvinces).catch(() => {}) }, [])

  useEffect(() => {
    if (!provinceCode) { setDistricts([]); setWards([]); return }
    setGeoLoading(true); setDistricts([]); setWards([])
    setForm(f => ({ ...f, district: '', ward: '' })); setDistrictCode('')
    fetchDistricts(provinceCode).then(setDistricts).catch(() => {}).finally(() => setGeoLoading(false))
  }, [provinceCode])

  useEffect(() => {
    if (!districtCode) { setWards([]); return }
    setGeoLoading(true); setWards([])
    setForm(f => ({ ...f, ward: '' }))
    fetchWards(districtCode).then(setWards).catch(() => {}).finally(() => setGeoLoading(false))
  }, [districtCode])

  const shippingFee  = SHIPPING_OPTIONS.find(s => s.id === form.shippingMethod)?.fee ?? 35_000
const discountAmt  = coupon ? Number(coupon.discountAmount) : 0
  const total        = subtotal - discountAmt + shippingFee

  const setField = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.shippingName.trim())  e.shippingName  = 'Vui lòng nhập họ tên'
    if (!/^(0|\+84)\d{8,10}$/.test(form.shippingPhone.replace(/\s/g, '')))
      e.shippingPhone = 'Số điện thoại không hợp lệ'
    if (!form.city)           e.city          = 'Chọn tỉnh/thành phố'
    if (!form.district)       e.district      = 'Chọn quận/huyện'
    if (!form.ward)           e.ward          = 'Chọn phường/xã'
    if (!form.streetAddress.trim()) e.streetAddress = 'Nhập địa chỉ chi tiết'
    return e
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const res = await validateCoupon(couponInput.trim(), subtotal)
      if (res.valid) { setCoupon(res); toast.success(res.message) }
      else           { setCoupon(null); toast.error(res.message) }
    } catch { toast.error('Không thể kiểm tra mã. Thử lại sau.') }
    finally  { setCouponLoading(false) }
  }

  const buildPayload = () => ({
    shippingName:   form.shippingName.trim(),
    shippingPhone:  form.shippingPhone.trim(),
    city:           form.city,
    district:       form.district,
    ward:           form.ward,
    streetAddress:  form.streetAddress.trim(),
    shippingMethod: form.shippingMethod,
    paymentMethod:  form.paymentMethod,
    couponCode:     coupon?.code ?? null,
    note:           form.note?.trim() || null,
    items: items.map(i => ({
      productId:    typeof i.id === 'number' ? i.id : null,
      productName:  i.name,
      productImage: sanitizeImage(i.image),
      size:         i.size  ?? null,
      color:        i.color ?? null,
      quantity:     i.qty,
      price:        parsePrice(i.price),
    })),
  })

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); toast.error('Vui lòng điền đầy đủ thông tin'); return }
    if (items.length === 0)    { toast.error('Giỏ hàng đang trống'); return }

    setLoading(true)
    try {
      // Bước 1: Đặt hàng → nhận orderId
      const order = await placeOrder(buildPayload())

      if (form.paymentMethod === 'COD') {
        // COD: xong luôn
        setOrder(order)
        clearCart()
        toast.success('Đặt hàng thành công! 🎉')
        navigate('/order-success')
      } else {
        // PAYOS: gọi tạo link thanh toán PayOS
        const payosRes = await api.post(`/orders/${order.id}/payos/create`)
        const d = payosRes.data

        // Lưu order để sau confirm xong redirect
        setOrder(order)

        setPayosData({
          checkoutUrl: d.checkoutUrl,
          qrCode:      d.qrCode,        // chuỗi VietQR thực từ PayOS
orderCode:   d.orderCode ?? order.orderCode ?? order.id,
          amount:      d.amount ?? total,
          orderId:     order.id,
        })
        setPayosModal(true)
        clearCart()
      }
    } catch (err) {
      const data = err?.response?.data
      const msg = typeof data === 'object' && !data?.message
        ? Object.values(data).join(' · ')
        : data?.message ?? 'Đặt hàng thất bại. Vui lòng thử lại.'
      toast.error(msg)
    } finally { setLoading(false) }
  }

  // Khi PayOS xác nhận đã thanh toán (poll hoặc user xác nhận)
  const handlePayOSConfirmed = () => {
    setPayosModal(false)
    toast.success('Thanh toán thành công! Đơn hàng đã được xác nhận 🎉', { duration: 5000 })
    navigate('/order-success')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <TopNav />

      {/* PayOS Modal */}
      {payosData && (
        <PayOSModal
          open={payosModal}
          onClose={() => setPayosModal(false)}
          checkoutUrl={payosData.checkoutUrl}
          qrCode={payosData.qrCode}
          amount={payosData.amount}
          orderCode={payosData.orderCode}
          orderId={payosData.orderId}
          onConfirmed={handlePayOSConfirmed}
        />
      )}

      <main className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">

          {/* Title */}
          <div className="mb-8 space-y-2">
            <p className="font-beVietnamPro text-xs uppercase tracking-[0.35em] text-[#695D4B]">
              Giỏ hàng / Thanh toán / Hoàn tất
            </p>
            <h1 className="font-serif text-4xl tracking-tight text-[#231916] dark:text-white md:text-5xl">
              Thanh toán đơn hàng
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-[#DDC0B8] bg-[#FFF8F6] p-14 text-center">
              <p className="font-serif text-2xl text-[#231916]">Giỏ hàng đang trống</p>
              <Link to="/collections"
                className="mt-6 inline-flex items-center rounded-full bg-[#BB5734] px-7 py-3 font-beVietnamPro text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#9F4A2D] transition">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">

              {/* LEFT */}
              <section className="space-y-10 rounded-3xl border border-[#DDC0B8] bg-[#FFF8F6] p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-8">

                {/* Thông tin giao hàng */}
                <div className="space-y-5">
                  <SectionTitle label="01" title="Thông tin giao hàng" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Họ và tên *" error={errors.shippingName}>
<input value={form.shippingName} onChange={e => setField('shippingName', e.target.value)}
                        placeholder="Nguyễn Văn A" className={inputCls(errors.shippingName)} />
                    </Field>
                    <Field label="Số điện thoại *" error={errors.shippingPhone}>
                      <input type="tel" value={form.shippingPhone} onChange={e => setField('shippingPhone', e.target.value)}
                        placeholder="0912 345 678" className={inputCls(errors.shippingPhone)} />
                    </Field>
                  </div>
                  <Field label="Email (nhận xác nhận)">
                    <input type="email" value={form.email} onChange={e => setField('email', e.target.value)}
                      placeholder="email@example.com" className={inputCls()} />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Tỉnh / Thành phố *" error={errors.city}>
                      <select value={provinceCode}
                        onChange={e => { const o = provinces.find(p => String(p.code) === e.target.value); setProvinceCode(e.target.value); setField('city', o?.name ?? '') }}
                        className={selectCls(errors.city)}>
                        <option value="">Chọn Tỉnh / Thành phố</option>
                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Quận / Huyện *" error={errors.district}>
                      <select value={districtCode} disabled={!provinceCode || geoLoading}
                        onChange={e => { const o = districts.find(d => String(d.code) === e.target.value); setDistrictCode(e.target.value); setField('district', o?.name ?? '') }}
                        className={selectCls(errors.district)}>
                        <option value="">{geoLoading ? 'Đang tải...' : 'Chọn Quận / Huyện'}</option>
                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phường / Xã *" error={errors.ward}>
                      <select value={form.ward} disabled={!districtCode || geoLoading}
                        onChange={e => setField('ward', e.target.value)}
                        className={selectCls(errors.ward)}>
                        <option value="">{geoLoading ? 'Đang tải...' : 'Chọn Phường / Xã'}</option>
                        {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Địa chỉ chi tiết *" error={errors.streetAddress}>
<input value={form.streetAddress} onChange={e => setField('streetAddress', e.target.value)}
                        placeholder="Số nhà, tên đường..." className={inputCls(errors.streetAddress)} />
                    </Field>
                  </div>
                  <Field label="Ghi chú (tuỳ chọn)">
                    <textarea rows={2} value={form.note} onChange={e => setField('note', e.target.value)}
                      placeholder="Giao giờ hành chính, gọi trước khi giao..."
                      className="w-full resize-none border-b border-[#DDC0B8] bg-transparent py-3 font-beVietnamPro text-sm text-[#231916] placeholder:text-[#9A8C80] outline-none focus:border-[#BB5734] dark:border-white/15 dark:text-white" />
                  </Field>
                </div>

                {/* Vận chuyển */}
                <div className="space-y-3">
                  <SectionTitle label="02" title="Phương thức vận chuyển" />
                  {SHIPPING_OPTIONS.map(o => (
                    <label key={o.id}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-4 transition
                        ${form.shippingMethod === o.id ? 'border-[#BB5734] bg-[#FFF0EB]' : 'border-[#DDC0B8] bg-white dark:bg-slate-800 dark:border-white/10'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="ship" value={o.id}
                          checked={form.shippingMethod === o.id}
                          onChange={() => setField('shippingMethod', o.id)}
                          className="accent-[#BE123C]" />
                        <div>
                          <p className="font-beVietnamPro text-sm font-semibold text-[#231916] dark:text-white">{o.label}</p>
                          <p className="font-beVietnamPro text-xs text-[#695D4B]">{o.sub}</p>
                        </div>
                      </div>
                      <span className="font-beVietnamPro text-sm font-semibold">₫{o.fee.toLocaleString()}</span>
                    </label>
                  ))}
                </div>

                {/* Thanh toán */}
                <div className="space-y-3">
                  <SectionTitle label="03" title="Phương thức thanh toán" />
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-4 transition
                        ${form.paymentMethod === pm.id ? 'border-[#BB5734] bg-[#FFF0EB]' : 'border-[#DDC0B8] bg-white dark:bg-slate-800 dark:border-white/10'}`}>
                      <input type="radio" name="pay" value={pm.id}
                        checked={form.paymentMethod === pm.id}
                        onChange={() => setField('paymentMethod', pm.id)}
                        className="accent-[#BE123C]" />
<span className="text-2xl">{pm.icon}</span>
                      <div className="flex-1">
                        <p className="font-beVietnamPro text-sm font-semibold text-[#231916] dark:text-white">{pm.label}</p>
                        <p className="font-beVietnamPro text-xs text-[#695D4B]">{pm.desc}</p>
                      </div>
                      {pm.id === 'PAYOS' && (
                        <div className="flex flex-col items-end gap-1">
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-beVietnamPro text-[10px] font-bold text-emerald-700">PayOS</span>
                          <div className="flex gap-1">
                            {['MB', 'VCB', 'TCB'].map(b => (
                              <span key={b} className="rounded bg-gray-100 px-1.5 py-0.5 font-beVietnamPro text-[9px] text-gray-600">{b}</span>
                            ))}
                            <span className="rounded bg-pink-100 px-1.5 py-0.5 font-beVietnamPro text-[9px] text-pink-600">MM</span>
                            <span className="rounded bg-blue-100 px-1.5 py-0.5 font-beVietnamPro text-[9px] text-blue-600">VP</span>
                          </div>
                        </div>
                      )}
                    </label>
                  ))}

                  {/* PayOS info box */}
                  <AnimatePresence>
                    {form.paymentMethod === 'PAYOS' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
                          <p className="font-semibold text-emerald-800 mb-2">📲 Thanh toán qua PayOS</p>
                          <ul className="space-y-1 text-xs text-emerald-700">
                            <li>✓ Hỗ trợ <strong>tất cả ngân hàng Việt Nam</strong> (VCB, MB, TCB, VPBank...)</li>
                            <li>✓ Quét QR qua <strong>VNPay, MoMo, ZaloPay</strong></li>
                            <li>✓ QR tự động điền số tiền & nội dung chuyển khoản</li>
                            <li>✓ Xác nhận tự động sau khi thanh toán</li>
                          </ul>
                          <p className="mt-2 text-[11px] text-emerald-600">
                            ℹ️ QR sẽ hiển thị sau khi nhấn "Đặt hàng & Thanh toán"
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mã giảm giá */}
                <div className="space-y-3">
                  <SectionTitle label="04" title="Mã giảm giá (tuỳ chọn)" />
                  {coupon ? (
<div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                      <div>
                        <span className="font-beVietnamPro font-semibold text-green-700">{coupon.code}</span>
                        <span className="ml-2 font-beVietnamPro text-sm text-green-600">
                          Giảm {coupon.discountPercent}% — −₫{Number(coupon.discountAmount).toLocaleString()}
                        </span>
                      </div>
                      <button onClick={() => { setCoupon(null); setCouponInput('') }}
                        className="font-beVietnamPro text-xs text-red-500 hover:underline">Xóa</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Nhập mã (vd: SALE10)"
                        className="flex-1 rounded-xl border border-[#DDC0B8] bg-white px-4 py-3 font-beVietnamPro text-sm outline-none focus:border-[#BB5734] dark:bg-slate-800 dark:text-white" />
                      <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                        className="rounded-xl bg-[#BB5734] px-5 py-3 font-beVietnamPro text-sm font-semibold text-white hover:bg-[#9F4A2D] disabled:opacity-50 transition">
                        {couponLoading ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                  )}
                  <p className="font-beVietnamPro text-xs text-gray-400">Thử: SALE10 · SALE20 · NEWUSER · YRO5</p>
                </div>
              </section>

              {/* RIGHT */}
              <aside className="lg:sticky lg:top-24">
                <div className="rounded-3xl border border-[#DDC0B8] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-8 space-y-6">
                  <div>
                    <p className="font-beVietnamPro text-xs uppercase tracking-[0.3em] text-[#BB5734]">Tóm tắt</p>
                    <h2 className="mt-2 font-serif text-2xl tracking-tight text-[#231916] dark:text-white">Đơn hàng của bạn</h2>
                  </div>

                  {/* Items */}
                  <div className="space-y-4 border-b border-[#DDC0B8] pb-5 dark:border-white/10">
                    {items.map((item, i) => (
                      <div key={`${item.id}-${item.size ?? ''}-${i}`} className="flex items-start gap-3">
                        <div className="h-18 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F5F3EE]">
                          {sanitizeImage(item.image)
                            ? <img src={sanitizeImage(item.image)} alt={item.name} className="h-full w-full object-cover" />
: <div className="flex h-full w-full items-center justify-center text-xl">👕</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-beVietnamPro text-sm font-semibold text-[#231916] dark:text-white line-clamp-1">{item.name}</p>
                            <p className="font-beVietnamPro text-sm text-[#231916] dark:text-white shrink-0">₫{((item.price || 0) * item.qty).toLocaleString()}</p>
                          </div>
                          <p className="font-beVietnamPro text-xs text-[#695D4B]">Qty: {item.qty}</p>
                          {(item.size || item.color) && (
                            <p className="font-beVietnamPro text-xs text-[#695D4B]">
                              {[item.size && `Size ${item.size}`, item.color && `Màu ${item.color}`].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="space-y-2.5 text-sm">
                    <Row label="Tạm tính" value={`₫${subtotal.toLocaleString()}`} />
                    {coupon && <Row label={`Giảm giá (${coupon.code})`} value={`−₫${Number(coupon.discountAmount).toLocaleString()}`} cls="text-green-600" />}
                    <Row label="Phí vận chuyển" value={`₫${shippingFee.toLocaleString()}`} />
                    <div className="flex items-center justify-between border-t border-[#DDC0B8] pt-3 dark:border-white/10">
                      <span className="font-beVietnamPro font-semibold text-[#231916] dark:text-white">Tổng cộng</span>
                      <span className="font-serif text-3xl font-semibold text-[#95002A]">₫{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button onClick={handleSubmit} disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#BE123C] px-6 py-4 font-beVietnamPro text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#9F0F32] disabled:opacity-60 transition">
                    {loading
                      ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Đang xử lý...</>
                      : form.paymentMethod === 'COD'
                        ? 'Đặt hàng ngay →'
                        : 'Đặt hàng & Thanh toán →'
                    }
                  </button>

                  <div className="flex justify-center gap-5 font-beVietnamPro text-xs text-gray-400">
                    <span>🔒 Bảo mật SSL</span>
                    <span>🚚 Đổi trả 7 ngày</span>
<span>✅ Chính hãng</span>
                  </div>
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

/* ─── Sub components ─── */
const SectionTitle = ({ label, title }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BB5734] font-beVietnamPro text-xs font-bold text-white">{label}</span>
    <p className="font-beVietnamPro text-sm font-semibold uppercase tracking-[0.18em] text-[#BB5734]">{title}</p>
  </div>
)
const Field = ({ label, children, error }) => (
  <div className="space-y-1">
    <label className="font-beVietnamPro text-xs font-semibold uppercase tracking-[0.18em] text-[#695D4B] dark:text-gray-400">{label}</label>
    {children}
    {error && <p className="font-beVietnamPro text-xs text-red-500">{error}</p>}
  </div>
)
const Row = ({ label, value, cls = '' }) => (
  <div className={`flex justify-between font-beVietnamPro text-[#4A4A4A] dark:text-gray-300 ${cls}`}>
    <span>{label}</span><span>{value}</span>
  </div>
)
const inputCls = err =>
  `w-full border-b bg-transparent py-3 font-beVietnamPro text-sm text-[#231916] placeholder:text-[#9A8C80] outline-none transition focus:border-[#BB5734] dark:text-white dark:placeholder:text-gray-500 ${err ? 'border-red-400' : 'border-[#DDC0B8] dark:border-white/15'}`
const selectCls = err =>
  `w-full appearance-none border-b bg-transparent py-3 font-beVietnamPro text-sm text-[#231916] outline-none transition focus:border-[#BB5734] dark:text-white ${err ? 'border-red-400' : 'border-[#DDC0B8] dark:border-white/15'}`
