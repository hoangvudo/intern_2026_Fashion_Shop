import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import useCartStore from "../store/cartStore";

function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotal());
  const shipping = items.length > 0 ? 35000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <TopNav />

      <main className="py-12 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-[#695D4B] dark:text-gray-400">
              Giỏ hàng / Thanh toán / Hoàn tất
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif tracking-[-0.03em] text-[#231916] dark:text-white">
              Thanh toán đơn hàng
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#4A4A4A] dark:text-gray-300">
              Hoàn tất thông tin giao hàng và chọn phương thức thanh toán phù hợp để chúng tôi xử lý đơn hàng của bạn.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5E5E5E] dark:text-gray-400">
            <span className="text-[#1A1B22] dark:text-white">GIỎ HÀNG</span>
            <span>›</span>
            <span className="text-[#1A1B22] dark:text-white">THANH TOÁN</span>
            <span>›</span>
            <span className="opacity-50">HOÀN TẤT</span>
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-[#DDC0B8] bg-[#FFF8F6] p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
              <h2 className="text-2xl font-serif text-[#231916] dark:text-white">
                Giỏ hàng đang trống
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#4A4A4A] dark:text-gray-300">
                Hãy quay lại trang thiết kế để chọn thêm sản phẩm trước khi thanh toán.
              </p>
              <Link
                to="/design"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#BB5734] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#9F4A2D]"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
              <section className="rounded-3xl border border-[#DDC0B8] bg-[#FFF8F6] p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="space-y-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#BB5734]">
                      Thông tin giao hàng
                    </p>
                    <h2 className="mt-3 text-2xl font-serif tracking-[-0.02em] text-[#231916] dark:text-white">
                      Nhập thông tin nhận hàng
                    </h2>
                  </div>

                  <form className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#695D4B] dark:text-gray-400">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập họ và tên"
                          className="w-full border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#9A8C80] focus:border-[#BB5734] dark:border-white/15 dark:text-white dark:placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#695D4B] dark:text-gray-400">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          placeholder="0xxx xxx xxx"
                          className="w-full border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#9A8C80] focus:border-[#BB5734] dark:border-white/15 dark:text-white dark:placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#695D4B] dark:text-gray-400">
                          Thành phố
                        </label>
                        <div className="relative">
                          <select className="w-full appearance-none border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors focus:border-[#BB5734] dark:border-white/15 dark:text-white">
                            <option>Hà Nội</option>
                            <option>TP. Hồ Chí Minh</option>
                            <option>Đà Nẵng</option>
                            <option>Khác</option>
                          </select>
                          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#6B7280]">
                            ▾
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#695D4B] dark:text-gray-400">
                          Quận / Huyện
                        </label>
                        <div className="relative">
                          <select className="w-full appearance-none border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors focus:border-[#BB5734] dark:border-white/15 dark:text-white">
                            <option>Chọn Quận/Huyện</option>
                            <option>Ba Đình</option>
                            <option>Hoàn Kiếm</option>
                            <option>Đống Đa</option>
                          </select>
                          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#6B7280]">
                            ▾
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#695D4B] dark:text-gray-400">
                          Phường / Xã
                        </label>
                        <div className="relative">
                          <select className="w-full appearance-none border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors focus:border-[#BB5734] dark:border-white/15 dark:text-white">
                            <option>Chọn Phường/Xã</option>
                            <option>Phường 1</option>
                            <option>Phường 2</option>
                            <option>Phường 3</option>
                          </select>
                          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#6B7280]">
                            ▾
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#695D4B] dark:text-gray-400">
                          Địa chỉ chi tiết
                        </label>
                        <input
                          type="text"
                          placeholder="Số nhà, tên đường..."
                          className="w-full border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#9A8C80] focus:border-[#BB5734] dark:border-white/15 dark:text-white dark:placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </form>

                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#BB5734]">
                      Phương thức vận chuyển
                    </p>

                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDC0B8] bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                      <div>
                        <p className="text-sm font-semibold text-[#231916] dark:text-white">
                          Giao hàng nhanh (2-3 ngày)
                        </p>
                        <p className="text-xs text-[#695D4B] dark:text-gray-400">
                          Vận chuyển qua GHTK / GHN
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[#1A1B22] dark:text-white">
                        35.000₫
                      </span>
                    </label>

                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-[#DDC0B8] bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                      <div>
                        <p className="text-sm font-semibold text-[#231916] dark:text-white">
                          Giao hàng tiêu chuẩn (4-5 ngày)
                        </p>
                        <p className="text-xs text-[#695D4B] dark:text-gray-400">
                          Vận chuyển bưu điện
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[#1A1B22] dark:text-white">
                        20.000₫
                      </span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#BB5734]">
                      Phương thức thanh toán
                    </p>

                    <label className="flex items-center gap-4 rounded-2xl border border-[#DDC0B8] bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                      <input type="radio" name="payment" defaultChecked className="h-4 w-4 accent-[#BE123C]" />
                      <div>
                        <p className="text-sm font-semibold text-[#231916] dark:text-white">
                          QR VNPay
                        </p>
                        <p className="text-xs text-[#695D4B] dark:text-gray-400">
                          Thanh toán trực tuyến nhanh chóng
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 rounded-2xl border border-[#DDC0B8] bg-white px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                      <input type="radio" name="payment" className="h-4 w-4 accent-[#BE123C]" />
                      <div>
                        <p className="text-sm font-semibold text-[#231916] dark:text-white">
                          Thanh toán khi nhận hàng (COD)
                        </p>
                        <p className="text-xs text-[#695D4B] dark:text-gray-400">
                          Thanh toán cho nhân viên giao hàng
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </section>

              <aside className="lg:sticky lg:top-24">
                <div className="rounded-3xl border border-[#DDC0B8] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-8">
                  <div className="pb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#BB5734]">
                      Tóm tắt đơn hàng
                    </p>
                    <h2 className="mt-3 text-2xl font-serif tracking-[-0.02em] text-[#231916] dark:text-white">
                      Sản phẩm của bạn
                    </h2>
                  </div>

                  <div className="space-y-5 border-b border-[#DDC0B8] pb-6 dark:border-white/10">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="h-24 w-20 overflow-hidden rounded-xl bg-[#EEEDF7]">
                          <img
                            src={item.image || "/src/assets/logo.jpg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-[#231916] dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-sm text-[#231916] dark:text-white">
                              ₫{((item.price || 0) * item.qty).toLocaleString()}
                            </p>
                          </div>
                          <p className="mt-1 text-xs text-[#695D4B] dark:text-gray-400">
                            Số lượng: {item.qty}
                          </p>
                          <p className="mt-1 text-xs text-[#695D4B] dark:text-gray-400">
                            Màu sắc / Size theo lựa chọn của bạn
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 py-6">
                    <div className="flex items-center justify-between text-sm text-[#4A4A4A] dark:text-gray-300">
                      <span>Tạm tính</span>
                      <span>₫{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#4A4A4A] dark:text-gray-300">
                      <span>Phí vận chuyển</span>
                      <span>₫{shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#DDC0B8] pt-4 dark:border-white/10">
                      <span className="text-lg font-semibold text-[#231916] dark:text-white">
                        Tổng cộng
                      </span>
                      <span className="text-3xl font-semibold tracking-[-0.01em] text-[#95002A]">
                        ₫{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/order-success"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#BE123C] px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#9F0F32]"
                  >
                    Đặt hàng ngay
                    <span aria-hidden="true">→</span>
                  </Link>

                  <p className="mt-4 text-center text-xs leading-5 text-[#695D4B] dark:text-gray-400">
                    Bằng cách nhấn đặt hàng, bạn đồng ý với Điều khoản dịch vụ của YRO.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CheckoutPage;
