import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router'

export default function AuthenticatedRoute() {
  const { profile } = useAuth()

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
