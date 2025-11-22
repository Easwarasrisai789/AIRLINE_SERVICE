import { format } from 'date-fns'

const FlightCard = ({ flight, onSelect, selectedId }) => {
  // Prevent crash if flight is null or undefined
  if (!flight) {
    return (
      <article className="flight-card">
        <p>Invalid flight data</p>
      </article>
    );
  }

  const {
    _id,
    flightNumber,
    aircraft,
    origin,
    departureTime,
    destination,
    arrivalTime,
    price,
    availableSeats
  } = flight;

  const isSelected = selectedId === _id;

  return (
    <article className={`flight-card ${isSelected ? 'selected' : ''}`}>
      <header>
        <h3>{flightNumber || "Unknown Flight"}</h3>
        <span>{aircraft || "Unknown Aircraft"}</span>
      </header>

      <div className="flight-card__body">
        <div>
          <strong>{origin || "N/A"}</strong>
          <p>
            {departureTime
              ? format(new Date(departureTime), 'PPpp')
              : "No Departure Time"}
          </p>
        </div>

        <div className="flight-card__arrow">→</div>

        <div>
          <strong>{destination || "N/A"}</strong>
          <p>
            {arrivalTime
              ? format(new Date(arrivalTime), 'PPpp')
              : "No Arrival Time"}
          </p>
        </div>
      </div>

      <footer>
        <span>
          {typeof price === "number" ? `$${price.toFixed(2)}` : "No Price"}
        </span>

        <span>
          {typeof availableSeats === "number"
            ? `${availableSeats} seats left`
            : "Seats Unknown"}
        </span>

        <button
          disabled={!availableSeats}
          onClick={() => onSelect(flight)}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </footer>
    </article>
  );
};

export default FlightCard;
