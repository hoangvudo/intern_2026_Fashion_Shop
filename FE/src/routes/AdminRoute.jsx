import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import useAuthStore from '../store/authStore'

function getUserRoles(user) {
  const roles = []

  if (user?.role) roles.push(user.role)
  if (Array.isArray(user?.roles)) roles.push(...user.roles)
  if (Array.isArray(user?.authorities)) roles.push(...user.authorities)

  return roles
    .map((role) => {
      if (typeof role === 'string') return role
      return role?.authority || role?.name || role?.role || ''
    })
    .map((role) => role.toUpperCase())
}

function isAdminUser(user) {
  return getUserRoles(user).some((role) => role === 'ADMIN' || role === 'ROLE_ADMIN')
}

function AdminRoute() {
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkAuth() {
      try {
        await initializeAuth()
      } finally {
        if (!cancelled) setCheckingAuth(false)
      }
    }

    checkAuth()

    return () => {
      cancelled = true
    }
  }, [initializeAuth])

  if (checkingAuth) {
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

  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />
  }

  return <AdminLayout />
}

export default AdminRoute
