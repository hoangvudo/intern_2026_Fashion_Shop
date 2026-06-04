import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

export default function DeleteConfirmModal({ open, product, onConfirm, onCancel, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 z-60 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl"
          >
            <div className="p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center bg-red-50">
                <FiAlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="mb-2 font-beVietnamPro text-lg font-semibold text-[#1B1C19]">Xoá sản phẩm?</h3>
              <p className="font-beVietnamPro text-sm leading-6 text-[#4E453D]">
                Bạn sắp xoá <span className="font-semibold text-[#1B1C19]">"{product?.name}"</span>.
                Hành động này không thể hoàn tác và sẽ xoá toàn bộ dữ liệu liên quan.
              </p>
            </div>
            <div className="flex gap-3 border-t border-[#D1C4B9] px-8 py-5">
              <button onClick={onCancel}
                className="flex-1 border border-[#D1C4B9] py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]">
                Huỷ
              </button>
              <button onClick={onConfirm} disabled={loading}
                className="flex-1 bg-red-600 py-2.5 font-beVietnamPro text-sm text-white hover:bg-red-700 disabled:opacity-50">
                {loading ? 'Đang xoá...' : 'Xác nhận xoá'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
