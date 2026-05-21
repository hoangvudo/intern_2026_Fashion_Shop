import { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import authService from '../services/authService'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('pending') // pending, loading, success, error
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const hasCalled = useRef(false) 

  useEffect(() => {
    const token = searchParams.get('token')
    const urlEmail = searchParams.get('email')

    if (urlEmail) {
      setEmail(urlEmail)
    }

    if (!token) {
      // Chưa có token - chờ user click link từ email
      setStatus('pending')
      return
    }

    if (hasCalled.current) return
    hasCalled.current = true

    // Có token - xác thực ngay
    setStatus('loading')
    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token)
        setStatus('success')
        setMessage('Xác thực email thành công!')
      } catch (error) {
        setStatus('error')
        setMessage(error.message || 'Xác thực email thất bại')
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Vui lòng nhập email')
      return
    }

    setIsResending(true)
    try {
      const response = await fetch('http://localhost:8080/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast.success('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư.')
      } else {
        toast.error('Gửi lại email thất bại')
      }
    } catch (error) {
      toast.error('Lỗi: ' + error.message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
      >
        {status === 'pending' && (
          <>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Xác thực Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Email xác thực đã được gửi đến hộp thư của bạn. Vui lòng click vào link trong email để xác thực tài khoản.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isResending ? 'Đang gửi...' : 'Gửi lại Email'}
              </button>
              <Link
                to="/login"
                className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
              >
                Quay lại Đăng nhập
              </Link>
            </div>
          </>
        )}

        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang xác thực email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Xác thực thành công!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Xác thực thất bại
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Quay lại Đăng nhập
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default VerifyEmail