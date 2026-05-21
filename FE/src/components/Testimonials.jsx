import React, { useState, useEffect } from 'react'
import { MdStar } from 'react-icons/md'

const testimonials = [
  {
    text: "Thích cái gu nhẹ nhàng mà tinh tế của shop. Đồ không quá cầu kỳ nhưng mặc lên nhìn sang, đi họp hay gặp khách đều thấy tự tin.",
    author: 'Chị H.M.'
  },
  {
    text: "Dáng mình sau sinh bụng hơi to nên rất khó mua đầm may sẵn. May mà các bạn tư vấn kỹ, chỉnh sửa theo số đo riêng nên nhận váy về mặc vừa in, giấu bụng cực khéo.",
    author: 'Chị B.H.'
  },
  {
    text: "Mình khá kỹ tính nhưng nhận đồ của Kamiki không chê được điểm nào. Từ đường kim mũi chỉ đến cách đóng gói đều rất chỉn chu, tỉ mỉ. Phom dáng mặc lên đứng form nhưng cử động lại rất êm, không bị gò bó chút nào.",
    author: 'Chị N.D.'
  },
  {
    text: "Hồi trước sợ mặc đồ công sở lắm vì cảm giác bị 'đóng hộp'. May mà tìm được KAMIKI, kiểu dáng rất đa dạng, không bị nhàm chán chút nào. Mặc lên vừa thoải mái, vừa giữ được nét sang trọng, chuyên nghiệp cần có.",
    author: 'Chị M.T.'
  },
  {
    text: "Cảm nhận chân thực từ những người phụ nữ đã tìm thấy phiên bản tự tin nhất của chính mình.",
    author: ''
  }
]

export default function Testimonials(){
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const visible = [0,1,2].map((offset) => testimonials[(index + offset) % testimonials.length])

  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-serif font-semibold mb-2">CHẠM CẢM XÚC</h2>
        <p className="max-w-2xl mx-auto text-gray-300 mb-6">Cảm nhận chân thực từ những người phụ nữ đã tìm thấy phiên bản tự tin nhất của chính mình</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visible.map((t, i) => (
            <div key={i} className="p-6 border border-gray-800 rounded bg-gray-800/20">
              <div className="flex justify-center mb-3 text-amber-400">
                <MdStar/> <MdStar/> <MdStar/> <MdStar/> <MdStar/>
              </div>
              <p className="text-base italic text-gray-100 leading-relaxed">{t.text}</p>
              <div className="mt-4 text-sm text-gray-400">{t.author}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button aria-label="prev" onClick={() => setIndex(i => (i - 1 + testimonials.length) % testimonials.length)} className="text-white/80 hover:text-white">←</button>
          <div className="flex gap-2">
            {testimonials.map((_,i) => (
              <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i===index ? 'bg-white' : 'bg-white/30'}`} aria-label={`dot-${i}`} />
            ))}
          </div>
          <button aria-label="next" onClick={() => setIndex(i => (i + 1) % testimonials.length)} className="text-white/80 hover:text-white">→</button>
        </div>
      </div>
    </section>
  )
}
