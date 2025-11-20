import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardNavbar from '../../components/DashboardNavbar'
import SeatPickerLive from '../../components/SeatPickerLive'
import { fetchSeatMap } from '../../api/flights'

const SelectSeats = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [flight, setFlight] = useState(null)
  const [seatData, setSeatData] = useState({ seatMap: [], reservedSeats: [] })
  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatCount, setSeatCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const flightData = location.state?.flight
    if (!flightData) {
      navigate('/traveler')
      return
    }
    setFlight(flightData)
    loadSeatMap(flightData._id)
  }, [location, navigate])

  const loadSeatMap = async (flightId) => {
    setLoading(true)
    setMessage('')
    try {
      const { data } = await fetchSeatMap(flightId)
      if (data && data.seatMap && data.seatMap.length > 0) {
        setSeatData({
          seatMap: data.seatMap,
          reservedSeats: data.reservedSeats || [],
        })
      } else {
        // If no seat map, create a default one based on flight totalSeats
        if (flight && flight.totalSeats) {
          const defaultSeatMap = []
          const seatsPerRow = 6
          const businessRows = 2
          let seatCount = 0
          
          for (let row = 1; seatCount < flight.totalSeats; row += 1) {
            const seatClass = row <= businessRows ? 'BUSINESS' : 'ECONOMY'
            for (const seatLetter of ['A', 'B', 'C', 'D', 'E', 'F']) {
              const code = `${row}${seatLetter}`
              defaultSeatMap.push({ code, class: seatClass })
              seatCount += 1
              if (seatCount >= flight.totalSeats) break
            }
          }
          
          setSeatData({
            seatMap: defaultSeatMap,
            reservedSeats: data?.reservedSeats || [],
          })
        } else {
          setMessage('Seat map not available for this flight')
        }
      }
    } catch (error) {
      console.error('Error loading seat map:', error)
      // Try to create default seat map if flight data is available
      if (flight && flight.totalSeats) {
        const defaultSeatMap = []
        const seatsPerRow = 6
        const businessRows = 2
        let seatCount = 0
        
        for (let row = 1; seatCount < flight.totalSeats; row += 1) {
          const seatClass = row <= businessRows ? 'BUSINESS' : 'ECONOMY'
          for (const seatLetter of ['A', 'B', 'C', 'D', 'E', 'F']) {
            const code = `${row}${seatLetter}`
            defaultSeatMap.push({ code, class: seatClass })
            seatCount += 1
            if (seatCount >= flight.totalSeats) break
          }
        }
        
        setSeatData({
          seatMap: defaultSeatMap,
          reservedSeats: [],
        })
        setMessage('Using default seat map. Some features may be limited.')
      } else {
        setMessage(error.response?.data?.message || 'Unable to fetch seat map')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToPayment = () => {
    if (!flight || selectedSeats.length === 0) {
      setMessage('Please select at least one seat')
      return
    }
    if (selectedSeats.length !== seatCount) {
      setMessage(`Please select exactly ${seatCount} seat(s)`)
      return
    }
    // Navigate to payment page with booking data
    navigate('/traveler/payment', {
      state: {
        flight: flight,
        selectedSeats: selectedSeats,
        seatCount: seatCount,
      },
    })
  }

  if (!flight) {
    return null
  }

  const totalPrice = selectedSeats.length * flight.price

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <div className="booking-header">
          <button
            className="btn-back"
            onClick={() => navigate('/traveler')}
          >
            ← Back to Flights
          </button>
          <h1>Select Your Seats</h1>
        </div>

        {message && <div className="message-banner">{message}</div>}

        <div className="booking-content">
          <div className="booking-left">
            <div className="flight-summary">
              <h3>Flight Details</h3>
              <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
              <p><strong>Route:</strong> {flight.origin} → {flight.destination}</p>
              <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
              <p><strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
              <p><strong>Price:</strong> ${flight.price} per seat</p>
            </div>

            {loading ? (
              <div className="spinner" />
            ) : seatData.seatMap.length > 0 ? (
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
                }}
                onSeatCountChange={setSeatCount}
              />
            ) : (
              <p className="muted">Seat map not available</p>
            )}
          </div>

          <div className="booking-right">
            <div className="booking-actions-card">
              <h3>Booking Summary</h3>
              <div className="booking-summary-info">
                <div className="summary-row">
                  <span>Selected Seats:</span>
                  <strong>
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                  </strong>
                </div>
                <div className="summary-row">
                  <span>Seats Needed:</span>
                  <strong>{seatCount}</strong>
                </div>
                <div className="summary-row">
                  <span>Price per Seat:</span>
                  <strong>${flight.price}</strong>
                </div>
                <div className="summary-row total">
                  <span>Total Price:</span>
                  <strong>${totalPrice.toFixed(2)}</strong>
                </div>
              </div>
              <button
                className="btn-proceed"
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length === 0 || selectedSeats.length !== seatCount}
              >
                Proceed to Payment →
              </button>
              {selectedSeats.length > 0 && selectedSeats.length !== seatCount && (
                <p className="selection-warning">
                  Please select {seatCount} seat{seatCount > 1 ? 's' : ''} to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectSeats

