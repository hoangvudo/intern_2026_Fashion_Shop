import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

export default function DeleteCategoryModal({ open, category, onConfirm, onCancel, loading }) {
  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl p-8"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center border border-red-100 bg-red-50">
                <FiAlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="font-beVietnamPro text-lg font-semibold text-[#1B1C19]">Xoá danh mục?</h3>
                <p className="mt-1.5 font-beVietnamPro text-sm text-[#6F583D]">
                  Bạn sắp xoá danh mục <span className="font-semibold">"{category?.name}"</span>.
                  Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="flex w-full gap-3 pt-2">
                <button
                  onClick={onCancel}
                  className="flex-1 border border-[#D1C4B9] py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]"
                >
                  Huỷ
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 bg-red-500 py-2.5 font-beVietnamPro text-sm text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {loading
                    ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Đang xoá...</>
                    : 'Xoá danh mục'
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
