import api from './api'

/**
 * Đặt hàng
 * @param {Object} orderData - OrderRequest payload
 * @returns {Promise<OrderResponse>}
 */
export const placeOrder = async (orderData) => {
  const response = await api.post('/orders', orderData)
  return response.data
}

/**
 * Lấy chi tiết đơn hàng theo ID
 * @param {number} id
 */
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

/**
 * Validate coupon trước khi checkout
 * @param {string} code   - mã coupon
 * @param {number} subtotal - tổng tiền sản phẩm
 * @returns {{ valid, code, discountPercent, discountAmount, message }}
 */
export const validateCoupon = async (code, subtotal) => {
  const response = await api.post('/orders/validate-coupon', { code, subtotal })
  return response.data
}