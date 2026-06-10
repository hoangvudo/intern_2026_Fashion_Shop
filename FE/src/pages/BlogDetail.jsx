import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { FiArrowLeft, FiClock, FiTag } from "react-icons/fi";

import BannerImage from "../assets/high_end_luxury_fashion_brand_banner.png";
import ProfessionalLuxuryTailorAtelier from "../assets/professional_luxury_tailor.png";
import HighendLuxuryFashionEditorial from "../assets/high_end_luxury_fashion.png";
import CustomfitTailoring from "../assets/close_up_of_a_high_quality.png";
import StoryImg1 from "../assets/Image1.png";
import StoryImg2 from "../assets/Image2.png";
import StoryImg3 from "../assets/Image3.png";

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "10 Xu Hướng Thời Trang Bền Vững Sẽ Lên Ngôi Trong Năm 2026",
    category: "Xu hướng",
    image: HighendLuxuryFashionEditorial,
    date: "10 Tháng 6, 2026",
    author: "Nguyễn Hà",
    readTime: "5 phút",
    excerpt: "Sự lên ngôi của chất liệu thuần tự nhiên và thiết kế tái sinh đang định hình lại toàn bộ bức tranh của ngành công nghiệp thời trang hiện đại.",
    content: `
      <p>Thời trang bền vững không còn là một khái niệm xa vời hay một trào lưu nhất thời. Nó đã trở thành kim chỉ nam cho các thương hiệu và người tiêu dùng có ý thức. Trong năm 2026, chúng sẽ chứng kiến những bước tiến vượt bậc về công nghệ vật liệu cũng như thay đổi trong nhận thức người dùng.</p>
      <h2>1. Vật Liệu Tái Sinh Mới</h2>
      <p>Các loại vải được làm từ phụ phẩm nông nghiệp như xơ dứa, vỏ táo hay bã cà phê đang ngày càng trở nên phổ biến và đạt chất lượng cao không kém gì chất liệu tự nhiên truyền thống. Những vật liệu này không chỉ thân thiện với môi trường mà còn đem lại trải nghiệm mặc vô cùng thoải mái.</p>
      <h2>2. Mô Hình Kinh Doanh Tuần Hoàn</h2>
      <p>Nhiều nhãn hàng lớn đã bắt đầu áp dụng hệ thống thu hồi quần áo cũ để tái chế hoặc nâng cấp (upcycling). Bạn không còn phải lo lắng về việc những bộ quần áo không còn dùng đến sẽ đi về đâu.</p>
      <h2>3. Thuốc Nhuộm Tự Nhiên</h2>
      <p>Công nghiệp nhuộm hóa học vốn là một trong những tác nhân gây ô nhiễm nguồn nước hàng đầu. Xu hướng sử dụng thuốc nhuộm sinh học được chiết xuất từ thực vật, khoáng chất đang là giải pháp thay thế hoàn hảo.</p>
      <p>Sự thay đổi này không chỉ bảo vệ trái đất mà còn khẳng định phong cách sống tinh tế và đầy trách nhiệm của người mặc. Thời trang giờ đây không chỉ để làm đẹp cho bản thân, mà còn để làm đẹp cho thế giới.</p>
    `
  },
  {
    id: 2,
    title: "Bí Quyết Phối Đồ Cho Nữ Giới Tuổi 30: Tinh Tế & Thanh Lịch",
    category: "Phối đồ",
    image: StoryImg1,
    date: "05 Tháng 6, 2026",
    author: "Trần Mai",
    readTime: "4 phút",
    excerpt: "Làm sao để luôn giữ được khí chất sang trọng nhưng vẫn thoải mái nơi công sở? Khám phá 5 cách mix & match không bao giờ lỗi mốt.",
    content: `
      <p>Tuổi 30 là thời điểm đánh dấu sự trưởng thành không chỉ trong sự nghiệp, suy nghĩ mà còn ở phong cách cá nhân. Thời trang ở độ tuổi này hướng tới sự tối giản, tinh tế nhưng vẫn giữ được nét quyến rũ riêng biệt.</p>
      <h2>Đầu Tư Vào Những Món Đồ Cơ Bản (Basics)</h2>
      <p>Một chiếc áo sơ mi lụa trắng, một quần âu cắt may vừa vặn hay một chiếc blazer form chuẩn là những item không thể thiếu. Chúng là nền tảng để bạn xây dựng bất kỳ phong cách nào.</p>
      <h2>Sức Mạnh Của Phụ Kiện</h2>
      <p>Đừng đánh giá thấp những chi tiết nhỏ. Một chiếc đồng hồ cổ điển, một đôi bông tai ngọc trai hay một chiếc khăn lụa có thể làm bừng sáng cả một bộ trang phục đơn điệu nhất.</p>
      <h2>Chất Liệu Làm Nên Đẳng Cấp</h2>
      <p>Hãy chú trọng vào chất liệu. Lụa tơ tằm, cashmere, linen hay cotton cao cấp không chỉ mang lại cảm giác thoải mái khi mặc mà còn tạo nên phom dáng đẹp, tôn lên khí chất của người mặc.</p>
      <p>Hãy nhớ rằng, thanh lịch không có nghĩa là nhàm chán. Đó là nghệ thuật của sự tiết chế và thấu hiểu bản thân.</p>
    `
  },
  {
    id: 3,
    title: "Sự Kiện Ra Mắt Bộ Sưu Tập 'Hồi Sinh' - Giao Thoa Quá Khứ & Hiện Tại",
    category: "Sự kiện",
    image: StoryImg2,
    date: "02 Tháng 6, 2026",
    author: "Lê Minh",
    readTime: "6 phút",
    excerpt: "Sự kiện quy tụ hàng loạt gương mặt đình đám trong giới mộ điệu, đánh dấu bước chuyển mình mạnh mẽ của thiết kế thủ công Việt.",
    content: `
      <p>Đêm qua, sự kiện ra mắt bộ sưu tập "Hồi Sinh" đã diễn ra trong không gian đầy tính nghệ thuật. Bộ sưu tập là sự kết hợp táo bạo giữa những giá trị truyền thống và ngôn ngữ thiết kế đương đại.</p>
      <h2>Không Gian Trình Diễn Độc Đáo</h2>
      <p>Được tổ chức tại một bảo tàng nghệ thuật với ánh sáng và âm nhạc được thiết kế riêng, show diễn đã đưa người xem đi từ bất ngờ này đến bất ngờ khác.</p>
      <h2>Sự Tỏa Sáng Của Kỹ Thuật Thủ Công</h2>
      <p>Điểm nhấn của bộ sưu tập là những chi tiết đính kết thủ công tỉ mỉ, lấy cảm hứng từ các hoa văn cổ. Hàng ngàn giờ làm việc của các nghệ nhân đã tạo nên những tác phẩm nghệ thuật thực sự trên nền vải.</p>
      <p>"Chúng tôi muốn kể một câu chuyện về sự tiếp nối. Quá khứ không hề bị lãng quên, mà nó luôn là nguồn cảm hứng bất tận để tạo nên hiện tại và tương lai" - Giám đốc sáng tạo của ZYRO chia sẻ.</p>
    `
  },
  {
    id: 4,
    title: "Vải Từ Trái Cây: Lời Giải Cho Bài Toán Thời Trang Xanh?",
    category: "Sống Xanh",
    image: StoryImg3,
    date: "28 Tháng 5, 2026",
    author: "Phạm Hoàng",
    readTime: "7 phút",
    excerpt: "Công nghệ mới cho phép chuyển đổi phụ phẩm nông nghiệp thành sợi dệt cao cấp, một bước tiến lớn cho thời trang thân thiện với môi trường.",
    content: `
      <p>Công nghệ sản xuất vải từ trái cây đang mở ra một kỷ nguyên mới cho ngành dệt may. Không chỉ giảm thiểu rác thải nông nghiệp, những loại vải này còn mang lại những đặc tính ưu việt.</p>
      <h2>Da Thực Vật (Vegan Leather) Từ Táo và Dứa</h2>
      <p>Da làm từ vỏ táo hay lá dứa (Piñatex) đang dần thay thế da động vật trong các sản phẩm cao cấp. Chúng có độ bền cao, chống thấm nước tốt và đặc biệt là không tàn nhẫn với động vật.</p>
      <h2>Vải Từ Bã Cà Phê và Xơ Dừa</h2>
      <p>Những loại vải này có khả năng khử mùi và kháng khuẩn tự nhiên, vô cùng phù hợp cho trang phục thể thao hoặc thời trang mặc nhà.</p>
      <p>Bước đi này không chỉ là một giải pháp môi trường mà còn mở ra vô vàn khả năng sáng tạo cho các nhà thiết kế trong việc khám phá cấu trúc và đặc tính của vật liệu mới.</p>
    `
  },
  {
    id: 5,
    title: "Custom-fit: Khi Tủ Đồ Được Cá Nhân Hóa Hoàn Toàn",
    category: "Phối đồ",
    image: CustomfitTailoring,
    date: "25 Tháng 5, 2026",
    author: "Vũ Phong",
    readTime: "5 phút",
    excerpt: "May đo tinh chỉnh không chỉ là sự vừa vặn về mặt thể chất, mà còn là sự đồng điệu về phong cách sống và tâm hồn.",
    content: `
      <p>Sự trở lại của trào lưu may đo cá nhân hóa (custom-fit) chứng minh rằng khách hàng ngày càng khao khát những sản phẩm mang đậm dấu ấn cá nhân hơn là những món đồ sản xuất hàng loạt.</p>
      <h2>Quy Trình Tạo Nên Một Thiết Kế Custom-fit</h2>
      <p>Mọi thứ bắt đầu từ việc lắng nghe. Nhà thiết kế cần hiểu rõ thói quen, phong cách sống và những đặc điểm hình thể của khách hàng trước khi đưa ra bản phác thảo đầu tiên.</p>
      <h2>Sự Vừa Vặn Hoàn Hảo</h2>
      <p>Một bộ suit hay một chiếc váy được may đo riêng sẽ tôn lên những đường nét đẹp nhất và che đi những khuyết điểm. Bạn không phải mặc một thứ quần áo, mà thứ quần áo đó được sinh ra để dành cho bạn.</p>
      <p>Giá trị cốt lõi của custom-fit nằm ở sự trải nghiệm và cảm giác độc tôn. Đó là một khoản đầu tư xứng đáng cho phong cách cá nhân của bạn.</p>
    `
  },
  {
    id: 6,
    title: "Góc Nhìn Của Nghệ Nhân: Đằng Sau Một Chiếc Váy Haute Couture",
    category: "Sự kiện",
    image: ProfessionalLuxuryTailorAtelier,
    date: "20 Tháng 5, 2026",
    author: "Đặng Linh",
    readTime: "8 phút",
    excerpt: "Hơn 300 giờ làm việc thủ công, hàng ngàn đường kim mũi chỉ là cái giá của sự hoàn mỹ trong thời trang thiết kế.",
    content: `
      <p>Haute Couture luôn được xem là đỉnh cao của nghệ thuật thời trang. Phía sau ánh hào quang của những show diễn lộng lẫy là sự miệt mài trong bóng tối của những nghệ nhân tài hoa.</p>
      <h2>Sự Cầu Kỳ Trong Từng Chi Tiết</h2>
      <p>Để tạo nên một chiếc váy Haute Couture, mọi công đoạn từ tạo rập, cắt vải, đính kết đều được làm hoàn toàn bằng tay. Một chi tiết đính lông vũ hay pha lê có thể tiêu tốn hàng tuần lễ làm việc.</p>
      <h2>Nghệ Thuật Của Sự Kiên Nhẫn</h2>
      <p>Làm việc trong xưởng may Haute Couture đòi hỏi một sự kiên nhẫn phi thường và một tình yêu mãnh liệt với cái đẹp. Mỗi đường kim mũi chỉ đều chứa đựng tâm huyết và niềm tự hào của người thợ.</p>
      <p>Haute Couture không chỉ là những bộ váy đắt tiền, nó là di sản văn hóa, là đỉnh cao của kỹ thuật và nghệ thuật chế tác thủ công mà chúng ta cần phải gìn giữ.</p>
    `
  }
];

const FEATURED_ARTICLE = {
  id: "featured",
  title: "Định hình phong cách thời trang đương đại với nét tinh hoa thủ công",
  category: "Bài Viết Nổi Bật",
  image: BannerImage,
  date: "12 Tháng 6, 2026",
  author: "ZYRO Editorial",
  readTime: "10 phút",
  excerpt: "Sự kết hợp giữa kỹ thuật cắt may truyền thống và tư duy thẩm mỹ hiện đại đã tạo nên một chuẩn mực mới cho cái đẹp. Khám phá hành trình tìm lại những giá trị cốt lõi của thời trang qua lăng kính của ZYRO.",
  content: `
    <p>Trong kỷ nguyên của thời trang nhanh (fast fashion) lên ngôi với những vòng đời sản phẩm ngắn ngủi, việc tìm về những giá trị nguyên bản và bền vững trở thành một nhu cầu thiết yếu hơn bao giờ hết. ZYRO tự hào mang đến một góc nhìn mới về thời trang đương đại, nơi mà tinh hoa thủ công truyền thống hòa quyện cùng tư duy thiết kế hiện đại.</p>
    
    <h2>Sự Tôn Vinh Kỹ Thuật Cắt May Truyền Thống</h2>
    <p>Mỗi thiết kế của chúng tôi đều bắt đầu từ việc nghiên cứu kỹ lưỡng về cấu trúc hình thể và tỷ lệ vàng trong cắt may. Thay vì rập khuôn theo những số đo công nghiệp, chúng tôi tôn trọng sự đa dạng của cơ thể con người. Sự tinh xảo trong từng đường kim mũi chỉ, kỹ thuật xử lý form dáng cầu kỳ là minh chứng cho tay nghề điêu luyện của các nghệ nhân.</p>
    
    <h2>Vật Liệu Khơi Nguồn Cảm Hứng</h2>
    <p>Chất liệu đóng vai trò quyết định trong việc hình thành ngôn ngữ thiết kế. Việc lựa chọn những dòng vải cao cấp như lụa tơ tằm nguyên bản, wool nhập khẩu hay linen tự nhiên không chỉ đảm bảo chất lượng vượt trội mà còn mang đến trải nghiệm xúc giác tuyệt vời cho người mặc. Cảm giác khi lớp lụa mềm mại trượt trên da chính là sự xa xỉ thầm lặng mà ZYRO hướng tới.</p>
    
    <img src="${HighendLuxuryFashionEditorial}" alt="Luxury Fashion" class="w-full rounded-2xl my-10 object-cover shadow-lg" />
    
    <h2>Tính Ứng Dụng Trong Không Gian Nghệ Thuật</h2>
    <p>Một thiết kế đẹp không chỉ nằm ở vẻ bề ngoài mà còn ở tính ứng dụng của nó. Chúng tôi muốn phá vỡ ranh giới giữa trang phục dạ hội và thời trang ứng dụng (ready-to-wear). Một chiếc áo khoác với cấu trúc phức tạp vẫn có thể đồng hành cùng bạn trong những buổi họp quan trọng, và chỉ cần thay đổi một vài phụ kiện, nó sẽ trở nên hoàn hảo cho một bữa tiệc tối sang trọng.</p>
    
    <h2>Tầm Nhìn Về Tương Lai</h2>
    <p>Định hình phong cách không phải là chạy theo xu hướng, mà là tạo ra những giá trị vượt thời gian. Bằng cách kết nối di sản quá khứ với hơi thở của thời đại, ZYRO cam kết tiếp tục hành trình mang đến những thiết kế không chỉ tôn vinh vẻ đẹp ngoại hình mà còn thể hiện chiều sâu tâm hồn và phong cách sống độc bản của mỗi cá nhân.</p>
  `
};

function BlogDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (id === "featured") {
      setArticle(FEATURED_ARTICLE);
    } else {
      const found = MOCK_ARTICLES.find(a => a.id === parseInt(id));
      if (found) {
        setArticle(found);
      } else {
        setArticle(MOCK_ARTICLES[0]);
      }
    }
  }, [id]);

  if (!article) return <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-[#F9F7F2] dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col font-sans">
      <TopNav />

      <main className="flex-grow pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-6">
          <header className="mb-12 text-center">
            <Reveal direction="down">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors mb-8 uppercase">
                <FiArrowLeft /> Trở về Tạp chí
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex items-center justify-center gap-4 mb-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="px-3 py-1 bg-white dark:bg-gray-800 shadow-sm rounded-full uppercase tracking-widest text-xs">
                  {article.category}
                </span>
                <span className="flex items-center gap-1"><FiClock /> {article.readTime}</span>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-8">
                {article.title}
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-serif text-lg text-black dark:text-white">
                    {article.author.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">{article.author}</p>
                    <p>{article.date}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </header>

          <Reveal delay={0.4} direction="up">
            <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-3xl mx-auto prose-headings:font-serif prose-headings:font-normal prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300">
              <p className="text-xl md:text-2xl font-serif italic text-gray-600 dark:text-gray-400 border-l-4 border-black dark:border-white pl-6 mb-12">
                {article.excerpt}
              </p>

              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <FiTag className="text-gray-400" />
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-300">Thời trang</span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-300">{article.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">Chia sẻ:</span>
                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">f</button>
                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">in</button>
                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">X</button>
              </div>
            </div>
          </Reveal>
        </article>
      </main>

      <section className="bg-white dark:bg-gray-900 py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h3 className="text-3xl font-serif mb-12 text-center">Bài Viết Liên Quan</h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {MOCK_ARTICLES.filter(a => a.id !== article.id && a.id !== "featured").slice(0, 3).map((relatedArticle, index) => (
              <Reveal key={relatedArticle.id} delay={index * 0.1} direction="up">
                <Link to={`/blog/${relatedArticle.id}`} className="group block cursor-pointer h-full flex flex-col">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-semibold uppercase tracking-wider rounded-full text-black dark:text-white">
                        {relatedArticle.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 tracking-widest uppercase">
                      {relatedArticle.date}
                    </div>
                    <h4 className="text-xl font-serif font-semibold leading-snug mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h4>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BlogDetail;
