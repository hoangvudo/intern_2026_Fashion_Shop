import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  panelVariants,
  heroImageVariants,
  heroTextVariants,
  formSideVariants,
  formStagger,
} from './authMotion'

export function AuthLayout({
  heroImage,
  heroTag,
  heroTitle,
  heroSubtitle,
  topRightLink,
  children,
  footer,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6F4] p-4 font-hankenGrotesk text-[#231916] sm:p-6">
      <motion.div
        className="flex w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-[#E8DDD8] bg-white shadow-[0_12px_40px_rgba(35,25,22,0.08)] lg:min-h-[520px] lg:flex-row"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative h-36 shrink-0 overflow-hidden sm:h-44 lg:h-auto lg:w-[38%] lg:min-h-[520px]">
          <motion.img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            variants={heroImageVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#3d2010]/50 via-[#3d2010]/20 to-transparent lg:bg-gradient-to-t lg:from-[#3d2010]/85 lg:via-[#3d2010]/25 lg:to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <div className="relative flex h-full flex-col justify-between p-4 sm:p-5 lg:p-6">
            <motion.span
              className="text-lg font-medium tracking-tight text-white drop-shadow-sm lg:text-xl"
              custom={0}
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
            >
              ZYRO
            </motion.span>
            <div className="hidden sm:block lg:max-w-[220px]">
              {heroTag && (
                <motion.span
                  className="mb-2 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[9px] font-semibold tracking-wider text-white/90 backdrop-blur-sm"
                  custom={1}
                  variants={heroTextVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {heroTag}
                </motion.span>
              )}
              {heroTitle && (
                <motion.h2
                  className="text-base font-semibold leading-snug text-white sm:text-lg lg:text-xl"
                  custom={2}
                  variants={heroTextVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {heroTitle}
                </motion.h2>
              )}
              {heroSubtitle && (
                <motion.p
                  className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/75"
                  custom={3}
                  variants={heroTextVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {heroSubtitle}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        <motion.main
          className="flex min-w-0 flex-1 flex-col border-t border-[#EDE4DF] lg:border-l lg:border-t-0"
          variants={formSideVariants}
          initial="hidden"
          animate="visible"
        >
          <header className="flex items-center justify-between border-b border-[#F5EFEB] px-5 py-4 sm:px-7">
            <Link
              to="/"
              className="text-lg font-medium tracking-tight text-[#9B3F1E] transition-colors hover:opacity-80 lg:hidden"
            >
              ZYRO
            </Link>
            <span className="hidden text-sm font-medium text-[#6B5A52] lg:inline">ZYRO</span>
            {topRightLink}
          </header>

          <div className="flex flex-1 flex-col justify-center px-5 py-6 sm:px-7 sm:py-8">
            {children}
          </div>

          {footer && (
            <motion.p
              className="border-t border-[#F5EFEB] px-5 py-3 text-center text-[11px] text-[#89726B] sm:px-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              {footer}
            </motion.p>
          )}
        </motion.main>
      </motion.div>
    </div>
  )
}

export function AuthCard({ title, subtitle, children }) {
  return (
    <div>
      <motion.div
        className="mb-5 sm:mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.45 }}
      >
        <h1 className="text-xl font-semibold tracking-tight text-[#231916] sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-relaxed text-[#6B5A52]">{subtitle}</p>
        )}
      </motion.div>
      {children}
    </div>
  )
}

export function AuthForm({ onSubmit, className = 'space-y-4', children }) {
  return (
    <motion.form
      onSubmit={onSubmit}
      className={className}
      variants={formStagger}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.form>
  )
}
