import { useState } from 'react'

function NewArrivals() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    console.log('Subscribe:', email)
    setEmail('')
  }

  return (
    <section className="py-xl px-lg max-w-container-max mx-auto">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Hàng Mới Về</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Large Featured Product */}
        <div className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno"
            alt="Featured"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent flex flex-col justify-end p-lg">
            <span className="inline-block bg-error text-on-error px-sm py-xs rounded-full font-label-bold text-sm w-fit mb-sm">NEW</span>
            <h3 className="font-headline-md text-headline-md text-on-primary mb-xs">Bộ Sưu Tập Thu Đông 2024</h3>
            <p className="font-body-md text-on-primary/80 mb-md">Khám phá phong cách tối giản nhưng đầy tinh tế</p>
            <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-bold w-fit hover:scale-105 transition-transform">
              Xem Ngay
            </button>
          </div>
        </div>

        {/* Small Product 1 */}
        <div className="relative rounded-xl overflow-hidden group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno"
            alt="Product"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent flex flex-col justify-end p-md">
            <h4 className="font-body-md text-on-primary mb-xs">Áo Khoác Dạ</h4>
            <span className="font-price-lg text-on-primary">2.890.000₫</span>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-primary-container rounded-xl p-lg flex flex-col justify-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-md">mail</span>
          <h3 className="font-headline-md text-headline-md text-on-primary-container mb-xs">Đăng Ký Nhận Tin</h3>
          <p className="font-body-sm text-on-primary-container/80 mb-md">
            Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-xs">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              className="flex-1 px-sm py-xs rounded-lg border border-outline bg-surface text-on-surface font-body-sm"
              required
            />
            <button type="submit" className="bg-primary text-on-primary px-md py-xs rounded-lg font-label-bold hover:scale-105 transition-transform">
              Gửi
            </button>
          </form>
        </div>

        {/* Small Product 2 */}
        <div className="relative rounded-xl overflow-hidden group md:col-span-2">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD54VAZUf5xQ2FzQ-9nLanRdoVOD_Jiw80PXrrFaIU--1UlP9K2qqeIYp9VwO4hN8iUAd1ubjSIq4b1w_Xj4PSZaMFrWmaE1oqfYL7Q8-Dstrr6uvqhJni3lda6hzye6RglhOQipZOTkCaU5MMY7uI97dLM1W8i4B0Qo7tuJOzcpB8Ty3uryNmnVfuegYjzxuETNYsMaD8EpSvi9LS9i-aBpG2jKaii27EEH2AeBU4dHZDB-SV_hw3As15JQHT7Zg3NLAvbzj4Aeno"
            alt="Product"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-on-surface/60 to-transparent flex items-center p-lg">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-primary mb-xs">Giày Sneaker Limited</h4>
              <span className="font-price-lg text-on-primary">3.490.000₫</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewArrivals
