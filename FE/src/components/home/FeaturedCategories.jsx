import { Link } from 'react-router-dom'

function FeaturedCategories() {
  const categories = [
    { name: "Áo Sơ Mi", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqxKJYVZxQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno" },
    { name: "Quần Âu", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMxKJYVZxQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno" },
    { name: "Áo Khoác", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNxKJYVZxQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno" },
    { name: "Giày Dép", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuEOxKJYVZxQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno" },
    { name: "Phụ Kiện", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuFPxKJYVZxQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno" },
    { name: "Túi Xách", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuGQxKJYVZxQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno" }
  ]

  return (
    <section className="py-xl px-lg max-w-container-max mx-auto">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Danh Mục Nổi Bật</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
        {categories.map((cat, index) => (
          <Link 
            key={index}
            to={`/category/${cat.name}`}
            className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container hover:scale-105 transition-transform"
          >
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent flex items-end p-md">
              <span className="font-label-bold text-on-primary">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeaturedCategories
