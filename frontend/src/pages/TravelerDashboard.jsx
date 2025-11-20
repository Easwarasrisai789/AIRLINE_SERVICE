import { useEffect, useState } from 'react'
import DashboardNavbar from '../components/DashboardNavbar'
import FlightCard from '../components/FlightCard'
import SeatPickerLive from '../components/SeatPickerLive'
import BookingForm from '../components/BookingForm'
import BookingList from '../components/BookingList'
import { fetchFlights, fetchSeatMap } from '../api/flights'
import { createBooking, fetchMyBookings, cancelBooking } from '../api/bookings'

const TravelerDashboard = () => {
  const [activeTab, setActiveTab] = useState('flights')
  const [flights, setFlights] = useState([])
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [seatData, setSeatData] = useState({ seatMap: [], reservedSeats: [] })
  const [selectedSeats, setSelectedSeats] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [seatCount, setSeatCount] = useState(1)
  const [showBookingForm, setShowBookingForm] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: flightsRes }, { data: bookingsRes }] = await Promise.all([
          fetchFlights(),
          fetchMyBookings(),
        ])
        setFlights(flightsRes.flights)
        setBookings(bookingsRes.bookings)
        setMessage('')
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSelectFlight = async (flight) => {
    setSelectedFlight(flight)
    setSelectedSeats([])
    setSeatCount(1)
    setShowBookingForm(true)
    try {
      const { data } = await fetchSeatMap(flight._id)
      setSeatData(data)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to fetch seat map')
    }
  }

  const handleCreateBooking = async (form) => {
    if (!selectedFlight) {
      setMessage('Select a flight first')
      return Promise.reject()
    }
    if (selectedSeats.length && selectedSeats.length !== Number(form.seats)) {
      setMessage('Seat selection mismatch')
      return Promise.reject()
    }
    setBusy(true)
    setMessage('')
    try {
      const payload = {
        flightId: selectedFlight._id,
        passengerName: form.passengerName,
        passengerEmail: form.passengerEmail,
        contactNumber: form.contactNumber,
        seats: Number(form.seats),
        seatNumbers: selectedSeats,
        paymentMethod: 'card',
      }
      const { data } = await createBooking(payload)
      setBookings((prev) => [data.booking, ...prev])
      setSelectedFlight(null)
      setSelectedSeats([])
      setSeatCount(1)
      setSeatData({ seatMap: [], reservedSeats: [] })
      setShowBookingForm(false)
      setActiveTab('bookings')
      setMessage('Booking confirmed! Check your email for receipt.')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Booking failed')
      throw error
    } finally {
      setBusy(false)
    }
  }

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id)
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status: 'CANCELLED' } : booking
        )
      )
      setMessage('Booking cancelled successfully')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to cancel booking')
    }
  }

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'flights' ? 'active' : ''}
            onClick={() => {
              setActiveTab('flights')
              setShowBookingForm(false)
              setSelectedFlight(null)
            }}
          >
            Browse Flights
          </button>
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
        </div>

        {message && <div className="message-banner">{message}</div>}

        {activeTab === 'flights' && (
          <div className="flights-tab">
            {!showBookingForm ? (
              <div className="flights-list">
                <h2>Available Flights</h2>
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <div className="flight-grid">
                    {flights.map((flight) => (
                      <FlightCard
                        key={flight._id}
                        flight={flight}
                        selectedId={selectedFlight?._id}
                        onSelect={handleSelectFlight}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="booking-flow">
                <div className="booking-header">
                  <h2>Book Flight: {selectedFlight?.flightNumber}</h2>
                  <button
                    className="btn-back"
                    onClick={() => {
                      setShowBookingForm(false)
                      setSelectedFlight(null)
                      setSelectedSeats([])
                    }}
                  >
                    ← Back to Flights
                  </button>
                </div>

                <div className="booking-content">
                  <div className="booking-left">
                    <div className="flight-summary">
                      <h3>Flight Details</h3>
                      <p><strong>Route:</strong> {selectedFlight?.origin} → {selectedFlight?.destination}</p>
                      <p><strong>Departure:</strong> {new Date(selectedFlight?.departureTime).toLocaleString()}</p>
                      <p><strong>Price:</strong> ${selectedFlight?.price} per seat</p>
                      <p><strong>Available Seats:</strong> {selectedFlight?.availableSeats}</p>
                    </div>

                    {seatData.seatMap.length > 0 && (
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
                    )}
                  </div>

                  <div className="booking-right">
                    <BookingForm
                      onSubmit={handleCreateBooking}
                      busy={busy}
                      onSeatCountChange={setSeatCount}
                      selectedSeats={selectedSeats}
                      flight={selectedFlight}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-tab">
            <h2>My Bookings</h2>
            {loading ? (
              <div className="spinner" />
            ) : (
              <BookingList bookings={bookings} onCancel={handleCancel} canCancel />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TravelerDashboard
