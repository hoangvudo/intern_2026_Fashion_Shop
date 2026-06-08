import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiTag } from 'react-icons/fi'
import { usePublicCategories } from '../hooks/useCategories'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'

function CategorySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-2xl bg-[#F0EEE9]" />
      <div className="mt-4 h-5 w-3/4 rounded bg-[#F0EEE9]" />
      <div className="mt-2 h-4 w-1/2 rounded bg-[#F0EEE9]" />
    </div>
  )
}

export default function Categories() {
  const { categories, loading } = usePublicCategories()
  const [keyword, setKeyword] = useState('')

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <>
      <TopNav />

      <main className="mx-auto max-w-[1280px] px-5 py-12 md:px-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-[Manrope] text-3xl font-bold text-[#1B1C19]">
            Tất Cả Danh Mục
          </h1>
          <p className="mt-2 text-[#6F583D]">
            Khám phá {categories.length} danh mục sản phẩm
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex max-w-sm items-center gap-2 border border-[#D1C4B9] bg-white px-4 py-3">
          <FiSearch className="h-4 w-4 shrink-0 text-[#9E8E7E]" />
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm danh mục..."
            className="flex-1 bg-transparent text-sm text-[#1B1C19] outline-none placeholder:text-[#9E8E7E] font-beVietnamPro"
          />
          {keyword && (
            <button onClick={() => setKeyword('')} className="text-[#9E8E7E] hover:text-[#1B1C19]">×</button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loading
            ? [...Array(10)].map((_, i) => <CategorySkeleton key={i} />)
            : filtered.length === 0
            ? (
              <div className="col-span-full py-20 text-center">
                <FiTag className="mx-auto mb-3 h-12 w-12 text-[#D1C4B9]" />
                <p className="font-beVietnamPro text-[#9E8E7E]">
                  {keyword ? 'Không tìm thấy danh mục phù hợp' : 'Chưa có danh mục nào'}
                </p>
              </div>
            )
            : filtered.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/categories/${cat.slug || cat.id}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#E8E0D8] bg-[#F5F3EE]">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FiTag className="h-12 w-12 text-[#D1C4B9]" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-[Manrope] text-base font-semibold text-[#1B1C19] group-hover:text-[#6F583D] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 font-beVietnamPro text-xs text-[#9E8E7E] line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </Link>
              </motion.div>
            ))
          }
        </div>
      </main>

      <Footer />
    </>
  )
}