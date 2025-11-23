'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password }); ///[cite_start]// [cite: 815]
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.'); ///[cite_start]// [cite: 818]
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-red-800">Admin Unsito</h1>
        <p className="mb-6 text-center text-gray-500">Inicia sesión para gestionar el contenido</p>
        
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700 border border-red-400">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
            <input
              type="email"
              className="w-full rounded border border-gray-300 p-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              placeholder="ejemplo@unsito.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full rounded border border-gray-300 p-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-red-700 p-2 text-white hover:bg-red-800 transition-colors font-semibold"
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}