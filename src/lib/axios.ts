import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use((config) => {
  // Nota: En Next.js App Router, localStorage solo existe en el cliente ('use client')
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token'); // [cite: 31]
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // [cite: 35]
    }
  }
  return config;
});

export default api;