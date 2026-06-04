import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import ProfessionalLuxuryTailorAtelier from "../assets/professional_luxury_tailor.png";
import BannerImage from "../assets/high_end_luxury_fashion_brand_banner.png";
import Reveal from "../components/Reveal";

function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <TopNav />

      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <img
            src={BannerImage}
            alt="Banner liên hệ"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />

          <div className="relative mx-auto flex min-h-[62vh] max-w-7xl items-center px-6 py-20">
            <Reveal duration={0.8}>
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.45em] text-amber-200/90">
                  ZYRO / LIÊN HỆ
                </p>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold leading-tight tracking-[-0.03em]">
                  Chúng tôi luôn sẵn sàng lắng nghe.
                </h1>
                <p className="mt-5 max-w-2xl text-base sm:text-lg leading-8 text-slate-200">
                  Kết nối với ZYRO để được tư vấn thiết kế, đặt lịch tại atelier
                  hoặc nhận hỗ trợ cho đơn hàng và chăm sóc khách hàng.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-[#FFF8F6] py-20 text-[#231916] dark:bg-gray-950 dark:text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#695D4B] dark:text-gray-400">
                Thông tin liên hệ
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-serif tracking-[-0.02em]">
                Không gian gặp gỡ, tư vấn và đồng hành cùng bạn.
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-start">
              <Reveal direction="up">
                <div className="space-y-8 rounded-3xl border border-[#DDC0B8] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
                  <section className="space-y-3 border-b border-[#DDC0B8]/70 pb-6 dark:border-white/10">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#BB5734]">
                      Phía Nam
                    </p>
                    <h3 className="text-2xl font-serif">Atelier tại TP. Hồ Chí Minh</h3>
                    <p className="text-sm leading-7 text-[#4A4A4A] dark:text-slate-300">
                      Tòa nhà L&apos;Éclat, 158 Đồng Khởi, Quận 1, TP. Hồ Chí Minh<br />
                      +84 (0) 28 3822 0000
                    </p>
                    <p className="text-sm uppercase tracking-[0.18em] text-[#695D4B] dark:text-slate-400">
                      Thứ Hai — Chủ Nhật: 09:00 - 21:00
                    </p>
                  </section>

                  <section className="space-y-3 border-b border-[#DDC0B8]/70 pb-6 dark:border-white/10">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#BB5734]">
                      Phía Bắc
                    </p>
                    <h3 className="text-2xl font-serif">Văn phòng tại Hà Nội</h3>
                    <p className="text-sm leading-7 text-[#4A4A4A] dark:text-slate-300">
                      Tầng 12, Sofitel Legend Metropole, 15 Ngô Quyền, Hoàn Kiếm, Hà Nội<br />
                      +84 (0) 24 3933 0000
                    </p>
                    <p className="text-sm uppercase tracking-[0.18em] text-[#695D4B] dark:text-slate-400">
                      Thứ Hai — Thứ Sáu: 09:00 - 18:00
                    </p>
                  </section>

                  <section className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#BB5734]">
                      Hỗ trợ trực tuyến
                    </p>
                    <h3 className="text-2xl font-serif">Chăm sóc khách hàng</h3>
                    <p className="text-sm leading-7 text-[#4A4A4A] dark:text-slate-300">
                      Mọi thắc mắc về đơn hàng trực tuyến hoặc hợp tác truyền thông.
                    </p>
                    <a
                      href="mailto:concierge@leclat.vn"
                      className="inline-flex text-sm font-medium text-[#BB5734] underline underline-offset-4 hover:opacity-80"
                    >
                      concierge@leclat.vn
                    </a>
                  </section>

                  <div className="overflow-hidden rounded-2xl border border-[#DDC0B8] dark:border-white/10">
                    <img
                      src={ProfessionalLuxuryTailorAtelier}
                      alt="Không gian atelier"
                      className="h-[320px] w-full object-cover grayscale transition duration-700 hover:grayscale-0"
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal direction="right" delay={0.05}>
                <div className="rounded-3xl border border-[#DDC0B8] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-10 lg:p-12">
                  <div className="mb-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#BB5734]">
                      Gửi lời nhắn
                    </p>
                    <h3 className="mt-3 text-3xl font-serif tracking-[-0.02em]">
                      Chia sẻ nhu cầu của bạn
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#4A4A4A] dark:text-slate-300">
                      Chúng tôi sẽ phản hồi trong thời gian sớm nhất để hỗ trợ đặt lịch, tư vấn hoặc giải đáp thắc mắc.
                    </p>
                  </div>

                  <form className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.22em] text-[#695D4B]">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          placeholder="Nguyễn Văn A"
                          className="w-full border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#9A8C80] focus:border-[#BB5734] dark:border-white/15 dark:text-white dark:placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.22em] text-[#695D4B]">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="example@email.com"
                          className="w-full border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#9A8C80] focus:border-[#BB5734] dark:border-white/15 dark:text-white dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.22em] text-[#695D4B]">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        placeholder="+84 ..."
                        className="w-full border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#9A8C80] focus:border-[#BB5734] dark:border-white/15 dark:text-white dark:placeholder:text-slate-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.22em] text-[#695D4B]">
                        Lời nhắn
                      </label>
                      <textarea
                        rows="5"
                        placeholder="Chúng tôi có thể giúp gì cho bạn?"
                        className="w-full resize-none border-b border-[#DDC0B8] bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-[#9A8C80] focus:border-[#BB5734] dark:border-white/15 dark:text-white dark:placeholder:text-slate-500"
                      />
                    </div>

                    <button className="inline-flex w-full items-center justify-center rounded-full bg-[#BB5734] px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#9F4A2D]">
                      Gửi tin nhắn
                    </button>
                  </form>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ContactPage;