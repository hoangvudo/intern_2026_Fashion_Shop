import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import useCartStore from '../store/cartStore'
import toast from 'react-hot-toast'

function ProductDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const addItem = useCartStore(state => state.addItem)

  const mock = {
    id: id || 'sample-1',
    name: 'Áo Dài Gấm Lụa Voan Hoa',
    price: 1145000,
    images: ['/src/assets/logo.jpg', '/src/assets/logo.jpg', '/src/assets/logo.jpg', '/src/assets/logo.jpg'],
    short: ['Chất liệu cao cấp', 'May đo tinh xảo', 'Miễn phí đổi trả 7 ngày'],
    description: 'Mô tả chi tiết sản phẩm... Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    sku: 'KD-027',
    category: 'Áo dài - Pháp phục'
  }

  const [qty, setQty] = useState(1)
  const [selectedImage, setSelectedImage] = useState(mock.images[0])
  const [size, setSize] = useState('M')
  const [color, setColor] = useState('Hồng')
  const [tab, setTab] = useState('desc')

  const [reviews, setReviews] = useState([
    { id: 1, name: 'Lan', rating: 5, comment: 'Chất lượng tốt, mặc thoải mái.', date: '2026-05-10' },
    { id: 2, name: 'Minh', rating: 4, comment: 'Đẹp, đúng form.', date: '2026-05-12' }
  ])
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewHover, setReviewHover] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [id])

  const related = [
    { id: 'featured-1', name: 'Áo khoác voan', price: 399000, image: '/src/assets/logo.jpg' },
    { id: 'featured-2', name: 'Pháp phục gấm', price: 459000, image: '/src/assets/logo.jpg' },
    { id: 'featured-3', name: 'Váy lụa', price: 529000, image: '/src/assets/logo.jpg' }
  ]

  function handleAdd(){
    addItem({ id: mock.id, name: mock.name, price: mock.price, image: selectedImage })
    toast.success('Đã thêm vào giỏ hàng')
  }

  function buyNow(){
    handleAdd()
    navigate('/cart')
  }

  function submitReview(e){
    e.preventDefault()
    if(!reviewName || !reviewComment) return toast.error('Vui lòng nhập tên và bình luận')
    const newReview = {
      id: Date.now(),
      name: reviewName,
      rating: Number(reviewRating),
      comment: reviewComment,
      date: new Date().toISOString().slice(0,10)
    }
    setReviews([newReview, ...reviews])
    setReviewName('')
    setReviewRating(5)
    setReviewComment('')
    toast.success('Cảm ơn bạn đã đánh giá')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopNav />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate(-1)} className="hover:underline">← Quay lại</button>
          <span>/</span>
          <span className="text-gray-400">{mock.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="order-2 lg:order-1 lg:col-span-2">
            <div className="flex gap-6">
              <div className="hidden lg:flex flex-col gap-3 w-24">
                {mock.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded overflow-hidden border ${selectedImage===img ? 'ring-2 ring-rose-500' : ''}`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-24 h-24 object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img src={selectedImage} alt={mock.name} className="w-full h-[560px] object-cover" />
                </div>

                <div className="mt-4 grid grid-cols-5 gap-3 lg:hidden">
                  {mock.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`rounded overflow-hidden border ${selectedImage===img ? 'ring-2 ring-rose-500' : ''}`}
                    >
                      <img src={img} alt={`thumb-${idx}`} className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex gap-6 border-b pb-3">
                <button onClick={() => setTab('desc')} className={`pb-2 ${tab==='desc' ? 'border-b-2 border-black font-medium' : 'text-gray-600'}`}>Mô tả sản phẩm</button>
                <button onClick={() => setTab('size')} className={`pb-2 ${tab==='size' ? 'border-b-2 border-black font-medium' : 'text-gray-600'}`}>Hướng dẫn chọn size</button>
                <button onClick={() => setTab('reviews')} className={`pb-2 ${tab==='reviews' ? 'border-b-2 border-black font-medium' : 'text-gray-600'}`}>Đánh giá ({reviews.length})</button>
              </div>

              <div className="mt-6">
                {tab==='desc' && <div className="text-gray-700 dark:text-gray-300 leading-7">{mock.description}</div>}
                {tab==='size' && <div className="text-gray-700 dark:text-gray-300">Hướng dẫn chọn size: ...</div>}
                {tab==='reviews' && (
                  <div className="space-y-4">
                    <form onSubmit={submitReview} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
                      <div className="flex gap-3 mb-3">
                        <input value={reviewName} onChange={e=>setReviewName(e.target.value)} placeholder="Tên của bạn" className="border rounded px-3 py-2 flex-1" />
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(i => (
                            <button
                              key={i}
                              type="button"
                              onMouseEnter={() => setReviewHover(i)}
                              onMouseLeave={() => setReviewHover(0)}
                              onClick={() => setReviewRating(i)}
                              className="p-1"
                            >
                              <FaStar className={`${(reviewHover || reviewRating) >= i ? 'text-yellow-400' : 'text-gray-300'} w-5 h-5`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea value={reviewComment} onChange={e=>setReviewComment(e.target.value)} placeholder="Viết đánh giá" className="w-full border rounded px-3 py-2 mb-3" rows={3} />
                      <div className="flex gap-3">
                        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Gửi đánh giá</button>
                        <button type="button" onClick={() => { setReviewName(''); setReviewComment(''); setReviewRating(5) }} className="px-4 py-2 border rounded">Xóa</button>
                      </div>
                    </form>

                    <div className="space-y-3">
                      {reviews.map(r => (
                        <div key={r.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{r.name}</div>
                            <div className="flex items-center gap-1 text-yellow-500">
                              {Array.from({length: r.rating}).map((_,i) => <FaStar key={i} />)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">{r.date}</div>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="order-1 lg:order-2 lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold mb-2">{mock.name}</h1>
              <div className="text-gray-500 text-sm mb-4">SKU: {mock.sku} • {mock.category}</div>
              <div className="text-3xl font-extrabold mb-4">₫{mock.price.toLocaleString()}</div>

              <ul className="mb-4 space-y-1 text-sm text-gray-600">
                {mock.short.map((s, idx) => (<li key={idx}>• {s}</li>))}
              </ul>

              <div className="text-sm text-gray-600 mb-2">Kích thước</div>
              <div className="flex items-center gap-2 mb-4">
                {['XS','S','M','L','XL'].map(sz => (
                  <button key={sz} onClick={() => setSize(sz)} className={`px-3 py-2 border rounded ${size===sz ? 'bg-black text-white' : ''}`}>{sz}</button>
                ))}
              </div>

              <div className="text-sm text-gray-600 mb-2">Màu sắc</div>
              <div className="flex items-center gap-2 mb-4">
                {['Hồng','Đen','Trắng'].map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border ${color===c ? 'ring-2 ring-black' : ''}`}
                    style={{backgroundColor: c==='Đen' ? '#000' : c==='Trắng' ? '#fff' : '#FDE2E6'}}
                    aria-label={c}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center border rounded overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty-1))} className="px-3 py-2">−</button>
                  <div className="w-12 text-center">{qty}</div>
                  <button onClick={() => setQty(qty+1)} className="px-3 py-2">+</button>
                </div>
                <button onClick={handleAdd} className="bg-white border border-black text-black px-4 py-2 rounded">Thêm vào giỏ</button>
              </div>

              <div className="flex gap-3">
                <button onClick={buyNow} className="bg-black text-white px-4 py-2 rounded flex-1">Mua ngay</button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <div>Miễn phí đổi trả trong 7 ngày</div>
                <div>Giao hàng 2-4 ngày</div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-6">Sản phẩm tương tự</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(p => (
              <div key={p.id} className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Link to={`/product/${p.id}`} className="px-4 py-2 bg-white text-black rounded">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white">{p.name}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Mô tả ngắn gọn sản phẩm.</p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">₫{p.price.toLocaleString()}</div>
                    <button
                      onClick={() => { addItem({ id: p.id, name: p.name, price: p.price, image: p.image }); toast.success('Đã thêm vào giỏ hàng') }}
                      className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md hover:opacity-90 transition"
                    >
                      <span>Thêm</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetail