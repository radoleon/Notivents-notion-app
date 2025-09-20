import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router'

export default function OtpRequiredRoute() {
  const { profile } = useAuth()

  if (profile?.is_organizer) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
