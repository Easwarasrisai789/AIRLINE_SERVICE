import { useState, useEffect } from 'react'
import clsx from 'clsx'

const SeatPickerLive = ({ seatMap, reservedSeats, selectedSeats, seatsNeeded, onToggle, onSeatCountChange }) => {
  const [seatCount, setSeatCount] = useState(seatsNeeded || 1)

  useEffect(() => {
    if (onSeatCountChange) {
      onSeatCountChange(seatCount)
    }
  }, [seatCount, onSeatCountChange])

  if (!seatMap?.length) {
    return <p className="muted">Seat map loading...</p>
  }

  const totalPrice = selectedSeats.length * (seatMap[0]?.price || 0)

  return (
    <div className="seat-picker-live">
      <div className="seat-picker-header">
        <div>
          <h3>Select Your Seats</h3>
          <label className="seat-count-selector">
            Number of Seats:
            <input
              type="number"
              min="1"
              max={seatMap.filter(s => !reservedSeats.includes(s.code)).length}
              value={seatCount}
              onChange={(e) => {
                const count = Math.max(1, parseInt(e.target.value) || 1)
                setSeatCount(count)
                if (selectedSeats.length > count) {
                  selectedSeats.slice(count).forEach(seat => onToggle(seat))
                }
              }}
            />
          </label>
        </div>
        <div className="seat-selection-info">
          <div className="selected-count">
            Selected: <strong>{selectedSeats.length}/{seatCount}</strong>
          </div>
          {selectedSeats.length > 0 && (
            <div className="selected-seats-preview">
              <strong>Your Seats:</strong>
              <div className="seat-badges">
                {selectedSeats.map(seat => (
                  <span key={seat} className="seat-badge">{seat}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="seat-map-container">
        <div className="airplane-cabin">
          <div className="cabin-header">
            <div className="cabin-legend">
              <span className="legend-item">
                <span className="legend-seat available"></span> Available
              </span>
              <span className="legend-item">
                <span className="legend-seat selected"></span> Selected
              </span>
              <span className="legend-item">
                <span className="legend-seat reserved"></span> Reserved
              </span>
              <span className="legend-item">
                <span className="legend-seat business"></span> Business
              </span>
            </div>
            <div className="cabin-aisle-indicator">Aisle</div>
          </div>

          <div className="seat-grid-live">
            {seatMap.map((seat) => {
              const isReserved = reservedSeats.includes(seat.code)
              const isSelected = selectedSeats.includes(seat.code)
              const seatClass = seat.class?.toLowerCase() || 'economy'
              
              // Add aisle spacing
              const showAisle = seat.code.match(/[DF]/) // Show aisle after C and before D
              
              return (
                <div key={seat.code} className="seat-wrapper">
                  {seat.code.match(/^[CDF]/) && <div className="aisle-spacer"></div>}
                  <button
                    type="button"
                    disabled={isReserved || (selectedSeats.length >= seatCount && !isSelected)}
                    className={clsx('seat-live', seatClass, {
                      reserved: isReserved,
                      selected: isSelected,
                    })}
                    onClick={() => onToggle(seat.code)}
                    title={isReserved ? 'Reserved' : isSelected ? 'Click to deselect' : 'Click to select'}
                  >
                    <span className="seat-number">{seat.code}</span>
                    {seatClass === 'business' && <span className="seat-class-badge">B</span>}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="cabin-footer">
            <div className="cabin-direction">→ Front of Aircraft</div>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="seat-summary">
            <h4>Booking Summary</h4>
            <div className="summary-details">
              <div className="summary-row">
                <span>Selected Seats:</span>
                <strong>{selectedSeats.join(', ')}</strong>
              </div>
              <div className="summary-row">
                <span>Total Price:</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SeatPickerLive

