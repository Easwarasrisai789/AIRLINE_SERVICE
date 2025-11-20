import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'

const DashboardNavbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    if (path === '/traveler') {
      return location.pathname === '/traveler' || location.pathname.startsWith('/traveler/select-seats') || location.pathname.startsWith('/traveler/payment')
    }
    if (path === '/admin') {
      return location.pathname === '/admin' || (location.pathname.startsWith('/admin/') && location.pathname !== '/admin/flights' && location.pathname !== '/admin/bookings' && location.pathname !== '/admin/users' && location.pathname !== '/admin/manual' && location.pathname !== '/admin/profile')
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  if (user?.role === 'admin') {
    return (
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <Link to="/admin" className="navbar-brand">
            <h2>✈️ AirLine Admin</h2>
          </Link>
          
          <button 
            className="navbar-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/flights" className={isActive('/admin/flights') ? 'active' : ''}>
                Flights
              </Link>
            </li>
            <li>
              <Link to="/admin/bookings" className={isActive('/admin/bookings') ? 'active' : ''}>
                Bookings
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/manual" className={isActive('/admin/manual') ? 'active' : ''}>
                User Manual
              </Link>
            </li>
            <li>
              <Link to="/admin/profile" className={isActive('/admin/profile') ? 'active' : ''}>
                Profile
              </Link>
            </li>
            <li>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    )
  }

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-container">
        <Link to="/traveler" className="navbar-brand">
          <h2>✈️ AirLine</h2>
        </Link>
        
        <button 
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/traveler" className={isActive('/traveler') ? 'active' : ''}>
              Browse Flights
            </Link>
          </li>
          <li>
            <Link to="/traveler/bookings" className={isActive('/traveler/bookings') ? 'active' : ''}>
              My Bookings
            </Link>
          </li>
          <li>
            <Link to="/traveler/profile" className={isActive('/traveler/profile') ? 'active' : ''}>
              Profile
            </Link>
          </li>
          <li>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default DashboardNavbar

