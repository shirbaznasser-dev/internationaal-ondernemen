import { Navigate } from 'react-router-dom'
import { getHuidigeGebruiker } from '../utils/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const g = getHuidigeGebruiker()
  if (!g) return <Navigate to="/" replace />
  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const g = getHuidigeGebruiker()
  if (!g || !g.isAdmin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
