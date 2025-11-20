import { useState, useEffect } from 'react'
import DashboardNavbar from '../../components/DashboardNavbar'
import useAuth from '../../hooks/useAuth'
import { updateProfile } from '../../api/auth'

const AdminProfile = () => {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
  })
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      await updateProfile(form)
      setMessage('Profile updated successfully')
    } catch (error) {
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
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile

