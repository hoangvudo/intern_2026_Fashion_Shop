const statusStyles = {
  SHIPPING:   'bg-[#897054] text-[#FFFBFF]',
  DELIVERED:  'bg-[#E8F5E9] text-[#2E7D32]',
  PENDING:    'bg-[#FFF3E0] text-[#EF6C00]',
  CANCELLED:  'bg-[#FFEBEE] text-[#C62828]',
  PROCESSING: 'bg-blue-50 text-blue-700',
  // lowercase fallbacks
  shipping:   'bg-[#897054] text-[#FFFBFF]',
  delivered:  'bg-[#E8F5E9] text-[#2E7D32]',
  pending:    'bg-[#FFF3E0] text-[#EF6C00]',
  cancelled:  'bg-[#FFEBEE] text-[#C62828]',
  processing: 'bg-blue-50 text-blue-700',
}

const statusLabel = {
  SHIPPING: 'Đang giao', DELIVERED: 'Hoàn tất',
  PENDING: 'Chờ xử lý', CANCELLED: 'Đã hủy', PROCESSING: 'Đang xử lý',
  shipping: 'Đang giao', delivered: 'Hoàn tất',
  pending: 'Chờ xử lý', cancelled: 'Đã hủy', processing: 'Đang xử lý',
}

function fmt(n) {
  if (!n) return '—'
  return Number(n).toLocaleString('vi-VN') + ' ₫'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN')
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()
}

function RecentOrdersTable({ data = [], loading }) {
  // Skeleton rows
  const skeletonRows = [...Array(4)].map((_, i) => (
    <tr key={i} className="border-t border-[#D1C4B9]">
      {[...Array(6)].map((__, j) => (
        <td key={j} className="px-6 py-4">
          <div className="h-4 animate-pulse rounded bg-[#F0EEE9]" style={{ width: j === 0 ? '80px' : '120px' }} />
        </td>
      ))}
    </tr>
  ))

  return (
    <div className="w-full border border-[#D1C4B9] bg-white">
      <div className="flex items-center justify-between border-b border-[#D1C4B9] p-8">
        <p className="font-beVietnamPro text-base font-semibold text-[#1B1C19]">
          Hoạt động đơn hàng gần đây
        </p>
        <div className="flex gap-4">
          <button type="button" className="border border-[#D1C4B9] p-2 hover:bg-[#F0EEE9]" aria-label="Lọc">
            <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
              <path d="M5.83333 10V8.33333H9.16667V10H5.83333ZM2.5 5.83333V4.16667H12.5V5.83333H2.5ZM0 1.66667V0H15V1.66667H0Z" fill="#1B1C19" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#D1C4B9] bg-[#F5F3EE]">
              {['MÃ ĐƠN HÀNG', 'KHÁCH HÀNG', 'TRẠNG THÁI', 'TỔNG TIỀN', 'NGÀY ĐẶT', ''].map((col) => (
                <th key={col} className="px-6 py-4 text-left font-beVietnamPro text-xs font-bold tracking-[0.05em] text-[#4E453D]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeletonRows
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center font-beVietnamPro text-sm text-[#9E8E7E]">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              data.map((order, index) => (
                <tr key={order.id ?? index} className={index > 0 ? 'border-t border-[#D1C4B9]' : ''}>
                  <td className="px-6 py-4 font-beVietnamPro text-sm font-bold text-[#6F583D]">
                    #{order.orderId ?? order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAE1DB] font-beVietnamPro text-xs font-bold text-[#1F1B17]">
                        {getInitials(order.customerName ?? order.name)}
                      </span>
                      <span className="font-beVietnamPro text-sm text-[#1B1C19]">
                        {order.customerName ?? order.name ?? '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-xl px-3 py-1 font-beVietnamPro text-xs font-bold ${statusStyles[order.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {statusLabel[order.status] ?? order.status ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-beVietnamPro text-sm text-[#1B1C19]">
                    {fmt(order.totalAmount ?? order.total)}
                  </td>
                  <td className="px-6 py-4 font-beVietnamPro text-sm text-[#4E453D]">
                    {formatDate(order.createdAt ?? order.date)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#9E8E7E] hover:text-[#1B1C19]">···</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center border-t border-[#D1C4B9] p-4">
        <button type="button" className="flex items-center gap-2 font-beVietnamPro text-sm text-[#6F583D] hover:underline">
          Xem tất cả đơn hàng
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#6F583D" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default RecentOrdersTable