import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import useCheckoutStore from '../store/checkoutStore'
import { getMyOrderById } from '../services/orderService'

export default function VNPayResult() {
  const [searchParams]  = useSearchParams()
  const navigate        = useNavigate()
  const setOrder        = useCheckoutStore(state => state.setOrder)
  const [status, setStatus] = useState('loading') // loading | success | failed
  const [orderCode, setOrderCode] = useState('')

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode')
    const txnRef       = searchParams.get('vnp_TxnRef') ?? ''
    const success      = responseCode === '00'

    setOrderCode(txnRef)

    if (!success) {
      setStatus('failed')
      return
    }

    // Thành công → fetch lại order rồi redirect /order-success
    const orderId = sessionStorage.getItem('vnpay_order_id')
    if (orderId) {
      getMyOrderById(orderId)
        .then(order => {
          setOrder(order)
          sessionStorage.removeItem('vnpay_order_id')
          navigate('/order-success', { replace: true })
        })
        .catch(() => {
          sessionStorage.removeItem('vnpay_order_id')
          setStatus('success') // fallback: hiện success tại đây
        })
    } else {
      setStatus('success')
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <TopNav />

      <main className="flex flex-col items-center justify-center py-28 px-6 text-center">
        {status === 'loading' && (
          <>
            <FiLoader className="mb-6 h-16 w-16 animate-spin text-gray-300" />
            <p className="text-gray-400">Đang xác nhận thanh toán...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-green-200 bg-green-50">
              <FiCheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="mb-3 text-3xl font-bold">Thanh toán thành công!</h1>
            {orderCode && (
              <p className="mb-2 text-base text-gray-500">
                Mã đơn hàng: <span className="font-bold text-[#BE123C]">#{orderCode}</span>
              </p>
            )}
            <p className="mb-8 text-sm text-gray-400 max-w-sm">
              Chúng tôi đã ghi nhận thanh toán và sẽ xử lý đơn hàng sớm nhất.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/my-orders"
                className="rounded border border-[#1A1B22] px-8 py-3 text-sm font-medium hover:bg-[#1A1B22] hover:text-white transition dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                Xem đơn hàng
              </Link>
              <Link to="/"
                className="rounded bg-[#BE123C] px-8 py-3 text-sm font-medium text-white hover:bg-[#9F0F32] transition">
                Tiếp tục mua sắm
              </Link>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
              <FiXCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="mb-3 text-3xl font-bold">Thanh toán thất bại</h1>
            <p className="mb-2 text-sm text-gray-500 max-w-sm">
              Thanh toán thất bại hoặc bị hủy.
            </p>
            {orderCode && (
              <p className="mb-6 text-sm text-gray-400">
                Mã đơn hàng: <span className="font-medium">#{orderCode}</span> — đơn hàng vẫn được giữ, bạn có thể thử lại.
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/my-orders"
                className="rounded border border-[#1A1B22] px-8 py-3 text-sm font-medium hover:bg-[#1A1B22] hover:text-white transition dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                Xem đơn hàng
              </Link>
              <button onClick={() => navigate(-1)}
                className="rounded bg-gray-800 px-8 py-3 text-sm font-medium text-white hover:bg-gray-700 transition">
                Quay lại
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}