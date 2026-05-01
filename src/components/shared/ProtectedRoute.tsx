import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { Role } from '../../types/domain'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

const DEFAULT_ROUTES: Record<Role, string> = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  admin: '/admin/dashboard',
  dean: '/dean/dashboard',
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={DEFAULT_ROUTES[user.role]} replace />
  }

  return <>{children}</>
}
