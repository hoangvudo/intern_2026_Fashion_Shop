import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import authService from '../services/authService'
import { loginSchema } from '../schemas/loginSchema'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data.email, data.password)
      // Backend only returns accessToken and refreshToken, no user object
      login({ 
        user: null, 
        accessToken: response.accessToken, 
        refreshToken: response.refreshToken 
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
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }

  return (
    <main className="flex-grow flex items-center justify-center pt-16 px-gutter">
      <div className="max-w-[480px] w-full mt-lg mb-xl">
        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg md:p-xl shadow-sm">
          {/* Brand Header */}
          <div className="text-center mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              Chào mừng trở lại
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Đăng nhập vào tài khoản LuxeCommerce của bạn
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-sm">
            {/* Email Field */}
            <div className="space-y-base">
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  {...register('email')}
                  className={`block w-full h-[48px] pl-lg pr-sm bg-surface-container-low border rounded-lg font-body-md focus:ring-2 focus:ring-primary transition-all ${
                    errors.email ? 'border-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  id="email"
                  placeholder="example@luxe.com"
                  type="email"
                />
              </div>
              {errors.email && (
                <p className="font-body-sm text-error mt-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-base">
              <div className="flex justify-between items-center">
                <label className="font-label-bold text-label-bold text-on-surface" htmlFor="password">
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="font-body-sm text-body-sm text-primary hover:underline transition-all"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  {...register('password')}
                  className={`block w-full h-[48px] pl-lg pr-lg bg-surface-container-low border rounded-lg font-body-md focus:ring-2 focus:ring-primary transition-all ${
                    errors.password ? 'border-error' : 'border-outline-variant focus:border-primary'
                  }`}
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
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
                <p className="font-body-sm text-error mt-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[48px] bg-primary text-on-primary font-headline-md text-headline-md rounded-lg flex items-center justify-center gap-xs hover:opacity-90 active:scale-[0.98] transition-all mt-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              )}
              <span>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-lg">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant" />
            </div>
            <div className="relative flex justify-center text-body-sm font-body-sm">
              <span className="px-sm bg-surface-container-lowest text-on-surface-variant">
                Hoặc đăng nhập với
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-sm">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-xs h-[48px] border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all active:scale-95"
            >
              <img
                alt="Google Logo"
                className="w-5 h-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSKW8pg_zYTmb0edwJLC6tE2MjZ9HNG08BhBPzsnSv9TcR5k-pnZRF0_39sYl1Tv_wst5UjoCx8VQVgAm9rJDh3DVTyAY4s2h3aojLjaXTKcDJ6e7qfeSXtrvK9Br0t_G2g6XETTTBn3WJ5cWvfr3d34wO-xAQJCuxwPSsloT4YGBbl_X0ZHzbnlARW9ClQsTjiBQEZyogRFEJCFjLgIV4P12F0fmWQu1vU8YSDCPLeqnN8NXT2berPeAvuK5FE4mKC6Nowrq-GHQ"
              />
              <span className="font-label-bold text-label-bold">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-xs h-[48px] border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all active:scale-95"
            >
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="font-label-bold text-label-bold">Facebook</span>
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-lg text-center font-body-sm text-body-sm">
            <p className="text-on-surface-variant">
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary font-label-bold hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Security Message */}
          <div className="mt-xl flex items-center justify-center gap-xs opacity-60">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="font-body-sm text-[12px]">Bảo mật bởi reCAPTCHA</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
