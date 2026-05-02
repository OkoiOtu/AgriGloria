import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedAdminRoute({ children, superAdminOnly = false }) {
  const { currentUser, userRole, userProfile } = useAuth()

  if (!currentUser || !userProfile) return <Navigate to="/admin/login" replace />

  const isAdmin = userRole === 'admin' || userRole === 'super_admin'
  if (!isAdmin) return <Navigate to="/admin/login" replace />

  if (superAdminOnly && userRole !== 'super_admin') return <Navigate to="/admin/dashboard" replace />

  return children
}
