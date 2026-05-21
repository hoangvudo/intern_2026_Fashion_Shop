import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import authService from '../services/authService'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự')
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword(token, formData.newPassword, formData.confirmPassword)
      toast.success('Đặt lại mật khẩu thành công!')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Đặt lại mật khẩu thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Đặt lại mật khẩu
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Nhập mật khẩu mới của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ResetPassword
