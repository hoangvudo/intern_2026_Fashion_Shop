import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function DeleteBrandModal({
  open,
  brand,
  onConfirm,
  onCancel,
  loading,
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "tween", duration: 0.18 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-red-100 bg-red-50">
                <FiAlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <button
                onClick={onCancel}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#F0EEE9] text-[#4E453D]"
                title="Đóng"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <h3 className="font-beVietnamPro text-lg font-semibold text-[#1B1C19]">
                Xoá thương hiệu?
              </h3>
              <p className="mt-2 font-beVietnamPro text-sm text-[#6F583D]">
                Bạn sắp xoá thương hiệu{" "}
                <span className="font-semibold">“{brand?.name || ""}”</span>.
                Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="mt-6 flex w-full gap-3">
              <button
                onClick={onCancel}
                className="flex-1 border border-[#D1C4B9] px-4 py-2.5 font-beVietnamPro text-sm text-[#4E453D] hover:bg-[#F0EEE9]"
                type="button"
              >
                Huỷ
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 font-beVietnamPro text-sm text-white hover:bg-red-600 disabled:opacity-50"
                type="button"
              >
                {loading ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
