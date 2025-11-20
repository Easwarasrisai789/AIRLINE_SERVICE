import { useState, useEffect } from 'react'
import DashboardNavbar from '../../components/DashboardNavbar'
import useAuth from '../../hooks/useAuth'
import { updateProfile } from '../../api/auth'

const UserProfile = () => {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  })
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const { data } = await updateProfile(form)
      // Refresh user data in context to reflect the updated phone number
      if (refreshUser) {
        await refreshUser()
      }
      // Also update local form state with the response
      if (data && data.user) {
        setForm({
          name: data.user.name || form.name,
          email: data.user.email || form.email,
          phoneNumber: data.user.phoneNumber || form.phoneNumber,
        })
      }
      setMessage('✅ Profile updated successfully! Phone number has been saved to backend.')
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <h1>Edit Profile</h1>
        {message && <div className="message-banner">{message}</div>}

        <div className="panel">
          <form onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            <label>
              Phone Number *
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                required
                placeholder="+1 (555) 123-4567"
                pattern="[+]?[0-9\s\-()]{10,}"
              />
              <small className="muted" style={{ display: 'block', marginTop: '0.25rem' }}>
                📞 Required for booking flights
              </small>
            </label>
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserProfile

