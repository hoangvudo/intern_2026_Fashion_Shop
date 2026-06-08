import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import authService from '../services/authService'
import { PasswordResetLayout, ResetLockIcon } from '../components/auth/PasswordResetLayout'
import { AuthForm } from '../components/auth/AuthLayout'
import { AuthInput, AuthButton, AuthMotionBlock } from '../components/auth/AuthField'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!formData.newPassword) next.newPassword = 'Nhập mật khẩu mới'
    else if (formData.newPassword.length < 8) next.newPassword = 'Tối thiểu 8 ký tự'
    if (!formData.confirmPassword) next.confirmPassword = 'Nhập lại mật khẩu'
    else if (formData.newPassword !== formData.confirmPassword) {
      next.confirmPassword = 'Mật khẩu không khớp'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await authService.resetPassword(
        token,
        formData.newPassword,
        formData.confirmPassword,
      )
      toast.success('Đặt lại mật khẩu thành công!')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Đặt lại mật khẩu thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PasswordResetLayout>
      <div className="flex w-full flex-col items-center text-center">
        <ResetLockIcon />

        <h1 className="pb-4 text-3xl font-medium tracking-tight text-[#231916] sm:text-4xl">
          New Password
        </h1>
        <p className="max-w-md pb-8 text-base leading-relaxed text-[#56423C] opacity-80">
          Create a strong new password for your ZYRO account.
        </p>

        <AuthForm onSubmit={handleSubmit} className="w-full max-w-md space-y-4 text-left">
          <AuthInput
            label="Mật khẩu mới"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Tối thiểu 8 ký tự"
            error={errors.newPassword}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89726B]"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            }
          />

          <AuthInput
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
            error={errors.confirmPassword}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89726B]"
              >
                {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            }
          />

          <AuthButton
            type="submit"
            loading={isLoading}
            variant="primary"
            className="!mt-4 !tracking-[0.15em] uppercase"
          >
            {isLoading ? 'Updating...' : 'Update password'}
          </AuthButton>
        </AuthForm>

        <AuthMotionBlock className="pt-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.1em] text-[#695D4B] hover:text-[#9B3F1E]"
          >
            <FiArrowLeft size={14} />
            BACK TO LOGIN
          </Link>
        </AuthMotionBlock>
      </div>
    </PasswordResetLayout>
  )
}

export default ResetPassword
