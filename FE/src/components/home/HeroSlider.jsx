import { useState } from 'react'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=85',
    title: 'Define Your Style',
    description:
      'ZYRO mang den nhung thiet ke toi gian, hien dai va de ung dung cho tu do hang ngay.',
  },
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85',
    title: 'Bo suu tap moi',
    description:
      'Kham pha ao, quan, vay va phu kien duoc tuyen chon theo tinh than thanh lich cua ZYRO.',
  },
]

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slide = slides[currentSlide]

  const goPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#041B3C]">
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#041B3C]/85 via-[#041B3C]/35 to-transparent" />

      <div className="relative mx-auto flex min-h-[560px] max-w-[1280px] items-center px-5 py-20 md:px-10">
        <div className="max-w-[620px] text-left text-white">
          <p className="mb-4 font-[Manrope] text-sm font-bold uppercase tracking-[0.32em] text-[#D7E2FF]">
            ZYRO
          </p>
          <h1 className="font-[Manrope] text-5xl font-bold leading-tight md:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-[560px] font-['Hanken_Grotesk'] text-lg leading-8 text-white/85">
            {slide.description}
          </p>
          <button className="mt-9 rounded-lg bg-[#0052CC] px-9 py-4 font-['Hanken_Grotesk'] text-base font-bold text-white transition hover:bg-[#003D9B]">
            Mua ngay
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Chuyen den banner ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full p-0 transition-all ${
              index === currentSlide ? 'w-12 bg-white' : 'w-8 bg-white/40'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Banner truoc"
        onClick={goPrev}
        className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 p-0 text-white backdrop-blur transition hover:bg-white/25"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button
        type="button"
        aria-label="Banner sau"
        onClick={goNext}
        className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 p-0 text-white backdrop-blur transition hover:bg-white/25"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </section>
  )
}

export default HeroSlider
