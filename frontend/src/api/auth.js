import api from './client'

export const login = (credentials) => {
  console.log('Login request:', credentials.email)
  return api.post('/auth/login', credentials)
}
export const register = (payload) => api.post('/auth/register', payload)
export const getProfile = () => api.get('/auth/profile')
export const updateProfile = (data) => api.put('/auth/profile', data)

