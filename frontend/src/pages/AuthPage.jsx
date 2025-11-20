import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import HomeNavbar from '../components/HomeNavbar'

const AuthPage = () => {
  const { user, login, register, error, setError } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [busy, setBusy] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
      } else {
        await register(form)
      }
    } finally {
      setBusy(false)
    }
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/traveler'} replace />
  }

  return (
    <div className="auth-page">
      <HomeNavbar />
      <form className="panel auth-form" onSubmit={handleSubmit}>
        <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        {mode === 'register' && (
          <label>
            Full Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy}>
          {busy ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
        </button>
        <p>
          {mode === 'login' ? "Don't have an account?" : 'Already registered?'}{' '}
          <button
            type="button"
            className="link"
            onClick={() => {
              setMode((prev) => (prev === 'login' ? 'register' : 'login'))
              setError?.(null)
            }}
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </form>
    </div>
  )
}

export default AuthPage

