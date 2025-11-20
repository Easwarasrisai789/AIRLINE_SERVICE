import { useState } from 'react'

const initialState = {
  passengerName: '',
  passengerEmail: '',
  contactNumber: '',
  seats: 1,
  paymentMethod: 'card',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
}

const BookingForm = ({ onSubmit, busy, onSeatCountChange }) => {
  const [form, setForm] = useState(initialState)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'seats') {
      onSeatCountChange?.(Number(value) || 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
      .then(() => {
        setForm(initialState)
        onSeatCountChange?.(1)
      })
      .catch(() => {})
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h3>Traveler Details</h3>
      <label>
        Full Name
        <input name="passengerName" value={form.passengerName} onChange={handleChange} required />
      </label>
      <label>
        Email
        <input
          type="email"
          name="passengerEmail"
          value={form.passengerEmail}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Contact Number
        <input name="contactNumber" value={form.contactNumber} onChange={handleChange} />
      </label>
      <label>
        Seats Needed
        <input
          type="number"
          min="1"
          max="6"
          name="seats"
          value={form.seats}
          onChange={handleChange}
        />
      </label>

      <h4>Payment</h4>
      <label>
        Cardholder Name
        <input name="cardName" value={form.cardName} onChange={handleChange} required />
      </label>
      <label>
        Card Number
        <input
          name="cardNumber"
          value={form.cardNumber}
          onChange={handleChange}
          placeholder="4242 4242 4242 4242"
          required
        />
      </label>
      <div className="grid">
        <label>
          Expiry
          <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" />
        </label>
        <label>
          CVC
          <input name="cvc" value={form.cvc} onChange={handleChange} />
        </label>
      </div>

      <button type="submit" disabled={busy}>
        {busy ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  )
}

export default BookingForm

