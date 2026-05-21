import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

function OAuth2Callback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (accessToken && refreshToken) {
      // Store tokens - authStore.login expects an object
      login({ 
        accessToken, 
        refreshToken, 
        user: null // User info will be fetched later if needed
      })
      toast.success('Đăng nhập thành công!')
      navigate('/')
    } else {
      toast.error('Đăng nhập thất bại')
      navigate('/login')
    }
  }, [searchParams, login, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  )
}

export default OAuth2Callback
