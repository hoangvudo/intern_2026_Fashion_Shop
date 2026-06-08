const products = [
  {
    category: 'So mi',
    name: 'Ao So Mi Lua Trang',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Quan',
    name: 'Quan Tay Slim Fit',
    price: 1100000,
    image: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Vay',
    name: 'Vay Midi Dang A',
    price: 1450000,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Ao khoac',
    name: 'Ao Blazer Cong So',
    price: 1850000,
    image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80',
  },
]

const formatPrice = (price) => `${price.toLocaleString('vi-VN')}d`

function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 md:px-10">
      <h2 className="mb-10 text-left font-[Manrope] text-[28px] font-semibold leading-9 text-[#041B3C]">
        San pham noi bat
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.name}
            className="rounded-xl border border-[#C3C6D6] bg-[#F9F9FF] p-4 text-left transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-[#E8EDFF]">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <p className="mt-4 font-sans text-sm text-[#434654]">
              {product.category}
            </p>
            <h3 className="mt-1 min-h-[56px] font-[Manrope] text-xl font-semibold leading-7 text-[#041B3C]">
              {product.name}
            </h3>
            <p className="mt-2 font-sans text-[22px] font-bold leading-7 text-[#003D9B]">
              {formatPrice(product.price)}
            </p>
            <button className="mt-6 w-full rounded-lg border border-[#003D9B] bg-transparent px-4 py-2 font-sans text-base text-[#003D9B] transition hover:bg-[#003D9B] hover:text-white">
              Xem chi tiet
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts
