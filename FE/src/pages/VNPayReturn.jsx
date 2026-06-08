/**
 * VNPayReturn.jsx
 * Trang trung gian nhận redirect từ VNPay về FE.
 *
 * Flow:
 *  VNPay → localhost:8080/api/orders/vnpay/return  (BE cập nhật DB)
 *       → redirect → localhost:3000/vnpay/return?... (trang này)
 *       → nếu success → /order-success
 *       → nếu fail    → /checkout?error=payment_failed
 *
 * Route cần thêm vào App.jsx / router:
 *   <Route path="/vnpay/return" element={<VNPayReturn />} />
 */
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useCheckoutStore from '../store/checkoutStore'
import { getMyOrderById } from '../services/orderService'

export default function VNPayReturn() {
  const navigate      = useNavigate()
  const [params]      = useSearchParams()
  const setOrder      = useCheckoutStore(state => state.setOrder)

  useEffect(() => {
    const responseCode = params.get('vnp_ResponseCode')
    const orderCode    = params.get('vnp_TxnRef')      // = orderCode như YRO788018
    const success      = responseCode === '00'

    if (!success) {
      navigate('/checkout?error=payment_failed', { replace: true })
      return
    }

    // Lấy orderId từ sessionStorage (lưu lúc tạo link VNPay)
    const orderId = sessionStorage.getItem('vnpay_order_id')

    if (orderId) {
      getMyOrderById(orderId)
        .then(order => {
          setOrder(order)
          sessionStorage.removeItem('vnpay_order_id')
          navigate('/order-success', { replace: true })
        })
        .catch(() => {
          // Nếu không fetch được → vẫn vào order-success với fallback
          sessionStorage.removeItem('vnpay_order_id')
          navigate('/order-success', { replace: true })
        })
    } else {
      navigate('/order-success', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4 text-[#1A1B22] dark:text-white">
        <svg className="animate-spin h-10 w-10 text-[#BE123C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-base font-medium">Đang xác nhận thanh toán...</p>
      </div>
    </div>
  )
}