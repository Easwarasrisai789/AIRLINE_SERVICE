import { Link } from 'react-router-dom'
import { useState } from 'react'

const HomeNavbar = () => {
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
          <li><a href="#about">About</a></li>
          <li>
            <Link to="/auth" className="btn-primary">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default HomeNavbar

