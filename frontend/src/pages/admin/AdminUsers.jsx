import { useEffect, useState } from 'react'
import DashboardNavbar from '../../components/DashboardNavbar'
import { fetchUsers, createUser } from '../../api/users'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'traveler',
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data } = await fetchUsers()
      setUsers(data.users)
      setMessage('')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      await createUser(form)
      setMessage(`User created successfully! ${form.role === 'admin' ? 'Admin' : 'User'} account has been created.`)
      setForm({ name: '', email: '', password: '', role: 'traveler' })
      setShowAddForm(false)
      loadUsers()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create user')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-container">
        <div className="page-header">
          <h1>All Users</h1>
          <button
            className="btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add User/Admin'}
          </button>
        </div>

        {message && (
          <div className={`message-banner ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {showAddForm && (
          <div className="panel" style={{ marginBottom: '2rem' }}>
            <h2>Add New User or Admin</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Full Name *
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
              </label>
              <label>
                Email *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="user@example.com"
                />
              </label>
              <label>
                Password *
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  minLength="6"
                />
              </label>
              <label>
                Role *
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="traveler">Traveler</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <button type="submit" disabled={busy}>
                {busy ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers

