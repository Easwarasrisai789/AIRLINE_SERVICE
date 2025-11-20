import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="screen-center">
        <div className="spinner" />
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute

