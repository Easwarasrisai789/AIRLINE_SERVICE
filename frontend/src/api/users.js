import api from './client'

export const fetchUsers = () => api.get('/users')
export const createUser = (userData) => api.post('/users', userData)

