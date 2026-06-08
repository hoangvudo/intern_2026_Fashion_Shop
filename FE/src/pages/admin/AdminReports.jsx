import { useState, useEffect, useMemo } from 'react'
import { FiTrendingUp, FiBarChart2, FiRefreshCw } from 'react-icons/fi'
import { getAdminRevenue, getAdminStats } from '../../services/adminService'

const fmtFull = (n) => Number(n || 0).toLocaleString('vi-VN') + '₫'
const fmtM = (n) => {
  if (!n) return '0'
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return String(Math.round(n))
}

function AreaChartSVG({ data, loading }) {
  const W = 800, H = 220
  const PAD = { top: 16, right: 16, bottom: 40, left: 52 }

  const { revPath, revArea, profPath, profArea, points, yLabels, xLabels, maxVal } = useMemo(() => {
    if (!data.length) return { revPath: null, revArea: null, profPath: null, profArea: null, points: [], yLabels: [], xLabels: [], maxVal: 0 }
    const maxV = Math.max(...data.map(d => d.revenue), 1)
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom

    const toX = (i) => PAD.left + (i / Math.max(data.length - 1, 1)) * innerW
    const toY = (v) => PAD.top + innerH - (v / maxV) * innerH

    const rPts = data.map((d, i) => ({ x: toX(i), y: toY(d.revenue), rev: d.revenue, prof: d.profit, date: d.date }))
    const pPts = data.map((d, i) => ({ x: toX(i), y: toY(d.profit) }))

    const revLine = `M${rPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L')}`
    const revAreaPath = `${revLine}L${rPts[rPts.length-1].x},${H - PAD.bottom}L${PAD.left},${H - PAD.bottom}Z`
    const profLine = `M${pPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L')}`
    const profAreaPath = `${profLine}L${pPts[pPts.length-1].x},${H - PAD.bottom}L${PAD.left},${H - PAD.bottom}Z`

    const ySteps = [0, 0.25, 0.5, 0.75, 1].map(f => ({
      y: PAD.top + (1 - f) * innerH,
      label: fmtM(maxV * f),
    }))

    const step = Math.max(1, Math.floor(data.length / 8))
    const xLbls = data
      .filter((_, i) => i % step === 0)
      .map((d, i) => ({ x: toX(i * step), label: (d.date || '').slice(5) }))

    return { revPath: revLine, revArea: revAreaPath, profPath: profLine, profArea: profAreaPath, points: rPts, yLabels: ySteps, xLabels: xLbls, maxVal: maxV }
  }, [data])

  const [tooltip, setTooltip] = useState(null)

  if (loading) return (
    <div className="flex h-56 items-center justify-center">
      <span className="h-8 w-8 rounded-full border-2 border-[#D1C4B9] border-t-[#6F583D] animate-spin" />
    </div>
  )

  if (!revPath) return (
    <div className="flex h-56 flex-col items-center justify-center">
      <FiBarChart2 className="mb-3 h-12 w-12 text-[#D1C4B9]" />
      <p className="font-beVietnamPro text-sm text-[#9E8E7E]">Chưa có dữ liệu</p>
      <p className="font-beVietnamPro text-xs text-[#C5B9AE]">Sẽ xuất hiện khi có đơn hàng hoàn thành</p>
    </div>
  )

  return (
    <div className="relative overflow-x-auto" onMouseLeave={() => setTooltip(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 180 }}>
        <defs>
          <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B1C19" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#1B1C19" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradProf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6F583D" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6F583D" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid + Y labels */}
        {yLabels.map((l, i) => (
          <g key={i}>
            <line x1={PAD.left} y1={l.y} x2={W - PAD.right} y2={l.y} stroke="#F0EEE9" strokeWidth="1" />
            <text x={PAD.left - 6} y={l.y + 4} fill="#9E8E7E" fontSize="10" textAnchor="end">{l.label}</text>
          </g>
        ))}

        {/* Area fills */}
        <path d={revArea} fill="url(#gradRev)" />
        <path d={profArea} fill="url(#gradProf)" />

        {/* Lines */}
        <path d={revPath} stroke="#1B1C19" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={profPath} stroke="#6F583D" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />

        {/* Dots & hover */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="12" fill="transparent"
            onMouseEnter={() => setTooltip(p)} />
        ))}

        {/* Tooltip */}
        {tooltip && (() => {
          const tx = Math.min(tooltip.x - 50, W - 130)
          return (
            <g>
              <rect x={tx} y={tooltip.y - 50} width="128" height="42" rx="3" fill="#1B1C19" opacity="0.88" />
              <text x={tx + 64} y={tooltip.y - 33} fill="white" fontSize="10" textAnchor="middle">{tooltip.date}</text>
              <text x={tx + 64} y={tooltip.y - 20} fill="#D1C4B9" fontSize="9" textAnchor="middle">DT: {fmtM(tooltip.rev)}₫</text>
              <text x={tx + 64} y={tooltip.y - 8} fill="#A89070" fontSize="9" textAnchor="middle">LN: {fmtM(tooltip.prof)}₫</text>
            </g>
          )
        })()}

        {/* X labels */}
        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={H - PAD.bottom + 14} fill="#9E8E7E" fontSize="9" textAnchor="middle">{l.label}</text>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-5 px-2">
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-6 bg-[#1B1C19]" />
          <span className="font-beVietnamPro text-xs text-[#4E453D]">Doanh thu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="24" height="2"><line x1="0" y1="1" x2="24" y2="1" stroke="#6F583D" strokeWidth="2" strokeDasharray="4 2" /></svg>
          <span className="font-beVietnamPro text-xs text-[#4E453D]">Lợi nhuận (ước tính)</span>
        </div>
      </div>
    </div>
  )
}

function BarChartSVG({ data }) {
  const W = 800, H = 160
  const PAD = { top: 8, right: 16, bottom: 32, left: 52 }
  const [tooltip, setTooltip] = useState(null)

  const { bars, yLabels, xLabels } = useMemo(() => {
    if (!data.length) return { bars: [], yLabels: [], xLabels: [] }
    const maxV = Math.max(...data.map(d => d.revenue), 1)
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom
    const barW = Math.max(4, (innerW / data.length) * 0.6)

    const bs = data.map((d, i) => {
      const x = PAD.left + (i / data.length) * innerW + (innerW / data.length - barW) / 2
      const bH = (d.revenue / maxV) * innerH
      return { x, y: PAD.top + innerH - bH, h: bH, rev: d.revenue, date: d.date, barW }
    })

    const ySteps = [0, 0.5, 1].map(f => ({
      y: PAD.top + (1 - f) * innerH,
      label: fmtM(maxV * f),
    }))

    const step = Math.max(1, Math.floor(data.length / 8))
    const xLbls = data
      .filter((_, i) => i % step === 0)
      .map((d, i) => {
        const idx = i * step
        const x = PAD.left + (idx / data.length) * innerW + (innerW / data.length) / 2
        return { x, label: (d.date || '').slice(5) }
      })

    return { bars: bs, yLabels: ySteps, xLabels: xLbls }
  }, [data])

  if (!bars.length) return null

  return (
    <div className="relative overflow-x-auto" onMouseLeave={() => setTooltip(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 120 }}>
        {yLabels.map((l, i) => (
          <g key={i}>
            <line x1={PAD.left} y1={l.y} x2={W - PAD.right} y2={l.y} stroke="#F0EEE9" strokeWidth="1" />
            <text x={PAD.left - 6} y={l.y + 4} fill="#9E8E7E" fontSize="10" textAnchor="end">{l.label}</text>
          </g>
        ))}

        {bars.map((b, i) => (
          <g key={i} onMouseEnter={() => setTooltip(b)} style={{ cursor: 'pointer' }}>
            <rect x={b.x} y={b.y} width={b.barW} height={Math.max(b.h, 1)}
              fill={tooltip === b ? '#6F583D' : '#1B1C19'} rx="1" />
          </g>
        ))}

        {tooltip && (() => {
          const tx = Math.min(tooltip.x, W - 110)
          return (
            <g>
              <rect x={tx} y={tooltip.y - 30} width="106" height="26" rx="3" fill="#1B1C19" opacity="0.88" />
              <text x={tx + 53} y={tooltip.y - 17} fill="white" fontSize="9" textAnchor="middle">{tooltip.date}</text>
              <text x={tx + 53} y={tooltip.y - 6} fill="#D1C4B9" fontSize="9" textAnchor="middle">{fmtM(tooltip.rev)}₫</text>
            </g>
          )
        })()}

        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={H - PAD.bottom + 14} fill="#9E8E7E" fontSize="9" textAnchor="middle">{l.label}</text>
        ))}
      </svg>
    </div>
  )
}

const PERIODS = [
  { key: 'month', label: '30 ngày qua' },
  { key: 'quarter', label: '3 tháng qua' },
  { key: 'year', label: '12 tháng qua' },
]

export default function AdminReports() {
  const [period, setPeriod] = useState('month')
  const [revenueData, setRevenueData] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [rev, st] = await Promise.all([getAdminRevenue(period), getAdminStats()])
      const formatted = (rev || []).map(d => ({
        ...d,
        date: d.date || '',
        revenue: Number(d.revenue || 0),
        profit: Number(d.profit || 0),
      }))
      setRevenueData(formatted)
      setStats(st)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [period])

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0)
  const totalProfit  = revenueData.reduce((s, d) => s + d.profit, 0)
  const avgRevenue   = revenueData.length ? totalRevenue / revenueData.length : 0
  const peakDay      = revenueData.reduce((max, d) => d.revenue > (max?.revenue || 0) ? d : max, null)

  return (
    <div className="flex min-h-screen flex-col gap-6 px-8 pb-16 pt-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-beVietnamPro text-2xl font-semibold text-[#1B1C19]">Báo cáo & Thống kê</h1>
          <p className="mt-1 font-beVietnamPro text-sm text-[#6F583D]">Phân tích doanh thu và hiệu quả kinh doanh</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-[#D1C4B9]">
            {PERIODS.map(o => (
              <button key={o.key} onClick={() => setPeriod(o.key)}
                className={`px-4 py-2.5 font-beVietnamPro text-sm transition-colors ${
                  period === o.key ? 'bg-[#1B1C19] text-white' : 'bg-white text-[#4E453D] hover:bg-[#F0EEE9]'
                }`}>
                {o.label}
              </button>
            ))}
          </div>
          <button onClick={load} className="flex items-center gap-2 border border-[#D1C4B9] px-3 py-2.5 text-[#4E453D] hover:bg-[#F0EEE9]">
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Tổng doanh thu',            value: fmtFull(totalRevenue),           sub: `${revenueData.length} ngày có đơn`,   color: 'text-[#1B1C19]' },
          { label: 'Lợi nhuận ước tính',         value: fmtFull(totalProfit),            sub: '30% doanh thu',                       color: 'text-green-700' },
          { label: 'Doanh thu TB/ngày',          value: fmtFull(Math.round(avgRevenue)), sub: 'Theo kỳ chọn',                        color: 'text-blue-700'  },
          { label: 'Ngày đỉnh',                  value: peakDay?.date?.slice(5) || '—',  sub: peakDay ? fmtFull(peakDay.revenue) : 'Chưa có dữ liệu', color: 'text-amber-700' },
        ].map((c, i) => (
          <div key={i} className="border border-[#D1C4B9] bg-white p-5">
            <p className="font-beVietnamPro text-xs text-[#9E8E7E]">{c.label}</p>
            <p className={`mt-2 font-beVietnamPro text-xl font-bold ${c.color}`}>{c.value}</p>
            <p className="mt-1 font-beVietnamPro text-xs text-[#C5B9AE]">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="border border-[#D1C4B9] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-beVietnamPro text-base font-semibold text-[#1B1C19]">Biểu đồ doanh thu & lợi nhuận</h2>
          <FiTrendingUp className="h-5 w-5 text-[#9E8E7E]" />
        </div>
        <AreaChartSVG data={revenueData} loading={loading} />
      </div>

      {/* Bar chart */}
      {revenueData.length > 0 && (
        <div className="border border-[#D1C4B9] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-beVietnamPro text-base font-semibold text-[#1B1C19]">So sánh doanh thu theo ngày</h2>
            <FiBarChart2 className="h-5 w-5 text-[#9E8E7E]" />
          </div>
          <BarChartSVG data={revenueData} />
        </div>
      )}

      {/* Stats overview */}
      {stats && (
        <div className="border border-[#D1C4B9] bg-white p-6">
          <h2 className="mb-4 font-beVietnamPro text-base font-semibold text-[#1B1C19]">Tổng quan hoạt động</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Đơn hàng hôm nay',      value: stats.newOrdersToday },
              { label: 'Đơn chờ xử lý',         value: stats.pendingOrders },
              { label: 'Khách hàng mới (tháng)', value: stats.newCustomersThisMonth },
              { label: 'Tổng khách hàng',        value: stats.totalCustomers },
            ].map((item, i) => (
              <div key={i} className="border border-[#E8E0D8] p-4 text-center">
                <p className="font-beVietnamPro text-2xl font-bold text-[#1B1C19]">{item.value ?? '—'}</p>
                <p className="mt-1 font-beVietnamPro text-xs text-[#9E8E7E]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}