const yLabels = ['250M', '150M', '50M', '0']

function RevenueChart() {
  return (
    <div className="border border-[#D1C4B9] bg-white p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-beVietnamPro text-base text-[#1B1C19]">
            Biểu đồ tăng trưởng doanh thu
          </p>
          <p className="font-beVietnamPro text-base text-[#4E453D] opacity-70">
            30 ngày qua (Đơn vị: Triệu VNĐ)
          </p>
        </div>
        <div className="flex items-center gap-2 border border-[#D1C4B9] px-4 py-2">
          <span className="font-beVietnamPro text-base text-[#1B1C19]">Tháng này</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M7.2 9.6L12 14.4L16.8 9.6"
              stroke="#6B7280"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="relative flex h-64">
        <div className="mr-2 flex h-full flex-col justify-between py-2 opacity-50">
          {yLabels.map((label) => (
            <span
              key={label}
              className="font-beVietnamPro text-[10px] font-bold leading-[15px] text-[#4E453D]"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          {[88, 115, 141, 168].map((top) => (
            <div
              key={top}
              className="absolute left-0 right-0 border-t border-[#F0EEE9]"
              style={{ top: `${(top / 256) * 100}%` }}
            />
          ))}
          <svg
            viewBox="0 0 534 102"
            className="absolute bottom-8 left-0 right-0 h-[101px] w-full opacity-10"
            preserveAspectRatio="none"
          >
            <path
              d="M0 85.44L53.4 64.08L106.8 74.76L160.2 48.06L213.6 58.74L267 32.04L320.4 42.72L373.8 16.02L427.2 26.7L480.6 0L534 10.68V101.46H0V85.44"
              fill="url(#revenueGradient)"
            />
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#6F583D" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
          <svg
            viewBox="0 0 535 88"
            className="absolute bottom-8 left-0 right-0 h-[85px] w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M1.07 86.51L54.47 65.15L107.87 75.83L161.27 49.13L214.67 59.81L268.07 33.11L321.47 43.79L374.87 17.09L428.27 27.77L481.67 1.07L535.07 11.75"
              stroke="#6F583D"
              strokeWidth="2.136"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart
