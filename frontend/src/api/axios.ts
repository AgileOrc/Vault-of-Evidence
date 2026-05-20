import axios from 'axios';

const api = axios.create({
  // Alamat backend Go yang berjalan di Docker
  baseURL: 'http://localhost:8080/api/v1', 
  
  // WAJIB TRUE: Agar browser otomatis menyimpan dan mengirim cookie JWT 'voe_session'
  withCredentials: true, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;