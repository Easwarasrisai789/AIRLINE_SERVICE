import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const navLinks = [
  { to: '/traveler', label: 'My Trips', roles: ['traveler'] },
  { to: '/admin', label: 'Admin Console', roles: ['admin'] },
]

const AppShell = ({ title, children }) => {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div>
          <h1>AirLine HQ</h1>
          <p>{title}</p>
        </div>
        <div className="user-chip">
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role === 'admin' ? 'Admin' : 'Traveler'}</span>
          </div>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="app-shell__nav">
        {navLinks
          .filter((link) => (user ? link.roles.includes(user.role) : false))
          .map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
      </nav>

      <main className="app-shell__main">{children}</main>
    </div>
  )
}

export default AppShell

