import { useState, useEffect } from 'react'

const defaultFlight = {
  flightNumber: '',
  origin: '',
  destination: '',
  departureTime: '',
  arrivalTime: '',
  price: 0,
  totalSeats: 60,
  gate: 'A1',
  aircraft: 'A320',
}

const AdminFlightForm = ({ onSave, saving, flight = null, onCancel }) => {
  const [values, setValues] = useState(defaultFlight)
  
  // Format dates for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch (error) {
      return ''
    }
  }

  useEffect(() => {
    if (flight) {
      setValues({
        flightNumber: flight.flightNumber || '',
        origin: flight.origin || '',
        destination: flight.destination || '',
        departureTime: formatDateForInput(flight.departureTime),
        arrivalTime: formatDateForInput(flight.arrivalTime),
        price: flight.price || 0,
        totalSeats: flight.totalSeats || 60,
        gate: flight.gate || 'A1',
        aircraft: flight.aircraft || 'A320',
      })
    } else {
      setValues(defaultFlight)
    }
  }, [flight])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      ...values,
      price: Number(values.price),
      totalSeats: Number(values.totalSeats),
      departureTime: new Date(values.departureTime).toISOString(),
      arrivalTime: new Date(values.arrivalTime).toISOString(),
    }
    onSave(payload)
      .then(() => {
        if (!flight) {
          setValues(defaultFlight)
        }
      })
      .catch(() => {})
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h3>{flight ? 'Edit Flight' : 'Add New Flight'}</h3>
      {Object.entries({
        flightNumber: 'Flight Number',
        origin: 'Origin',
        destination: 'Destination',
        gate: 'Gate',
        aircraft: 'Aircraft',
      }).map(([name, label]) => (
        <label key={name}>
          {label}
          <input name={name} value={values[name]} onChange={handleChange} required />
        </label>
      ))}

      <label>
        Departure Time
        <input
          type="datetime-local"
          name="departureTime"
          value={values.departureTime}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Arrival Time
        <input
          type="datetime-local"
          name="arrivalTime"
          value={values.arrivalTime}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Price
        <input
          type="number"
          name="price"
          value={values.price}
          onChange={handleChange}
          min="50"
          step="10"
          required
        />
      </label>
      <label>
        Seats
        <input
          type="number"
          name="totalSeats"
          value={values.totalSeats}
          onChange={handleChange}
          min="10"
          required
        />
      </label>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={saving}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : flight ? 'Update Flight' : 'Publish Flight'}
        </button>
      </div>
    </form>
  )
}

export default AdminFlightForm

