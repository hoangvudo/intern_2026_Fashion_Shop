import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'
import authService from '../services/authService'
import registerHeroImage from '../assets/close_up_of_a_high_quality.png'
import { AuthLayout, AuthCard, AuthForm } from '../components/auth/AuthLayout'
import { AuthInput, AuthButton, AuthMotionBlock } from '../components/auth/AuthField'
import { motion, AnimatePresence } from 'framer-motion'
import { formItem } from '../components/auth/authMotion'

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Nhập họ tên'
    else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Tối thiểu 2 ký tự'
    if (!formData.email) newErrors.email = 'Nhập email'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ'
    if (!formData.phone.trim()) newErrors.phone = 'Nhập số điện thoại'
    else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) newErrors.phone = '10–11 chữ số'
    if (!formData.password) newErrors.password = 'Nhập mật khẩu'
    else if (formData.password.length < 8) newErrors.password = 'Tối thiểu 8 ký tự'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Nhập lại mật khẩu'
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Cần đồng ý điều khoản'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      await authService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
      })
      toast.success('Đăng ký thành công! Kiểm tra email để xác thực.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      heroImage={registerHeroImage}
      heroTag="THÀNH VIÊN"
      heroTitle="Gia nhập ZYRO"
      heroSubtitle="Tạo tài khoản để quản lý giỏ hàng và trải nghiệm mua sắm cao cấp."
      topRightLink={
        <Link
          to="/login"
          className="text-xs font-medium text-[#9B3F1E] hover:underline"
        >
          Đã có tài khoản →
        </Link>
      }
      footer="© 2024 ZYRO"
    >
      <AuthCard
        title="Đăng ký"
        subtitle="Điền thông tin bên dưới để tạo tài khoản mới."
      >
        <AuthForm onSubmit={handleSubmit}>
          <AuthInput
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            error={errors.fullName}
          />

          <AuthInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@email.com"
            error={errors.email}
          />

          <AuthInput
            label="Số điện thoại"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0901234567"
            error={errors.phone}
          />

          <AuthMotionBlock className="grid gap-4 sm:grid-cols-2">
            <AuthInput
              label="Mật khẩu"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Tối thiểu 8 ký tự"
              error={errors.password}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89726B]"
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              }
            />
            <AuthInput
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              error={errors.confirmPassword}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89726B]"
                  aria-label="Hiện/ẩn xác nhận mật khẩu"
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              }
            />
          </AuthMotionBlock>

          <motion.label
            variants={formItem}
            className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[#EDE4DF] bg-[#FFFCFB] px-3 py-2.5 transition-colors hover:border-[#DDC0B8]"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#DDC0B8] text-[#9B3F1E] focus:ring-[#9B3F1E]/20"
            />
            <span className="text-xs leading-relaxed text-[#6B5A52]">
              Tôi đồng ý với{' '}
              <span className="text-[#9B3F1E] underline">Điều khoản</span> và{' '}
              <span className="text-[#9B3F1E] underline">Chính sách bảo mật</span>
            </span>
          </motion.label>
          <AnimatePresence>
            {errors.agreeToTerms && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="-mt-2 text-xs text-red-600"
              >
                {errors.agreeToTerms}
              </motion.p>
            )}
          </AnimatePresence>

          <AuthButton type="submit" loading={isLoading} className="!mt-2" variant="primary">
            {isLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
          </AuthButton>

          <AuthMotionBlock>
            <p className="text-center text-sm text-[#6B5A52]">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-semibold text-[#9B3F1E] hover:underline">
                Đăng nhập
              </Link>
            </p>
          </AuthMotionBlock>
        </AuthForm>
      </AuthCard>
    </AuthLayout>
  )
}

export default Register
