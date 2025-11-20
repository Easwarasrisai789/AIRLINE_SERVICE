import api from './client'

export const createBooking = (payload) => api.post('/bookings', payload)
export const fetchMyBookings = () => api.get('/bookings')
export const fetchAllBookings = () => api.get('/bookings/all')
export const getBooking = (id) => api.get(`/bookings/${id}`)
export const cancelBooking = (id) => api.delete(`/bookings/${id}`)

