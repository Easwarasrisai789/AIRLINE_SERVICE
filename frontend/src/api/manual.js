import api from './client'

export const fetchManual = () => api.get('/manual')
export const updateManual = (content) => api.put('/manual', { content })

