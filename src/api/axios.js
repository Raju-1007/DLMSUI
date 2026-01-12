import axios from 'axios'
const API = import.meta.env.VITE_MICRO_SERVICE_API_URL || 'http://192.168.1.35:8080'
export const http = axios.create({ baseURL: API })
export { API }
