import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import useAuth from '../hooks/useAuth'

const DashboardNavbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

  // Reset the logout timer
  const resetTimer = useCallback(() => {
    if (window.logoutTimer) clearTimeout(window.logoutTimer)

    window.logoutTimer = setTimeout(() => {
      logout()
      alert("You have been logged out due to 15 minutes of inactivity.")
    }, INACTIVITY_LIMIT)
  }, [logout])

  // Start inactivity listener
  useEffect(() => {
    resetTimer()

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"]

    const activityListener = () => resetTimer()

    events.forEach((event) =>
      window.addEventListener(event, activityListener)
    )

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, activityListener)
      )
      if (window.logoutTimer) clearTimeout(window.logoutTimer)
    }
  }, [resetTimer])


  const isActive = (path) => {
    if (path === '/traveler') {
      return (
        location.pathname === '/traveler' ||
        location.pathname.startsWith('/traveler/select-seats') ||
        location.pathname.startsWith('/traveler/payment')
      )
    }
    if (path === '/admin') {
      return (
        location.pathname === '/admin' ||
        (location.pathname.startsWith('/admin/') &&
          !['/admin/flights', '/admin/bookings', '/admin/users', '/admin/manual', '/admin/profile']
            .includes(location.pathname))
      )
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  // -------------------------------
  // ADMIN NAVBAR
  // -------------------------------
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

  // -------------------------------
  // TRAVELER NAVBAR
  // -------------------------------
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
