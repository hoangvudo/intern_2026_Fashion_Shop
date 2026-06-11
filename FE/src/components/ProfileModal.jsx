import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import authService from '../services/authService';
import { FiX, FiEdit2, FiSave, FiLock, FiUser, FiPhone, FiMail, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfileModal({ open, onClose }) {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'password'

  // Profile Form
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (open) {
      authService.getCurrentUser()
        .then(latestUser => {
          updateUser(latestUser);
          setForm({ 
            fullName: latestUser.fullName || '', 
            email: latestUser.email || '', 
            phone: latestUser.phone || '' 
          });
        })
        .catch(err => console.error("Failed to fetch latest user info", err));
    }
  }, [open, updateUser]);

  // Handle Close & Reset
  const handleClose = () => {
    setEditing(false);
    setActiveTab('info');
    setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    onClose();
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await authService.updateProfile({ fullName: form.fullName, phone: form.phone });
      // Update local store
      updateUser({ ...user, fullName: form.fullName, phone: form.phone });
      toast.success("Cập nhật thông tin thành công");
      setEditing(false);
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }
    setSavingPw(true);
    try {
      await authService.changePassword({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      toast.success("Thay đổi mật khẩu thành công");
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setActiveTab('info');
    } catch (err) {
      toast.error(err.message || "Thay đổi mật khẩu thất bại");
    } finally {
      setSavingPw(false);
    }
  };

  const TIERS = [
    { id: 'NONE', name: 'MỚI', threshold: 0, label: 'MỚI (0)' },
    { id: 'SILVER', name: 'BẠC', threshold: 5000000, label: 'BẠC (5tr)' },
    { id: 'GOLD', name: 'VÀNG', threshold: 15000000, label: 'VÀNG (15tr)' },
    { id: 'PLATINUM', name: 'BẠCH KIM', threshold: 30000000, label: 'BẠCH KIM (30tr)' },
    { id: 'DIAMOND', name: 'KIM CƯƠNG', threshold: 50000000, label: 'KIM CƯƠNG (50tr)' },
  ];

  const currentSpent = user?.totalSpent || 0;
  const maxSpent = 50000000;
  const progressPercent = Math.min((currentSpent / maxSpent) * 100, 100);
  
  let nextTier = TIERS.find(t => t.threshold > currentSpent);
  if (!nextTier) nextTier = TIERS[TIERS.length - 1]; // Maxed out

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-3xl bg-[#FBF9F4] dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold font-beVietnamPro">Quản lý tài khoản</h2>
              <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {/* Top: Progress Bar Block */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#E59819] flex items-center justify-center text-white text-3xl font-bold">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {user?.fullName || 'Người dùng'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Hạng hiện tại:</span>
                      <span className="text-xs font-bold uppercase px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded">
                        {user?.vipTier && user.vipTier !== 'NONE' ? user.vipTier : 'MỚI'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Tổng chi tiêu: <strong className="text-black dark:text-white">{new Intl.NumberFormat('vi-VN').format(currentSpent)}đ</strong>
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Mức tiếp theo: <strong className="text-black dark:text-white">{new Intl.NumberFormat('vi-VN').format(nextTier.threshold)}đ</strong>
                    </span>
                  </div>
                  
                  <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-2 overflow-hidden border border-gray-200 dark:border-gray-600">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#E59819] rounded-full transition-all duration-1000" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="relative w-full h-8 mt-2">
                    {TIERS.map(t => (
                      <span key={t.id} 
                        className="absolute text-[10px] sm:text-xs text-gray-400 whitespace-nowrap" 
                        style={{ 
                          left: `${(t.threshold / maxSpent) * 100}%`,
                          transform: t.threshold === 0 ? 'none' : t.threshold === maxSpent ? 'translateX(-100%)' : 'translateX(-50%)'
                        }}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom: Tabs & Content */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'info' ? 'text-black dark:text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                  >
                    Thông tin cá nhân
                    {activeTab === 'info' && <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />}
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'password' ? 'text-black dark:text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                  >
                    Đổi mật khẩu
                    {activeTab === 'password' && <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />}
                  </button>
                </div>

                <div className="flex-grow">
                  <AnimatePresence mode="wait">
                    {activeTab === 'info' ? (
                      <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="font-beVietnamPro text-gray-800 dark:text-gray-200 font-semibold">Chi tiết thông tin</h4>
                          <button onClick={() => setEditing(!editing)} className="flex items-center gap-2 text-sm text-[#BB5734] hover:text-[#A04525] font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-[#BB5734]/10">
                            {editing ? <FiX /> : <FiEdit2 />}
                            {editing ? 'Huỷ' : 'Chỉnh sửa'}
                          </button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-5">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                              <FiUser /> Họ và tên
                            </label>
                            {editing ? (
                              <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#BB5734]/20 focus:border-[#BB5734] outline-none transition-all" required />
                            ) : (
                              <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent text-gray-900 dark:text-white font-medium">{user?.fullName || '-'}</div>
                            )}
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                              <FiMail /> Email <span className="text-xs text-gray-400 font-normal">(Không thể thay đổi)</span>
                            </label>
                            <div className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed">{user?.email || '-'}</div>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                              <FiPhone /> Số điện thoại
                            </label>
                            {editing ? (
                              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#BB5734]/20 focus:border-[#BB5734] outline-none transition-all" />
                            ) : (
                              <div className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent text-gray-900 dark:text-white font-medium">{user?.phone || 'Chưa cập nhật'}</div>
                            )}
                          </div>

                          {editing && (
                            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} type="submit" disabled={savingProfile} className="mt-4 w-full flex justify-center items-center gap-2 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50">
                              {savingProfile ? <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" /> : <><FiSave /> Lưu thay đổi</>}
                            </motion.button>
                          )}
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h4 className="font-beVietnamPro text-gray-800 dark:text-gray-200 font-semibold mb-6 flex items-center gap-2">
                          <FiLock className="text-[#BB5734]" /> Bảo mật tài khoản
                        </h4>
                        <form onSubmit={handleSavePassword} className="space-y-5">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Mật khẩu hiện tại</label>
                            <input type="password" value={pwForm.oldPassword} onChange={e => setPwForm({ ...pwForm, oldPassword: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#BB5734]/20 focus:border-[#BB5734] outline-none transition-all" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Mật khẩu mới</label>
                            <input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#BB5734]/20 focus:border-[#BB5734] outline-none transition-all" required minLength={6} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Xác nhận mật khẩu mới</label>
                            <input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#BB5734]/20 focus:border-[#BB5734] outline-none transition-all" required minLength={6} />
                          </div>
                          
                          <button type="submit" disabled={savingPw} className="mt-6 w-full flex justify-center items-center gap-2 py-3.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50">
                            {savingPw ? <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" /> : 'Cập nhật mật khẩu'}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
