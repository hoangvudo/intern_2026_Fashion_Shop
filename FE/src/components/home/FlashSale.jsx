import { useEffect, useState } from 'react'

const saleProducts = [
  {
    name: 'Ao Khoac Trench Coat',
    category: 'Thoi trang Nam',
    price: 1250000,
    oldPrice: 1800000,
    discount: 30,
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Vay Lua Satin Cao Cap',
    category: 'Thoi trang Nu',
    price: 850000,
    oldPrice: 1700000,
    discount: 50,
    rating: 4.9,
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Giay Cao Got Stiletto',
    category: 'Phu kien',
    price: 2100000,
    oldPrice: 2600000,
    discount: 20,
    rating: 4.7,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Tui Cam Tay Da Be',
    category: 'Tui xach',
    price: 3400000,
    oldPrice: 4000000,
    discount: 15,
    rating: 5.0,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
]

const formatPrice = (price) => `${price.toLocaleString('vi-VN')}d`

function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const time = [timeLeft.hours, timeLeft.minutes, timeLeft.seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')

  return (
    <section className="bg-[#F1F3FF] py-16">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <h2 className="font-[Manrope] text-4xl font-bold leading-[44px] text-[#851800]">
              Flash Sale
            </h2>
            <div className="flex w-fit items-center gap-2 rounded-lg bg-[#B02300] px-4 py-2 text-[#FFC6B9]">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span className="font-['Hanken_Grotesk'] text-base">Ket thuc sau: {time}</span>
            </div>
          </div>
          <button className="flex w-fit items-center gap-2 bg-transparent p-0 font-['Hanken_Grotesk'] text-base text-[#003D9B]">
            Xem toan bo
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {saleProducts.map((product) => (
            <article key={product.name} className="rounded-xl border border-[#C3C6D6] bg-white p-4 text-left">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#E8EDFF]">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                <span className="absolute right-2 top-2 rounded bg-[#BA1A1A] px-2 py-1 font-['Hanken_Grotesk'] text-xs text-white">
                  -{product.discount}%
                </span>
              </div>
              <p className="mt-4 font-['Hanken_Grotesk'] text-sm text-[#434654]">{product.category}</p>
              <h3 className="mt-1 min-h-[56px] font-[Manrope] text-xl font-semibold leading-7 text-[#041B3C]">
                {product.name}
              </h3>
              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span className="font-['Hanken_Grotesk'] text-[22px] font-bold text-[#003D9B]">
                  {formatPrice(product.price)}
                </span>
                <span className="font-['Hanken_Grotesk'] text-sm text-[#434654] line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1 font-['Hanken_Grotesk'] text-xs text-[#434654]">
                <span className="material-symbols-outlined text-sm text-[#851800]">star</span>
                <span className="text-[#041B3C]">{product.rating.toFixed(1)}</span>
                <span>({product.reviews})</span>
              </div>
              <button className="mt-5 w-full rounded-lg bg-[#0052CC] px-4 py-2 font-['Hanken_Grotesk'] text-base text-white transition hover:bg-[#003D9B]">
                Them vao gio
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FlashSale
