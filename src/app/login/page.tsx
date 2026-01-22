'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 1. IMPORTAMOS AUTH DE FIREBASE
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // LOGIN CON GOOGLE (Nuevo y recomendado)
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Obtenemos el Token especial de Google
      const idToken = await result.user.getIdToken();
      
      // Guardamos este token para que Axios lo use en el Dashboard
      localStorage.setItem('token', idToken);
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Error al autenticar con Google. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // LOGIN TRADICIONAL (Ahora usa Firebase en lugar de tu API propia)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Validamos contra Firebase Auth directamente
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      localStorage.setItem('token', idToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-red-800">Admin Unsito</h1>
        <p className="mb-6 text-center text-gray-500">Inicia sesión para gestionar el contenido</p>
        
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700 border border-red-400">
            {error}
          </div>
        )}
        
        {/* BOTÓN DE GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="mb-6 flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white p-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
          {loading ? 'Cargando...' : 'Continuar con Google'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">O usa tu cuenta</span></div>
        </div>

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
            disabled={loading}
            className={`w-full rounded p-2 text-white font-semibold transition-colors ${
              loading ? 'bg-gray-400' : 'bg-red-700 hover:bg-red-800'
            }`}
          >
            {loading ? 'Ingresando...' : 'Ingresar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}