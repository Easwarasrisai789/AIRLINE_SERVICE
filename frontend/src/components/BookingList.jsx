import { format } from 'date-fns'

const BookingList = ({ bookings = [], onCancel, canCancel }) => {
  if (!bookings.length) {
    return <p className="muted">No bookings yet.</p>
  }

  return (
    <div className="booking-list">
      {bookings.map((booking) => (
        <article key={booking._id} className="booking-card">
          <div className="booking-card-header">
            <div>
              <h3>{booking.flight?.flightNumber || 'N/A'}</h3>
              <p className="booking-route">
                {booking.flight?.origin || 'N/A'} → {booking.flight?.destination || 'N/A'}
              </p>
            </div>
            <span className={`status-badge ${booking.status?.toLowerCase()}`}>
              {booking.status || 'CONFIRMED'}
            </span>
          </div>
          
          <div className="booking-card-body">
            <div className="booking-details-grid">
              <div className="booking-detail">
                <span className="detail-label">Departure:</span>
                <span className="detail-value">
                  {booking.flight?.departureTime 
                    ? format(new Date(booking.flight.departureTime), 'MMM dd, yyyy HH:mm')
                    : 'N/A'}
                </span>
              </div>
              <div className="booking-detail">
                <span className="detail-label">Arrival:</span>
                <span className="detail-value">
                  {booking.flight?.arrivalTime 
                    ? format(new Date(booking.flight.arrivalTime), 'MMM dd, yyyy HH:mm')
                    : 'N/A'}
                </span>
              </div>
              <div className="booking-detail">
                <span className="detail-label">Seats:</span>
                <span className="detail-value">{booking.seats || 0}</span>
              </div>
              <div className="booking-detail">
                <span className="detail-label">Seat Numbers:</span>
                <span className="detail-value seat-numbers">
                  {booking.seatNumbers?.length 
                    ? booking.seatNumbers.map(seat => (
                        <span key={seat} className="seat-chip">{seat}</span>
                      ))
                    : 'Auto-assigned'}
                </span>
              </div>
              <div className="booking-detail">
                <span className="detail-label">Total Price:</span>
                <span className="detail-value price">
                  ${((booking.seats || 0) * (booking.flight?.price || 0)).toFixed(2)}
                </span>
              </div>
              <div className="booking-detail">
                <span className="detail-label">Payment Status:</span>
                <span className={`detail-value payment-status ${booking.paymentStatus?.toLowerCase()}`}>
                  {booking.paymentStatus || 'PAID'}
                </span>
              </div>
            </div>
            
            <div className="booking-meta">
              <p className="booking-date">
                <strong>Booked on:</strong> {format(new Date(booking.createdAt), 'PPpp')}
              </p>
              {booking.paymentReference && (
                <p className="payment-ref">
                  <strong>Payment Ref:</strong> {booking.paymentReference}
                </p>
              )}
            </div>
          </div>

          {canCancel && booking.status === 'CONFIRMED' && (
            <div className="booking-card-footer">
              <button 
                className="btn-cancel-booking"
                onClick={() => onCancel(booking._id)}
              >
                Cancel Booking
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

export default BookingList

