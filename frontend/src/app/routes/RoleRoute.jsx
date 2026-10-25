import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from './routePaths'

/**
 * Wraps a set of routes and only renders them if the current user's role is
 * in `allow`. Used for e.g. <RoleRoute allow={['admin']} /> around Audit Logs.
 */
export default function RoleRoute({ allow = [] }) {
  const { role } = useAuth()

  if (!allow.includes(role)) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
