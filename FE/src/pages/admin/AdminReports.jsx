import { useState, useEffect } from "react";
import { getAdminReports } from "../../services/adminService";
import { exportElementToPDF } from "../../utils/pdfExport";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";

const fmtFull = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";
const fmtNumber = (n) => Number(n || 0).toLocaleString("vi-VN");

function normalizeMonthlyRevenue(monthlyRevenue) {
  const rows = Array.isArray(monthlyRevenue) ? monthlyRevenue : [];

  // Backend dùng month: "T1".."T12", nhưng có thể thiếu.
  const byMonth = new Map(
    rows
      .filter((r) => r && r.month)
      .map((r) => {
        const m = String(r.month).toUpperCase().startsWith("T")
          ? Number(String(r.month).slice(1))
          : Number(String(r.month));
        return [m, r];
      }),
  );

  return Array.from({ length: 12 }, (_, i) => {
    const monthIndex = i + 1;
    const row = byMonth.get(monthIndex);

    const actual = Number(row?.actual ?? 0);
    const target = Number(row?.target ?? 0);

    return {
      month: `T${monthIndex}`,
      actual,
      target,
    };
  });
}

export default function AdminReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAdminReports()
      .then((data) => {
        setReportData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading report data:", err);
        setError(
          "Không thể tải dữ liệu báo cáo. Vui lòng kiểm tra lại kết nối.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center font-beVietnamPro">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D1C4B9] border-t-[#6F583D]" />
          <p className="text-[#6F583D] font-medium text-lg">
            Đang tổng hợp dữ liệu báo cáo...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[600px] w-full flex-col items-center justify-center gap-6 font-beVietnamPro">
        <div className="p-4 rounded-full bg-red-50">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-red-600 font-bold text-xl mb-2">{error}</p>
          <p className="text-gray-500">
            Chúng tôi không thể lấy dữ liệu từ máy chủ lúc này.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#6F583D] text-white rounded-lg font-semibold hover:bg-[#5A4732] transition-all shadow-lg active:scale-95"
        >
          Thử lại ngay
        </button>
      </div>
    );
  }

  const normalizedMonthlyRevenue = normalizeMonthlyRevenue(
    reportData?.monthlyRevenue || [],
  );

  return (
    <div className="flex flex-col items-start bg-[#FBF9F4] min-w-full min-h-screen relative font-beVietnamPro pb-20">
      <style>{`
        @keyframes chartDraw { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes growWidth { from { width: 0; } }
        .animate-chart-draw { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: chartDraw 2s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-grow-width { animation: growWidth 1s ease-out forwards; }
      `}</style>

      <div className="flex flex-col justify-center items-start w-full">
        <div className="flex pt-6 pr-6 pb-[65px] pl-6 flex-col items-start w-full max-w-[1200px] mx-auto">
          <div className="flex flex-col items-start gap-8 w-full animate-fade-in-up">
            {/* 1. Header Section */}
            <div className="flex justify-between items-end w-full">
              <div className="flex flex-col items-start gap-2 w-fit">
                <p className="text-[#6F583D] text-sm font-bold leading-5 w-fit tracking-[0.1em] uppercase">
                  THỐNG KÊ CHI TIẾT
                </p>
                <h1 className="text-[#1B1C19] text-[32px] font-semibold leading-10 w-fit tracking-[-0.01em]">
                  Báo cáo &amp; Phân tích
                </h1>
              </div>

              <div className="flex items-start gap-3 w-fit">
                <div className="flex py-2 px-4 items-center gap-2 rounded border border-[#80756B] bg-[#FBF9F4] w-fit">
                  <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2V20M2 18H16V18V18V8H2V18V18V18V18M2 6H16V4V4V4H2V4V4V6V6M2 6V4V4V4V4V4V4V6V6V6"
                      fill="#1B1C19"
                    />
                  </svg>
                  <p className="text-[#1B1C19] text-sm font-semibold leading-5 w-fit tracking-[0.01em]">
                    {new Date(
                      new Date().getFullYear(),
                      0,
                      1,
                    ).toLocaleDateString("vi-VN")}
                    {" - "}
                    {new Date(
                      new Date().getFullYear(),
                      11,
                      31,
                    ).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("admin-report-chart");
                    if (!el) return;
                    exportElementToPDF({
                      element: el,
                      fileName: `admin-report-${new Date().toISOString().slice(0, 10)}.pdf`,
                    });
                  }}
                  className="flex py-[9px] px-6 items-center gap-2 rounded bg-[#6F583D] w-fit cursor-pointer hover:bg-[#5A4732] transition-colors shadow-sm"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12V12M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V11H2V14V14V14H14V14V14V11H16V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2V16"
                      fill="white"
                    />
                  </svg>
                  <p className="text-[#FFF] text-sm font-semibold leading-5 w-fit tracking-[0.01em]">
                    Xuất báo cáo (PDF)
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <StatCard
                label="Tổng doanh thu"
                value={fmtFull(reportData?.totalRevenue)}
                growth={reportData?.revenueGrowth}
                icon={<RevenueIcon />}
              />
              <StatCard
                label="Tổng đơn hàng"
                value={fmtNumber(reportData?.totalOrders)}
                growth={reportData?.orderGrowth}
                icon={<OrdersIcon />}
              />
              <StatCard
                label="Tỷ lệ chuyển đổi"
                value={`${reportData?.conversionRate ?? 0}%`}
                growth={reportData?.conversionGrowth}
                icon={<ConversionIcon />}
                isNegative={(reportData?.conversionGrowth || 0) < 0}
              />
              <StatCard
                label="Khách hàng mới"
                value={fmtNumber(reportData?.newCustomers)}
                growth={reportData?.customerGrowth}
                icon={<CustomersIcon />}
              />
            </div>

            {/* 3. Main Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              <div
                id="admin-report-chart"
                className="lg:col-span-2 flex flex-col p-8 gap-10 rounded-lg border border-[#D1C4B9] bg-white shadow-sm"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#1B1C19] text-2xl font-bold leading-8">
                      Doanh thu theo tháng
                    </p>
                    <p className="text-[#4E453D] text-sm font-medium leading-5 tracking-[0.01em]">
                      Thống kê doanh thu thực tế so với mục tiêu năm{" "}
                      {new Date().getFullYear()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <LegendItem color="#6F583D" label="Thực tế" />
                    <LegendItem color="#D1C4B9" label="Mục tiêu" />
                  </div>
                </div>

                <div className="h-[300px] w-full">
                  <RevenueChart
                    data={normalizedMonthlyRevenue.map((d) => ({
                      date: d.month,
                      revenue: Number(d.actual),
                    }))}
                  />
                </div>
              </div>

              {/* Favorite Categories Progress */}
              <div className="flex flex-col p-8 gap-6 rounded-lg border border-[#D1C4B9] bg-white shadow-sm">
                <div>
                  <p className="text-[#1B1C19] text-xl font-bold">
                    Danh mục yêu thích
                  </p>
                  <p className="text-[#4E453D] text-sm font-medium tracking-[0.01em]">
                    Tỷ lệ tăng trưởng theo ngành hàng
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  {(reportData?.categoryStats || []).map((cat, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-[#1B1C19]">
                          {cat?.name || "Khác"}
                        </span>
                        <span className="text-[#6F583D]">
                          {(cat?.percentage || 0).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#F0EEE9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6F583D] transition-all duration-700 animate-grow-width"
                          style={{ width: `${cat?.percentage || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto p-4 bg-[#F8F6F4] rounded border border-[#E8E0D8]">
                  <p className="text-[10px] font-bold text-[#6F583D] uppercase tracking-widest mb-1">
                    Gợi ý tối ưu
                  </p>
                  <p className="text-xs text-[#4E453D] leading-relaxed">
                    Nhu cầu đầm dự tiệc tăng cao nhất vào mùa cưới cuối năm. Cân
                    nhắc tăng tồn kho 15%.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Reviews (loại bỏ phần funnel theo yêu cầu) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <div className="flex flex-col p-8 gap-6 rounded-lg border border-[#D1C4B9] bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="text-[#1B1C19] text-xl font-bold">
                    Mức độ hài lòng khách hàng
                  </p>
                  <div className="flex items-center gap-1 px-3 py-1 bg-[#F8F6F4] rounded-full">
                    <span className="text-[#1B1C19] font-bold text-lg">
                      ★ {(reportData?.averageRating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {(reportData?.recentReviews || []).map((rev, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#EAE2D4] flex-shrink-0 overflow-hidden border border-[#D1C4B9]">
                        <img
                          src={`https://i.pravatar.cc/150?u=${encodeURIComponent(rev?.customerName || "Khách")}`}
                          alt={rev?.customerName || "Khách"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-[#1B1C19]">
                            {rev?.customerName || "Khách"}
                          </span>
                          <span className="text-[10px] text-[#9E8E7E] font-medium">
                            {rev?.timeAgo || "Vừa xong"}
                          </span>
                        </div>
                        <p className="text-xs text-[#4E453D] leading-relaxed italic line-clamp-2">
                          {rev?.content
                            ? `“${rev.content}”`
                            : "Không có nội dung"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Footer */}

            <div className="flex justify-between items-center w-full pt-8 border-t border-[#D1C4B9] text-[10px] text-[#9E8E7E] font-medium">
              <p>
                © 2024 ZYRO Couture Admin System. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex gap-6">
                <button className="hover:text-[#6F583D] transition-colors">
                  Chính sách bảo mật
                </button>
                <button className="hover:text-[#6F583D] transition-colors">
                  Điều khoản dịch vụ
                </button>
                <button className="hover:text-[#6F583D] transition-colors">
                  Trợ giúp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  growth,
  icon,
  isNegative = false,
  className = "",
}) {
  const hasGrowth = growth !== null && growth !== undefined;
  const growthValue = hasGrowth ? Number(growth).toFixed(1) : "0.0";
  const isActuallyNegative = isNegative || (hasGrowth && growth < 0);

  const growthColor = isActuallyNegative ? "text-[#BA1A1A]" : "text-[#2E7D32]";
  const growthIconColor = isActuallyNegative ? "#BA1A1A" : "#2E7D32";

  return (
    <div
      className={`flex p-6 flex-col items-start gap-1 rounded-lg border border-[#D1C4B9] bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      <div className="flex justify-between items-start w-full">
        <div className="p-3 bg-[#EAE2D4] rounded transform transition-transform hover:rotate-12">
          {icon}
        </div>
        <div className="flex items-center gap-1">
          <p className={`text-xs font-bold leading-4 ${growthColor}`}>
            {hasGrowth && growth > 0 ? "+" : ""}
            {growthValue}%
          </p>
          <svg
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            className={`transition-transform duration-500 ${isActuallyNegative ? "rotate-180" : ""}`}
          >
            <path
              d="M0.816667 7L0 6.18333L4.31667 1.8375L6.65 4.17083L9.68333 1.16667H8.16667V0H11.6667V3.5H10.5V1.98333L6.65 5.83333L4.31667 3.5L0.816667 7V7"
              fill={growthIconColor}
            />
          </svg>
        </div>
      </div>
      <p className="mt-3 text-[#4E453D] text-sm font-medium leading-5 tracking-[0.01em]">
        {label}
      </p>
      <p className="text-[#1B1C19] text-2xl font-bold leading-8">{value}</p>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <p className="text-[#4E453D] text-xs font-medium leading-4">{label}</p>
    </div>
  );
}

const RevenueIcon = () => (
  <svg
    width="22"
    height="12"
    viewBox="0 0 22 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9V9M6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6V12M8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.1958 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10V10M19 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16M6 10V10V10V10V2Z"
      fill="#6F583D"
    />
  </svg>
);

const OrdersIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18ZM7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L21.16 4.96L19.42 4H19.41L18.31 6L15.55 11H8.53L8.4 10.73L6.16 6L5.21 4L4.27 2H1V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.29 15 7.17 14.89 7.17 14.75Z"
      fill="#6F583D"
    />
  </svg>
);

const ConversionIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"
      fill="#6F583D"
    />
  </svg>
);

const CustomersIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      fill="#6F583D"
    />
  </svg>
);
