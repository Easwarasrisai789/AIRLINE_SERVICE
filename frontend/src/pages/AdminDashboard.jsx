import { useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell'
import StatCard from '../components/StatCard'
import AdminFlightForm from '../components/AdminFlightForm'
import AdminBookingTable from '../components/AdminBookingTable'
import { fetchFlights, createFlight, deleteFlight, seedFlights } from '../api/flights'
import { fetchAllBookings, cancelBooking } from '../api/bookings'

const AdminDashboard = () => {
  const [flights, setFlights] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingFlight, setSavingFlight] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [{ data: flightsRes }, { data: bookingsRes }] = await Promise.all([
        fetchFlights(),
        fetchAllBookings(),
      ])
      setFlights(flightsRes.flights)
      setBookings(bookingsRes.bookings)
      setMessage('')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreateFlight = async (payload) => {
    setSavingFlight(true)
    try {
      const { data } = await createFlight(payload)
      setFlights((prev) => [data.flight, ...prev])
      setMessage('Flight published')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create flight')
      throw error
    } finally {
      setSavingFlight(false)
    }
  }

  const handleDeleteFlight = async (id) => {
    try {
      await deleteFlight(id)
      setFlights((prev) => prev.filter((flight) => flight._id !== id))
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete flight')
    }
  }

  const handleCancelBooking = async (id) => {
    try {
      await cancelBooking(id)
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status: 'CANCELLED' } : booking
        )
      )
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to cancel booking')
    }
  }

  const handleSeedFlights = async () => {
    try {
      await seedFlights()
      load()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to seed flights')
    }
  }

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === 'CONFIRMED')
    const seatsSold = confirmed.reduce((acc, booking) => acc + booking.seats, 0)
    const revenue = confirmed.reduce((acc, booking) => acc + booking.seats * booking.flight.price, 0)
    return [
      { label: 'Active Flights', value: flights.length },
      { label: 'Seats Sold', value: seatsSold },
      { label: 'Bookings', value: bookings.length },
      { label: 'Revenue', value: `$${revenue.toFixed(2)}` },
    ]
  }, [flights, bookings])

  return (
    <AppShell title="Admin Command Center">
      {message && <p className="banner">{message}</p>}
      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <section className="stats-grid">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="grid-2">
            <AdminFlightForm onSave={handleCreateFlight} saving={savingFlight} />
            <div className="panel">
              <h3>Active Flights</h3>
              <button onClick={handleSeedFlights}>Seed Sample Flights</button>
              <ul className="flight-list--compact">
                {flights.map((flight) => (
                  <li key={flight._id}>
                    <div>
                      <strong>{flight.flightNumber}</strong> {flight.origin} → {flight.destination}
                      <p>{flight.availableSeats} seats left</p>
                    </div>
                    <button onClick={() => handleDeleteFlight(flight._id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h3>All Bookings</h3>
            <AdminBookingTable bookings={bookings} onCancel={handleCancelBooking} />
          </section>
        </>
      )}
    </AppShell>
  )
}

export default AdminDashboard

