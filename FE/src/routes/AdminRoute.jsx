import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import AdminLayout from '../components/admin/AdminLayout'

function AdminRoute() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const [checking, setChecking] = useState(true)

  // ✅ THÊM: chờ initializeAuth() xong trước khi redirect
  useEffect(() => {
    const init = async () => {
      await useAuthStore.getState().initializeAuth()
      setChecking(false)
    }
    init()
  }, [])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EE]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D1C4B9] border-t-[#6F583D]" />
          <p className="font-beVietnamPro text-sm text-[#4E453D]">Đang xác thực...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const role = user?.role?.toUpperCase?.() ?? ''
  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <AdminLayout />
}

export default AdminRoute