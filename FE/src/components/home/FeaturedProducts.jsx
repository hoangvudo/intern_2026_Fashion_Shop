function FeaturedProducts() {
  const products = [
    { name: "Áo Sơ Mi Oxford", price: 1290000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", rating: 4.8 },
    { name: "Quần Chinos", price: 990000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", rating: 4.6 },
    { name: "Áo Polo Premium", price: 790000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", rating: 4.9 },
    { name: "Giày Loafer", price: 1890000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", rating: 4.7 },
    { name: "Thắt Lưng Da", price: 590000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", rating: 4.5 },
    { name: "Ví Da Cao Cấp", price: 890000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", rating: 4.8 },
    { name: "Túi Xách Công Sở", price: 1590000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", rating: 4.6 },
    { name: "Kính Mát Thời Trang", price: 690000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno", rating: 4.7 }
  ]

  return (
    <section className="py-xl px-lg max-w-container-max mx-auto">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Sản Phẩm Nổi Bật</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {products.map((product, index) => (
          <div key={index} className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative aspect-square overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              <button className="absolute top-sm right-sm bg-surface/80 backdrop-blur-sm p-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-primary">favorite_border</span>
              </button>
            </div>
            <div className="p-md">
              <h3 className="font-body-md text-on-surface mb-xs">{product.name}</h3>
              <div className="flex items-center gap-xs mb-xs">
                <span className="material-symbols-outlined text-sm text-tertiary">star</span>
                <span className="font-body-sm text-on-surface-variant">{product.rating}</span>
              </div>
              <span className="font-price-lg text-primary">{product.price.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts
