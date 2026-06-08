import { create } from 'zustand'

/**
 * Lưu thông tin đơn hàng vừa đặt thành công
 * để trang OrderSuccess hiển thị mà không cần gọi lại API.
 */
const useCheckoutStore = create((set) => ({
  /** OrderResponse từ backend sau khi placeOrder thành công */
  order: null,

  setOrder: (order) => set({ order }),

  clearOrder: () => set({ order: null }),
}))

export default useCheckoutStore