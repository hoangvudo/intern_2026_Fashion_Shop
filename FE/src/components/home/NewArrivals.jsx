import { useState } from 'react'

function NewArrivals() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (event) => {
    event.preventDefault()
    setEmail('')
  }

  return (
    <section className="mx-auto max-w-[1280px] border-t border-[#C3C6D6] px-5 py-16 md:px-10">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-[Manrope] text-[28px] font-semibold leading-9 text-[#041B3C]">
          San pham moi ve
        </h2>
        <div className="hidden gap-4 md:flex">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C3C6D6] bg-transparent p-0 text-[#041B3C]">
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C3C6D6] bg-transparent p-0 text-[#041B3C]">
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="rounded-xl border border-[#C3C6D6] bg-[#F9F9FF] p-6 text-left lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-[#E8EDFF]">
              <img
                src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=80"
                alt="Khan Choang Cashmere"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-sans text-xs font-bold text-[#851800]">NEW</p>
              <h3 className="mt-2 font-[Manrope] text-3xl font-bold text-[#041B3C]">
                Khan Choang Cashmere
              </h3>
              <p className="mt-3 max-w-[520px] font-sans text-base leading-7 text-[#434654]">
                Chat lieu mem, am va nhe cho nhung ban phoi mua lanh cua ZYRO.
              </p>
              <p className="mt-5 font-sans text-[22px] font-bold text-[#003D9B]">
                550,000d
              </p>
            </div>
          </div>
        </article>

        <article className="relative min-h-[360px] overflow-hidden rounded-xl bg-[#E8EDFF] text-left">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
            alt="Modern Nomad 2024"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041B3C]/90 to-transparent p-8 text-white">
            <p className="font-sans text-base">Suu tap gioi han</p>
            <h3 className="mt-2 font-[Manrope] text-[28px] font-semibold leading-9">Modern Nomad 2024</h3>
            <button className="mt-4 border-b border-white bg-transparent p-0 font-sans text-base text-white">
              Xem bo suu tap
            </button>
          </div>
        </article>

        <div className="rounded-xl bg-[#E0E8FF] p-8 text-left lg:col-span-3">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-[Manrope] text-4xl font-bold leading-[44px] text-[#041B3C]">
                Uu dai doc quyen
              </h3>
              <p className="mt-3 max-w-[620px] font-sans text-lg leading-7 text-[#041B3C]/80">
                Giam them 10% cho don hang dau tien khi dang ky thanh vien ZYRO.
              </p>
              <form onSubmit={handleSubscribe} className="mt-8 flex max-w-[520px] flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Nhap email cua ban"
                  className="min-h-14 flex-1 rounded-lg border border-[#C3C6D6] bg-white px-5 font-sans text-base text-[#041B3C] outline-none focus:border-[#003D9B]"
                  required
                />
                <button className="rounded-lg bg-[#003D9B] px-8 py-4 font-sans text-base text-white">
                  Dang ky ngay
                </button>
              </form>
            </div>
            <span className="material-symbols-outlined hidden text-[96px] text-[#003D9B]/20 md:block">
              mail
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewArrivals
