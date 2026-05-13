import HeroSlider from '../components/home/HeroSlider'
import FeaturedCategories from '../components/home/FeaturedCategories'
import FlashSale from '../components/home/FlashSale'
import FeaturedProducts from '../components/home/FeaturedProducts'
import NewArrivals from '../components/home/NewArrivals'

function Home() {
  return (
    <main className="pt-16">
      <HeroSlider />
      <FeaturedCategories />
      <FlashSale />
      <FeaturedProducts />
      <NewArrivals />
      
      {/* FAB Support Button */}
      <button className="fixed bottom-lg right-lg bg-primary text-on-primary p-md rounded-full shadow-lg hover:scale-110 transition-transform z-40 flex items-center gap-xs">
        <span className="material-symbols-outlined">support_agent</span>
        <span className="font-label-bold">Hỗ trợ</span>
      </button>
    </main>
  )
}

export default Home
