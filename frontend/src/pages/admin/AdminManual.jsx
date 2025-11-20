import { useEffect, useState } from 'react'
import DashboardNavbar from '../../components/DashboardNavbar'
import { fetchManual, updateManual } from '../../api/manual'

const defaultManualContent = `<section>
  <h2>Admin Dashboard Guide</h2>
  <h3>Dashboard Overview</h3>
  <p>View real-time statistics and analytics including total flights, bookings, revenue, and trends.</p>

  <h3>Flight Management</h3>
  <ul>
    <li><strong>Create Flight:</strong> Click "Add Flight" to create a new flight with details like origin, destination, times, price, and seat configuration.</li>
    <li><strong>Configure Seats:</strong> Set up seat maps with business and economy classes.</li>
    <li><strong>Delete Flight:</strong> Remove flights that are no longer available.</li>
  </ul>

  <h3>Booking Management</h3>
  <ul>
    <li>View all user bookings with filters (All, Confirmed, Cancelled)</li>
    <li>Cancel bookings if needed</li>
    <li>Monitor booking status and passenger details</li>
  </ul>

  <h3>User Management</h3>
  <ul>
    <li>View all registered users</li>
    <li>Add new users or admins manually</li>
    <li>See user roles (admin/traveler)</li>
    <li>Monitor user registration dates</li>
  </ul>

  <h3>Profile Settings</h3>
  <ul>
    <li>Update your admin profile information</li>
    <li>Change email and contact details</li>
  </ul>
</section>

<section>
  <h2>User Dashboard Guide</h2>
  <h3>Browse Flights</h3>
  <ul>
    <li>View all available flights</li>
    <li>See flight details: route, times, price, available seats</li>
    <li>Select a flight to book</li>
  </ul>

  <h3>Seat Selection</h3>
  <ul>
    <li>Interactive seat map with live preview</li>
    <li>Choose specific seats or let system auto-assign</li>
    <li>See reserved, available, and business class seats</li>
    <li>Real-time seat selection with visual feedback</li>
  </ul>

  <h3>Booking Process</h3>
  <ol>
    <li>Select a flight</li>
    <li>Choose number of seats</li>
    <li>Select specific seats from the map</li>
    <li>Proceed to payment page</li>
    <li>Enter passenger details (name, email, contact)</li>
    <li>Enter payment information</li>
    <li>Confirm booking</li>
    <li>Receive email confirmation with ticket details</li>
  </ol>

  <h3>My Bookings</h3>
  <ul>
    <li>View all your bookings</li>
    <li>See booking status, seat numbers, flight details</li>
    <li>Cancel bookings if needed</li>
  </ul>
</section>

<section>
  <h2>System Features</h2>
  <h3>Email Notifications</h3>
  <p>Automatic email confirmations are sent to users after successful bookings with:</p>
  <ul>
    <li>Flight details</li>
    <li>Seat numbers</li>
    <li>Payment reference</li>
    <li>Booking status</li>
  </ul>

  <h3>Security</h3>
  <ul>
    <li>JWT-based authentication</li>
    <li>Role-based access control (Admin/User)</li>
    <li>Password encryption</li>
    <li>Protected API routes</li>
  </ul>
</section>`

const AdminManual = () => {
  const [content, setContent] = useState(defaultManualContent)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    loadManual()
  }, [])

  const loadManual = async () => {
    setLoading(true)
    setMessage('')
    try {
      const { data } = await fetchManual()
      if (data && data.manual) {
        if (data.manual.content && data.manual.content.trim() !== '') {
          setContent(data.manual.content)
        } else {
          // If content is empty, use default
          setContent(defaultManualContent)
        }
        if (data.manual.lastUpdated) {
          setLastUpdated(data.manual.lastUpdated)
        }
      } else {
        // If no manual exists, use default content
        setContent(defaultManualContent)
      }
    } catch (error) {
      console.error('Error loading manual:', error)
      // Use default content on error, don't show error message
      setContent(defaultManualContent)
      // Only show error if it's a critical issue
      if (error.response?.status !== 404) {
        setMessage('Using default manual content. You can edit and save to create a custom manual.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setBusy(true)
    setMessage('')
    try {
      const { data } = await updateManual(content)
      setMessage('Manual updated successfully!')
      setIsEditing(false)
      setLastUpdated(data.manual.lastUpdated)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update manual')
    } finally {
      setBusy(false)
    }
  }

  const handleCancel = () => {
    loadManual()
    setIsEditing(false)
    setMessage('')
  }

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <div className="page-header">
          <h1>User Manual & Details</h1>
          {!isEditing ? (
            <button
              className="btn-primary"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Manual
            </button>
          ) : (
            <div className="page-actions">
              <button
                className="btn-secondary"
                onClick={handleCancel}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={busy}
              >
                {busy ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>

        {message && (
          <div className={`message-banner ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {lastUpdated && !isEditing && (
          <p className="muted" style={{ marginBottom: '1rem' }}>
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}

        {loading ? (
          <div className="spinner" />
        ) : isEditing ? (
          <div className="panel">
            <h2>Edit User Manual</h2>
            <p className="muted" style={{ marginBottom: '1rem' }}>
              You can use HTML tags to format the content. Use &lt;section&gt; for sections, &lt;h2&gt; and &lt;h3&gt; for headings, &lt;p&gt; for paragraphs, &lt;ul&gt; and &lt;ol&gt; for lists, and &lt;strong&gt; for bold text.
            </p>
            <label>
              Manual Content (HTML)
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="manual-editor"
                rows={30}
                placeholder="Enter manual content in HTML format..."
              />
            </label>
          </div>
        ) : (
          <div 
            className="manual-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  )
}

export default AdminManual

