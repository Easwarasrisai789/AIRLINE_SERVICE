import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardNavbar from '../../components/DashboardNavbar'
import SeatPickerLive from '../../components/SeatPickerLive'
import { fetchSeatMap } from '../../api/flights'

const SeatSelectionPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { flight } = location.state || {}
  
  const [seatData, setSeatData] = useState({ seatMap: [], reservedSeats: [] })
  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatCount, setSeatCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!flight) {
      navigate('/traveler')
      return
    }
    loadSeatMap()
  }, [flight, navigate])

  const loadSeatMap = async () => {
    setLoading(true)
    try {
      const { data } = await fetchSeatMap(flight._id)
      setSeatData(data)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to fetch seat map')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setMessage('Please select at least one seat')
      return
    }
    if (selectedSeats.length !== seatCount) {
      setMessage(`Please select ${seatCount} seat${seatCount > 1 ? 's' : ''}`)
      return
    }
    navigate('/traveler/payment', {
      state: { flight, selectedSeats, seatCount }
    })
  }

  if (!flight) {
    return null
  }

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <div className="seat-selection-header">
          <div>
            <h1>Select Your Seats</h1>
            <p className="flight-info">
              {flight.flightNumber} • {flight.origin} → {flight.destination}
            </p>
          </div>
          <button className="btn-back" onClick={() => navigate('/traveler')}>
            ← Back to Flights
          </button>
        </div>

        {message && <div className="message-banner error">{message}</div>}

        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            <div className="seat-selection-content">
              <SeatPickerLive
                seatMap={seatData.seatMap}
                reservedSeats={seatData.reservedSeats}
                selectedSeats={selectedSeats}
                seatsNeeded={seatCount}
                onToggle={(seatCode) => {
                  setSelectedSeats((prev) =>
                    prev.includes(seatCode)
                      ? prev.filter((s) => s !== seatCode)
                      : [...prev, seatCode]
                  )
                  setMessage('')
                }}
                onSeatCountChange={setSeatCount}
              />
            </div>

            <div className="seat-selection-footer">
              <div className="selection-summary">
                <div className="summary-item">
                  <span>Selected Seats:</span>
                  <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong>
                </div>
                <div className="summary-item">
                  <span>Total Price:</span>
                  <strong className="price-highlight">
                    ${(selectedSeats.length * (flight.price || 0)).toFixed(2)}
                  </strong>
                </div>
              </div>
              <button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0 || selectedSeats.length !== seatCount}
                className="btn-continue"
              >
                Continue to Payment →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SeatSelectionPage

