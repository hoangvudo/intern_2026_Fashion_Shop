import { FiAlertTriangle, FiPackage, FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const LEVEL = (stock) => {
  if (stock === 0) return { label: 'Hết hàng', bg: 'bg-red-100', text: 'text-red-700' }
  if (stock <= 2)  return { label: 'Rất ít',   bg: 'bg-red-50',  text: 'text-red-600' }
  return              { label: 'Sắp hết',  bg: 'bg-amber-50', text: 'text-amber-700' }
}

function LowStockWidget({ data = [], loading }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-5 border border-[#D1C4B9] bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiAlertTriangle className="h-4 w-4 text-red-500" />
          <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19]">Sắp hết hàng</p>
          {data.length > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 font-beVietnamPro text-xs text-white">
              {data.length}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-1 font-beVietnamPro text-xs text-[#6F583D] hover:underline"
        >
          Nhập hàng <FiArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col divide-y divide-[#F0EDE9]">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="h-10 w-10 animate-pulse rounded bg-[#F0EEE9]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-[#F0EEE9]" />
                <div className="h-2.5 w-1/2 animate-pulse rounded bg-[#F0EEE9]" />
              </div>
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <FiPackage className="h-8 w-8 text-[#D1C4B9]" />
            <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Kho hàng ổn định 👍</p>
          </div>
        ) : (
          data.slice(0, 6).map((item, i) => {
            const lvl = LEVEL(item.stock)
            return (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded border border-[#D1C4B9] bg-[#F7F5F2]">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FiPackage className="h-4 w-4 text-[#C5B9AE]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-beVietnamPro text-sm font-medium text-[#1B1C19]">
                    {item.productName}
                  </p>
                  <p className="font-beVietnamPro text-xs text-[#9E8E7E]">
                    {[item.size, item.color].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className={`shrink-0 rounded px-2 py-0.5 font-beVietnamPro text-xs font-semibold ${lvl.bg} ${lvl.text}`}>
                  {item.stock === 0 ? 'Hết' : `còn ${item.stock}`}
                </span>
              </div>
            )
          })
        )}
      </div>

      {data.length > 6 && (
        <button
          onClick={() => navigate('/admin/products')}
          className="w-full border border-[#D1C4B9] py-2.5 font-beVietnamPro text-xs text-[#4E453D] hover:bg-[#F0EEE9] transition-colors"
        >
          Xem thêm {data.length - 6} sản phẩm khác
        </button>
      )}
    </div>
  )
}

export default LowStockWidget