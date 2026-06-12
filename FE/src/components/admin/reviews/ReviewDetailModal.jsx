import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiStar, FiCalendar, FiUser, FiPackage } from 'react-icons/fi'

export default function ReviewDetailModal({ open, onClose, review }) {
  if (!review) return null

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (/^(https?:)?\/\//.test(imagePath) || imagePath.startsWith("data:") || imagePath.startsWith("blob:")) {
      return imagePath;
    }

    let cleanPath = imagePath.replace(/^\//, "");
    if (cleanPath.startsWith("api/uploads/")) {
      return `http://localhost:8080/${cleanPath}`;
    }

    if (cleanPath.startsWith("uploads/")) {
      cleanPath = cleanPath.replace(/^uploads\//, "");
    }

    return `http://localhost:8080/api/uploads/${cleanPath}`;
  };

  const getProductImage = () =>
    review.productThumbnailUrl ||
    review.productImage ||
    review.productMainImage ||
    review.thumbnailUrl ||
    "";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F0EEE9] px-6 py-4">
              <h3 className="font-beVietnamPro text-lg font-semibold text-[#1B1C19]">Chi tiết đánh giá</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-[#9E8E7E] hover:bg-[#F5F3EE] hover:text-[#1B1C19] transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 bg-[#F5F3EE] overflow-hidden">
                      <img 
                        src={getImageUrl(getProductImage())} 
                        alt={review.productName || "Sản phẩm"} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#9E8E7E]">
                        <FiPackage className="h-3 w-3" /> Sản phẩm
                      </p>
                      <p className="font-beVietnamPro text-sm font-semibold text-[#1B1C19] line-clamp-2">
                        {review.productName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-[#FAF9F6] p-3">
                      <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#9E8E7E]">
                        <FiUser className="h-3 w-3" /> Khách hàng
                      </p>
                      <p className="mt-1 font-beVietnamPro text-sm font-medium text-[#4E453D]">
                        {review.userFullName}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#FAF9F6] p-3">
                      <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[#9E8E7E]">
                        <FiCalendar className="h-3 w-3" /> Ngày gửi
                      </p>
                      <p className="mt-1 font-beVietnamPro text-sm font-medium text-[#4E453D]">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#9E8E7E] mb-2">Xếp hạng</p>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-[#1B1C19]">{review.rating}/5</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Content */}
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#9E8E7E] mb-2">Nội dung bình luận</p>
                    <div className="rounded-lg border border-[#F0EEE9] bg-[#FAF9F6] p-4 min-h-[120px]">
                      <p className="font-beVietnamPro text-sm leading-relaxed text-[#4E453D] whitespace-pre-wrap">
                        {review.comment || "Không có nội dung bình luận."}
                      </p>
                    </div>
                  </div>

                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#9E8E7E] mb-2">Hình ảnh đính kèm</p>
                      <div className="flex flex-wrap gap-2">
                        {review.imageUrls.map((url, i) => (
                          <div key={i} className="h-20 w-20 overflow-hidden bg-[#F5F3EE] border border-[#F0EEE9]">
                            <img 
                              src={getImageUrl(url)} 
                              alt={`Review image ${i + 1}`} 
                              className="h-full w-full object-cover hover:scale-110 transition-transform cursor-pointer" 
                              onClick={() => window.open(getImageUrl(url), '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#F0EEE9] px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="bg-[#1B1C19] px-6 py-2 font-beVietnamPro text-sm font-medium text-white hover:bg-[#1B1C19]/90 transition-colors"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
