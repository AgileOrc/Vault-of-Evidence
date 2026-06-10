import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  
  // WAJIB TRUE: Agar browser otomatis menyimpan dan mengirim cookie JWT 'voe_session'
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;