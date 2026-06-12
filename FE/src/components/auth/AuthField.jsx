import { motion, AnimatePresence } from 'framer-motion'
import { formItem, shake } from './authMotion'

export function AuthInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  rightSlot,
}) {
  return (
    <motion.div
      className="space-y-1.5"
      variants={formItem}
    >
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={name} className="text-xs font-medium text-[#6B5A52]">
          {label}
        </label>
        {hint}
      </div>
      <motion.div className="relative" animate={error ? shake : undefined}>
        <motion.input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className={`h-11 w-full rounded-lg border bg-[#FFFCFB] px-3.5 text-sm text-[#231916] outline-none transition-colors placeholder:text-[#C4A89E] focus:border-[#9B3F1E] focus:ring-2 focus:ring-[#9B3F1E]/15 ${
            error ? 'border-red-300' : 'border-[#E0CEC6]'
          }`}
        />
        {rightSlot}
      </motion.div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden text-xs text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function AuthButton({
  children,
  loading,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
  ...props
}) {
  const styles =
    variant === 'primary'
      ? 'bg-[#9B3F1E] text-white shadow-sm'
      : 'border border-[#E0CEC6] bg-white text-[#56423C]'

  return (
    <motion.button
      type={type}
      disabled={loading || disabled}
      variants={formItem}
      whileHover={!loading && !disabled ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!loading && !disabled ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === 'primary' ? 'hover:bg-[#85351A]' : 'hover:border-[#9B3F1E]/50 hover:bg-[#FFF8F6]'
      } ${styles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function AuthDivider({ text = 'hoặc' }) {
  return (
    <motion.div
      className="flex items-center gap-3 py-1"
      variants={formItem}
    >
      <motion.div
        className="h-px flex-1 bg-[#EDE4DF]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ originX: 1 }}
      />
      <span className="text-xs text-[#89726B]">{text}</span>
      <motion.div
        className="h-px flex-1 bg-[#EDE4DF]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ originX: 0 }}
      />
    </motion.div>
  )
}

export function AuthMotionBlock({ children, className = '' }) {
  return (
    <motion.div variants={formItem} className={className}>
      {children}
    </motion.div>
  )
}
