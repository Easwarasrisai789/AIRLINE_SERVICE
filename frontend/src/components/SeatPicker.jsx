import clsx from 'clsx'

const SeatPicker = ({ seatMap, reservedSeats, selectedSeats, onToggle, seatsNeeded }) => {
  if (!seatMap?.length) {
    return <p className="muted">Seat map not available.</p>
  }

  return (
    <div className="seat-picker">
      <header>
        <strong>Choose Seats</strong>
        <span>
          {selectedSeats.length}/{seatsNeeded} selected
        </span>
      </header>
      <div className="seat-grid">
        {seatMap.map((seat) => {
          const isReserved = reservedSeats.includes(seat.code)
          const isSelected = selectedSeats.includes(seat.code)
          return (
            <button
              key={seat.code}
              type="button"
              disabled={isReserved || (selectedSeats.length >= seatsNeeded && !isSelected)}
              className={clsx('seat', seat.class.toLowerCase(), {
                reserved: isReserved,
                selected: isSelected,
              })}
              onClick={() => onToggle(seat.code)}
            >
              {seat.code}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SeatPicker

