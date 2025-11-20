import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardNavbar from '../../components/DashboardNavbar'
import { createBooking } from '../../api/bookings'

const PaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { flight, selectedSeats, seatCount } = location.state || {}
  
  const [form, setForm] = useState({
    passengerName: '',
    passengerEmail: '',
    contactNumber: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!flight || !selectedSeats || selectedSeats.length === 0) {
      navigate('/traveler')
    }
  }, [flight, selectedSeats, navigate])

  if (!flight || !selectedSeats) {
    return null
  }

  const totalPrice = selectedSeats.length * (flight.price || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const payload = {
        flightId: flight._id,
        passengerName: form.passengerName,
        passengerEmail: form.passengerEmail,
        contactNumber: form.contactNumber,
        seats: selectedSeats.length,
        seatNumbers: selectedSeats,
        paymentMethod: 'card',
        cardLast4: form.cardNumber.slice(-4),
      }
      await createBooking(payload)
      navigate('/traveler/bookings', { 
        state: { message: 'Booking confirmed! Check your email for receipt.' }
      })
    } catch (error) {
      setMessage(error.response?.data?.message || 'Payment failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <div className="payment-header">
          <h1>Complete Your Booking</h1>
          <button className="btn-back" onClick={() => navigate('/traveler')}>
            ← Back to Flights
          </button>
        </div>

        <div className="payment-content">
          <div className="payment-left">
            <div className="booking-summary-card">
              <h2>Booking Summary</h2>
              <div className="summary-section">
                <h3>Flight Details</h3>
                <div className="summary-item">
                  <span>Flight Number:</span>
                  <strong>{flight.flightNumber}</strong>
                </div>
                <div className="summary-item">
                  <span>Route:</span>
                  <strong>{flight.origin} → {flight.destination}</strong>
                </div>
                <div className="summary-item">
                  <span>Departure:</span>
                  <strong>{new Date(flight.departureTime).toLocaleString()}</strong>
                </div>
                <div className="summary-item">
                  <span>Arrival:</span>
                  <strong>{new Date(flight.arrivalTime).toLocaleString()}</strong>
                </div>
              </div>

              <div className="summary-section">
                <h3>Seat Selection</h3>
                <div className="selected-seats-display">
                  {selectedSeats.map((seat, idx) => (
                    <span key={idx} className="seat-tag">{seat}</span>
                  ))}
                </div>
                <div className="summary-item">
                  <span>Number of Seats:</span>
                  <strong>{selectedSeats.length}</strong>
                </div>
              </div>

              <div className="summary-section price-section">
                <div className="summary-item">
                  <span>Price per Seat:</span>
                  <strong>${flight.price}</strong>
                </div>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <strong className="total-price">${totalPrice.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-right">
            <div className="payment-form-card">
              <h2>Passenger Information</h2>
              {message && <div className="error-message">{message}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={form.passengerName}
                    onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={form.passengerEmail}
                    onChange={(e) => setForm({ ...form, passengerEmail: e.target.value })}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Number *</label>
                  <input
                    type="tel"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    required
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="payment-section">
                  <h3>Payment Details</h3>
                  
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      value={form.cardNumber}
                      onChange={(e) => setForm({ ...form, cardNumber: e.target.value.replace(/\s/g, '').slice(0, 16) })}
                      required
                      placeholder="1234 5678 9012 3456"
                      maxLength="16"
                    />
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      value={form.cardName}
                      onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                      required
                      placeholder="JOHN DOE"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        value={form.expiryDate}
                        onChange={(e) => setForm({ ...form, expiryDate: e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{0,2})/, '$1/$2') })}
                        required
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>

                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        value={form.cvv}
                        onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                        required
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={busy} className="btn-pay">
                  {busy ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

