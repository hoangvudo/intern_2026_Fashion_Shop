import { Link } from 'react-router-dom'
import { usePublicCategories } from '../../hooks/useCategories'
import { FiTag } from 'react-icons/fi'

function CategorySkeleton() {
  return (
    <div className="animate-pulse text-center">
      <div className="aspect-[1/1.08] rounded-xl bg-[#F0EEE9]" />
      <div className="mx-auto mt-4 h-5 w-20 rounded bg-[#F0EEE9]" />
    </div>
  )
}

function FeaturedCategories() {
  const { categories, loading } = usePublicCategories()

  // Hiển thị tối đa 6 danh mục active trên trang chủ
  const displayed = categories.slice(0, 6)

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 md:px-10">
      <div className="mb-10 flex items-center justify-between gap-4">
        <h2 className="font-[Manrope] text-[28px] font-semibold leading-9 text-[#041B3C]">
          Danh Mục Nổi Bật
        </h2>
        <Link to="/categories" className="font-sans text-base text-[#003D9B] hover:underline">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {loading
          ? [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
          : displayed.length === 0
          ? (
            <div className="col-span-6 py-16 text-center text-[#9E8E7E]">
              Chưa có danh mục nào
            </div>
          )
          : displayed.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug || category.id}`}
              className="group text-center"
            >
              <div className="aspect-[1/1.08] overflow-hidden rounded-xl border border-[#C3C6D6] bg-[#F1F3FF]">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FiTag className="h-10 w-10 text-[#C3C6D6]" />
                  </div>
                )}
              </div>
              <p className="mt-4 font-[Manrope] text-xl font-semibold text-[#041B3C]">
                {category.name}
              </p>
            </Link>
          ))
        }
      </div>
    </section>
  )
}

export default FeaturedCategories