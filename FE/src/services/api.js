import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable cookies for httpOnly
})

// Request interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store (memory)
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor để xử lý refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = useAuthStore.getState().refreshToken
        
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        // Gọi API refresh token
        const response = await axios.post('/api/auth/refresh', {
          refreshToken
        })

        // Backend returns both accessToken, refreshToken, and user (rotation)
        const { accessToken, refreshToken: newRefreshToken, user } = response.data

        // Update tokens and user in Zustand store
        useAuthStore.getState().login({
          user,
          accessToken,
          refreshToken: newRefreshToken
        })

        // Retry request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Nếu refresh token thất bại, logout và chuyển về trang login
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
