import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useAuthStore from '../store/authStore'

function OAuth2Callback() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('accessToken')
      const refreshToken = params.get('refreshToken')

      if (!accessToken) {
        navigate('/login')
        return
      }

      try {
        // Lấy user info từ API dùng accessToken
        const userResponse = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        const user = userResponse.data

        // Lưu vào store
        login({ user, accessToken, refreshToken })
        navigate('/')
      } catch (error) {
        console.error('OAuth2Callback error:', error)
        navigate('/login')
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Đang đăng nhập...</p>
    </div>
  )
}

export default OAuth2Callback