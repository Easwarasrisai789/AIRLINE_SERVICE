import { format } from 'date-fns'

const BookingList = ({ bookings = [], onCancel, canCancel }) => {
  // If no bookings found
  if (!Array.isArray(bookings) || bookings.length === 0) {
    return <p className="muted">No bookings yet.</p>
  }

  return (
    <div className="booking-list">
      {bookings.map((booking) => {
        if (!booking) return null; // Prevent crashes from null values

        const flight = booking.flight || {};

        const {
          flightNumber,
          origin,
          destination,
          departureTime,
          arrivalTime,
          price
        } = flight;

        const safeSeats = booking.seats || 0;
        const safePrice = typeof price === 'number' ? price : 0;
        const totalPrice = (safeSeats * safePrice).toFixed(2);

        return (
          <article key={booking._id || Math.random()} className="booking-card">
            
            {/* Header */}
            <div className="booking-card-header">
              <div>
                <h3>{flightNumber || 'N/A'}</h3>
                <p className="booking-route">
                  {(origin || 'N/A')} → {(destination || 'N/A')}
                </p>
              </div>

              <span className={`status-badge ${booking.status?.toLowerCase() || 'confirmed'}`}>
                {booking.status || 'CONFIRMED'}
              </span>
            </div>

            {/* Body */}
            <div className="booking-card-body">
              <div className="booking-details-grid">

                {/* Departure */}
                <div className="booking-detail">
                  <span className="detail-label">Departure:</span>
                  <span className="detail-value">
                    {departureTime
                      ? format(new Date(departureTime), 'MMM dd, yyyy HH:mm')
                      : 'N/A'}
                  </span>
                </div>

                {/* Arrival */}
                <div className="booking-detail">
                  <span className="detail-label">Arrival:</span>
                  <span className="detail-value">
                    {arrivalTime
                      ? format(new Date(arrivalTime), 'MMM dd, yyyy HH:mm')
                      : 'N/A'}
                  </span>
                </div>

                {/* Seats */}
                <div className="booking-detail">
                  <span className="detail-label">Seats:</span>
                  <span className="detail-value">{safeSeats}</span>
                </div>

                {/* Seat Numbers */}
                <div className="booking-detail">
                  <span className="detail-label">Seat Numbers:</span>
                  <span className="detail-value seat-numbers">
                    {Array.isArray(booking.seatNumbers) && booking.seatNumbers.length > 0 ? (
                      booking.seatNumbers.map(seat => (
                        <span key={seat} className="seat-chip">{seat}</span>
                      ))
                    ) : (
                      'Auto-assigned'
                    )}
                  </span>
                </div>

                {/* Price */}
                <div className="booking-detail">
                  <span className="detail-label">Total Price:</span>
                  <span className="detail-value price">${totalPrice}</span>
                </div>

                {/* Payment Status */}
                <div className="booking-detail">
                  <span className="detail-label">Payment Status:</span>
                  <span className={`detail-value payment-status ${booking.paymentStatus?.toLowerCase() || 'paid'}`}>
                    {booking.paymentStatus || 'PAID'}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="booking-meta">
                <p className="booking-date">
                  <strong>Booked on:</strong>{' '}
                  {booking.createdAt
                    ? format(new Date(booking.createdAt), 'PPpp')
                    : 'N/A'}
                </p>

                {booking.paymentReference && (
                  <p className="payment-ref">
                    <strong>Payment Ref:</strong> {booking.paymentReference}
                  </p>
                )}
              </div>
            </div>

            {/* Cancel Button */}
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
        );
      })}
    </div>
  );
};

export default BookingList;
