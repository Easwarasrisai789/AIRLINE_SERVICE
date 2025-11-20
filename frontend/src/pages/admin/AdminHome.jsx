import { useEffect, useState } from 'react'
import DashboardNavbar from '../../components/DashboardNavbar'
import StatCard from '../../components/StatCard'
import { fetchFlights } from '../../api/flights'
import { fetchAllBookings } from '../../api/bookings'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const AdminHome = () => {
  const [flights, setFlights] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: flightsRes }, { data: bookingsRes }] = await Promise.all([
          fetchFlights(),
          fetchAllBookings(),
        ])
        setFlights(flightsRes.flights)
        setBookings(bookingsRes.bookings)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = {
    totalFlights: flights.length,
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
    totalRevenue: bookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.flight?.price || 0) * (b.seats || 0), 0),
  }

  // Prepare chart data
  const bookingsByStatus = [
    { name: 'Confirmed', value: bookings.filter(b => b.status === 'CONFIRMED').length, color: '#2563eb' },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'CANCELLED').length, color: '#dc2626' },
  ]

  const revenueData = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((acc, booking) => {
      const date = new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const existing = acc.find(item => item.date === date)
      const revenue = (booking.flight?.price || 0) * (booking.seats || 0)
      if (existing) {
        existing.revenue += revenue
      } else {
        acc.push({ date, revenue })
      }
      return acc
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7)

  const flightsByRoute = flights.reduce((acc, flight) => {
    const route = `${flight.origin} → ${flight.destination}`
    const existing = acc.find(item => item.route === route)
    if (existing) {
      existing.bookings += flight.totalSeats - flight.availableSeats
    } else {
      acc.push({ route, bookings: flight.totalSeats - flight.availableSeats })
    }
    return acc
  }, [])

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <StatCard title="Total Flights" value={stats.totalFlights} icon="✈️" />
          <StatCard title="Total Bookings" value={stats.totalBookings} icon="🎫" />
          <StatCard title="Confirmed" value={stats.confirmedBookings} icon="✅" />
          <StatCard title="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon="💰" />
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Bookings by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Revenue Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Bookings by Route</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={flightsByRoute.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="route" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome

