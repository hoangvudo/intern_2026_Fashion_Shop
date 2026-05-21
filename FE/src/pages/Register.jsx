import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { registerSchema } from '../schemas/registerSchema'
import authService from '../services/authService'
import { calculatePasswordStrength } from '../utils/passwordStrength'

function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', percentage: 0 })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange'
  })

  const password = watch('password', '')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Only remove agreeToTerms, keep confirmPassword for backend validation
      const { agreeToTerms, ...registerData } = data
      
      console.log('Sending register data:', registerData) // Debug log
      
      await authService.register(registerData)
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.')
      navigate('/verify-email', { state: { email: data.email } })
    } catch (error) {
      console.error('Register error:', error) // Debug log
      toast.error(error.message || 'Đăng ký thất bại')
    } finally {
      setIsLoading(false)
    }
  }


const handleGoogleRegister = () => {
  window.location.href =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=779501654477-mm9vj298v1071gdgq42dr2nauaajnt20.apps.googleusercontent.com" +
    "&redirect_uri=http://localhost:8080/api/auth/oauth2/google/callback" +
    "&response_type=code" +
    "&scope=openid%20email%20profile"
}

const handleFacebookRegister = () => {
  window.location.href =
    "https://www.facebook.com/v18.0/dialog/oauth" +
    "?client_id=975365101857178" +
    "&redirect_uri=http://localhost:8080/api/auth/oauth2/facebook/callback" +
    "&response_type=code" +
    "&scope=public_profile"
}
  const getStrengthBars = () => {
    const bars = [false, false, false]
    if (passwordStrength.percentage >= 33) bars[0] = true
    if (passwordStrength.percentage >= 66) bars[1] = true
    if (passwordStrength.percentage >= 100) bars[2] = true
    return bars
  }

  const getStrengthColor = () => {
    if (passwordStrength.percentage >= 100) return 'bg-primary'
    if (passwordStrength.percentage >= 66) return 'bg-primary'
    if (passwordStrength.percentage >= 33) return 'bg-primary'
    return 'bg-surface-container-high'
  }

  const getStrengthTextColor = () => {
    if (passwordStrength.percentage >= 100) return 'text-primary'
    if (passwordStrength.percentage >= 66) return 'text-primary'
    if (passwordStrength.percentage >= 33) return 'text-primary'
    return 'text-on-surface-variant'
  }

  return (
    <main className="flex-grow flex items-center justify-center pt-xl pb-xl px-md mt-16">
      <div className="w-full max-w-[600px] bg-white rounded-2xl p-xl shadow-sm">
        {/* Header */}
        <div className="text-center mb-xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Tạo tài khoản mới
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Tham gia LuxeCommerce để trải nghiệm mua sắm đẳng cấp.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
          {/* Full Name Field */}
          <div>
            <label className="font-body-md text-on-surface-variant block mb-sm" htmlFor="fullName">
              Họ tên
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                person
              </span>
              <input
                {...register('fullName')}
                className="w-full h-14 pl-[3.5rem] pr-md bg-surface-container-low border-0 rounded-xl focus:ring-0 outline-none transition-all font-body-md text-on-surface placeholder:text-on-surface-variant/40"
                id="fullName"
                placeholder="Nguyễn Văn A"
                type="text"
              />
            </div>
            {errors.fullName && (
              <p className="font-body-sm text-error text-xs mt-xs">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="font-body-md text-on-surface-variant block mb-sm" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                mail
              </span>
              <input
                {...register('email')}
                className="w-full h-14 pl-[3.5rem] pr-md bg-surface-container-low border-0 rounded-xl focus:ring-0 outline-none transition-all font-body-md text-on-surface placeholder:text-on-surface-variant/40"
                id="email"
                placeholder="example@gmail.com"
                type="email"
              />
            </div>
            {errors.email && (
              <p className="font-body-sm text-error text-xs mt-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="font-body-md text-on-surface-variant block mb-sm" htmlFor="phone">
              Số điện thoại
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                call
              </span>
              <input
                {...register('phone')}
                className="w-full h-14 pl-[3.5rem] pr-md bg-surface-container-low border-0 rounded-xl focus:ring-0 outline-none transition-all font-body-md text-on-surface placeholder:text-on-surface-variant/40"
                id="phone"
                placeholder="0123 456 789"
                type="tel"
              />
            </div>
            {errors.phone && (
              <p className="font-body-sm text-error text-xs mt-xs">{errors.phone.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="font-body-md text-on-surface-variant block mb-sm" htmlFor="password">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                lock
              </span>
              <input
                {...register('password')}
                className="w-full h-14 pl-[3.5rem] pr-[3.5rem] bg-surface-container-low border-0 rounded-xl focus:ring-0 outline-none transition-all font-body-md text-on-surface placeholder:text-on-surface-variant/40"
                id="password"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => {
                  const strength = calculatePasswordStrength(e.target.value)
                  setPasswordStrength(strength)
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-sm top-1/2 -translate-y-1/2 bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="font-body-sm text-error text-xs mt-xs">{errors.password.message}</p>
            )}

            {/* Password Strength Meter */}
            {password && (
              <div className="mt-sm">
                <div className="flex gap-xs h-1.5 w-full rounded-full overflow-hidden">
                  {getStrengthBars().map((active, index) => (
                    <div
                      key={index}
                      className={`w-1/3 h-full transition-colors duration-300 ${
                        active ? getStrengthColor() : 'bg-surface-container-high'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs font-body-sm text-on-surface-variant mt-xs">
                  Độ mạnh mật khẩu:{' '}
                  <span className={`font-label-bold ${getStrengthTextColor()}`}>
                    {passwordStrength.label || 'Chưa đánh giá'}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="font-body-md text-on-surface-variant block mb-sm" htmlFor="confirmPassword">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                lock_reset
              </span>
              <input
                {...register('confirmPassword')}
                className="w-full h-14 pl-[3.5rem] pr-[3.5rem] bg-surface-container-low border-0 rounded-xl focus:ring-0 outline-none transition-all font-body-md text-on-surface placeholder:text-on-surface-variant/40"
                id="confirmPassword"
                placeholder="••••••••"
                type={showConfirmPassword ? 'text' : 'password'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-sm top-1/2 -translate-y-1/2 bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="font-body-sm text-error text-xs mt-xs">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-sm pt-sm">
            <input
              {...register('agreeToTerms')}
              className="mt-1 w-5 h-5 text-primary border-outline-variant focus:ring-primary rounded cursor-pointer"
              id="terms"
              type="checkbox"
            />
            <label className="font-body-sm text-on-surface-variant cursor-pointer leading-relaxed" htmlFor="terms">
              Tôi đồng ý với các{' '}
              <Link to="/terms" className="text-primary hover:underline">
                điều khoản
              </Link>{' '}
              và{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                điều kiện
              </Link>{' '}
              của LuxeCommerce.
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="font-body-sm text-error text-xs">{errors.agreeToTerms.message}</p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-primary text-on-primary font-headline-md rounded-xl hover:opacity-90 active:scale-[0.98] transition-all mt-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-lg items-center">
          <div className="flex-grow border-t border-outline-variant" />
          <span className="flex-shrink mx-md font-body-sm text-on-surface-variant">Hoặc đăng ký bằng</span>
          <div className="flex-grow border-t border-outline-variant" />
        </div>

        {/* Social Registration */}
        <div className="grid grid-cols-2 gap-sm">
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="flex items-center justify-center gap-xs h-12 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all font-label-bold text-on-surface"
          >
            <img
              alt="Google Icon"
              className="w-5 h-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9Pb1Y4c9zsKO2v_AGbR49niwx5x7n4QS51G-ZqYtUlc6YetotLYgnoQFhaP1Mz_YzTpHo8Yxqb-XUQcNaj2i_udz2x2AFkR13mV2OFNwGPwAqOoL0CKhKZ_ju8rTzgj7jPcWeKDhhlWPonmMD1_0-a_HTOcW6lAxNcT0zP54qMiTgv4ckBKvAyzT0QknUZr-vF1_g1VkRYkbLovEQULdhD3HIr2nKZloAikaoC2sqh1zat5TH_xKF6VStLqhWvNWrY3MaRIUBeEU"
            />
            Google
          </button>
          <button
            type="button"
            onClick={handleFacebookRegister}
            className="flex items-center justify-center gap-xs h-12 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all font-label-bold text-on-surface"
          >
            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        {/* Link to Login */}
        <div className="text-center pt-lg">
          <p className="font-body-md text-on-surface-variant">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary font-label-bold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Register
