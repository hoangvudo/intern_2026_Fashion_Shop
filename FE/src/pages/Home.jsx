  import TopNav from "../components/TopNav";
  import { Link } from "react-router-dom";
  import Footer from "../components/Footer";
  import Testimonials from "../components/Testimonials";
  import Newsletter from "../components/Newsletter";
  import { motion } from "framer-motion";
  import { MdShoppingBag } from "react-icons/md";
  import useCartStore from "../store/cartStore";
  import toast from "react-hot-toast";
  import BannerImage from "../assets/high_end_luxury_fashion.png";
  import Image1 from "../assets/Image1.png";
  import Image2 from "../assets/Image2.png";
  import Image3 from "../assets/Image3.png";
  import Image6 from "../assets/Image6.png";
  import Image8 from "../assets/Image8.png";
  import Image7 from "../assets/Image7.png";

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const arrivals = [
    {
      id: "arrival-1",
      name: "Áo Khoác Măng Tô",
      price: 2750000,
      description: "Một lớp áo hoàn hảo để tạo điểm nhấn nhẹ nhàng.",
      image: Image6,
    },
    {
      id: "arrival-2",
      name: "Đầm Maxi Linen",
      price: 3200000,
      description: "Chất liệu nhẹ, phom dáng tự do và sang trọng.",
      image: Image7,
    },
    {
      id: "arrival-3",
      name: "Quần Ống Rộng",
      price: 2150000,
      description: "Kiểu dáng cổ điển hiện đại cho mọi chiều cao.",
      image: Image8,
    },
  ];

  const essentialTones = [
    {
      title: "Beige Dịu Dàng",
      subtitle: "Nền ấm áp cho mọi ngày.",
      image: Image1,
    },
    {
      title: "Terracotta Ấm Nồng",
      subtitle: "Đậm nét, vẫn nhẹ nhàng.",
      image: Image2,
    },
    {
      title: "Ivory Thanh Lịch",
      subtitle: "Sạch, tinh tế và hiện đại.",
      image: Image3,
    },
    {
      title: "Olive Dịu Dàng",
      subtitle: "Tự nhiên mà vẫn sang trọng.",
      image: Image1,
    },
  ];

  function Home() {
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = (product) => {
      addItem(product);
      toast.success("Đã thêm vào giỏ hàng");
    };

    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
        <TopNav />

        <main className="pt-20">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12, delayChildren: 0.12 },
              },
            }}
            className="relative overflow-hidden bg-slate-950 text-white"
          >
            <img
              src={BannerImage}
              alt="Ảnh nền trang chủ"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/30" />

            <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
              <div className="flex w-full items-center">
                <div className="flex-1 pr-6 lg:pr-20">
                  <motion.div variants={fadeInUp} className="max-w-2xl">
                    <p className="text-sm uppercase tracking-[0.45em] text-amber-200">
                      ZYRO — THỜI TRANG TỐI GIẢN
                    </p>
                    <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold leading-tight tracking-[-0.03em]">
                      Định nghĩa lại
                      <br />
                      vẻ thanh lịch tự nhiên
                    </h1>
                    <p className="mt-5 text-base sm:text-lg leading-7 text-slate-200">
                      Sang trọng bền vững dành cho con người hiện đại — nơi di sản
                      thủ công gặp gỡ sự tinh tế kiến trúc.
                    </p>

                    <div className="mt-8 flex gap-4">
                      <Link
                        to="/story"
                        className="inline-flex items-center justify-center rounded-full bg-[#9B3F1E] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-md hover:bg-[#7f2f15]"
                      >
                        KHÁM PHÁ BỘ SƯU TẬP
                      </Link>
                      <Link
                        to="/cart"
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:bg-white/10"
                      >
                        XEM SẢN PHẨM
                      </Link>
                    </div>
                  </motion.div>
                </div>

                <div className="w-[420px] hidden lg:block"></div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#BB5734] text-white overflow-hidden"
          >
            <div className="mx-auto max-w-7xl px-6 py-5">
              <div className="overflow-hidden">
                <div className="flex min-w-[200%] whitespace-nowrap gap-4 animate-marquee">
                  {[...Array(10)].map((_, index) => (
                    <span
                      key={`item-${index}`}
                      className="inline-flex px-8 py-2 uppercase tracking-[0.3em] text-sm"
                    >
                      ✦ CHẠM LÀ MÊ ✦
                    </span>
                  ))}
                  {[...Array(10)].map((_, index) => (
                    <span
                      key={`item-dup-${index}`}
                      className="inline-flex px-8 py-2 uppercase tracking-[0.3em] text-sm"
                      aria-hidden="true"
                    >
                      ✦ CHẠM LÀ MÊ ✦
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#FFF8F6] py-20"
          >
            <div className="mx-auto max-w-7xl px-6">
              <div className="border-y border-[#DDC0B8] py-16 text-center">
                <p className="text-3xl sm:text-4xl font-playfairDisplay leading-tight text-[#231916] tracking-[-0.02em]">
                  “Trang phục không chỉ là vải vóc, đó là ngôn ngữ của sự tự tin.”
                </p>
                <p className="mt-8 text-sm uppercase tracking-[0.12em] text-[#695D4B]">
                  — Ms Hương, Nhà sáng lập ZYRO
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#FFF1ED] py-24"
          >
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-12 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-[#695D4B]">
                  Bảng màu nền tảng
                </p>
                <h2 className="mt-4 text-4xl font-serif text-[#231916]">
                  Bảng màu nền tảng cho phong cách tối giản.
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {essentialTones.map((tone) => (
                  <div
                    key={tone.title}
                    className="overflow-hidden rounded-3xl border border-[#DDC0B8] bg-white shadow-sm"
                  >
                    <div className="overflow-hidden rounded-t-3xl">
                      <img
                        src={tone.image}
                        alt={tone.title}
                        className="h-48 w-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#231916]">
                        {tone.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#695D4B]">
                        {tone.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white py-24"
          >
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-10 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-[#695D4B]">
                  Sản phẩm mới
                </p>
                <h2 className="mt-4 text-4xl font-serif text-[#231916]">
                  Khám phá mẫu mới nhất của chúng tôi.
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-[#4A4A4A]">
                  Ba thiết kế đầu tiên, cân bằng giữa vẻ đẹp tối giản và sự thoải
                  mái.
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {arrivals.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.08 }}
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-[#231916]">
                        {product.name}
                      </h3>
                      <p className="mt-3 text-sm text-[#4A4A4A]">
                        {product.description}
                      </p>
                      <div className="mt-6 flex items-center justify-between gap-4">
                        <span className="text-lg font-bold text-[#231916]">
                          ₫{product.price.toLocaleString("vi-VN")}
                        </span>
                        <button
                          onClick={() => handleAdd(product)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2e2e2e]"
                        >
                          <MdShoppingBag /> Thêm
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden bg-[#8B4331] text-white"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),transparent_34%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.2),transparent_32%)]" />
            <div className="relative mx-auto max-w-7xl px-6 py-24">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
                <div className="space-y-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#F8E6DC]">
                    BỘ SƯU TẬP TIÊU BIỂU
                  </p>
                  <h2 className="text-5xl font-serif tracking-[-0.03em] leading-tight">
                    Khai Hoa Phú Quý
                  </h2>
                  <p className="max-w-2xl text-base leading-8 text-[#F2DDD3]">
                    Tinh thần mới cho phong cách tối giản: ấm áp, sang trọng và dễ
                    tiếp cận.
                  </p>
                  <Link
                    to="/story"
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-slate-100"
                  >
                    Khám phá bộ sưu tập
                  </Link>
                </div>
                <div className="rounded-[2rem] border border-white/15 bg-white/10 p-10 backdrop-blur-sm">
                  <div className="overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/5">
                    <img
                      src={Image8}
                      alt="Khai Hoa Phú Quý"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-[#F8F2EC] py-24"
          >
            <div className="mx-auto max-w-7xl px-6 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#695D4B]">
                Tham gia Cộng Đồng
              </p>
              <h2 className="mt-4 text-4xl font-serif text-[#231916]">
                Đăng ký để nhận cập nhật và ưu đãi riêng.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#4A4A4A]">
                Nhận trước thông tin về bộ sưu tập mới, sự kiện cửa hàng và chương
                trình ưu đãi đặc biệt.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-[#231916] px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#3a3a3a]"
                >
                  Tham gia ngay
                </Link>
                <Link
                  to="/story"
                  className="inline-flex items-center justify-center rounded-full border border-[#695D4B] bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#231916] transition hover:bg-[#f0e7de]"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </motion.section>
        </main>

        <Testimonials />
        <Newsletter />
        <Footer />
      </div>
    );
  }

  export default Home;
