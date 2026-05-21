import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import authService from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const { login: storeLogin } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email không được để trống'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      const response = await authService.login(formData.email, formData.password)
      
      // Store tokens and user info - authStore.login expects an object
      storeLogin({ 
        accessToken: response.accessToken, 
        refreshToken: response.refreshToken, 
        user: response.user 
      })
      
      toast.success('Đăng nhập thành công!')
      navigate('/')
    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      '?client_id=1026429745383-sl1pr3kvfhtvk7fan8627ig45m2v0etf.apps.googleusercontent.com' +
      '&redirect_uri=http://localhost:8080/api/auth/oauth2/google/callback' +
      '&response_type=code' +
      '&scope=openid email profile'
  }

  const handleFacebookLogin = () => {
    window.location.href =
      'https://www.facebook.com/v18.0/dialog/oauth' +
      '?client_id=1766654577638082' +
      '&redirect_uri=http://localhost:8080/api/auth/oauth2/facebook/callback' +
      '&response_type=code' +
      '&scope=public_profile,email'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12 px-4">
      {/* Back to Home Button */}
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
        >
          <FiArrowLeft size={20} />
          <span className="font-medium">Trang chủ</span>
        </motion.button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mb-4 mx-auto"
            >
              <span className="text-white dark:text-black font-bold text-3xl">Z</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Chào mừng trở lại
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Đăng nhập để tiếp tục mua sắm
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FcGoogle size={24} />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Đăng nhập với Google
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FaFacebook size={24} className="text-blue-600" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Đăng nhập với Facebook
              </span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                Hoặc đăng nhập với email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                    errors.email
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                    errors.password
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <FiArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="font-semibold text-black dark:text-white hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
