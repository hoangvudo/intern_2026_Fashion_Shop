import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import authService from '../services/authService'
import { AuthStatusCard } from '../components/auth/PasswordResetLayout'
import { AuthButton } from '../components/auth/AuthField'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('Token không hợp lệ')
      return
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token)
        setStatus('success')
        setMessage('Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay.')
      } catch (error) {
        setStatus('error')
        setMessage(error.message || 'Xác thực email thất bại')
      }
    }

    verify()
  }, [searchParams])

  return (
    <AuthStatusCard
      status={status}
      title={
        status === 'loading'
          ? 'Đang xác thực...'
          : status === 'success'
            ? 'Xác thực thành công'
            : 'Xác thực thất bại'
      }
      message={status === 'loading' ? 'Vui lòng đợi trong giây lát.' : message}
    >
      {status !== 'loading' && (
        <Link to="/login" className="block w-full">
          <AuthButton type="button" variant="primary" className="!tracking-[0.12em] uppercase">
            Đăng nhập
          </AuthButton>
        </Link>
      )}
    </AuthStatusCard>
  )
}

export default VerifyEmail
