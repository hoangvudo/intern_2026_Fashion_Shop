function BestSellers({ data = [], loading }) {

  // Fallback khi chưa có data
  const products = data.length > 0 ? data : [
    { name: 'Chưa có dữ liệu', collection: '—', percent: 0, soldCount: 0 },
  ]

  // Tính % tương đối dựa trên soldCount lớn nhất
  const maxSold = Math.max(...products.map(p => p.soldCount ?? p.percent ?? 0), 1)

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
        ) : (
          products.slice(0, 5).map((product, i) => {
            const sold = product.soldCount ?? product.percent ?? 0
            const pct = Math.round((sold / maxSold) * 100)
            return (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-beVietnamPro text-sm font-medium text-[#1B1C19] line-clamp-1">
                      {product.productName ?? product.name}
                    </p>
                    <p className="font-beVietnamPro text-xs text-[#4E453D] opacity-60">
                      {product.categoryName ?? product.collection ?? '—'}
                    </p>
                  </div>
                  <p className="font-beVietnamPro text-sm font-semibold text-[#6F583D]">
                    {sold > 0 ? `${sold} đã bán` : `${pct}%`}
                  </p>
                </div>
                <div className="h-1.5 w-full bg-[#F0EEE9]">
                  <div className="h-full bg-[#6F583D] transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })
        )}
      </div>

      <button
        type="button"
        className="w-full border border-[#D1C4B9] py-3 font-beVietnamPro text-sm text-[#1B1C19] transition-colors hover:bg-[#F0EEE9]"
      >
        Xem tất cả báo cáo
      </button>
    </div>
  )
}

export default BestSellers