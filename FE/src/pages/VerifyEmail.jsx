import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import authService from '../services/authService'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setMessage('Token xác thực không hợp lệ')
      return
    }

    // Call verify API
    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token)
        setStatus('success')
        setMessage('Xác thực email thành công!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error) {
        setStatus('error')
        setMessage(error.message || 'Xác thực email thất bại')
      }
    }

    verifyToken()
  }, [searchParams, navigate])

  return (
    <main className="flex-grow flex items-center justify-center pt-xl pb-xl px-md mt-16">
      <div className="w-full max-w-[500px] bg-white rounded-2xl p-xl shadow-sm text-center">
        {/* Icon */}
        <div className="mb-lg">
          {status === 'verifying' && (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-md">
              <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
          
          {status === 'success' && (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-md">
              <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-md">
              <span className="material-symbols-outlined text-red-600 text-5xl">error</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
          {status === 'verifying' && 'Đang xác thực email...'}
          {status === 'success' && 'Xác thực thành công!'}
          {status === 'error' && 'Xác thực thất bại'}
        </h1>

        {/* Message */}
        <p className="font-body-md text-on-surface-variant mb-lg">
          {message}
        </p>

        {/* Actions */}
        {status === 'success' && (
          <div className="space-y-sm">
            <p className="font-body-sm text-on-surface-variant">
              Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây...
            </p>
            <Link
              to="/login"
              className="inline-block bg-primary text-on-primary px-xl py-sm rounded-xl font-headline-md hover:opacity-90 transition-opacity"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-sm">
            <Link
              to="/register"
              className="inline-block bg-primary text-on-primary px-xl py-sm rounded-xl font-headline-md hover:opacity-90 transition-opacity"
            >
              Đăng ký lại
            </Link>
            <p className="font-body-sm text-on-surface-variant">
              hoặc{' '}
              <Link to="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        )}

        {status === 'verifying' && (
          <div className="flex items-center justify-center gap-xs">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </main>
  )
}

export default VerifyEmail
