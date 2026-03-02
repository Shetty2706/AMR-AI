import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const predict = async (payload) => {
  const { data } = await api.post('/predict', payload)
  return data
}

export const ams = async (payload) => {
  const { data } = await api.post('/ams', payload)
  return data
}

export default api
