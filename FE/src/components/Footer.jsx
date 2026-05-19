import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-[#C3C6D6] bg-[#D7E2FF]">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-10 md:grid-cols-[1fr_auto] md:px-10">
        <div className="max-w-[460px] text-left">
          <Link to="/" className="font-[Manrope] text-2xl font-bold tracking-[0.22em] text-[#003D9B]">
            ZYRO
          </Link>
          <p className="mt-3 font-['Hanken_Grotesk'] text-sm leading-6 text-[#434654]">
            Define your style. ZYRO tuyen chon nhung thiet ke thoi trang hien dai,
            toi gian va de ung dung cho phong cach ca nhan moi ngay.
          </p>
        </div>

        <div className="flex flex-col gap-5 text-left md:items-end md:text-right">
          <nav className="flex flex-wrap gap-5 font-['Hanken_Grotesk'] text-base text-[#434654]">
            <Link to="/privacy" className="hover:text-[#003D9B]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#003D9B]">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-[#003D9B]">Shipping & Returns</Link>
            <Link to="/contact" className="hover:text-[#003D9B]">Contact Us</Link>
          </nav>
          <p className="font-['Hanken_Grotesk'] text-sm text-[#434654]">
            © 2024 ZYRO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
