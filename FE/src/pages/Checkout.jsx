import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import useCartStore, { parsePrice } from '../store/cartStore'
import useCheckoutStore from '../store/checkoutStore'
import { placeOrder, validateCoupon, createVNPayUrl } from '../services/orderService'
import toast from 'react-hot-toast'

/* ─── Dữ liệu địa chỉ sẽ được fetch từ Provinces Open API ─── */

const PAYMENT_METHODS = [
  {
    id: 'COD',
    label: 'Thanh toán khi nhận hàng (COD)',
    desc: 'Trả tiền mặt cho nhân viên giao hàng',
    icon: '💵',
  },
  {
    id: 'VNPAY',
    label: 'QR VNPay',
    desc: 'Thanh toán qua ứng dụng ngân hàng / VNPay',
    icon: '📱',
  },
  {
    id: 'MOMO',
    label: 'Ví MoMo',
    desc: 'Thanh toán nhanh qua ví điện tử MoMo',
    icon: '🟣',
  },
  {
    id: 'BANK_TRANSFER',
    label: 'Chuyển khoản ngân hàng',
    desc: 'Chuyển khoản trực tiếp theo thông tin tài khoản',
    icon: '🏦',
  },
]

const SHIPPING_OPTIONS = [
  { id: 'FAST',     label: 'Giao hàng nhanh (2–3 ngày)',       sub: 'GHTK / GHN', fee: 35_000 },
  { id: 'STANDARD', label: 'Giao hàng tiêu chuẩn (4–5 ngày)', sub: 'Bưu điện',    fee: 20_000 },
]

/* ─── Helper: chỉ giữ lại URL http/https, bỏ file:// và /src/... ─── */
const sanitizeImage = (url) => {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return null
}

/* ═══════════════════════════════════════════════════════════ */
function CheckoutPage() {
  const items     = useCartStore(state => state.items)
  const getTotal  = useCartStore(state => state.getTotal)
  const clearCart = useCartStore(state => state.clear)
  const setOrder  = useCheckoutStore(state => state.setOrder)
  const navigate  = useNavigate()
  const location  = useLocation()

  const subtotal = getTotal()

  /* ── Form state ─────────────────────────────────────────── */
  const [form, setForm] = useState({
    shippingName:   '',
    shippingPhone:  '',
    email:          '',
    city:           '',
    district:       '',
    ward:           '',
    streetAddress:  '',
    shippingMethod: 'FAST',
    paymentMethod:  'COD',
    note:           '',
  })
  const [errors, setErrors] = useState({})

  /* ── Coupon state ───────────────────────────────────────── */
  const [couponInput,   setCouponInput]   = useState('')
  const [coupon,        setCoupon]        = useState(location.state?.coupon ?? null)
  const [couponLoading, setCouponLoading] = useState(false)

  /* ── Địa chỉ dynamic ────────────────────────────────────── */
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const [provCode, setProvCode] = useState('')
  const [distCode, setDistCode] = useState('')

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if (!provCode) {
      setDistricts([])
      setDistCode('')
      setField('district', '')
      setWards([])
      setField('ward', '')
      return
    }
    fetch(`https://provinces.open-api.vn/api/p/${provCode}?depth=2`)
      .then(res => res.json())
      .then(data => {
        setDistricts(data.districts || [])
        setDistCode('')
        setField('district', '')
        setWards([])
        setField('ward', '')
      })
      .catch(err => console.error(err))
  }, [provCode])

  useEffect(() => {
    if (!distCode) {
      setWards([])
      setField('ward', '')
      return
    }
    fetch(`https://provinces.open-api.vn/api/d/${distCode}?depth=2`)
      .then(res => res.json())
      .then(data => {
        setWards(data.wards || [])
        setField('ward', '')
      })
      .catch(err => console.error(err))
  }, [distCode])

  /* ── Tính tiền ──────────────────────────────────────────── */
  const shippingFee = SHIPPING_OPTIONS.find(s => s.id === form.shippingMethod)?.fee ?? 35_000
  const discountAmt = coupon ? Number(coupon.discountAmount) : 0
  const total       = subtotal - discountAmt + shippingFee

  /* ── Helpers ────────────────────────────────────────────── */
  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  /* ── Validate ───────────────────────────────────────────── */
  const validate = () => {
    const e = {}
    if (!form.shippingName.trim())  e.shippingName  = 'Vui lòng nhập họ tên'
    if (!/^(0|\+84)[0-9]{8,10}$/.test(form.shippingPhone))
                                    e.shippingPhone = 'Số điện thoại không hợp lệ'
    if (!form.city)                 e.city          = 'Vui lòng chọn thành phố'
    if (!form.district)             e.district      = 'Vui lòng chọn quận/huyện'
    if (!form.ward)                 e.ward          = 'Vui lòng chọn phường/xã'
    if (!form.streetAddress.trim()) e.streetAddress = 'Vui lòng nhập địa chỉ chi tiết'
    return e
  }

  /* ── Áp coupon ──────────────────────────────────────────── */
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

  /* ── Submit ─────────────────────────────────────────────── */
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    if (items.length === 0) { toast.error('Giỏ hàng đang trống'); return }

    setLoading(true)
    try {
      const payload = {
        shippingName:   form.shippingName,
        shippingPhone:  form.shippingPhone,
        city:           form.city,
        district:       form.district,
        ward:           form.ward,
        streetAddress:  form.streetAddress,
        shippingMethod: form.shippingMethod,
        paymentMethod:  form.paymentMethod,
        couponCode:     coupon?.code ?? null,
        note:           form.note?.trim() || null,
        items: items.map(i => ({
          productId:    typeof i.id === 'number' ? i.id : null,
          productName:  i.name,
          // Chỉ gửi URL http/https — bỏ file:/// và /src/assets/... tránh Data truncation
          productImage: sanitizeImage(i.image),
          size:         i.size  ?? null,
          color:        i.color ?? null,
          quantity:     i.qty,
          price:        parsePrice(i.price),
        })),
      }

      const order = await placeOrder(payload)
      clearCart()

      if (payload.paymentMethod === 'VNPAY') {
        // Lưu orderId để VNPayReturn.jsx fetch lại sau khi redirect về
        sessionStorage.setItem('vnpay_order_id', order.id)
        // Lấy link thanh toán VNPay rồi redirect
        const vnpay = await createVNPayUrl(order.id)
        toast.success('Đang chuyển sang trang thanh toán VNPay...')
        window.location.href = vnpay.paymentUrl
      } else {
        setOrder(order)
        toast.success('Đặt hàng thành công! 🎉')
        navigate('/order-success')
      }
    } catch (err) {
      const data = err?.response?.data
      if (data && typeof data === 'object' && !data.message) {
        const msgs = Object.values(data).join(' · ')
        toast.error('Lỗi: ' + msgs, { duration: 5000 })
      } else {
        const msg = data?.message ?? 'Đặt hàng thất bại. Vui lòng thử lại.'
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  /* ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <TopNav />

      <main className="py-12 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6">

          {/* ── Breadcrumb ──────────────────────────── */}
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-[#695D4B] dark:text-gray-400">
              Giỏ hàng / Thanh toán / Hoàn tất
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif tracking-[-0.03em] text-[#231916] dark:text-white">
              Thanh toán đơn hàng
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5E5E5E] dark:text-gray-400">
            <Link to="/cart" className="hover:underline">GIỎ HÀNG</Link>
            <span>›</span>
            <span className="text-[#1A1B22] dark:text-white">THANH TOÁN</span>
            <span>›</span>
            <span className="opacity-50">HOÀN TẤT</span>
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-[#DDC0B8] bg-[#FFF8F6] p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
              <h2 className="text-2xl font-serif text-[#231916] dark:text-white">Giỏ hàng đang trống</h2>
              <Link to="/design" className="mt-6 inline-flex items-center justify-center rounded-full bg-[#BB5734] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#9F4A2D]">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">

              {/* ══ LEFT — Form ══════════════════════════════ */}
              <section className="rounded-3xl border border-[#DDC0B8] bg-[#FFF8F6] p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-slate-900 space-y-10">

                {/* ── Thông tin giao hàng ──────────────── */}
                <div className="space-y-6">
                  <SectionTitle label="01" title="Thông tin giao hàng" />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Họ và tên *" error={errors.shippingName}>
                      <input type="text" placeholder="Nguyễn Văn A" value={form.shippingName}
                        onChange={e => setField('shippingName', e.target.value)}
                        className={inputCls(errors.shippingName)} />
                    </Field>
                    <Field label="Số điện thoại *" error={errors.shippingPhone}>
                      <input type="tel" placeholder="0912 345 678" value={form.shippingPhone}
                        onChange={e => setField('shippingPhone', e.target.value)}
                        className={inputCls(errors.shippingPhone)} />
                    </Field>
                  </div>

                  <Field label="Email (để nhận xác nhận)" error={errors.email}>
                    <input type="email" placeholder="email@example.com" value={form.email}
                      onChange={e => setField('email', e.target.value)}
                      className={inputCls(errors.email)} />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Thành phố *" error={errors.city}>
                      <select value={provCode} onChange={e => {
                        const code = e.target.value
                        setProvCode(code)
                        const name = provinces.find(p => p.code == code)?.name || ''
                        setField('city', name)
                      }} className={selectCls(errors.city)}>
                        <option value="">Chọn Thành phố / Tỉnh</option>
                        {provinces.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Quận / Huyện *" error={errors.district}>
                      <select value={distCode} onChange={e => {
                        const code = e.target.value
                        setDistCode(code)
                        const name = districts.find(d => d.code == code)?.name || ''
                        setField('district', name)
                      }} className={selectCls(errors.district)}>
                        <option value="">Chọn Quận / Huyện</option>
                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phường / Xã *" error={errors.ward}>
                      <select value={form.ward} onChange={e => setField('ward', e.target.value)} className={selectCls(errors.ward)}>
                        <option value="">Chọn Phường / Xã</option>
                        {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Địa chỉ chi tiết *" error={errors.streetAddress}>
                      <input type="text" placeholder="Số nhà, tên đường..." value={form.streetAddress}
                        onChange={e => setField('streetAddress', e.target.value)}
                        className={inputCls(errors.streetAddress)} />
                    </Field>
                  </div>

                  <Field label="Ghi chú đơn hàng (tuỳ chọn)">
                    <textarea rows={2} placeholder="Giao giờ hành chính, gọi trước khi giao..."
                      value={form.note} onChange={e => setField('note', e.target.value)}
                      className="w-full border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#9A8C80] focus:border-[#BB5734] dark:border-white/15 dark:text-white dark:placeholder:text-gray-500 resize-none" />
                  </Field>
                </div>

                {/* ── Phương thức vận chuyển ───────────── */}
                <div className="space-y-4">
                  <SectionTitle label="02" title="Phương thức vận chuyển" />
                  {SHIPPING_OPTIONS.map(opt => (
                    <label key={opt.id}
                      className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 cursor-pointer transition
                        ${form.shippingMethod === opt.id
                          ? 'border-[#BB5734] bg-[#FFF0EB] dark:bg-[#3a1f15]'
                          : 'border-[#DDC0B8] bg-white dark:bg-slate-950/40 dark:border-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value={opt.id}
                          checked={form.shippingMethod === opt.id}
                          onChange={() => setField('shippingMethod', opt.id)}
                          className="h-4 w-4 accent-[#BE123C]" />
                        <div>
                          <p className="text-sm font-semibold text-[#231916] dark:text-white">{opt.label}</p>
                          <p className="text-xs text-[#695D4B] dark:text-gray-400">{opt.sub}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">₫{opt.fee.toLocaleString()}</span>
                    </label>
                  ))}
                </div>

                {/* ── Phương thức thanh toán ───────────── */}
                <div className="space-y-4">
                  <SectionTitle label="03" title="Phương thức thanh toán" />
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.id}
                      className={`flex items-center gap-4 rounded-2xl border px-4 py-4 cursor-pointer transition
                        ${form.paymentMethod === pm.id
                          ? 'border-[#BB5734] bg-[#FFF0EB] dark:bg-[#3a1f15]'
                          : 'border-[#DDC0B8] bg-white dark:bg-slate-950/40 dark:border-white/10'}`}
                    >
                      <input type="radio" name="payment" value={pm.id}
                        checked={form.paymentMethod === pm.id}
                        onChange={() => setField('paymentMethod', pm.id)}
                        className="h-4 w-4 accent-[#BE123C]" />
                      <span className="text-xl">{pm.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#231916] dark:text-white">{pm.label}</p>
                        <p className="text-xs text-[#695D4B] dark:text-gray-400">{pm.desc}</p>
                      </div>
                    </label>
                  ))}

                  {/* Thông tin chuyển khoản */}
                  {form.paymentMethod === 'BANK_TRANSFER' && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/30 p-4 text-sm space-y-1">
                      <p className="font-semibold text-blue-800 dark:text-blue-300">Thông tin chuyển khoản</p>
                      <p className="text-blue-700 dark:text-blue-400">Ngân hàng: <strong>VCB – Vietcombank</strong></p>
                      <p className="text-blue-700 dark:text-blue-400">Số TK: <strong>1234 5678 9012</strong></p>
                      <p className="text-blue-700 dark:text-blue-400">Chủ TK: <strong>CONG TY YRO FASHION</strong></p>
                      <p className="text-blue-700 dark:text-blue-400">Nội dung: <strong>YRO [Họ tên] [SĐT]</strong></p>
                    </div>
                  )}
                </div>

                {/* ── Mã giảm giá ─────────────────────── */}
                <div className="space-y-4">
                  <SectionTitle label="04" title="Mã giảm giá (tuỳ chọn)" />
                  {coupon ? (
                    <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/30 px-4 py-3">
                      <div>
                        <span className="font-semibold text-green-700 dark:text-green-400">{coupon.code}</span>
                        <span className="ml-2 text-sm text-green-600 dark:text-green-500">
                          Giảm {coupon.discountPercent}% — −₫{Number(coupon.discountAmount).toLocaleString()}
                        </span>
                      </div>
                      <button onClick={() => { setCoupon(null); setCouponInput('') }}
                        className="text-xs text-red-500 hover:underline">Xóa</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Nhập mã (vd: SALE10)"
                        className="flex-1 rounded-xl border border-[#DDC0B8] bg-white dark:bg-slate-800 dark:text-white px-4 py-3 text-sm outline-none focus:border-[#BB5734]" />
                      <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                        className="px-5 py-3 bg-[#BB5734] text-white text-sm rounded-xl hover:bg-[#9F4A2D] disabled:opacity-50 transition font-semibold">
                        {couponLoading ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">Thử: SALE10 · SALE20 · NEWUSER · YRO5</p>
                </div>
              </section>

              {/* ══ RIGHT — Order Summary ═════════════════════ */}
              <aside className="lg:sticky lg:top-24">
                <div className="rounded-3xl border border-[#DDC0B8] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-8 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#BB5734]">Tóm tắt đơn hàng</p>
                    <h2 className="mt-2 text-2xl font-serif tracking-[-0.02em] text-[#231916] dark:text-white">
                      Sản phẩm của bạn
                    </h2>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <div className="space-y-4 border-b border-[#DDC0B8] pb-5 dark:border-white/10">
                    {items.map((item, idx) => (
                      <div key={`${item.id}-${item.size ?? ''}-${item.color ?? ''}-${idx}`} className="flex items-start gap-4">
                        <div className="h-20 w-16 overflow-hidden rounded-xl bg-[#EEEDF7] flex-shrink-0">
                          {sanitizeImage(item.image) ? (
                            <img src={sanitizeImage(item.image)} alt={item.name}
                              className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-2xl">👕</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-[#231916] dark:text-white truncate">{item.name}</p>
                            <p className="text-sm text-[#231916] dark:text-white flex-shrink-0">
                              ₫{((item.price || 0) * item.qty).toLocaleString()}
                            </p>
                          </div>
                          <p className="mt-0.5 text-xs text-[#695D4B] dark:text-gray-400">Số lượng: {item.qty}</p>
                          {(item.size || item.color) && (
                            <p className="text-xs text-[#695D4B] dark:text-gray-400">
                              {[item.size && `Size ${item.size}`, item.color && `Màu ${item.color}`].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tính tiền */}
                  <div className="space-y-3 text-sm">
                    <Row label="Tạm tính" value={`₫${subtotal.toLocaleString()}`} />
                    {coupon && (
                      <Row label={`Giảm giá (${coupon.code})`}
                           value={`−₫${Number(coupon.discountAmount).toLocaleString()}`}
                           className="text-green-600" />
                    )}
                    <Row label="Phí vận chuyển" value={`₫${shippingFee.toLocaleString()}`} />
                    <div className="flex items-center justify-between border-t border-[#DDC0B8] pt-3 dark:border-white/10">
                      <span className="text-base font-semibold text-[#231916] dark:text-white">Tổng cộng</span>
                      <span className="text-3xl font-semibold tracking-[-0.01em] text-[#95002A]">
                        ₫{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Nút đặt hàng */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#BE123C] px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#9F0F32] disabled:opacity-60"
                  >
                    {loading ? (
                      <><span className="animate-spin">⏳</span> Đang xử lý...</>
                    ) : (
                      <>Đặt hàng ngay <span>→</span></>
                    )}
                  </button>

                  <p className="text-center text-xs leading-5 text-[#695D4B] dark:text-gray-400">
                    Bằng cách nhấn đặt hàng, bạn đồng ý với{' '}
                    <Link to="/story" className="underline">Điều khoản dịch vụ</Link> của YRO.
                  </p>

                  {/* Badges */}
                  <div className="flex justify-center gap-4 text-xs text-gray-400 pt-2">
                    <span>🔒 SSL bảo mật</span>
                    <span>🚚 Đổi trả 7 ngày</span>
                    <span>✅ Hàng chính hãng</span>
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

/* ═══ Sub-components ════════════════════════════════════════ */
const SectionTitle = ({ label, title }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#BB5734] text-xs font-bold text-white">
      {label}
    </span>
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#BB5734]">{title}</p>
  </div>
)

const Field = ({ label, children, error }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#695D4B] dark:text-gray-400">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

const Row = ({ label, value, className = '' }) => (
  <div className={`flex items-center justify-between text-[#4A4A4A] dark:text-gray-300 ${className}`}>
    <span>{label}</span><span>{value}</span>
  </div>
)

const inputCls = (err) =>
  `w-full border-b bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#9A8C80] focus:border-[#BB5734] dark:text-white dark:placeholder:text-gray-500
  ${err ? 'border-red-400' : 'border-[#DDC0B8] dark:border-white/15'}`

const selectCls = (err) =>
  `w-full appearance-none border-b bg-transparent py-3 text-sm outline-none transition-colors focus:border-[#BB5734] dark:text-white
  ${err ? 'border-red-400' : 'border-[#DDC0B8] dark:border-white/15'}`

export default CheckoutPage