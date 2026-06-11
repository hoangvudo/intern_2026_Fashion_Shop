import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { FiArrowLeft, FiClock, FiTag } from "react-icons/fi";
import articleService from "../services/articleService";

function BlogDetail() {
  const { id } = useParams(); // id holds the slug from URL
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await articleService.getBySlug(id);
        setArticle(data);
        if (data && data.id) {
          articleService.incrementView(data.id).catch(() => {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    articleService.getRecent()
      .then(data => {
        setRecentArticles(data.filter(a => a.slug !== id).slice(0, 3));
      })
      .catch(console.error);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <TopNav />
        <div className="flex-grow flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <TopNav />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Bài viết không tồn tại.</p>
        </div>
        <Footer />
      </div>
    );
  }

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
                  {article.category?.name || "Tin tức"}
                </span>
                <span className="flex items-center gap-1"><FiClock /> {article.readTime || "5"} phút</span>
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
                    {article.author?.name?.charAt(0) || "A"}
                  </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      <p className="font-medium text-black dark:text-white">{article.author?.name || "Admin"}</p>
                      <p className="text-sm">
                        {new Date(article.publishedAt).toLocaleDateString('vi-VN', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                </div>
              </div>
            </Reveal>
          </header>

              {/* Cover Image */}
              <Reveal direction="up" delay={0.2}>
                <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl relative bg-gray-100 dark:bg-gray-800">
                  {article.thumbnailUrl && (
                    <img
                      src={article.thumbnailUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  )}
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
