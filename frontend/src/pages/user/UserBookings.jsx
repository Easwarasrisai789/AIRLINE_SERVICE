import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardNavbar from '../../components/DashboardNavbar'
import BookingList from '../../components/BookingList'
import { fetchMyBookings, cancelBooking } from '../../api/bookings'

const UserBookings = () => {
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(location.state?.message || '')

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    setMessage('')
    try {
      const { data } = await fetchMyBookings()
      setBookings(data.bookings || [])
      if (!data.bookings || data.bookings.length === 0) {
        setMessage('You have no bookings yet. Book a flight to see your bookings here!')
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
      setMessage(error.response?.data?.message || 'Unable to load bookings. Please try again.')
    } finally {
      setLoading(false)
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
        <h1>My Bookings</h1>
        {message && <div className="message-banner">{message}</div>}

        {loading ? (
          <div className="spinner" />
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✈️</div>
            <h2>No Bookings Yet</h2>
            <p>You haven't made any bookings yet. Start exploring flights and book your next trip!</p>
            <button 
              className="btn-primary" 
              onClick={() => window.location.href = '/traveler'}
            >
              Browse Flights
            </button>
          </div>
        ) : (
          <BookingList bookings={bookings} onCancel={handleCancel} canCancel />
        )}
      </div>
    </div>
  )
}

export default UserBookings

