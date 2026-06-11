import { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiMail,
  FiCheck,
  FiTrash2,
  FiX,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import contactService from "../../services/contactService";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contactService.getAdminContacts({
        keyword,
        status: statusFilter,
        page,
        size: 10,
      });
      setContacts(data.content || []);
      setTotal(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Không thể tải danh sách liên hệ");
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleView = async (c) => {
    try {
      const detail = await contactService.getContactDetail(c.id);
      setSelectedContact(detail);
      setReplyText(detail.replyContent || "");
      // Update locally if it was UNREAD
      if (c.status === "UNREAD") {
        setContacts((prev) =>
          prev.map((item) => (item.id === c.id ? { ...item, status: "READ" } : item)),
        );
      }
    } catch {
      toast.error("Không thể xem chi tiết liên hệ");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return toast.error("Vui lòng nhập nội dung phản hồi");
    setReplying(true);
    try {
      const updated = await contactService.replyContact(selectedContact.id, {
        replyContent: replyText,
      });
      toast.success("Đã phản hồi qua email khách hàng");
      setSelectedContact(updated);
      setContacts((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
    } catch {
      toast.error("Phản hồi thất bại");
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá liên hệ này?")) return;
    try {
      await contactService.deleteContact(id);
      toast.success("Đã xoá liên hệ");
      load();
    } catch {
      toast.error("Xoá thất bại");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "UNREAD":
        return "bg-red-100 text-red-800 border-red-200";
      case "READ":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "REPLIED":
        return "bg-green-100 text-green-800 border-green-200";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "UNREAD": return "Chưa đọc";
      case "READ": return "Đã đọc";
      case "REPLIED": return "Đã phản hồi";
      case "ARCHIVED": return "Lưu trữ";
      default: return status;
    }
  };

  return (
    <div className="flex flex-col items-start gap-10 bg-[#FBF9F4] w-full min-h-screen p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-4">
        <div className="flex flex-col items-start gap-2 w-fit">
          <h1 className="text-[#6F583D] font-beVietnamPro text-2xl font-semibold leading-8 w-fit">
            Góp ý & Liên hệ
          </h1>
          <p className="text-[#4E453D] font-beVietnamPro text-base leading-6 w-fit">
            Quản lý các tin nhắn từ khách hàng gửi qua trang Liên hệ.
          </p>
        </div>

        <div className="flex items-start gap-4 w-fit">
          <div className="relative group">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="appearance-none cursor-pointer flex pt-2 pr-10 pb-2 pl-10 items-center gap-2 rounded bg-[#EAE2D4] text-[#696459] font-beVietnamPro text-base leading-6 outline-none border-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="UNREAD">Chưa đọc</option>
              <option value="READ">Đã đọc</option>
              <option value="REPLIED">Đã phản hồi</option>
            </select>
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#696459] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col items-start rounded-lg border border-[#D1C4B9] bg-white w-full overflow-hidden shadow-sm">
        <div className="flex p-6 items-center gap-6 border-b border-[#D1C4B9] w-full bg-[#FAFAF8]">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E8E7E]" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex pt-2.5 pr-4 pb-2.5 pl-10 items-center w-full rounded border border-[#D1C4B9] bg-white text-[#1B1C19] font-beVietnamPro text-sm leading-5 placeholder:text-[#9E8E7E] focus:border-[#6F583D] focus:outline-none"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-beVietnamPro text-sm text-[#1B1C19]">
            <thead className="bg-[#F0EEE9] text-[#696459] font-semibold">
              <tr>
                <th className="px-6 py-4">Tên khách hàng</th>
                <th className="px-6 py-4">Email / SĐT</th>
                <th className="px-6 py-4">Nội dung</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1C4B9]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#9E8E7E]">Đang tải...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#9E8E7E]">Không tìm thấy liên hệ nào.</td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAFAF8] transition-all duration-300">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{c.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#4E453D]">{c.email}</div>
                      <div className="text-xs text-[#9E8E7E] mt-0.5">{c.phone || "Không có SĐT"}</div>
                    </td>
                    <td className="px-6 py-4 text-[#4E453D]">
                      <div className="line-clamp-2 max-w-xs text-xs leading-relaxed" title={c.message}>
                        {c.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4E453D]">{fmtDate(c.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-medium border ${getStatusColor(c.status)}`}>
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleView(c)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem chi tiết"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex px-6 py-4 justify-between items-center w-full border-t border-[#D1C4B9] bg-[#FAFAF8]">
            <span className="text-[#696459] font-beVietnamPro text-sm">
              Hiển thị trang {page + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-[#D1C4B9] rounded text-[#4E453D] disabled:opacity-50 hover:bg-[#F0EEE9] transition-colors"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-[#D1C4B9] rounded text-[#4E453D] disabled:opacity-50 hover:bg-[#F0EEE9] transition-colors"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#D1C4B9] bg-[#FAFAF8]">
                <h3 className="font-beVietnamPro text-lg font-bold text-[#1B1C19] flex items-center gap-2">
                  <FiMessageSquare className="text-[#6F583D]" />
                  Chi tiết liên hệ
                </h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 text-[#696459] hover:bg-[#EAE2D4] rounded"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm font-beVietnamPro">
                  <div>
                    <span className="text-[#9E8E7E] block mb-1 uppercase text-xs tracking-wider">Họ và tên</span>
                    <strong className="text-[#1B1C19] text-base">{selectedContact.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#9E8E7E] block mb-1 uppercase text-xs tracking-wider">Thời gian gửi</span>
                    <span className="text-[#4E453D]">{fmtDate(selectedContact.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-[#9E8E7E] block mb-1 uppercase text-xs tracking-wider">Email</span>
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">{selectedContact.email}</a>
                  </div>
                  <div>
                    <span className="text-[#9E8E7E] block mb-1 uppercase text-xs tracking-wider">Số điện thoại</span>
                    <span className="text-[#4E453D]">{selectedContact.phone || "Không có"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#9E8E7E] block mb-2 uppercase text-xs tracking-wider font-beVietnamPro">Nội dung lời nhắn</span>
                  <div className="p-4 bg-[#FBF9F4] rounded-lg border border-[#EAE2D4] text-[#1B1C19] font-beVietnamPro leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D1C4B9]">
                  <span className="text-[#9E8E7E] block mb-2 uppercase text-xs tracking-wider font-beVietnamPro flex items-center gap-2">
                    <FiMail />
                    Phản hồi qua Email
                  </span>
                  {selectedContact.status === "REPLIED" ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                      <div className="font-semibold mb-2 flex items-center gap-2">
                        <FiCheck />
                        Đã phản hồi vào lúc {fmtDate(selectedContact.repliedAt)}
                      </div>
                      <div className="whitespace-pre-wrap">{selectedContact.replyContent}</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows="4"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Nhập nội dung phản hồi. Hệ thống sẽ gửi email tự động đến khách hàng..."
                        className="w-full p-3 rounded border border-[#D1C4B9] bg-white text-[#1B1C19] text-sm focus:border-[#6F583D] focus:outline-none resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleReply}
                          disabled={replying}
                          className="flex items-center gap-2 bg-[#1B1C19] px-6 py-2.5 rounded font-beVietnamPro text-sm text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
                        >
                          {replying ? "Đang gửi..." : "Gửi phản hồi"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminContacts;
