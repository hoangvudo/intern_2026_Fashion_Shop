import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F5F3EE] font-beVietnamPro">
      <AdminSidebar />
      <AdminHeader />
      <main className="ml-72 min-h-screen pt-20">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
