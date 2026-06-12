import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import BannerImage from "../assets/high_end_luxury_fashion_brand_banner.png";
import { FiArrowRight } from "react-icons/fi";
import articleService from "../services/articleService";
import { getImageUrl } from "../utils/imageUrl";

const CATEGORIES = ["Tất cả", "Xu hướng", "Phối đồ", "Sự kiện", "Sống Xanh"];

function Blog() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch featured
  useEffect(() => {
    articleService.getFeatured().then(data => {
      if (data && data.length > 0) setFeatured(data[0]);
    }).catch(console.error);
  }, []);

  // Fetch articles list
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const params = { page: 0, size: 6 };
        if (activeCategory !== "Tất cả") params.category = activeCategory;
        const res = await articleService.getPublished(params);
        setArticles(res.content || []);
        setHasMore(!res.last);
        setPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [activeCategory]);

  const handleLoadMore = async () => {
    try {
      const params = { page, size: 6 };
      if (activeCategory !== "Tất cả") params.category = activeCategory;
      const res = await articleService.getPublished(params);
      setArticles(prev => [...prev, ...(res.content || [])]);
      setHasMore(!res.last);
      setPage(p => p + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
      <TopNav />

      <main className="flex-grow">
        {/* Hero Section - Featured Article */}
        <section className="relative min-h-[70vh] flex items-center">
          <img
            src={featured?.coverImage ? getImageUrl(featured.coverImage) : BannerImage}
            alt={featured?.title || "Featured Article Banner"}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = BannerImage }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
            <Reveal duration={0.8} direction="up">
              <div className="max-w-3xl">
                <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest text-white uppercase border border-white/30 rounded-full backdrop-blur-sm">
                  Bài Viết Nổi Bật
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
                  {featured?.title || "Định hình phong cách thời trang đương đại với nét tinh hoa thủ công"}
                </h1>
                <p className="text-lg text-white/80 mb-8 max-w-2xl line-clamp-3">
                  {featured?.excerpt || "Sự kết hợp giữa kỹ thuật cắt may truyền thống và tư duy thẩm mỹ hiện đại đã tạo nên một chuẩn mực mới cho cái đẹp. Khám phá hành trình tìm lại những giá trị cốt lõi của thời trang qua lăng kính của ZYRO."}
                </p>
                <Link
                  to={featured ? `/blog/${featured.slug}` : "/blog"}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold text-sm uppercase tracking-wider rounded-full hover:bg-gray-200 transition-colors"
                >
                  Đọc tiếp <FiArrowRight />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Categories & Articles Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Header & Categories */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-serif">Tạp Chí Mới Nhất</h2>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeCategory === category
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {loading ? (
                [...Array(6)].map((_, index) => (
                  <div key={index} className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                ))
              ) : articles.length > 0 ? (
                articles.map((article, index) => (
                  <Reveal key={article.id} delay={(index % 6) * 0.1} direction="up">
                    <article className="group cursor-pointer h-full flex flex-col">
                      {/* Image Container */}
                      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 bg-gray-100 dark:bg-gray-800">
                        {article.coverImage ? (
                          <img
                            src={getImageUrl(article.coverImage)}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            Chưa có ảnh
                          </div>
                        )}
                        {article.category && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-semibold uppercase tracking-wider rounded-full">
                              {article.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 tracking-widest uppercase">
                          {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                            day: '2-digit', month: 'long', year: 'numeric'
                          })}
                        </div>
                        <h3 className="text-xl font-serif font-semibold leading-snug mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                          {article.excerpt}
                        </p>
                        <div className="mt-auto">
                          <Link
                            to={`/blog/${article.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors"
                          >
                            Đọc bài viết <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-500">
                  <p>Chưa có bài viết nào trong danh mục này.</p>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-20 text-center">
                <Reveal delay={0.2} direction="up">
                  <button 
                    onClick={handleLoadMore}
                    className="px-10 py-4 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Tải thêm bài viết
                  </button>
                </Reveal>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Banner - Optional element for magazine */}
        <section className="bg-[#F9F7F2] dark:bg-gray-900 py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Reveal direction="up">
              <h2 className="text-3xl md:text-4xl font-serif mb-4 dark:text-white">Đăng Ký Nhận Tin</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Để lại email của bạn để không bỏ lỡ những xu hướng thời trang mới nhất, cùng những câu chuyện truyền cảm hứng từ ZYRO.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Địa chỉ email của bạn..."
                  className="flex-grow px-6 py-4 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold uppercase tracking-wider rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Đăng Ký
                </button>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Blog;
