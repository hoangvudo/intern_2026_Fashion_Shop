import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiArrowRight, FiCheck, FiX } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import toast from 'react-hot-toast'
import authService from '../services/authService'

function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const nextValue = type === 'checkbox' ? checked : value
    setFormData((prev) => ({ ...prev, [name]: nextValue }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    
    const score = Object.values(checks).filter(Boolean).length
    setPasswordStrength({ score, checks })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email không được để trống'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)'
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Mật khẩu chưa đủ mạnh'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản và điều kiện'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      const userData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
      }
      
      await authService.register(userData)
      
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = () => {
    window.location.href =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      '?client_id=1026429745383-sl1pr3kvfhtvk7fan8627ig45m2v0etf.apps.googleusercontent.com' +
      '&redirect_uri=http://localhost:8080/api/auth/oauth2/google/callback' +
      '&response_type=code' +
      '&scope=openid email profile'
  }

  const handleFacebookRegister = () => {
    window.location.href =
      'https://www.facebook.com/v18.0/dialog/oauth' +
      '?client_id=1766654577638082' +
      '&redirect_uri=http://localhost:8080/api/auth/oauth2/facebook/callback' +
      '&response_type=code' +
      '&scope=public_profile,email'
  }

  const getStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500'
    if (passwordStrength.score === 3) return 'bg-yellow-500'
    if (passwordStrength.score === 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Yếu'
    if (passwordStrength.score === 3) return 'Trung bình'
    if (passwordStrength.score === 4) return 'Mạnh'
    return 'Rất mạnh'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12 px-4">
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
              Tạo tài khoản
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Đăng ký để bắt đầu mua sắm
            </p>
          </div>

          {/* Social Register */}
          <div className="space-y-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FcGoogle size={24} />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Đăng ký với Google
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFacebookRegister}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FaFacebook size={24} className="text-blue-600" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Đăng ký với Facebook
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
                Hoặc đăng ký với email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                    errors.fullName
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.fullName}
                </motion.p>
              )}
            </div>

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

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại (tùy chọn)
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                    errors.phone
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                  placeholder="0123456789"
                />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.phone}
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
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        className={`h-full ${getStrengthColor()} transition-all`}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {getStrengthText()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.checks.length ? <FiCheck size={14} /> : <FiX size={14} />}
                      <span>8+ ký tự</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.checks.uppercase ? <FiCheck size={14} /> : <FiX size={14} />}
                      <span>Chữ hoa</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.checks.lowercase ? <FiCheck size={14} /> : <FiX size={14} />}
                      <span>Chữ thường</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.checks.number ? <FiCheck size={14} /> : <FiX size={14} />}
                      <span>Số</span>
                    </div>
                  </div>
                </div>
              )}
              
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all ${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Terms */}
            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                  Tôi đồng ý với{' '}
                  <a href="#" className="font-medium text-black dark:text-white hover:underline">
                    điều khoản sử dụng
                  </a>{' '}
                  và{' '}
                  <a href="#" className="font-medium text-black dark:text-white hover:underline">
                    chính sách bảo mật
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.agreeToTerms}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang đăng ký...
                </>
              ) : (
                <>
                  Đăng ký
                  <FiArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="font-semibold text-black dark:text-white hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
