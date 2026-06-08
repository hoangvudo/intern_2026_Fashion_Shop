import { Link } from 'react-router-dom'
import { PasswordResetLayout } from '../components/auth/PasswordResetLayout'

function ResetPasswordExpired() {
  return (
    <PasswordResetLayout>
      <div className="flex w-full flex-col items-center text-center">
        <div className="pb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-red-200 bg-red-50">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-red-600">
              <path
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="pb-4 text-3xl font-medium text-[#231916] sm:text-4xl">
          Link expired
        </h1>
        <p className="max-w-md pb-10 text-base leading-relaxed text-[#56423C] opacity-80">
          This password reset link has expired or is invalid. Request a new link to continue.
        </p>

        <Link
          to="/forgot-password"
          className="flex h-11 w-full max-w-xs items-center justify-center rounded-lg bg-[#9B3F1E] text-sm font-semibold tracking-[0.15em] text-white uppercase shadow-sm transition-colors hover:bg-[#85351A]"
        >
          Request new link
        </Link>

        <Link
          to="/login"
          className="mt-8 text-sm font-semibold tracking-[0.1em] text-[#56423C] hover:text-[#9B3F1E]"
        >
          BACK TO LOGIN
        </Link>
      </div>
    </PasswordResetLayout>
  )
}

export default ResetPasswordExpired
