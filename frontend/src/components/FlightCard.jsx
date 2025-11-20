import { format } from 'date-fns'

const FlightCard = ({ flight, onSelect, selectedId }) => {
  const isSelected = selectedId === flight._id

  return (
    <article className={`flight-card ${isSelected ? 'selected' : ''}`}>
      <header>
        <h3>{flight.flightNumber}</h3>
        <span>{flight.aircraft}</span>
      </header>
      <div className="flight-card__body">
        <div>
          <strong>{flight.origin}</strong>
          <p>{format(new Date(flight.departureTime), 'PPpp')}</p>
        </div>
        <div className="flight-card__arrow">→</div>
        <div>
          <strong>{flight.destination}</strong>
          <p>{format(new Date(flight.arrivalTime), 'PPpp')}</p>
        </div>
      </div>
      <footer>
        <span>${flight.price.toFixed(2)}</span>
        <span>{flight.availableSeats} seats left</span>
        <button disabled={!flight.availableSeats} onClick={() => onSelect(flight)}>
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </footer>
    </article>
  )
}

export default FlightCard

