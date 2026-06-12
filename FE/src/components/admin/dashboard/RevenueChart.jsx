import { useState, useMemo } from "react";

const PERIODS = [
  { value: "month", label: "Tháng này" },
  { value: "quarter", label: "Quý này" },
  { value: "year", label: "Năm này" },
];

function fmtMillion(n) {
  if (!n) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(0) + "M";
  return (n / 1_000).toFixed(0) + "K";
}

function RevenueChart({ data = [], period, onPeriodChange, loading }) {
  const [dropOpen, setDropOpen] = useState(false);
  const [tooltip, setTooltip] = useState(null); // { x, y, value, date }

  const W = 540,
    H = 160;
  const PAD = { top: 12, right: 8, bottom: 32, left: 8 };

  const { path, areaPath, points, yLabels } = useMemo(() => {
    // FIX: BE trả về { date, revenue, profit } — dùng revenue
    const vals = data.map((d) => Number(d.revenue ?? d.value ?? d.amount ?? 0));
    if (vals.length < 2)
      return { path: null, areaPath: null, points: [], maxVal: 0, yLabels: [] };

    const max = Math.max(...vals, 1);
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const pts = vals.map((v, i) => ({
      x: PAD.left + (i / (vals.length - 1)) * innerW,
      y: PAD.top + innerH - (v / max) * innerH,
      value: v,
      date: data[i]?.date ?? "",
    }));

    const linePath = `M${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("L")}`;
    const aPath = `${linePath}L${pts[pts.length - 1].x},${H - PAD.bottom}L${pts[0].x},${H - PAD.bottom}Z`;

    // Y-axis labels
    const steps = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
      y: PAD.top + (1 - f) * (H - PAD.top - PAD.bottom),
      label: fmtMillion(max * f),
    }));

    return {
      path: linePath,
      areaPath: aPath,
      points: pts,
      maxVal: max,
      yLabels: steps,
    };
  }, [data]);

  // X-axis labels — hiện 6 nhãn đều
  const xLabels = useMemo(() => {
    if (!data.length) return [];
    const step = Math.max(1, Math.floor(data.length / 6));
    return data
      .filter((_, i) => i % step === 0)
      .map((d, i) => {
        const idx = i * step;
        const x =
          PAD.left +
          (idx / Math.max(data.length - 1, 1)) * (W - PAD.left - PAD.right);
        const label = d.date ? d.date.slice(5) : ""; // MM-DD
        return { x, label };
      });
  }, [data]);

  return (
    <div className="border border-[#D1C4B9] bg-white p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-beVietnamPro text-base font-semibold text-[#1B1C19]">
            Biểu đồ tăng trưởng doanh thu
          </p>
          <p className="font-beVietnamPro text-sm text-[#4E453D] opacity-70">
            Đơn vị: VNĐ
          </p>
        </div>

        {/* Period dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen((o) => !o)}
            className="flex items-center gap-2 border border-[#D1C4B9] px-4 py-2 font-beVietnamPro text-sm text-[#1B1C19] hover:bg-[#F0EEE9]"
          >
            {PERIODS.find((p) => p.value === period)?.label ?? "Tháng này"}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M7.2 9.6L12 14.4L16.8 9.6"
                stroke="#6B7280"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {dropOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-36 border border-[#D1C4B9] bg-white shadow-lg">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    onPeriodChange?.(p.value);
                    setDropOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left font-beVietnamPro text-sm hover:bg-[#F0EEE9] ${
                    period === p.value
                      ? "font-semibold text-[#6F583D]"
                      : "text-[#1B1C19]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D1C4B9] border-t-[#6F583D]" />
          </div>
        ) : !path ? (
          <div className="flex h-48 items-center justify-center">
            <p className="font-beVietnamPro text-sm text-[#9E8E7E]">
              Chưa có dữ liệu doanh thu
            </p>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ height: 200 }}
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Grid lines */}
            {yLabels.map((l, i) => (
              <g key={i}>
                <line
                  x1={PAD.left}
                  y1={l.y}
                  x2={W - PAD.right}
                  y2={l.y}
                  stroke="#F0EEE9"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left}
                  y={l.y - 3}
                  className="fill-[#9E8E7E]"
                  fontSize="9"
                  textAnchor="start"
                >
                  {l.label}
                </text>
              </g>
            ))}

            {/* Area fill */}
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6F583D" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6F583D" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#revGrad)" />

            {/* Line */}
            <path
              d={path}
              stroke="#6F583D"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover dots + hit areas */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="3" fill="#6F583D" opacity="0.8" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="transparent"
                  onMouseEnter={() => setTooltip(p)}
                />
              </g>
            ))}

            {/* Tooltip */}
            {tooltip && (
              <g>
                <rect
                  x={Math.min(tooltip.x - 40, W - 90)}
                  y={tooltip.y - 40}
                  width="88"
                  height="28"
                  rx="4"
                  fill="#1B1C19"
                  opacity="0.85"
                />
                <text
                  x={Math.min(tooltip.x - 40, W - 90) + 44}
                  y={tooltip.y - 22}
                  fill="white"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {tooltip.date}
                </text>
                <text
                  x={Math.min(tooltip.x - 40, W - 90) + 44}
                  y={tooltip.y - 10}
                  fill="#D1C4B9"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {fmtMillion(tooltip.value)}₫
                </text>
              </g>
            )}

            {/* X-axis labels */}
            {xLabels.map((l, i) => (
              <text
                key={i}
                x={l.x}
                y={H - 4}
                fill="#9E8E7E"
                fontSize="9"
                textAnchor="middle"
              >
                {l.label}
              </text>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}

export default RevenueChart;
