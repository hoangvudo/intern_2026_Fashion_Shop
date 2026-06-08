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
 const response = await api.get(`/orders/my/${id}`)
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

/**
 * Tạo link thanh toán VNPay cho đơn hàng đã tạo
 * @param {number} orderId
 * @returns {Promise<{ paymentUrl, orderCode, amount, message }>}
 */
export const createVNPayUrl = async (orderId) => {
  const response = await api.post(`/orders/${orderId}/vnpay/create`)
  return response.data
}

/**
 * Lấy danh sách đơn hàng của user
 * @param {string} [status] - filter: PENDING | CONFIRMED | SHIPPING | COMPLETED | CANCELLED
 */
export const getMyOrders = async (status) => {
  const params = status ? { status } : {}
  const response = await api.get('/orders/my', { params })
  return response.data
}

/**
 * Lấy chi tiết đơn hàng của user (chỉ đơn của chính mình)
 * @param {number} id
 */
export const getMyOrderById = async (id) => {
  const response = await api.get(`/orders/my/${id}`)
  return response.data
}
/**
 * Huỷ đơn hàng
 * @param {number} orderId
 * @param {string} [reason]
 */
export const cancelOrder = async (orderId, reason) => {
  const response = await api.patch(`/orders/my/${orderId}/cancel`, { reason })
  return response.data
}

/**
 * Tạo yêu cầu đổi/trả hàng
 * @param {{ orderId, type, reason, imageUrls }} data
 */
export const createReturnRequest = async (data) => {
  const response = await api.post('/orders/return-requests', data)
  return response.data
}