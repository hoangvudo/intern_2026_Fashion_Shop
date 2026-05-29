import { useMemo } from "react";
import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import useCartStore from "../store/cartStore";

function OrderSuccessPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotal());

  const orderCode = useMemo(() => {
    const suffix = String(Math.floor(10000 + Math.random() * 90000));
    return `YRO${suffix}`;
  }, []);

  const shippingAddress =
    "Nguyễn Văn A\n123 Đường Lê Lợi, Phường Bến Thành\nQuận 1, TP. Hồ Chí Minh";

  const deliveryDate = "Thứ Tư, 24 Tháng 5, 2024";
  const shippingFee = subtotal > 0 ? 35000 : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <TopNav />

      <main className="bg-[#FBF8FF] py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto flex max-w-[576px] flex-col items-center gap-12 text-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute -left-8 -top-8 h-32 w-32 rounded-xl bg-[#BE123C] opacity-5" />
              <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-[#E3BDBF] bg-white shadow-sm dark:bg-slate-900">
                <svg
                  width="54"
                  height="54"
                  viewBox="0 0 54 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14"
                  aria-hidden="true"
                >
                  <path
                    d="M22.6846 38.7231L41.8731 19.5346L39.75 17.4115L22.6846 34.4769L14.1346 25.9269L12.0115 28.05L22.6846 38.7231V38.7231M27.0101 54C23.2764 54 19.7662 53.2916 16.4793 51.8746C13.1925 50.4576 10.3334 48.5346 7.90198 46.1055C5.4706 43.6764 3.54576 40.8199 2.12746 37.5361C0.709152 34.2524 0 30.7437 0 27.0101C0 23.2764 0.708487 19.7662 2.12546 16.4793C3.54244 13.1925 5.46547 10.3334 7.89457 7.90198C10.3237 5.4706 13.1801 3.54576 16.4639 2.12746C19.7477 0.709152 23.2564 0 26.99 0C30.7236 0 34.2338 0.708487 37.5207 2.12546C40.8076 3.54243 43.6667 5.46547 46.0981 7.89457C48.5294 10.3237 50.4543 13.1801 51.8726 16.4639C53.2909 19.7477 54 23.2564 54 26.99C54 30.7236 53.2916 34.2338 51.8746 37.5207C50.4576 40.8076 48.5346 43.6667 46.1055 46.0981C43.6764 48.5294 40.8199 50.4543 37.5361 51.8726C34.2524 53.2909 30.7437 54 27.0101 54V54M27 51C33.7 51 39.375 48.675 44.025 44.025C48.675 39.375 51 33.7 51 27C51 20.3 48.675 14.625 44.025 9.97502C39.375 5.32502 33.7 3.00002 27 3.00002C20.3 3.00002 14.625 5.32502 9.97502 9.97502C5.32502 14.625 3.00002 20.3 3.00002 27C3.00002 33.7 5.32502 39.375 9.97502 44.025C14.625 48.675 20.3 51 27 51V51M27 27V27V27V27V27V27V27V27V27V27"
                    fill="#95002A"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-[-0.02em] text-[#1A1B22] sm:text-[40px] sm:leading-[48px] dark:text-white">
                Cảm ơn bạn đã đặt hàng!
              </h1>
              <p className="mx-auto max-w-[448px] text-base leading-[26px] text-[#1A1B22] dark:text-gray-300">
                Mã đơn hàng của bạn là <span className="font-semibold">#{orderCode}</span>. Chúng tôi đã gửi email xác nhận cho bạn.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/design"
                className="inline-flex items-center justify-center rounded border border-[#1A1B22] px-10 py-4 text-base text-[#1A1B22] transition hover:bg-[#1A1B22] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded bg-[#BE123C] px-10 py-4 text-base text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition hover:bg-[#9F0F32]"
              >
                Theo dõi đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-white py-16 dark:bg-gray-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E3BDBF] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5E5E5E] dark:text-gray-400">
              ĐỊA CHỈ GIAO HÀNG
            </p>
            <p className="mt-4 whitespace-pre-line text-base leading-6 text-[#1A1B22] dark:text-gray-200">
              {shippingAddress}
            </p>
          </div>

          <div className="rounded-3xl border border-[#E3BDBF] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5E5E5E] dark:text-gray-400">
              DỰ KIẾN GIAO HÀNG
            </p>
            <div className="mt-4 flex items-center gap-3 text-[#1A1B22] dark:text-gray-200">
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M4.4977 15.0576C3.71716 15.0576 3.05446 14.7847 2.50959 14.2387C1.96472 13.6928 1.69229 13.0299 1.69229 12.2499H0V1.80768C0 1.30255 0.174998 0.874992 0.524995 0.524995C0.874992 0.174998 1.30255 0 1.80768 0H15.423V3.80768H18.0769L21.3076 8.13463V12.2499H19.5C19.5 13.0299 19.2268 13.6928 18.6804 14.2387C18.134 14.7847 17.4706 15.0576 16.69 15.0576C15.9095 15.0576 15.2468 14.7847 14.7019 14.2387C14.157 13.6928 13.8846 13.0299 13.8846 12.2499H7.30764C7.30764 13.032 7.03445 13.6955 6.48808 14.2403C5.9417 14.7852 5.27824 15.0576 4.4977 15.0576V15.0576M4.49996 13.5577C4.86664 13.5577 5.17626 13.4314 5.42883 13.1788C5.68139 12.9262 5.80768 12.6166 5.80768 12.2499C5.80768 11.8833 5.68139 11.5737 5.42883 11.3211C5.17626 11.0685 4.86664 10.9422 4.49996 10.9422C4.13329 10.9422 3.82367 11.0685 3.5711 11.3211C3.31853 11.5737 3.19225 11.8833 3.19225 12.2499C3.19225 12.6166 3.31853 12.9262 3.5711 13.1788C3.82367 13.4314 4.13329 13.5577 4.49996 13.5577V13.5577M1.49996 10.75H2.22303C2.43585 10.3795 2.74322 10.0689 3.14515 9.81824C3.54707 9.56759 3.99868 9.44227 4.49996 9.44227C4.98843 9.44227 5.43683 9.56599 5.84516 9.81343C6.2535 10.0609 6.56408 10.3731 6.77689 10.75H13.9231V1.49996H1.80768C1.73075 1.49996 1.66023 1.53202 1.59612 1.59612C1.53202 1.66023 1.49996 1.73075 1.49996 1.80768V10.75V10.75M16.6923 13.5577C17.059 13.5577 17.3686 13.4314 17.6211 13.1788C17.8737 12.9262 18 12.6166 18 12.2499C18 11.8833 17.8737 11.5737 17.6211 11.3211C17.3686 11.0685 17.059 10.9422 16.6923 10.9422C16.3256 10.9422 16.016 11.0685 15.7634 11.3211C15.5109 11.5737 15.3846 11.8833 15.3846 12.2499C15.3846 12.6166 15.5109 12.9262 15.7634 13.1788C16.016 13.4314 16.3256 13.5577 16.6923 13.5577V13.5577M15.423 8.74998H19.9038L17.3076 5.30764H15.423V8.74998V8.74998M7.71152 6.12497V6.12497V6.12497V6.12497V6.12497V6.12497V6.12497V6.12497V6.12497V6.12497V6.12497V6.12497V6.12497" fill="#95002A"/>
              </svg>
              <span className="font-semibold">{deliveryDate}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF8FF] py-20 dark:bg-gray-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-3">
          <div className="overflow-hidden rounded-3xl border border-[#E3BDBF] bg-white shadow-sm lg:col-span-1 dark:border-white/10 dark:bg-slate-900">
            <div className="relative overflow-hidden">
              <img
                src={items[0]?.image || "/src/assets/logo.jpg"}
                className="h-[453px] w-full object-cover"
                alt={items[0]?.name || "Sản phẩm đã đặt"}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-8">
                <p className="text-xl font-semibold text-white">
                  {items[0]?.name || "New Arrivals"}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#E3BDBF] bg-white shadow-sm lg:col-span-1 dark:border-white/10 dark:bg-slate-900">
            <div className="relative overflow-hidden">
              <img
                src={items[1]?.image || items[0]?.image || "/src/assets/logo.jpg"}
                className="h-[453px] w-full object-cover"
                alt={items[1]?.name || "Phụ kiện"}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-8">
                <p className="text-xl font-semibold text-white">
                  {items[1]?.name || "Accessories"}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#E3BDBF] bg-white shadow-sm lg:col-span-1 dark:border-white/10 dark:bg-slate-900">
            <div className="relative overflow-hidden">
              <img
                src={items[2]?.image || items[0]?.image || "/src/assets/logo.jpg"}
                className="h-[453px] w-full object-cover"
                alt={items[2]?.name || "Câu chuyện của chúng tôi"}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-8">
                <p className="text-xl font-semibold text-white">
                  {items[2]?.name || "Our Story"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-[#5E5E5E] dark:text-gray-400">
          <p>Tạm tính: ₫{subtotal.toLocaleString()}</p>
          <p>Phí vận chuyển: ₫{shippingFee.toLocaleString()}</p>
          <p className="font-semibold text-[#95002A]">Tổng cộng: ₫{total.toLocaleString()}</p>
        </div>
      </section>

      <section className="border-t border-[#E2E2E2] bg-white py-8 dark:border-white/10 dark:bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6">
          <div>
            <p className="text-2xl font-bold tracking-[-0.05em] text-[#1A1B22] dark:text-white">
              YRO
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#5E5E5E] dark:text-gray-400">
            <Link to="/design">Shop</Link>
            <Link to="/story">Collections</Link>
            <Link to="/contact">About</Link>
          </div>
          <div className="flex items-center gap-4 text-[#1A1B22] dark:text-white">
            <span aria-hidden="true">◻</span>
            <span aria-hidden="true">◻</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default OrderSuccessPage;
