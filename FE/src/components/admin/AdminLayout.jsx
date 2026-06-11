import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#F5F3EE] font-beVietnamPro">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminHeader onMenuClick={() => setSidebarOpen(o => !o)} />

      <main className="min-h-screen pt-20 lg:ml-72 overflow-hidden relative">
        <div className="relative z-10 min-h-full bg-[#F5F3EE]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout