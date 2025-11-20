const StatCard = ({ label, value, hint }) => (
  <div className="stat-card">
    <p>{label}</p>
    <h3>{value}</h3>
    {hint && <small>{hint}</small>}
  </div>
)

export default StatCard

