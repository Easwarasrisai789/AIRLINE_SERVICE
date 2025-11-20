import { useEffect, useState } from 'react'
import DashboardNavbar from '../../components/DashboardNavbar'
import AdminBookingTable from '../../components/AdminBookingTable'
import { fetchAllBookings, cancelBooking } from '../../api/bookings'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const { data } = await fetchAllBookings()
      setBookings(data.bookings)
      setMessage('')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load bookings')
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
      setMessage('Booking cancelled')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to cancel booking')
    }
  }

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter.toUpperCase())

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <div className="page-header">
          <h1>All Bookings</h1>
          <div className="filter-tabs">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'confirmed' ? 'active' : ''}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={filter === 'cancelled' ? 'active' : ''}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {message && <div className="message-banner">{message}</div>}

        {loading ? (
          <div className="spinner" />
        ) : (
          <AdminBookingTable bookings={filteredBookings} onCancel={handleCancel} />
        )}
      </div>
    </div>
  )
}

export default AdminBookings

