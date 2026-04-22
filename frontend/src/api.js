import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const createPlan = (data) => api.post('/plan', data)
export const getPlan    = (userId) => api.get(`/plan/${userId}`)
export const getQuiz    = (data) => api.post('/quiz', data)
export const submitAnswer = (data) => api.post('/submit', data)
export const getAnalysis  = (userId) => api.get(`/analysis/${userId}`)
export const getReview    = (userId) => api.get(`/review/${userId}`)
export const createMockTest = (data) => api.post('/mock-test', data)