import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import reviewService from '../../services/reviewService'
import api from '../../services/api'

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-1 focus:outline-none"
        >
          <FiStar
            className={`h-7 w-7 ${
              star <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  )
}

export default function ReviewModal({ order, item, onClose, onSuccess }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    if (images.length + files.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 ảnh')
      return
    }

    setImgUploading(true)
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const form = new FormData()
          form.append('file', file)
          const res = await api.post('/upload/image', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          return res.data?.url ?? res.data
        })
      )
      setImages((prev) => [...prev, ...urls.filter(Boolean)])
    } catch (err) {
      toast.error('Lỗi khi tải ảnh lên')
    } finally {
      setImgUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error('Vui lòng nhập nhận xét')
      return
    }

    setIsSubmitting(true)
    try {
      await reviewService.create(item.productId, {
        orderId: order.id,
        rating,
        comment,
        imageUrls: images,
      })
      toast.success('Cảm ơn bạn đã đánh giá!')
      onSuccess?.()
    } catch (err) {
      const msg = err.response?.data?.message || 'Gửi đánh giá thất bại'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700"
          >
            <FiX className="h-4 w-4" />
          </button>

          <div className="p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Đánh giá sản phẩm
            </h2>

            <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
              <img
                src={item.productImage}
                alt={item.productName}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                  {item.productName}
                </p>
                <p className="text-xs text-gray-500">
                  {[item.size, item.color].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chất lượng sản phẩm tuyệt vời?
                </span>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nhận xét của bạn
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Hãy chia sẻ cảm nhận về sản phẩm..."
                  className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ảnh đính kèm ({images.length}/5)
                </label>
                <div className="flex flex-wrap gap-2">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative h-16 w-16">
                      <img
                        src={url}
                        alt="preview"
                        className="h-full w-full rounded-lg object-cover border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-black hover:text-black dark:border-gray-600 dark:hover:border-white dark:hover:text-white">
                      {imgUploading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-t-white" />
                      ) : (
                        <span className="text-2xl">+</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={imgUploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
