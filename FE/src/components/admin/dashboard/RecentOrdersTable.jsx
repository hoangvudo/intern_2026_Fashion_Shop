const orders = [
  {
    id: '#ZY89231',
    initials: 'LH',
    name: 'Lê Hoàng Nam',
    avatarBg: 'bg-[#EAE1DB]',
    avatarText: 'text-[#1F1B17]',
    status: { label: 'Đang giao', variant: 'shipping' },
    total: '12.500.000 ₫',
    date: '12/10/2023',
  },
  {
    id: '#ZY89230',
    initials: 'TM',
    name: 'Trần Minh Thư',
    avatarBg: 'bg-[#EAE2D4]',
    avatarText: 'text-[#696459]',
    status: { label: 'Hoàn tất', variant: 'completed' },
    total: '8.900.000 ₫',
    date: '12/10/2023',
  },
  {
    id: '#ZY89229',
    initials: 'PV',
    name: 'Phạm Văn Đạt',
    avatarBg: 'bg-[#EAE1DB]',
    avatarText: 'text-[#1F1B17]',
    status: { label: 'Chờ thanh toán', variant: 'pending' },
    total: '24.150.000 ₫',
    date: '11/10/2023',
  },
  {
    id: '#ZY89228',
    initials: 'NK',
    name: 'Nguyễn Kim Oanh',
    avatarBg: 'bg-[#E4E2DD]',
    avatarText: 'text-[#1B1C19]',
    status: { label: 'Đã hủy', variant: 'cancelled' },
    total: '1.200.000 ₫',
    date: '11/10/2023',
  },
]

const statusStyles = {
  shipping: 'bg-[#897054] text-[#FFFBFF]',
  completed: 'bg-[#E8F5E9] text-[#2E7D32]',
  pending: 'bg-[#FFF3E0] text-[#EF6C00]',
  cancelled: 'bg-[#FFEBEE] text-[#C62828]',
}

function MoreIcon() {
  return (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
      <path
        d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14C0 13.45 0.195833 12.9792 0.5875 12.5875C0.979167 12.1958 1.45 12 2 12C2.55 12 3.02083 12.1958 3.4125 12.5875C3.80417 12.9792 4 13.45 4 14C4 14.55 3.80417 15.0208 3.4125 15.4125C3.02083 15.8042 2.55 16 2 16ZM2 10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6C2.55 6 3.02083 6.19583 3.4125 6.5875C3.80417 6.97917 4 7.45 4 8C4 8.55 3.80417 9.02083 3.4125 9.4125C3.02083 9.80417 2.55 10 2 10ZM2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4Z"
        fill="#4E453D"
      />
    </svg>
  )
}

function RecentOrdersTable() {
  return (
    <div className="w-full border border-[#D1C4B9] bg-white">
      <div className="flex items-center justify-between border-b border-[#D1C4B9] p-8">
        <p className="font-beVietnamPro text-base text-[#1B1C19]">
          Hoạt động đơn hàng gần đây
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            className="border border-[#D1C4B9] p-2"
            aria-label="Lọc"
          >
            <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
              <path
                d="M5.83333 10V8.33333H9.16667V10H5.83333ZM2.5 5.83333V4.16667H12.5V5.83333H2.5ZM0 1.66667V0H15V1.66667H0Z"
                fill="#1B1C19"
              />
            </svg>
          </button>
          <button
            type="button"
            className="border border-[#D1C4B9] p-2"
            aria-label="Xuất dữ liệu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M6.66667 10L2.5 5.83333L3.66667 4.625L5.83333 6.79167V0H7.5V6.79167L9.66667 4.625L10.8333 5.83333L6.66667 10ZM1.66667 13.3333C1.20833 13.3333 0.815972 13.1701 0.489583 12.8438C0.163194 12.5174 0 12.125 0 11.6667V9.16667H1.66667V11.6667H11.6667V9.16667H13.3333V11.6667C13.3333 12.125 13.1701 12.5174 12.8438 12.8438C12.5174 13.1701 12.125 13.3333 11.6667 13.3333H1.66667Z"
                fill="#1B1C19"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#D1C4B9] bg-[#F5F3EE]">
              {['MÃ ĐƠN HÀNG', 'KHÁCH HÀNG', 'TRẠNG THÁI', 'TỔNG TIỀN', 'NGÀY ĐẶT', ''].map(
                (col) => (
                  <th
                    key={col}
                    className="px-8 py-4 text-left font-beVietnamPro text-base font-bold tracking-[0.05em] text-[#4E453D]"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={index > 0 ? 'border-t border-[#D1C4B9]' : ''}
              >
                <td className="px-8 py-4 font-beVietnamPro text-base font-bold text-[#6F583D]">
                  {order.id}
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-beVietnamPro text-xs font-bold ${order.avatarBg} ${order.avatarText}`}
                    >
                      {order.initials}
                    </span>
                    <span className="font-beVietnamPro text-base text-[#1B1C19]">
                      {order.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span
                    className={`inline-block rounded-xl px-3 py-1 font-beVietnamPro text-xs font-bold ${statusStyles[order.status.variant]}`}
                  >
                    {order.status.label}
                  </span>
                </td>
                <td className="px-8 py-4 font-beVietnamPro text-base text-[#1B1C19]">
                  {order.total}
                </td>
                <td className="px-8 py-4 font-beVietnamPro text-base text-[#4E453D]">
                  {order.date}
                </td>
                <td className="px-8 py-4 text-right">
                  <MoreIcon />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center border-t border-[#D1C4B9] p-4">
        <button
          type="button"
          className="flex items-center gap-2 font-beVietnamPro text-base text-[#6F583D] hover:underline"
        >
          Xem tất cả đơn hàng
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z"
              fill="#6F583D"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default RecentOrdersTable
