const PERIODS = [
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'year', label: 'Năm này' },
]

const yLabels = ['250M', '150M', '50M', '0']

function RevenueChart({ data = [], period, onPeriodChange, loading }) {
  const [dropOpen, setDropOpen] = useState(false)

  // Tạo SVG path từ data API
  const buildPath = () => {
    if (!data || data.length < 2) return null
    const maxVal = Math.max(...data.map(d => d.value ?? d.amount ?? 0), 1)
    const w = 534, h = 88
    const pts = data.map((d, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((d.value ?? d.amount ?? 0) / maxVal) * (h - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    return `M${pts.join('L')}`
  }

  const path = buildPath()

  return (
    <div className="border border-[#D1C4B9] bg-white p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-beVietnamPro text-base text-[#1B1C19]">Biểu đồ tăng trưởng doanh thu</p>
          <p className="font-beVietnamPro text-sm text-[#4E453D] opacity-70">Đơn vị: Triệu VNĐ</p>
        </div>

        {/* Period selector */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(o => !o)}
            className="flex items-center gap-2 border border-[#D1C4B9] px-4 py-2 font-beVietnamPro text-sm text-[#1B1C19]"
          >
            {PERIODS.find(p => p.value === period)?.label ?? 'Tháng này'}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M7.2 9.6L12 14.4L16.8 9.6" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {dropOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 border border-[#D1C4B9] bg-white shadow-lg">
              {PERIODS.map(p => (
                <button
                  key={p.value}
                  onClick={() => { onPeriodChange?.(p.value); setDropOpen(false) }}
                  className={`block w-full px-4 py-2.5 text-left font-beVietnamPro text-sm hover:bg-[#F0EEE9] ${period === p.value ? 'font-semibold text-[#6F583D]' : 'text-[#1B1C19]'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative flex h-64">
        <div className="mr-2 flex h-full flex-col justify-between py-2 opacity-50">
          {yLabels.map((label) => (
            <span key={label} className="font-beVietnamPro text-[10px] font-bold text-[#4E453D]">{label}</span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D1C4B9] border-t-[#6F583D]" />
            </div>
          ) : (
            <>
              {[88, 115, 141, 168].map((top) => (
                <div key={top} className="absolute left-0 right-0 border-t border-[#F0EEE9]" style={{ top: `${(top / 256) * 100}%` }} />
              ))}

              {/* Area fill */}
              {path && (
                <svg viewBox="0 0 534 102" className="absolute bottom-8 left-0 right-0 h-[101px] w-full opacity-10" preserveAspectRatio="none">
                  <path d={`${path}V101.46H0Z`} fill="url(#revenueGradient)" />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#6F583D" />
                      <stop offset="1" stopColor="white" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Line */}
              {path && (
                <svg viewBox="0 0 534 88" className="absolute bottom-8 left-0 right-0 h-[85px] w-full" preserveAspectRatio="none">
                  <path d={path} stroke="#6F583D" strokeWidth="2.136" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              )}

              {/* Fallback khi không có data */}
              {!path && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Chưa có dữ liệu doanh thu</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ✅ Cần import useState
import { useState } from 'react'
export default RevenueChart