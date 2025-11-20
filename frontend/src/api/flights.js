import api from './client'

export const fetchFlights = () => api.get('/flights')
export const seedFlights = () => api.post('/flights/seed')
export const createFlight = (payload) => api.post('/flights', payload)
export const updateFlight = (id, payload) => api.put(`/flights/${id}`, payload)
export const deleteFlight = (id) => api.delete(`/flights/${id}`)
export const fetchSeatMap = (id) => api.get(`/flights/${id}/seats`)

