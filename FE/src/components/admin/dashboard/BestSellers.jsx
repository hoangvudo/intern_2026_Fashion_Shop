import { useNavigate } from 'react-router-dom'

function BestSellers({ data = [], loading }) {
  const navigate = useNavigate()

  // field names từ BestSellerDto: productName, category, soldQuantity, sellPercent
  const products = data.length > 0 ? data : null

  const maxSold = products
    ? Math.max(...products.map(p => Number(p.soldQuantity ?? p.soldCount ?? 0)), 1)
    : 1

  return (
    <div className="flex flex-col gap-6 border border-[#D1C4B9] bg-white p-8">
      <p className="font-beVietnamPro text-base font-semibold text-[#1B1C19]">Sản phẩm bán chạy</p>

      <div className="flex flex-col gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#F0EEE9]" />
              <div className="h-1.5 w-full animate-pulse rounded bg-[#F0EEE9]" />
            </div>
          ))
        ) : !products ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Chưa có dữ liệu bán hàng</p>
          </div>
        ) : (
          products.slice(0, 5).map((product, i) => {
            const sold = Number(product.soldQuantity ?? product.soldCount ?? 0)
            const pct = Math.round((sold / maxSold) * 100)
            const name = product.productName ?? product.name ?? '—'
            const cat  = product.category ?? product.categoryName ?? product.collection ?? '—'
            return (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19] line-clamp-1">
                      {name}
                    </p>
                    <p className="font-beVietnamPro text-xs text-[#4E453D] opacity-60">{cat}</p>
                  </div>
                  <p className="shrink-0 font-beVietnamPro text-sm font-semibold text-[#6F583D]">
                    {sold > 0 ? `${sold} đã bán` : '0'}
                  </p>
                </div>
                <div className="h-1.5 w-full bg-[#F0EEE9]">
                  <div
                    className="h-full bg-[#6F583D] transition-all duration-700"
                    style={{ width: `${Math.max(pct, sold > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate('/admin/reports')}
        className="w-full border border-[#D1C4B9] py-3 font-beVietnamPro text-sm text-[#1B1C19] transition-colors hover:bg-[#F0EEE9]"
      >
        Xem tất cả báo cáo
      </button>
    </div>
  )
}

export default BestSellers