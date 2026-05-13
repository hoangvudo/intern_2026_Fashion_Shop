import { useState } from 'react'

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno",
      title: "Định Hình Phong Cách Riêng",
      description: "Khám phá bộ sưu tập Thu Đông 2024 với những thiết kế tối giản nhưng đầy quyền lực từ các thương hiệu hàng đầu thế giới."
    }
  ]

  return (
    <section className="relative w-full aspect-[21/9] overflow-hidden bg-surface-container">
      <img 
        className="w-full h-full object-cover" 
        src={slides[currentSlide].image}
        alt="Hero banner"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-on-surface/40 to-transparent flex items-center px-xl">
        <div className="max-w-xl text-on-primary">
          <h1 className="font-display text-display mb-sm">{slides[currentSlide].title}</h1>
          <p className="font-body-lg text-body-lg mb-lg opacity-90">
            {slides[currentSlide].description}
          </p>
          <button className="bg-primary-container text-on-primary font-label-bold px-lg py-sm rounded-lg hover:scale-105 transition-transform">
            Shop Now
          </button>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-md left-1/2 -translate-x-1/2 flex gap-xs">
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`w-12 h-1 rounded-full cursor-pointer ${
              index === currentSlide ? 'bg-on-primary' : 'bg-on-primary/30'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      <button 
        className="absolute left-md top-1/2 -translate-y-1/2 bg-surface/20 hover:bg-surface/40 backdrop-blur-md p-sm rounded-full text-on-primary"
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      
      <button 
        className="absolute right-md top-1/2 -translate-y-1/2 bg-surface/20 hover:bg-surface/40 backdrop-blur-md p-sm rounded-full text-on-primary"
        onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </section>
  )
}

export default HeroSlider
