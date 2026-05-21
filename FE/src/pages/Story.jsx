import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import BannerImage from "../assets/high_end_luxury_fashion_brand_banner.png";
import ProfessionalLuxuryTailorAtelier from "../assets/professional_luxury_tailor.png";
import HighendLuxuryFashionEditorial from "../assets/high_end_luxury_fashion.png";
import CustomfitTailoring from "../assets/close_up_of_a_high_quality.png";

function Story() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <TopNav />

      <main className="pt-20">
        <section className="relative min-h-screen overflow-hidden">
          <img
            src={BannerImage}
            alt="Banner Image"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative min-h-[80vh] flex items-center justify-center px-6 py-24">
            <div className="max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-sm tracking-[0.3em] uppercase text-white/80 mb-6">
                  Trang chủ / Câu chuyện
                </p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif tracking-[-0.03em] leading-[1.02] mb-6 text-white">
                  Câu Chuyện
                </h1>
                <p className="mx-auto max-w-2xl text-base sm:text-lg leading-8 text-white/80">
                  Hành trình của một thương hiệu thời trang cao cấp được xây
                  dựng từ lòng kiên định, sự thấu cảm và tình yêu với những giá
                  trị bền vững.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:grid lg:grid-cols-[0.95fr_1.05fr] gap-16 items-start">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                  Câu chuyện thương hiệu
                </p>
                <h2 className="text-4xl font-serif leading-tight">
                  Sáng tạo từ sự thấu hiểu
                </h2>
                <p className="text-base leading-8 text-gray-600 dark:text-gray-300">
                  Khi trở lại với sự nghiệp sau thời gian dài vun vén tổ ấm, phụ
                  nữ đối diện với nỗi lo &quot;lạc nhịp&quot; và sự tự ti trước
                  những thay đổi khó giấu của cơ thể. Thiết kế KAMIKI không ép
                  vào khuôn mẫu, mà nương theo cơ thể để giúp phái đẹp tự tin
                  tỏa sáng.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-base leading-8 text-gray-600 dark:text-gray-300">
                    Đó cũng chính là nỗi trăn trở suốt 15 năm của chị Hương -
                    người từng loay hoay định vị bản sắc khi bị nhận xét
                    &quot;thiếu khí chất&quot;. Chị quyết tâm khởi nghiệp ở tuổi
                    40 với triết lý khác biệt: không ép phụ nữ vào khuôn mẫu, mà
                    sáng tạo những thiết kế biết &quot;nương&quot; theo cơ thể.
                  </p>
                </div>
                <div>
                  <p className="text-base leading-8 text-gray-600 dark:text-gray-300">
                    Sự nghiêm túc của một người dám dấn thân được minh chứng qua
                    3 năm tu nghiệp tại Malaysia và giải thưởng &quot;Best Paper
                    Award&quot; tại Hội nghị Quốc tế ICTIM 2025 về chiến lược
                    thời trang khởi nghiệp.
                  </p>
                </div>
                <div>
                  <p className="text-base leading-8 text-gray-600 dark:text-gray-300">
                    Tinh thần ấy hội tụ nơi KAMIKI - kết hợp từ tên 3 người con
                    đồng thời mang ý nghĩa &quot;Thần Cây&quot; bền bỉ. Tiên
                    phong dòng vải từ hạt và trái cây, thương hiệu cam kết sự
                    thuần khiết: vừa tôn trọng môi trường, vừa vỗ về làn da nhạy
                    cảm bằng sự an toàn tuyệt đối.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[2rem] shadow-xl">
                <img
                  src={ProfessionalLuxuryTailorAtelier}
                  className="w-full h-[619px] object-cover"
                  alt="Professional luxury tailor atelier"
                />
              </div>
              <div className="overflow-hidden rounded-[2rem] shadow-xl">
                <img
                  src={HighendLuxuryFashionEditorial}
                  className="w-full h-[348px] object-cover"
                  alt="High-end luxury fashion editorial"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F9F7F2] text-[#1A1A1A] py-24">
          <div className="max-w-7xl mx-auto px-6 lg:grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-serif leading-tight">
                  Đánh thức sự tự tin từ bên trong
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-base leading-8 text-gray-700">
                  Thấu hiểu e ngại mua sắm trực tuyến, KAMIKI trao gửi đặc quyền
                  May đo tinh chỉnh (Custom-fit) hoàn toàn miễn phí.
                </p>
                <p className="text-base leading-8 text-gray-700">
                  Chúng tôi tôn trọng tính độc bản của từng cơ thể. Vì vậy,
                  KAMIKI luôn sẵn sàng tinh chỉnh thiết kế theo số đo riêng và
                  hoàn thiện trong 7-10 ngày.
                </p>
                <p className="text-base leading-8 text-gray-700">
                  Kiên định với sứ mệnh &quot;Che khuyết điểm - Tôn khí
                  chất&quot;, chúng tôi tin rằng chỉ khi trang phục mang lại sự
                  thoải mái tuyệt đối, sự tự tin từ bên trong mới thực sự trỗi
                  dậy.
                </p>
              </div>
              <div className="inline-flex rounded-full bg-[#1A1A1A] px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                Chạm khí chất
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl">
              <img
                src={CustomfitTailoring}
                className="w-full h-[520px] object-cover"
                alt="Custom-fit tailoring"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Story;
