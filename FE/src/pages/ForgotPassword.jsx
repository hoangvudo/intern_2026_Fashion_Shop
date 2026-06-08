import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'
import authService from '../services/authService'
import mailImage from '../assets/Image6.png'
import {
  PasswordResetLayout,
  ResetLockIcon,
  MailHeroVisual,
} from '../components/auth/PasswordResetLayout'
import { AuthForm } from '../components/auth/AuthLayout'
import { AuthButton, AuthMotionBlock } from '../components/auth/AuthField'
import { motion } from 'framer-motion'
import { formItem } from '../components/auth/authMotion'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Vui lòng nhập email')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email không hợp lệ')
      return
    }

    setIsLoading(true)
    try {
      await authService.forgotPassword(email.trim())
      setIsSuccess(true)
      toast.success('Đã gửi link đặt lại mật khẩu')
    } catch (error) {
      toast.error(error.message || 'Gửi email thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await authService.forgotPassword(email.trim())
      toast.success('Đã gửi lại link')
    } catch (error) {
      toast.error(error.message || 'Gửi lại thất bại')
    } finally {
      setIsResending(false)
    }
  }

  const openMailApp = () => {
    window.location.href = `mailto:${encodeURIComponent(email.trim())}`
  }

  if (isSuccess) {
    return (
      <PasswordResetLayout wide>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <MailHeroVisual image={mailImage} />

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-[#231916] sm:text-[32px] sm:leading-tight">
                Check your Inbox
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#56423C] sm:text-lg">
                We&apos;ve sent a password reset link to{' '}
                <strong className="font-semibold text-[#231916]">{email}</strong>.
                Please check your inbox and follow the instructions.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <AuthMotionBlock>
                <AuthButton
                  type="button"
                  variant="outline"
                  loading={isResending}
                  onClick={handleResend}
                  className="!tracking-[0.15em] uppercase"
                >
                  Resend link
                </AuthButton>
              </AuthMotionBlock>

              <AuthMotionBlock>
                <AuthButton
                  type="button"
                  variant="primary"
                  onClick={openMailApp}
                  className="!tracking-[0.15em] uppercase"
                >
                  Open mail app
                </AuthButton>
              </AuthMotionBlock>

              <Link
                to="/login"
                className="group inline-flex items-center gap-2 pt-4 text-sm font-semibold tracking-[0.1em] text-[#695D4B] transition-colors hover:text-[#9B3F1E]"
              >
                <FiArrowLeft size={14} />
                <span className="relative">
                  BACK TO LOGIN
                  <span className="absolute -bottom-0.5 left-0 h-px w-8 bg-[#9B3F1E] transition-all group-hover:w-full" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </PasswordResetLayout>
    )
  }

  return (
    <PasswordResetLayout>
      <div className="flex w-full flex-col items-center text-center">
        <ResetLockIcon />

        <h1 className="pb-4 text-4xl leading-tight text-[#231916] sm:text-5xl">
          Reset Password
        </h1>

        <p className="max-w-md pb-10 text-lg leading-relaxed text-[#56423C] opacity-80">
          Enter your email to receive a secure link to reset your account credentials.
        </p>

        <AuthForm onSubmit={handleSubmit} className="w-full space-y-6 text-left">
          <motion.div variants={formItem} className="space-y-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold tracking-[0.2em] text-[#56423C]"
            >
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@atelier.com"
              className="w-full border border-[#DDC0B8] bg-transparent px-0 py-4 text-lg text-[#231916] outline-none transition-colors placeholder:text-[rgba(221,192,184,0.55)] focus:border-[#9B3F1E]"
            />
          </motion.div>

          <AuthButton
            type="submit"
            loading={isLoading}
            variant="primary"
            className="!py-5 !tracking-[0.2em] uppercase"
          >
            {isLoading ? 'Sending...' : 'Send reset link'}
          </AuthButton>
        </AuthForm>

        <AuthMotionBlock className="pt-10">
          <Link
            to="/login"
            className="group relative inline-block text-sm font-semibold tracking-[0.1em] text-[#56423C] transition-colors hover:text-[#9B3F1E]"
          >
            BACK TO LOGIN
            <span className="absolute -bottom-1 left-1/2 h-px w-8 -translate-x-1/2 bg-[#9B3F1E]" />
          </Link>
        </AuthMotionBlock>

        <p className="mt-16 text-base tracking-wide text-[#89726B] opacity-40">
          Curated security for the modern aesthetic.
        </p>
      </div>
    </PasswordResetLayout>
  )
}

export default ForgotPassword
