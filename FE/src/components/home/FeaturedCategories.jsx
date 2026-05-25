import { Link } from 'react-router-dom'

const categories = [
  { name: 'Ao', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=700&q=80' },
  { name: 'Quan', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80' },
  { name: 'Vay', image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=700&q=80' },
  { name: 'Phu kien', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80' },
  { name: 'Giay dep', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80' },
  { name: 'Tui xach', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80' },
]

function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 md:px-10">
      <div className="mb-10 flex items-center justify-between gap-4">
        <h2 className="font-[Manrope] text-[28px] font-semibold leading-9 text-[#041B3C]">
          Danh Muc Noi Bat
        </h2>
        <Link to="/categories" className="font-sans text-base text-[#003D9B]">
          Xem tat ca
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link key={category.name} to={`/category/${category.name}`} className="group text-center">
            <div className="aspect-[1/1.08] overflow-hidden rounded-xl border border-[#C3C6D6] bg-[#F1F3FF]">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 font-[Manrope] text-xl font-semibold text-[#041B3C]">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeaturedCategories
