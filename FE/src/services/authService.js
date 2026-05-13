import api from './api'

const authService = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Đăng nhập thất bại',
        status: error.response?.status,
        data: error.response?.data
      }
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      console.log('Calling register API with:', userData)
      const response = await api.post('/auth/register', userData)
      console.log('Register response:', response.data)
      return response.data
    } catch (error) {
      console.error('Register API error:', error)
      console.error('Error response:', error.response)
      
      // Extract detailed error message
      let errorMessage = 'Đăng ký thất bại'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data)
      } else if (error.message) {
        errorMessage = error.message
      }
      
      throw {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      }
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh', {
        refreshToken
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Làm mới token thất bại',
        status: error.response?.status
      }
    }
  },

  // Logout
  logout: async (refreshToken) => {
    try {
      await api.post('/auth/logout', {
        refreshToken
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  // Check email exists
  checkEmail: async (email) => {
    try {
      const response = await api.get('/auth/check-email', {
        params: { email }
      })
      // Backend returns { exists: true/false }
      // Frontend needs { available: true/false }
      return { available: !response.data.exists }
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Kiểm tra email thất bại',
        status: error.response?.status
      }
    }
  },

  // Verify email with token
  verifyEmail: async (token) => {
    try {
      const response = await api.get('/auth/verify', {
        params: { token }
      })
      return response.data
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Xác thực email thất bại',
        status: error.response?.status
      }
    }
  },
}

export default authService
