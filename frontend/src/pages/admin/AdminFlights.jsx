import { useEffect, useState } from 'react'
import DashboardNavbar from '../../components/DashboardNavbar'
import AdminFlightForm from '../../components/AdminFlightForm'
import FlightCard from '../../components/FlightCard'
import { fetchFlights, createFlight, updateFlight, deleteFlight, seedFlights } from '../../api/flights'

const AdminFlights = () => {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingFlight, setSavingFlight] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingFlight, setEditingFlight] = useState(null)

  useEffect(() => {
    loadFlights()
  }, [])

  const loadFlights = async () => {
    setLoading(true)
    try {
      const { data } = await fetchFlights()
      setFlights(data.flights)
      setMessage('')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load flights')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFlight = async (payload) => {
    setSavingFlight(true)
    setMessage('')
    try {
      const { data } = await createFlight(payload)
      setFlights((prev) => [data.flight, ...prev])
      setMessage('✅ Flight created successfully!')
      setShowForm(false)
      setEditingFlight(null)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create flight')
      throw error
    } finally {
      setSavingFlight(false)
    }
  }

  const handleUpdateFlight = async (payload) => {
    if (!editingFlight) return Promise.reject()
    setSavingFlight(true)
    setMessage('')
    try {
      const { data } = await updateFlight(editingFlight._id, payload)
      setFlights((prev) =>
        prev.map((f) => (f._id === editingFlight._id ? data.flight : f))
      )
      setMessage('✅ Flight updated successfully!')
      setShowForm(false)
      setEditingFlight(null)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update flight')
      throw error
    } finally {
      setSavingFlight(false)
    }
  }

  const handleEdit = (flight) => {
    setEditingFlight(flight)
    setShowForm(true)
    setMessage('')
  }

  const handleCancelEdit = () => {
    setShowForm(false)
    setEditingFlight(null)
    setMessage('')
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this flight?')) return
    try {
      await deleteFlight(id)
      setFlights((prev) => prev.filter((f) => f._id !== id))
      setMessage('Flight deleted')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete flight')
    }
  }

  const handleSeed = async () => {
    try {
      await seedFlights()
      await loadFlights()
      setMessage('Sample flights created')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to seed flights')
    }
  }

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <div className="page-header">
          <h1>Manage Flights</h1>
          <div className="page-actions">
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? 'Cancel' : '+ Add Flight'}
            </button>
            <button onClick={handleSeed} className="btn-secondary">
              Seed Sample Flights
            </button>
          </div>
        </div>

        {message && <div className="message-banner">{message}</div>}

        {showForm && (
          <div className="panel">
            <AdminFlightForm
              onSave={editingFlight ? handleUpdateFlight : handleCreateFlight}
              saving={savingFlight}
              flight={editingFlight}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="flight-grid">
            {flights.map((flight) => (
              <div key={flight._id} className="flight-card-admin">
                <FlightCard flight={flight} />
                <div className="flight-actions">
                  <button 
                    onClick={() => handleEdit(flight)} 
                    className="btn-secondary"
                    style={{ marginRight: '0.5rem' }}
                  >
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(flight._id)} className="btn-danger">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminFlights

