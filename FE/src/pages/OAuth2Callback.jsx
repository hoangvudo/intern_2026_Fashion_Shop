import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import authService from '../services/authService'
import { AuthStatusCard } from '../components/auth/PasswordResetLayout'

function OAuth2Callback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (!accessToken || !refreshToken) {
      toast.error('Đăng nhập thất bại')
      navigate('/login', { replace: true })
      return
    }

    const completeLogin = async () => {
      try {
        login({ accessToken, refreshToken, user: null })

        let user = null
        try {
          user = await authService.getCurrentUser()
        } catch {
          const refreshed = await authService.refreshToken(refreshToken)
          login({
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
            user: refreshed.user,
          })
          user = refreshed.user
        }

        if (user) {
          login({ accessToken, refreshToken, user })
        }

        toast.success('Đăng nhập thành công!')
        const role = user?.role?.toUpperCase?.() ?? ''
        navigate(role === 'ADMIN' ? '/admin' : '/', { replace: true })
      } catch {
        toast.error('Đăng nhập thất bại')
        navigate('/login', { replace: true })
      }
    }

    completeLogin()
  }, [searchParams, login, navigate])

  return (
    <AuthStatusCard
      status="loading"
      title="Đang đăng nhập"
      message="Đang xử lý tài khoản của bạn..."
    />
  )
}

export default OAuth2Callback
