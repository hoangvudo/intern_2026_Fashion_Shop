import HeroSlider from '../components/home/HeroSlider'
import FeaturedCategories from '../components/home/FeaturedCategories'
import FlashSale from '../components/home/FlashSale'
import FeaturedProducts from '../components/home/FeaturedProducts'
import NewArrivals from '../components/home/NewArrivals'

function Home() {
  return (
    <main className="pt-[72px]">
      <HeroSlider />
      <FeaturedCategories />
      <FlashSale />
      <FeaturedProducts />
      <NewArrivals />

      <button className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#003D9B] px-5 py-4 font-['Hanken_Grotesk'] text-base font-bold text-white shadow-lg transition hover:scale-105">
        <span className="material-symbols-outlined">support_agent</span>
        <span>Ho tro</span>
      </button>
    </main>
  )
}

export default Home
