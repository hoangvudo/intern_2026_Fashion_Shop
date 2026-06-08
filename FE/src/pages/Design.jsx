import { useState } from 'react'
import { Link } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { FiSearch as Search, FiChevronLeft as ChevronLeft, FiChevronRight as ChevronRight } from 'react-icons/fi'

export default function Design() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('TẤT CẢ')

  const categories = ['ÁO', 'ĐẦM', 'QUẦN', 'VÁY', 'PHỤ KIỆN']
  const sizes = ['X', 'S', 'M', 'L']
  const colors = ['#FFFFFF', '#000000', '#E5E5E5', '#F5F5F5']

  const featuredCategories = [
    { title: 'ÁO', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjEKtZkhlOWdHPVMGVF_8mM-b3aJCSQy97ZHPTTE5tiT4-kfvTTJCVErVOABHYS-7WN0V4TaFqC9_QBl50ffQFCOMO1zK5m3hX0wB52nmg2f0GgLX2dEiTiD2yiQ4sIr4PQRQo7LMWBAYFy4TkA6bTBjEARF5DCoXbi0HekT1QJ8iPvK2VIUjx1HDnChzPrWtnG1T4at4K4L-_imNBC62z7wE1wbZNuMlB_Pbs6zlY_dvh4A31GdKNifyTQN9v0bG9Slrh8QmfKHY' },
    { title: 'ĐẦM', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJJdpdMecs8CHWElQdPNf5XXdd8VGzjdmjfDX93-ewGu4uXC0RY0h-TvQiQrBb_kln2xQFhiUnHQJWXPdZb0gQLALD0az8yo0-BQtlb-Dm9e4DqihrrZvrqoGzKTtWNh96wwwPGM_8XKCoaU7CnoouxwLUihyvgNVfVUd8iYRRri_P4fpu2iHooP8qChN2tkj9lzBt507poM50YscKEEWDvyz1q6WOuO4MQm1iDt5Zgb0EERnecH3mFbmxYjA0JNhRQ5IzPNWX4w0' },
    { title: 'QUẦN', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAusjiy689DjJTSptZRwKvTW7_7zgAQiQuS1MJTyElo6YtrpZbaGaF_x_Nc1vSzqnJU3J4u7ZjjMSeicDMkjcwXsW9krTNLmwSZjoVWtJiZqSgcMAQBqdddWTsXsF4OVJXmf2ULvS7stO6vWfESuDlOeWBwA8ovYrrl8A4ThJ5fYXMmTWYW1TGZu3S93zn96x5qSevCgeyjXFfX8T6duqxRzyjHdqOndJ9kmhkEndypvdKV9cY3S_29F5I_zroDXZkX6QC8tCVxpI8' },
    { title: 'VÁY', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlYFIl6fapVoLn9_isNLKty2KfkfccWaltI7PB7w_2qBpUto9dkifCJEDJ2wX8DMNlB_WecQlWcBzlXxZ6mP9cEgNrjhP-TJPp-Zf3n5LzCJb0YJ5eSzmK6KUKsbGkIHyPjhKtD0E886-u2iFGlEO7J6xuhXeIEN0xevzSA__HMMJkw5Hq3I9WFeVpM3g6InJSp298eLMQC9jIr8JXBJ8qxLRrC1cPXrPNv5W5YWP61pF_n6MV-NynrJl4rvFGv_44-ShTvOrQfS8' }
  ]

  const products = [
    { id: 1, name: 'ATELIER WHITE SHIRT', price: '1.250.000đ', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjEKtZkhlOWdHPVMGVF_8mM-b3aJCSQy97ZHPTTE5tiT4-kfvTTJCVErVOABHYS-7WN0V4TaFqC9_QBl50ffQFCOMO1zK5m3hX0wB52nmg2f0GgLX2dEiTiD2yiQ4sIr4PQRQo7LMWBAYFy4TkA6bTBjEARF5DCoXbi0HekT1QJ8iPvK2VIUjx1HDnChzPrWtnG1T4at4K4L-_imNBC62z7wE1wbZNuMlB_Pbs6zlY_dvh4A31GdKNifyTQN9v0bG9Slrh8QmfKHY' },
    { id: 2, name: 'MINIMAL SILK DRESS', price: '2.450.000đ', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJJdpdMecs8CHWElQdPNf5XXdd8VGzjdmjfDX93-ewGu4uXC0RY0h-TvQiQrBb_kln2xQFhiUnHQJWXPdZb0gQLALD0az8yo0-BQtlb-Dm9e4DqihrrZvrqoGzKTtWNh96wwwPGM_8XKCoaU7CnoouxwLUihyvgNVfVUd8iYRRri_P4fpu2iHooP8qChN2tkj9lzBt507poM50YscKEEWDvyz1q6WOuO4MQm1iDt5Zgb0EERnecH3mFbmxYjA0JNhRQ5IzPNWX4w0' },
    { id: 3, name: 'ARCHITECTURAL TROUSERS', price: '1.850.000đ', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAusjiy689DjJTSptZRwKvTW7_7zgAQiQuS1MJTyElo6YtrpZbaGaF_x_Nc1vSzqnJU3J4u7ZjjMSeicDMkjcwXsW9krTNLmwSZjoVWtJiZqSgcMAQBqdddWTsXsF4OVJXmf2ULvS7stO6vWfESuDlOeWBwA8ovYrrl8A4ThJ5fYXMmTWYW1TGZu3S93zn96x5qSevCgeyjXFfX8T6duqxRzyjHdqOndJ9kmhkEndypvdKV9cY3S_29F5I_zroDXZkX6QC8tCVxpI8' },
    { id: 4, name: 'GEOMETRIC MINI SKIRT', price: '950.000đ', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlYFIl6fapVoLn9_isNLKty2KfkfccWaltI7PB7w_2qBpUto9dkifCJEDJ2wX8DMNlB_WecQlWcBzlXxZ6mP9cEgNrjhP-TJPp-Zf3n5LzCJb0YJ5eSzmK6KUKsbGkIHyPjhKtD0E886-u2iFGlEO7J6xuhXeIEN0xevzSA__HMMJkw5Hq3I9WFeVpM3g6InJSp298eLMQC9jIr8JXBJ8qxLRrC1cPXrPNv5W5YWP61pF_n6MV-NynrJl4rvFGv_44-ShTvOrQfS8' },
    { id: 5, name: 'TEXTURED KNIT TOP', price: '1.100.000đ', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAusjiy689DjJTSptZRwKvTW7_7zgAQiQuS1MJTyElo6YtrpZbaGaF_x_Nc1vSzqnJU3J4u7ZjjMSeicDMkjcwXsW9krTNLmwSZjoVWtJiZqSgcMAQBqdddWTsXsF4OVJXmf2ULvS7stO6vWfESuDlOeWBwA8ovYrrl8A4ThJ5fYXMmTWYW1TGZu3S93zn96x5qSevCgeyjXFfX8T6duqxRzyjHdqOndJ9kmhkEndypvdKV9cY3S_29F5I_zroDXZkX6QC8tCVxpI8' },
    { id: 6, name: 'LINEN BLEND BLAZER', price: '3.200.000đ', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAusjiy689DjJTSptZRwKvTW7_7zgAQiQuS1MJTyElo6YtrpZbaGaF_x_Nc1vSzqnJU3J4u7ZjjMSeicDMkjcwXsW9krTNLmwSZjoVWtJiZqSgcMAQBqdddWTsXsF4OVJXmf2ULvS7stO6vWfESuDlOeWBwA8ovYrrl8A4ThJ5fYXMmTWYW1TGZu3S93zn96x5qSevCgeyjXFfX8T6duqxRzyjHdqOndJ9kmhkEndypvdKV9cY3S_29F5I_zroDXZkX6QC8tCVxpI8' },
  ]

  const q = searchTerm.trim().toLowerCase()
  const filtered = products.filter((product) => {
    if (selectedCategory && selectedCategory !== 'TẤT CẢ' && !product.name.includes(selectedCategory)) return false
    if (!q) return true
    return product.name.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white font-sans">
      <TopNav />

      <main className="max-w-[1440px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 flex-shrink-0 space-y-10 rounded-3xl bg-white border border-[#DDC0B8] shadow-sm p-6 dark:bg-slate-900 dark:border-white/10">
          <div className="relative">
            <input
              type="text"
              placeholder="TÌM KIẾM..."
              className="w-full border-b border-gray-300/80 bg-transparent py-2.5 pr-8 text-sm tracking-wide text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors duration-300 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-200"
              value={searchTerm}onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors duration-300 dark:text-slate-500" />
          </div>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.22em] uppercase text-gray-900 dark:text-slate-100">Danh mục</h3>
            <div className="space-y-2 text-sm">
              <p onClick={() => setSelectedCategory('TẤT CẢ')} className={`font-bold cursor-pointer transition-colors duration-300 ${selectedCategory==='TẤT CẢ'?'text-black dark:text-white':'text-black/80 dark:text-slate-300'}`}>TẤT CẢ</p>
              {categories.map(cat => (
                <p key={cat} onClick={() => setSelectedCategory(cat)} className={`cursor-pointer transition-all duration-300 ${selectedCategory===cat?'text-black font-medium translate-x-0.5 dark:text-white':'text-gray-500 hover:text-black dark:text-slate-400 dark:hover:text-slate-100'}`}>{cat}</p>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.22em] uppercase text-gray-900 dark:text-slate-100">Khoảng giá</h3>
            <div className="space-y-3 text-sm">
              {['Dưới 1.000.000đ', '1.000.000đ - 3.000.000đ', 'Trên 3.000.000đ'].map(range => (
                <label key={range} className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded-sm border border-gray-300 bg-white group-hover:border-black transition-colors duration-300 dark:border-slate-700 dark:bg-slate-950 dark:group-hover:border-slate-100" />
                  <span className="text-gray-600 group-hover:text-black transition-colors duration-300 dark:text-slate-400 dark:group-hover:text-slate-100">{range}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.22em] uppercase text-gray-900 dark:text-slate-100">Màu sắc</h3>
            <div className="flex gap-3">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform duration-300 shadow-sm dark:border-slate-700 ${i === 1 ? 'ring-1 ring-offset-2 ring-black dark:ring-white/70 dark:ring-offset-slate-900' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.22em] uppercase text-gray-900 dark:text-slate-100">Kích thước</h3>
            <div className="flex gap-2">
              {sizes.map(size => (
                <button
                  key={size}className={`w-8 h-8 rounded-md text-[10px] border flex items-center justify-center transition-all duration-300 ${size === 'S' ? 'bg-black text-white border-black shadow-sm dark:bg-white dark:text-black dark:border-white' : 'border-gray-200 hover:border-black hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <div className="flex-1 space-y-20">
          <header className="pt-1">
            <h1 className="text-5xl font-serif font-light tracking-widest uppercase mb-4 text-[#BB5734]">Thiết Kế</h1>
            <div className="w-16 h-[2px] bg-[#BB5734] rounded-full" />
          </header>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCategories.map((cat, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                  <div className="aspect-[3/4] overflow-hidden bg-white mb-4 rounded-2xl border border-[#DDC0B8] shadow-sm">
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                  <h4 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#BB5734]">{cat.title}</h4>
                </div>
              </Reveal>
            ))}
          </section>

          <section className="space-y-8">
            <div className="flex items-end justify-between border-b border-gray-200/80 pb-4 dark:border-slate-800">
              <h2 className="text-lg font-semibold tracking-widest uppercase text-gray-950 dark:text-slate-100">Sản phẩm mới</h2>
              <span className="text-[10px] text-gray-400 tracking-[0.2em] dark:text-slate-500">HIỂN THỊ {products.length} SẢN PHẨM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filtered.map((product, idx) => (
                <Reveal key={product.id} delay={idx * 0.06} className="">
                  <Link
                    to={`/product/${product.id}`}
                    className="group cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1 block"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-white mb-6 rounded-2xl border border-gray-200 shadow-sm">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1 text-[#BB5734]">{product.name}</h3>
                    <p className="text-[11px] text-[#4A4A4A] tracking-wider">{product.price}</p>
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 pt-12">
              <button className="p-2 rounded-full hover:bg-white/80 hover:shadow-sm transition-all duration-300 dark:hover:bg-slate-800"><ChevronLeft className="w-4 h-4 dark:text-slate-200" /></button>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white shadow-sm dark:bg-white dark:text-black">1</span>
                <span className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-300 dark:text-slate-300 dark:hover:bg-slate-800">2</span>
                <span className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-300 dark:text-slate-300 dark:hover:bg-slate-800">3</span>
              </div>
              <button className="p-2 rounded-full hover:bg-white/80 hover:shadow-sm transition-all duration-300 dark:hover:bg-slate-800"><ChevronRight className="w-4 h-4 dark:text-slate-200" /></button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}