import { format } from 'date-fns'

const AdminBookingTable = ({ bookings = [], onCancel }) => (
  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Traveler</th>
          <th>Flight</th>
          <th>Seats</th>
          <th>Seat Numbers</th>
          <th>Payment</th>
          <th>Status</th>
          <th>Created</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking._id}>
            <td>
              {booking.passengerName}
              <br />
              <small>{booking.passengerEmail}</small>
            </td>
            <td>
              {booking.flight.flightNumber}
              <br />
              <small>
                {booking.flight.origin} → {booking.flight.destination}
              </small>
            </td>
            <td>{booking.seats}</td>
            <td>{booking.seatNumbers?.length ? booking.seatNumbers.join(', ') : 'Auto'}</td>
            <td>{booking.paymentStatus}</td>
            <td>{booking.status}</td>
            <td>{format(new Date(booking.createdAt), 'PP')}</td>
            <td>
              {booking.status === 'CONFIRMED' && (
                <button onClick={() => onCancel(booking._id)}>Cancel</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default AdminBookingTable

