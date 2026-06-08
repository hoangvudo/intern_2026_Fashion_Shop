import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import authService from '../services/authService'
import loginHeroImage from '../assets/high_end_luxury_fashion.png'
import { AuthLayout, AuthCard, AuthForm } from '../components/auth/AuthLayout'
import { AuthMotionBlock } from '../components/auth/AuthField'
import { AuthInput, AuthButton, AuthDivider } from '../components/auth/AuthField'
import { GoogleIcon, FacebookIcon } from '../components/auth/AuthIcons'
import { redirectToFacebookOAuth, redirectToGoogleOAuth } from '../components/auth/oauth'

function Login() {
  const navigate = useNavigate()
  const { login: storeLogin } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Nhập email'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ'
    if (!formData.password) newErrors.password = 'Nhập mật khẩu'
    else if (formData.password.length < 6) newErrors.password = 'Tối thiểu 6 ký tự'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const response = await authService.login(formData.email, formData.password)
      storeLogin({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      })
      toast.success('Đăng nhập thành công!')
      const role = response.user?.role?.toUpperCase?.() ?? ''
      navigate(role === 'ADMIN' ? '/admin' : '/')
    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      heroImage={loginHeroImage}
      heroTag="BỘ SƯU TẬP"
      heroTitle="Tinh hoa thời trang hiện đại"
      heroSubtitle="Khám phá bộ sưu tập được tuyển chọn dành riêng cho bạn."
      topRightLink={
        <Link
          to="/"
          className="text-xs font-medium text-[#6B5A52] transition-colors hover:text-[#9B3F1E]"
        >
          ← Về cửa hàng
        </Link>
      }
      footer="© 2024 ZYRO"
    >
      <AuthCard
        title="Đăng nhập"
        subtitle="Chào mừng trở lại. Đăng nhập để tiếp tục mua sắm."
      >
        <AuthForm onSubmit={handleSubmit}>
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
            label="Mật khẩu"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            hint={
              <Link
                to="/forgot-password"
                className="text-xs text-[#9B3F1E] hover:underline"
              >
                Quên mật khẩu?
              </Link>
            }
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

          <AuthButton
            type="submit"
            loading={isLoading}
            className="!mt-5"
            variant="primary"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </AuthButton>

          <AuthDivider />

          <AuthMotionBlock className="grid grid-cols-2 gap-3">
            <AuthButton type="button" variant="outline" onClick={redirectToGoogleOAuth}>
              <GoogleIcon className="h-4 w-4" />
              Google
            </AuthButton>
            <AuthButton type="button" variant="outline" onClick={redirectToFacebookOAuth}>
              <FacebookIcon className="h-4 w-4" />
              Facebook
            </AuthButton>
          </AuthMotionBlock>

          <AuthMotionBlock>
            <p className="pt-2 text-center text-sm text-[#6B5A52]">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-semibold text-[#9B3F1E] hover:underline">
                Đăng ký
              </Link>
            </p>
          </AuthMotionBlock>
        </AuthForm>
      </AuthCard>
    </AuthLayout>
  )
}

export default Login
