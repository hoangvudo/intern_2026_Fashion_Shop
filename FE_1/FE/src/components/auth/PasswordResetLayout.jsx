import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { panelVariants } from './authMotion'

export function PasswordResetLayout({ children, wide = false }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FFF8F6] font-hankenGrotesk text-[#231916]">
      <div className="pointer-events-none absolute -right-32 -top-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(158,65,33,0.08)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 -left-32 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(158,65,33,0.08)_0%,transparent_70%)]" />

      <header className="relative z-10 px-6 pt-10 sm:px-12 lg:px-16">
        <Link
          to="/"
          className="text-4xl font-semibold tracking-[-0.05em] text-[#9B3F1E] transition-opacity hover:opacity-80 sm:text-5xl"
        >
          ZYRO
        </Link>
      </header>

      <main
        className={`relative z-10 flex flex-1 flex-col px-6 py-10 sm:px-12 lg:px-16 ${
          wide ? 'items-stretch' : 'items-center justify-center'
        }`}
      >
        <motion.div
          className={wide ? 'mx-auto w-full max-w-5xl' : 'w-full max-w-[520px]'}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.div>
      </main>

      <PasswordResetFooter />
    </div>
  )
}

export function PasswordResetFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-[#DDC0B8]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row sm:px-12 lg:px-16">
        <p className="text-xs font-semibold tracking-[0.1em] text-[#695D4B] opacity-70">
          © 2024 ZYRO ATELIER. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6">
          {['PRIVACY', 'TERMS', 'CONTACT'].map((item) => (
            <Link
              key={item}
              to={item === 'CONTACT' ? '/contact' : '#'}
              className="text-xs font-semibold tracking-[0.1em] text-[#56423C] transition-colors hover:text-[#9B3F1E]"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export function ResetLockIcon() {
  return (
    <div className="flex flex-col items-center pb-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-[rgba(155,63,30,0.10)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-[rgba(155,63,30,0.20)] bg-[#FFF1ED]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
            <path
              d="M15.836 31.667C13.646 31.667 11.591 31.253 9.67 30.426C7.749 29.599 6.074 28.474 4.645 27.051C3.216 25.628 2.084 23.955 1.251 22.032C.417 20.108 0 18.052 0 15.865H2.5c0 1.833.35 3.56 1.05 5.18.699 1.62 1.653 3.034 2.862 4.242 1.208 1.209 2.623 2.164 4.245 2.867 1.621.703 3.347 1.055 5.176 1.055 3.722 0 6.875-1.292 9.458-3.875 2.584-2.583 3.875-5.736 3.875-9.458 0-3.722-1.291-6.875-3.875-9.458-2.583-2.583-5.736-3.875-9.458-3.875-2.59 0-4.924.658-7.002 1.973-2.078 1.316-3.674 3.048-4.787 5.198h4.833v2.5H0V3.333h2.5v4.151C3.867 5.232 5.717 3.422 8.05 2.053 10.382.684 12.976 0 15.833 0c2.19 0 4.249.416 6.175 1.247 1.926.831 3.602 1.959 5.027 3.384 1.425 1.425 2.553 3.1 3.384 5.027.832 1.926 1.247 3.984 1.247 6.174 0 2.19-.416 4.249-1.247 6.176-.831 1.927-1.959 3.603-3.384 5.028-1.425 1.425-3.101 2.554-5.028 3.385-1.927.831-3.985 1.247-6.175 1.247Zm-3.336-9.359c-.445 0-.818-.15-1.119-.451-.3-.3-.451-.673-.451-1.118v-5c0-.445.16-.818.479-1.119.32-.3.715-.451 1.188-.451v-1.762c0-.89.316-1.652.948-2.286.632-.634 1.395-.951 2.29-.951.895 0 1.658.317 2.29.951.632.634.948 1.524.948 2.286v1.762c.473 0 .868.151 1.188.451.319.301.479.674.479 1.119v5c0 .445-.15.818-.451 1.119-.3.3-.674.451-1.119.451h-6.667Zm1.57-8.141h3.526v-1.757c0-.498-.195-.918-.536-1.259-.341-.341-.761-.536-1.255-.536-.494 0-.914.195-1.255.536-.341.341-.536.761-.536 1.259v1.757Z"
              fill="#9B3F1E"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function AuthStatusCard({ status = 'loading', title, message, children }) {
  return (
    <PasswordResetLayout>
      <div className="mx-auto flex w-full max-w-md flex-col items-center py-8 text-center">
        {status === 'loading' && (
          <div className="mb-6 h-14 w-14 animate-spin rounded-full border-2 border-[#E0CEC6] border-t-[#9B3F1E]" />
        )}
        {status === 'success' && (
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#2E7D32]">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}
        {status === 'error' && (
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFEBEE]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#C62828]">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}
        {title && (
          <h1 className="text-2xl font-semibold tracking-tight text-[#231916] sm:text-3xl">
            {title}
          </h1>
        )}
        {message && (
          <p className="mt-3 text-base leading-relaxed text-[#56423C] opacity-90">{message}</p>
        )}
        {children && <div className="mt-8 w-full">{children}</div>}
      </div>
    </PasswordResetLayout>
  )
}

export function MailHeroVisual({ image }) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
      <img
        src={image}
        alt=""
        className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[500px]"
      />
      <div className="absolute inset-0 bg-[rgba(155,63,30,0.05)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
          <svg width="36" height="28" viewBox="0 0 24 24" fill="none" className="text-[#9B3F1E]">
            <path
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
