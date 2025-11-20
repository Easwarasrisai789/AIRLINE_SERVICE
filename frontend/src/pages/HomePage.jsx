import { Link } from 'react-router-dom'
import HomeNavbar from '../components/HomeNavbar'
import useAuth from '../hooks/useAuth'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <HomeNavbar />
      
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Welcome to AirLine</h1>
          <p>Your trusted partner for safe and comfortable air travel</p>
          {!user && (
            <Link to="/auth" className="btn-hero">
              Book Your Flight
            </Link>
          )}
        </div>
      </section>

      <section id="safety" className="section safety-section">
        <div className="container">
          <h2>Airline Safety & Security</h2>
          <div className="safety-grid">
            <div className="safety-card">
              <div className="safety-icon">🛡️</div>
              <h3>Safety First</h3>
              <p>
                Our commitment to safety is unwavering. We maintain the highest international 
                safety standards and continuously invest in advanced safety technologies and 
                comprehensive training programs for our crew.
              </p>
            </div>
            
            <div className="safety-card">
              <div className="safety-icon">✈️</div>
              <h3>Modern Fleet</h3>
              <p>
                Our fleet consists of the latest aircraft models with state-of-the-art 
                safety features, regular maintenance schedules, and compliance with all 
                international aviation regulations.
              </p>
            </div>
            
            <div className="safety-card">
              <div className="safety-icon">👨‍✈️</div>
              <h3>Expert Crew</h3>
              <p>
                All our pilots and cabin crew undergo rigorous training and regular 
                recertification. Our crew members are trained in emergency procedures, 
                first aid, and passenger safety protocols.
              </p>
            </div>
            
            <div className="safety-card">
              <div className="safety-icon">🔒</div>
              <h3>Security Measures</h3>
              <p>
                We work closely with airport security agencies to ensure comprehensive 
                security screening. All passengers and luggage undergo thorough security 
                checks in compliance with international standards.
              </p>
            </div>
            
            <div className="safety-card">
              <div className="safety-icon">🏥</div>
              <h3>Health & Hygiene</h3>
              <p>
                Enhanced cleaning protocols, HEPA air filtration systems, and strict 
                hygiene measures ensure a safe and healthy environment for all passengers 
                throughout their journey.
              </p>
            </div>
            
            <div className="safety-card">
              <div className="safety-icon">📋</div>
              <h3>Safety Certifications</h3>
              <p>
                We hold certifications from leading aviation authorities including IATA 
                Operational Safety Audit (IOSA) and maintain compliance with ICAO standards 
                for operational safety.
              </p>
            </div>
          </div>

          <div className="safety-standards">
            <h3>Our Safety Standards</h3>
            <ul>
              <li>✓ Regular aircraft maintenance and inspections</li>
              <li>✓ Continuous crew training and development</li>
              <li>✓ Advanced weather monitoring systems</li>
              <li>✓ Real-time flight tracking and communication</li>
              <li>✓ Emergency response protocols</li>
              <li>✓ Passenger safety briefings and information</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="services" className="section services-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>🛫 Flight Booking</h3>
              <p>Easy online booking with seat selection and instant confirmation</p>
            </div>
            <div className="service-card">
              <h3>💺 Seat Selection</h3>
              <p>Choose your preferred seats with our interactive seat map</p>
            </div>
            <div className="service-card">
              <h3>📧 Email Confirmations</h3>
              <p>Receive detailed booking confirmations via email</p>
            </div>
            <div className="service-card">
              <h3>📱 Manage Bookings</h3>
              <p>View and manage all your bookings from your dashboard</p>
            </div>
            <div className="service-card">
              <h3>🎫 E-Tickets</h3>
              <p>Digital tickets sent directly to your email</p>
            </div>
            <div className="service-card">
              <h3>🔄 Booking Management</h3>
              <p>Cancel or modify bookings with ease</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="container">
          <h2>About AirLine</h2>
          <div className="about-content">
            <p>
              AirLine is a modern airline reservation system designed to provide passengers 
              with a seamless booking experience. We combine cutting-edge technology with 
              exceptional customer service to make air travel simple, safe, and enjoyable.
            </p>
            <p>
              Our platform offers real-time flight availability, secure payment processing, 
              and comprehensive booking management. Whether you're planning a business trip 
              or a vacation, we're here to make your journey smooth from start to finish.
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <h3>1000+</h3>
                <p>Flights Available</p>
              </div>
              <div className="stat-item">
                <h3>50K+</h3>
                <p>Happy Passengers</p>
              </div>
              <div className="stat-item">
                <h3>99.9%</h3>
                <p>On-Time Performance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="container">
          <h2>Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>📧 Email: support@airline.com</p>
              <p>📞 Phone: +1 (555) 123-4567</p>
              <p>📍 Address: 123 Aviation Way, Sky City, SC 12345</p>
              <p>🕒 Support Hours: 24/7</p>
            </div>
            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea placeholder="Your Message" rows="5" required></textarea>
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 AirLine. All rights reserved.</p>
          <p>Safe Travels, Always ✈️</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

