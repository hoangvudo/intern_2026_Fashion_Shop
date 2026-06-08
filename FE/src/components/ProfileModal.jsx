import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/authStore'
import { MdClose, MdEdit, MdSave } from 'react-icons/md'

export default function ProfileModal({ open, onClose }){
  const { user, updateUser } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' })

  useEffect(() => {
    if(user){
      setForm({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '' })
    }
  }, [user, open])

  function handleSave(e){
    e.preventDefault()
    updateUser({ ...user, ...form })
    setEditing(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative max-w-2xl w-full mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Hồ sơ của bạn</h3>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-900"><MdClose size={20} /></button>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-200">
                  {user?.fullName ? user.fullName.split(' ').map(n=>n[0]).slice(0,2).join('') : 'U'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Thông tin cơ bản</div>
                    <button onClick={() => setEditing(s=>!s)} className="inline-flex items-center gap-2 px-3 py-1 border rounded text-sm">
                      {editing ? <MdSave/> : <MdEdit/>}
                      <span>{editing ? 'Lưu' : 'Chỉnh sửa'}</span>
                    </button>
                  </div>

                  {!editing ? (
                    <div className="mt-3 text-gray-700 dark:text-gray-300 text-sm">
                      <p><strong>Họ và tên:</strong> {user?.fullName || '-'}</p>
                      <p className="mt-2"><strong>Email:</strong> {user?.email || '-'}</p>
                      <p className="mt-2"><strong>Điện thoại:</strong> {user?.phone || '-'}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSave} className="mt-3 grid grid-cols-1 gap-2">
                      <input value={form.fullName} onChange={e=>setForm(f=>({...f, fullName: e.target.value}))} className="px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900" />
                      <input value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} className="px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900" />
                      <input value={form.phone} onChange={e=>setForm(f=>({...f, phone: e.target.value}))} className="px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900" />
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded">Lưu thay đổi</button>
                        <button type="button" onClick={()=>{ setEditing(false); onClose() }} className="px-4 py-2 border rounded">Đóng</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
