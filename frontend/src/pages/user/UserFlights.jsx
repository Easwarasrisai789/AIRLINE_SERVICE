import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardNavbar from '../../components/DashboardNavbar'
import FlightCard from '../../components/FlightCard'
import { fetchFlights } from '../../api/flights'

const UserFlights = () => {
  const navigate = useNavigate()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadFlights()
  }, [])

  const loadFlights = async () => {
    setLoading(true)
    try {
      const { data } = await fetchFlights()
      setFlights(data.flights)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load flights')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectFlight = (flight) => {
    navigate('/traveler/select-seats', { state: { flight } })
  }


  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <h1>Browse Flights</h1>
        {message && <div className="message-banner">{message}</div>}

        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="flight-grid">
            {flights.map((flight) => (
              <FlightCard
                key={flight._id}
                flight={flight}
                onSelect={handleSelectFlight}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserFlights

