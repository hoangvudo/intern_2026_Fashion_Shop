import axios from 'axios'
import useAuthStore from '../store/authStore'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// ✅ SỬA: Lấy token từ Zustand store thay vì localStorage('token')
instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ✅ THÊM: Interceptor xử lý refresh token tự động khi 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        if (!refreshToken) throw new Error('No refresh token')

        const res = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken })
        const { accessToken, refreshToken: newRefreshToken, user } = res.data
        useAuthStore.getState().login({ user, accessToken, refreshToken: newRefreshToken })
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return instance(originalRequest)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default instance