import { useState, useEffect } from 'react'

function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const products = [
    { name: "Áo Sơ Mi Linen", price: 890000, oldPrice: 1290000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", sold: 45 },
    { name: "Quần Âu Slim Fit", price: 1190000, oldPrice: 1690000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", sold: 32 },
    { name: "Áo Khoác Blazer", price: 2390000, oldPrice: 3290000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", sold: 28 },
    { name: "Giày Derby", price: 1590000, oldPrice: 2190000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", sold: 19 }
  ]

  return (
    <section className="py-xl px-lg bg-tertiary-container">
      <div className="max-w-container-max mx-auto">
        <div className="flex justify-between items-center mb-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-tertiary-container">⚡ Flash Sale</h2>
          <div className="flex gap-xs items-center">
            <span className="font-body-md text-on-tertiary-container">Kết thúc trong:</span>
            <div className="flex gap-xs">
              <div className="bg-error text-on-error px-sm py-xs rounded font-label-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <span className="text-on-tertiary-container">:</span>
              <div className="bg-error text-on-error px-sm py-xs rounded font-label-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <span className="text-on-tertiary-container">:</span>
              <div className="bg-error text-on-error px-sm py-xs rounded font-label-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-md overflow-x-auto pb-md scrollbar-hide">
          {products.map((product, index) => (
            <div key={index} className="min-w-[280px] bg-surface rounded-xl p-md hover:scale-105 transition-transform">
              <div className="relative aspect-square mb-sm overflow-hidden rounded-lg">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-sm right-sm bg-error text-on-error px-sm py-xs rounded-full font-label-bold text-sm">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </div>
              </div>
              <h3 className="font-body-md text-on-surface mb-xs">{product.name}</h3>
              <div className="flex items-center gap-xs mb-xs">
                <span className="font-price-lg text-error">{product.price.toLocaleString('vi-VN')}₫</span>
                <span className="font-body-sm text-on-surface-variant line-through">{product.oldPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex items-center gap-xs">
                <div className="flex-1 bg-surface-container-low rounded-full h-2 overflow-hidden">
                  <div className="bg-error h-full" style={{ width: `${(product.sold / 100) * 100}%` }} />
                </div>
                <span className="font-body-sm text-on-surface-variant">Đã bán {product.sold}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FlashSale
