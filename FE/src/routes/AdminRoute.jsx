import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function AdminRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const role = user?.role?.toUpperCase?.() ?? ''
  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
