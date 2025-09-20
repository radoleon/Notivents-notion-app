import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router'

export default function UnauthenticatedRoute() {
  const { profile } = useAuth()

  if (profile) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
