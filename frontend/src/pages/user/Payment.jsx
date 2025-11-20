import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardNavbar from '../../components/DashboardNavbar'
import { createBooking } from '../../api/bookings'
import useAuth from '../../hooks/useAuth'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  })

  // Get booking data from location state
  const bookingData = location.state

  useEffect(() => {
    // Redirect if no booking data or user not logged in
    if (!bookingData || !bookingData.flight || !bookingData.selectedSeats || bookingData.selectedSeats.length === 0) {
      navigate('/traveler')
    }
    if (!user) {
      navigate('/auth')
    }
    // Check if phone number is set
    if (user && (!user.phoneNumber || user.phoneNumber.trim() === '')) {
      setMessage('⚠️ Phone number is required for booking. Please update your profile first.')
      setTimeout(() => {
        navigate('/traveler/profile')
      }, 3000)
    }
  }, [bookingData, navigate, user])

  if (!bookingData || !bookingData.flight) {
    return null
  }

  const { flight, selectedSeats } = bookingData
  const totalPrice = selectedSeats.length * flight.price

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if phone number is set
    if (!user?.phoneNumber || user.phoneNumber.trim() === '') {
      setMessage('Phone number is required. Please update your profile with a phone number first.')
      setTimeout(() => {
        navigate('/traveler/profile')
      }, 2000)
      return
    }
    
    // Validate payment method specific fields
    if (paymentMethod === 'card') {
      if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvc) {
        setMessage('Please fill in all card payment details')
        return
      }
    }
    
    setBusy(true)
    setMessage('')
    
    try {
      const payload = {
        flightId: flight._id,
        passengerName: user?.name || '',
        passengerEmail: user?.email || '',
        contactNumber: user?.phoneNumber || '',
        seats: selectedSeats.length,
        seatNumbers: selectedSeats,
        paymentMethod: paymentMethod,
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      await createBooking(payload)
      setMessage('✅ Payment Complete! Your booking has been confirmed. Check your email for receipt.')
      
      setTimeout(() => {
        navigate('/traveler/bookings', { 
          state: { message: 'Payment Complete! Booking confirmed successfully!' } 
        })
      }, 3000)
    } catch (error) {
      console.error('Booking error:', error)
      setMessage(error.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <div className="payment-header">
          <button
            className="btn-back"
            onClick={() => navigate('/traveler')}
          >
            ← Back to Flights
          </button>
          <h1>Complete Your Booking</h1>
        </div>

        {message && (
          <div className={`message-banner ${message.includes('confirmed') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="payment-content">
          <div className="payment-left">
            <div className="booking-summary-card">
              <h2>Booking Summary</h2>
              <div className="summary-section">
                <h3>Flight Details</h3>
                <div className="summary-item">
                  <span className="label">Flight Number:</span>
                  <span className="value">{flight.flightNumber}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Route:</span>
                  <span className="value">{flight.origin} → {flight.destination}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Departure:</span>
                  <span className="value">{new Date(flight.departureTime).toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Arrival:</span>
                  <span className="value">{new Date(flight.arrivalTime).toLocaleString()}</span>
                </div>
              </div>

              <div className="summary-section">
                <h3>Selected Seats</h3>
                <div className="selected-seats-display">
                  {selectedSeats.map((seat) => (
                    <span key={seat} className="seat-tag">{seat}</span>
                  ))}
                </div>
              </div>

              <div className="summary-section">
                <h3>Price Breakdown</h3>
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Seats ({selectedSeats.length} × ${flight.price})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-right">
            <form className="payment-form" onSubmit={handleSubmit}>
              <div className="traveler-info-section">
                <h2>Traveler Information</h2>
                <div className="traveler-details-display">
                  <div className="traveler-detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{user?.name || 'N/A'}</span>
                  </div>
                  <div className="traveler-detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="traveler-detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">
                      {user?.phoneNumber || (
                        <span style={{ color: '#dc2626' }}>
                          Not set - <a href="/traveler/profile" style={{ color: '#2563eb' }}>Update Profile</a>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {(!user?.phoneNumber || user.phoneNumber.trim() === '') && (
                  <div className="warning-banner" style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', color: '#92400e' }}>
                    ⚠️ Phone number is required for booking. Please update your profile.
                  </div>
                )}
              </div>

              <div className="payment-section">
                <h2>Select Payment Method</h2>
                
                <div className="payment-method-selector">
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    💳 Credit/Debit Card
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    📱 UPI QR Code
                  </button>
                </div>
                
                {paymentMethod === 'card' ? (
                  <>
                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={form.cardName}
                        onChange={handleChange}
                        required
                        placeholder="Name on card"
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter any card number (dummy payment)"
                        maxLength="19"
                      />
                      <small className="muted" style={{ display: 'block', marginTop: '0.25rem' }}>
                        💳 This is a demo - any card details will be accepted
                      </small>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="expiry"
                          value={form.expiry}
                          onChange={handleChange}
                          required
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVC *</label>
                        <input
                          type="text"
                          name="cvc"
                          value={form.cvc}
                          onChange={handleChange}
                          required
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="upi-qr-section">
                    <div className="upi-qr-container">
                      <div className="upi-qr-code">
                        <div className="qr-placeholder">
                          <div className="qr-grid">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <div key={i} className={`qr-cell ${Math.random() > 0.5 ? 'filled' : ''}`}></div>
                            ))}
                          </div>
                        </div>
                        <p className="qr-amount">₹{totalPrice.toFixed(2)}</p>
                        <p className="qr-upi-id">airline@paytm</p>
                      </div>
                      <div className="upi-instructions">
                        <h3>How to Pay:</h3>
                        <ol>
                          <li>Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</li>
                          <li>Scan this QR code</li>
                          <li>Enter the amount: ₹{totalPrice.toFixed(2)}</li>
                          <li>Complete the payment</li>
                        </ol>
                        <p className="muted" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                          💡 This is a demo - click "Complete Payment" to proceed
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-pay" disabled={busy}>
                {busy ? 'Processing Payment...' : paymentMethod === 'card' 
                  ? `💳 Pay $${totalPrice.toFixed(2)}` 
                  : `✅ Complete Payment ₹${totalPrice.toFixed(2)}`}
              </button>
              <p className="muted" style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
                🔒 Secure payment processing (Demo Mode)
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment

