import { Link } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'

const Navbar = () => {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
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
          <li><a href="#home">Home</a></li>
          <li><a href="#safety">Safety</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          {user ? (
            <li>
              <Link to={user.role === 'admin' ? '/admin' : '/traveler'}>
                Dashboard
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/auth" className="btn-primary">
                Login / Register
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

